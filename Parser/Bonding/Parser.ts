import {
    textLine,
    textWord,
    anchorWord
} from 'crt-terminal';
import BigNumber from 'bignumber.js';
import messages from '../../Messages/Messages';
import notFoundStrings from '../../Errors/notfound-strings'
import commonOperators from '../common';
import userBondIds, { getBondingByBondId } from '../WEB3/bonding/ids';
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

// Func Router 

const helpWorker = (eventQueue) => {
    const { print } = eventQueue.handlers;
    print([textLine({ words: [textWord({ characters: messages.bondingHelpText })] })]);
}

const typesWorker = (eventQueue) => {
    const { print } = eventQueue.handlers;
    print([textLine({ words: [textWord({ characters: "Available bond types: " })] })]);
    for (const key of Object.keys(BondTypes)) {
        print([textLine({ words: [textWord({ characters: `-  ${key}` })] })]);
    }

}

const tokensWorker = (eventQueue) => {
    const { print } = eventQueue.handlers;
    print([textLine({ words: [textWord({ characters: "Available tokens: " })] })]);
    for (const key of Object.keys(BondTokens)) {
        print([textLine({ words: [textWord({ characters: `-  ${key}` })] })]);
    }

}

const bondsWorker = async (eq) => {
    const { print } = eq.handlers;
    const ids = await userBondIds();
    if (ids.length === 0) {
        print([textLine({ words: [textWord({ characters: "You don't have active bonds." })] })]);
        return;
    }
    print([textLine({ words: [textWord({ characters: `Your bond ids are: ${ids.join(", ")}` })] })]);
}

const mintWorker = async (eq, args) => {
    const { lock, loading, print } = eq.handlers;
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

const claimWorker = async (eq, bondId) => {
    const { lock, loading, print } = eq.handlers;
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

const infoWorker = async (eq, id) => {
    const { print } = eq.handlers;
    const ids = await userBondIds();
    if (ids.length === 0) {
        print([textLine({ words: [textWord({ characters: "You don't have active bonds." })] })]);
        return;
    }
    print([textLine({ words: [textWord({ characters: `Your bond ids are: ${ids.join(", ")}` })] })]);
}

const previewWorker = async (eventQueue, args) => {
    const { lock, loading, print } = eventQueue.handlers;
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

const ArgsFunctions =
    [
        "stake",
        "unstake",
        "harvest",
        "buy"
    ]

async function Parse(eventQueue, command) {
    const { print } = eventQueue.handlers;
    const Command = command.split(' ')[0].trim().toLowerCase();
    // split was replaced by substring because of the buy command, which assumes two parameters
    const Arg = command.substring(command.indexOf(' ')).replace(' ', '');

    try {
        // Handle incorrect command
        if (!(Command in BondingMap)) throw Error(notFoundStrings[Math.floor(Math.random() * notFoundStrings.length)]);
        if (ArgsFunctions.includes(Command) && Arg === Command) throw Error("You should provide args for calling this function. e.g stake 1");
        BondingMap[Command](eventQueue, Arg.toLowerCase());
    }
    catch (err) {
        print([textLine({ words: [textWord({ characters: err.message })] })]);
    }
}

export default Parse;
