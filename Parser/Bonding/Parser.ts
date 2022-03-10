import {
    textLine,
    textWord,
} from 'crt-terminal';
import messages from '../../Messages/Messages';
import commonOperators, { printLink, createWorker, parser, timeConverter } from '../common';
import userBondIds, { getBondingByBondId, bondInfo } from '../WEB3/bonding/ids';
import getAmountOut, { getDiscount } from '../WEB3/bonding/amountOut';
import { fromWei, toWei } from '../WEB3/API/balance';
import { BondTypes, BondTokens, bondingContracts, tokenAddresses, ftmscanUrl, storageAddress } from '../../config/config';
import { allowance, approve } from '../WEB3/approve';
import { mint, mintFTM } from '../WEB3/bonding/mint';
import { claim } from '../WEB3/bonding/claim';

const parseArguments = (args: string) => {
    const argArr = args.split(" ");
    const token = argArr[0]
    const type = argArr[1]
    const amount = argArr[2]
    return [token, type, amount]
}

function validateArgs([token, type]: string[]) {
    const tokens = Object.keys(BondTokens)
    if (!(tokens.includes(token))) {
        throw new Error("Incorrect token name: " + token + ", avalable: " + tokens.toString() )
    }
    const types = Object.keys(BondTypes)
    if (!(types.includes(type))) {
        throw new Error("Incorrect bond type: " + type + ", avalable: " + types.toString())
    }
    if (token === BondTokens.usdc) {
        throw new Error("Only FTM bonding is available for now, USDC coming soon")
    }
}
// Func Router 

const helpWorker = ({ print }) => {
    print([textLine({ words: [textWord({ characters: messages.bondingHelpText })] })]);
}

const typesWorker = ({ print }) => {
    print([textLine({ words: [textWord({ characters: "Available bond types: " })] })]);
    for (const key of Object.keys(BondTypes)) {
        print([textLine({ words: [textWord({ characters: `-  ${key}` })] })]);
    }

}

const tokensWorker = ({ print }) => {
    print([textLine({ words: [textWord({ characters: "Available tokens: " })] })]);
    for (const key of Object.keys(BondTokens)) {
        print([textLine({ words: [textWord({ characters: `-  ${key}` })] })]);
    }

}

const bondsWorker = createWorker(async ({ print }, _, [userAddress]) => {
    const ids = await userBondIds(userAddress);
    if (ids.length === 0) {
        throw new Error("You don't have active bonds.")
    }
    const amount = ids.length === 1 ? "id is" : "ids are";
    print([textLine({ words: [textWord({ characters: `Your bond ${amount}: ${ids.join(", ")}` })] })]);
})

const mintWorker = createWorker(async ({ print }, args, [userAddress]) => {
    const [token, type, amount] = parseArguments(args)
    validateArgs([token, type]);
    const weiAmount = toWei(amount)
    const contractAddress = bondingContracts[token][type]
    const tokenAddress = tokenAddresses[token];
    let tx;
    if (token === BondTokens.ftm) {
        tx = await mintFTM(userAddress, contractAddress, weiAmount);
    } else {
        // TODO add check for allowance
        const all = await allowance(tokenAddress, contractAddress);
        if (all.lt(weiAmount)) {
            await approve(userAddress, tokenAddress, contractAddress, weiAmount)
        }
        tx = await mint(userAddress, contractAddress, weiAmount);
    }
    const id = tx.events.Mint.returnValues.tokenId;
    const txHash = tx.transactionHash
    print([textLine({ words: [textWord({ characters: `You have successfully issued bond with id ${id}` })] })]);
    printLink(print, messages.viewTxn, ftmscanUrl + txHash)
})

const claimWorker = createWorker(async ({ print }, bondId, [userAddress]) => {
    const contractAddress = await getBondingByBondId(bondId);
    const info = await bondInfo(contractAddress, bondId);
    const currentTs = Math.floor(Date.now() / 1000);
    if (currentTs < info.releaseTimestamp) {
        throw new Error("Bond is not allowed to claim yet")
    }
    await approve(userAddress, storageAddress, contractAddress, bondId)
    const tx = await claim(userAddress, contractAddress, bondId);
    const txHash = tx.transactionHash
    print([textLine({ words: [textWord({ characters: `You have successfully claimed bond with id ${bondId}` })] })]);
    printLink(print, messages.viewTxn, ftmscanUrl + txHash)

})

const infoWorker = async ({ print }, bondId) => {
        const contractAddress = await getBondingByBondId(bondId);
        const info = await bondInfo(contractAddress, bondId);
        print([textLine({
            words: [textWord({
                characters: `
        Status: ${info.isActive ? "Active" : "Claimed"}
        Issued: ${timeConverter(info.issueTimestamp)}
        Claim date: ${timeConverter(info.releaseTimestamp)}
        Release amount: ${fromWei(info.releaseAmount).toFixed(4)}
        ` })]
        })]);
}

const previewWorker = createWorker(async ({ print }, args) => {
        const [token, type, amount] = parseArguments(args)
        validateArgs([token, type]);
        const contractAddress = bondingContracts[token][type]
        const weiAmount = toWei(amount);
        const [amountOut, discount] = await getAmountOut(contractAddress, weiAmount);
        const outEther = fromWei(amountOut);
        const discountEther = fromWei(discount)
        const percent = await getDiscount(contractAddress);

        print([textLine({ words: [textWord({ characters: `You will receive ${outEther.toFixed(18)} of sGTON` })] })]);
        print([textLine({ words: [textWord({ characters: `Discount for this offer will be ${discountEther.toFixed(18)} - ${percent}%` })] })]);
})


const BondingMap =
{
    preview: previewWorker,
    help: helpWorker,
    tokens: tokensWorker,
    bonds: bondsWorker,
    types: typesWorker,
    mint: mintWorker,
    claim: claimWorker,
    info: infoWorker,
    ...commonOperators
}

const Parse = parser(BondingMap)

export default Parse;
