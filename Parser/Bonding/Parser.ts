import { textLine, textWord } from 'crt-terminal';
import Big from 'big.js';
import messages from '../../Messages/Messages';
import commonOperators, { printLink, createWorker, parser, timeConverter } from '../common';
import userBondIds, { getBondingByBondId, bondInfo, separateBonds } from '../WEB3/bonding/ids';
import getAmountOut, { getDiscount } from '../WEB3/bonding/amountOut';
import { fromWei, toWei } from '../WEB3/API/balance';
import balance, { getEthBalance } from '../WEB3/Balance';
import {
  BondTypes,
  BondTokens,
  bondingContracts,
  tokenAddresses,
  explorerUrl,
  storageAddress,
} from '../../config/config';
import { allowance, approve } from '../WEB3/approve';
import { mint, mintFTM } from '../WEB3/bonding/mint';
import { claim } from '../WEB3/bonding/claim';

const parseArguments = (args: string) => {
  const argArr = args.split(' ');
  const token = argArr[0];
  const type = argArr[1];
  const amount = argArr[2];
  return [token, type, amount];
};
const validateAmount = (amount: any) => {
  if (!amount || Number.isNaN(amount) || Number(amount) <= 0)
    throw new Error('Please, provide correct amount.');
};

function validateArgs([token, type]: string[]) {
  const tokens = Object.keys(BondTokens);
  if (!tokens.includes(token)) {
    throw new Error(`Incorrect token name, avalable: ${tokens.toString()}`);
  }
  const types = Object.keys(BondTypes);
  if (!types.includes(type)) {
    throw new Error(`Incorrect bond type, avalable: ${types.toString()}`);
  }
  if (token === BondTokens.usdc) {
    throw new Error('Only FTM bonding is available for now, USDC coming soon');
  }
}
// Func Router

const helpWorker = ({ print }) => {
  print([textLine({ words: [textWord({ characters: messages.stakingHelpText })] })]);
};

const typesWorker = ({ print }) => {
  print([textLine({ words: [textWord({ characters: 'Available bond types: ' })] })]);
  for (const key of Object.keys(BondTypes)) {
    print([textLine({ words: [textWord({ characters: `-  ${key}` })] })]);
  }
};

const tokensWorker = ({ print }) => {
  print([textLine({ words: [textWord({ characters: 'Available tokens: ' })] })]);
  for (const key of Object.keys(BondTokens)) {
    print([textLine({ words: [textWord({ characters: `-  ${key}` })] })]);
  }
};

const bondsWorker = createWorker(async ({ print }, _, [userAddress]) => {
  const ids = await userBondIds(userAddress);
  if (ids.length === 0) {
    throw new Error("You don't have active bonds.");
  }
  const [active, claimed] = await separateBonds(ids);
  const printIds = (type: string, bondIds: string[]) => {
    if (bondIds.length < 1) {
      print([textLine({ words: [textWord({ characters: `You don't have ${type} bonds` })] })]);
      return;
    }
    const amount = bondIds.length === 1 ? 'id is' : 'ids are';
    print([
      textLine({
        words: [textWord({ characters: `Your ${type} ${amount}: ${bondIds.join(', ')}` })],
      }),
    ]);
  };
  printIds('active', active);
  printIds('claimed', claimed);
});

const mintWorker = createWorker(async ({ print }, args, [userAddress]) => {
  const [token, type, amount] = parseArguments(args);
  validateArgs([token, type]);
  validateAmount(amount);
  const weiAmount = toWei(amount);
  const contractAddress = bondingContracts[token][type];
  const tokenAddress = tokenAddresses[token];
  let tx;
  if (token === BondTokens.ftm) {
    const tokenBalance = await getEthBalance(userAddress);
    if (tokenBalance.lt(weiAmount)) throw new Error('Insufficient ETH amount');
    tx = await mintFTM(userAddress, contractAddress, weiAmount);
  } else {
    const tokenBalance = await balance(userAddress, tokenAddress);
    if (tokenBalance.lt(weiAmount)) throw new Error('Insufficient token amount');
    const all = await allowance(tokenAddress, contractAddress);
    if (all.lt(weiAmount)) {
      await approve(userAddress, tokenAddress, contractAddress, weiAmount);
    }
    tx = await mint(userAddress, contractAddress, weiAmount);
  }
  const id = tx.events.Mint.returnValues.tokenId;
  const txHash = tx.transactionHash;
  print([
    textLine({
      words: [textWord({ characters: `You have successfully issued bond with id ${id}` })],
    }),
  ]);
  printLink(print, messages.viewTxn, explorerUrl + txHash);
});

const claimWorker = createWorker(async ({ print }, bondId, [userAddress]) => {
  validateAmount(bondId);
  const contractAddress = await getBondingByBondId(bondId);
  // Check if contract address eq 0x00000....000
  if (parseInt(contractAddress, 16) === 0) throw new Error('Bond is not issued yet');
  const info = await bondInfo(contractAddress, bondId);
  if (!info.isActive) throw new Error('Bond is claimed or not active');
  const currentTs = Math.floor(Date.now() / 1000);
  if (currentTs < info.releaseTimestamp) {
    throw new Error('Bond is not allowed to claim yet');
  }
  // TODO add owner of check
  await approve(userAddress, storageAddress, contractAddress, Big(bondId));
  const tx = await claim(userAddress, contractAddress, bondId);
  const txHash = tx.transactionHash;
  print([
    textLine({
      words: [textWord({ characters: `You have successfully claimed bond with id ${bondId}` })],
    }),
  ]);
  printLink(print, messages.viewTxn, explorerUrl + txHash);
});

const infoWorker = async ({ print }, bondId) => {
  validateAmount(bondId);
  const contractAddress = await getBondingByBondId(bondId);
  if (parseInt(contractAddress, 16) === 0) throw new Error('Bond is not issued yet');

  const info = await bondInfo(contractAddress, bondId);
  print([
    textLine({
      words: [
        textWord({
          characters: `
        Status: ${info.isActive ? 'Active' : 'Claimed'}
        Issued: ${timeConverter(info.issueTimestamp)}
        Claim date: ${timeConverter(info.releaseTimestamp)}
        Release amount: ${fromWei(info.releaseAmount).toFixed(4)}
        `,
        }),
      ],
    }),
  ]);
};

const previewWorker = createWorker(async ({ print }, args) => {
  const [token, type, amount] = parseArguments(args);
  validateArgs([token, type]);
  validateAmount(amount);
  const contractAddress = bondingContracts[token][type];
  const weiAmount = toWei(amount);
  const [amountOut, discount] = await getAmountOut(contractAddress, weiAmount);
  const outEther = fromWei(amountOut);
  const discountEther = fromWei(discount);
  const percent = await getDiscount(contractAddress);

  print([
    textLine({
      words: [textWord({ characters: `You will receive ${outEther.toFixed(18)} of sGTON` })],
    }),
  ]);
  print([
    textLine({
      words: [
        textWord({
          characters: `Discount for this offer will be ${discountEther.toFixed(18)} - ${percent}%`,
        }),
      ],
    }),
  ]);
});

const BondingMap = {
  preview: previewWorker,
  help: helpWorker,
  tokens: tokensWorker,
  bonds: bondsWorker,
  types: typesWorker,
  mint: mintWorker,
  claimBond: claimWorker,
  info: infoWorker,
  ...commonOperators,
};

const Parse = parser(BondingMap);

export default Parse;
