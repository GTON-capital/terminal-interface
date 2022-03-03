import {
    textLine,
    textWord,
    anchorWord
} from 'crt-terminal';
import BigNumber from 'bignumber.js';
import messages from '../../Messages/Messages';
import notFoundStrings from '../../Errors/notfound-strings'
import commonOperators, {parser} from '../common';
import userBondIds, { getBondingByBondId, bondInfo } from '../WEB3/bonding/ids';
import getAmountOut from '../WEB3/bonding/amountOut';
import { fromWei, toWei } from '../WEB3/API/balance';
import { BondTypes, BondTokens, bondingContracts, tokenAddresses, ftmscanUrl, storageAddress } from '../../config/config';
import { approve } from '../WEB3/approve';
import { mint, mintFTM } from '../WEB3/bonding/mint';
import { claim } from '../WEB3/bonding/claim';

const parseArguments = (args: string) => {
    const argArr = args.split(" ");
    const token = argArr[0]
    const type = argArr[1]
    const amount = argArr[2]
    return [token, type, amount]
}

function timeConverter(UNIX_timestamp){
    const a = new Date(UNIX_timestamp * 1000);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
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

const bondsWorker = async ({ print }) => {
    const ids = await userBondIds();
    if (ids.length === 0) {
        print([textLine({ words: [textWord({ characters: "You don't have active bonds." })] })]);
        return;
    }
    print([textLine({ words: [textWord({ characters: `Your bond ids are: ${ids.join(", ")}` })] })]);
}

const mintWorker = async ({ lock, loading, print }, args) => {
    const [token, type, amount] = parseArguments(args)
    const contractAddress = bondingContracts[token][type]
    const tokenAddress = tokenAddresses[token];
    const weiAmount = toWei(new BigNumber(amount))
    if (!contractAddress || (token !== BondTokens.FTM && !tokenAddress)) {
        throw new Error("Incorrect arguments passed.")
    }
    try {
        lock(true);
        loading(true);
        let tx;
        if (token === BondTokens.FTM) {
            tx = await mintFTM(contractAddress, weiAmount);
        } else {
            await approve(tokenAddress, contractAddress, weiAmount)
            tx = await mint(contractAddress, weiAmount);
        }
        const id = tx.events.Mint.returnValues.tokenId;
        const txHash = tx.transactionHash
        print([textLine({ words: [textWord({ characters: `You have successfully issued bond with id ${id}` })] })]);
        print([textLine({ words: [anchorWord({ className: "link-padding", characters: messages.viewTxn, onClick: () => { window.open(ftmscanUrl + txHash, '_blank'); } })] })]);
        loading(false);
        lock(false);
    }
    catch (err) {
        print([textLine({ words: [textWord({ characters: err.message })] })]);
        loading(false);
        lock(false);
    }
}

const claimWorker = async ({ lock, loading, print }, bondId) => {
    try {
        lock(true);
        loading(true);
        const contractAddress = await getBondingByBondId(bondId);
        await approve(storageAddress, contractAddress, new BigNumber(bondId))
        const tx = await claim(contractAddress, bondId);
        const txHash = tx.transactionHash
        print([textLine({ words: [textWord({ characters: `You have successfully claimed bond with id ${id}` })] })]);
        print([textLine({ words: [anchorWord({ className: "link-padding", characters: messages.viewTxn, onClick: () => { window.open(ftmscanUrl + txHash, '_blank'); } })] })]);
        loading(false);
        lock(false);
    }
    catch (err) {
        print([textLine({ words: [textWord({ characters: err.message })] })]);
        loading(false);
        lock(false);
    }
}

const infoWorker = async ({ lock, loading, print }, bondId) => {
    try {
        lock(true);
        loading(true);
        const contractAddress = await getBondingByBondId(bondId);
        const info = await bondInfo(contractAddress, bondId);
        print([textLine({ words: [textWord({ characters: `
        Issued: ${timeConverter(info.issueTimestamp)}
        Claim date: ${timeConverter(info.releaseTimestamp)}
        Release amount: ${fromWei(new BigNumber(info.releaseAmount)).toFixed(4)}
        ` })] })]);
        loading(false);
        lock(false);
    }
    catch (err) {
        print([textLine({ words: [textWord({ characters: err.message })] })]);
        loading(false);
        lock(false);
    }
}

const previewWorker = async ({ lock, loading, print }, args) => {
    try {
        lock(true);
        loading(true);
        const [token, type, amount] = parseArguments(args)
        const contractAddress = bondingContracts[token][type]
        if (!contractAddress) {
            print([textLine({ words: [textWord({ characters: "Incorrect arguments passed. /n Print >help to see how to use it" })] })]);
            loading(false);
            lock(false);
            return;
        }
        const weiAmount = toWei(new BigNumber(amount));

        const amountOut = await getAmountOut(contractAddress, weiAmount);
        const outEther = fromWei(amountOut);
        print([textLine({ words: [textWord({ characters: `You will receive ${outEther.toFixed(18)} of sGTON` })] })]);

        loading(false);
        lock(false);
    }
    catch (err) {
        print([textLine({ words: [textWord({ characters: err })] })]);
        loading(false);
        lock(false);
    }
}


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
