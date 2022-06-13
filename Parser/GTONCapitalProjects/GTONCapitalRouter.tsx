import { textLine, textWord, anchorWord } from 'crt-terminal';
import Big from 'big.js';
import messages from '../../Messages/Messages';
import {
  gtonAddress,
  stakingAddress,
  explorerUrl,
  network,
  claimNetwork,
  chain,
  fantomStakingAddress,
  oneInchRouterAddress,
} from '../../config/config';
import { isCurrentChain } from '../WEB3/validate';
import commonOperators, { printLink } from '../common';
import notFoundStrings from '../../Errors/notfound-strings';
import { stake, unstake, claim, userDidClaim } from '../WEB3/Stake';
import { harvest } from '../WEB3/harvest';
import balance, { userShare } from '../WEB3/Balance';
import { toWei } from '../WEB3/API/balance';
import tokenMap from '../WEB3/API/addToken';
import { allowance, approve } from '../WEB3/approve';
import { buy, checkSwapAmount } from '../WEB3/buyGTON';

declare const window: any;

enum ErrorCodes {
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  USER_DECLINED_TRANSACTION = 3,
  NOT_ENOUGHT_FUNDS = -32000,
}

const ErrorHandler = (print, Code, Operation) => {
  if (Code === ErrorCodes.INVALID_ARGUMENT) {
    print([
      textLine({
        words: [
          textWord({
            characters: `It looks like you specified the quantity incorrectly, for example: ${Operation} 20, or ${Operation} all`,
          }),
        ],
      }),
    ]);
  }
  if (Code === ErrorCodes.USER_DECLINED_TRANSACTION) {
    print([textLine({ words: [textWord({ characters: 'User declined transaction' })] })]);
  }
  if (Code === ErrorCodes.NOT_ENOUGHT_FUNDS) {
    print([
      textLine({
        words: [textWord({ characters: "You don't have enough funds to buy that many GTON" })],
      }),
    ]);
  }
};

// Func Router

const HelpWorker = ({ print }) => {
  print([textLine({ words: [textWord({ characters: messages.stakingHelpText })] })]);
};

const StakeWorker = async ({ lock, loading, print }, Amount, [userAddress]) => {
  try {
    lock(true);
    loading(true);

    if (!(await isCurrentChain(network))) {
      throw new Error(`Wrong network, switch on ${chain.chainName}, please.`);
    }
    if (Amount === '0') throw new Error("You can't stake less than 0 $GTON");

    let amount;
    let userBalance;

    if (Amount === 'all') {
      userBalance = await balance(userAddress, tokenMap.gton.address);
      amount = userBalance;
    } else {
      amount = toWei(Amount);
      userBalance = await balance(userAddress, gtonAddress);
      if (amount.gt(userBalance)) throw Error('Insufficient amount');
    }

    const userAllowance = await allowance(gtonAddress, stakingAddress);
    if (amount.gt(userAllowance)) {
      const firstTxn = await approve(userAddress, gtonAddress, stakingAddress, amount);

      print([textLine({ words: [textWord({ characters: messages.approve })] })]);
      printLink(print, messages.viewTxn, explorerUrl + firstTxn);
    }

    const secondTxn = await stake(userAddress, amount);

    print([textLine({ words: [textWord({ characters: messages.stake('staked', Amount) })] })]);
    printLink(print, messages.viewTxn, explorerUrl + secondTxn);

    loading(false);
    lock(false);
  } catch (err) {
    if (err.code in ErrorCodes) {
      ErrorHandler(print, err.code, 'stake');
    } else {
      print([textLine({ words: [textWord({ characters: err.message })] })]);
    }

    loading(false);
    lock(false);
  }
};

const UnStakeWorker = async ({ lock, loading, print }, Amount, [userAddress]) => {
  try {
    lock(true);
    loading(true);

    if (!(await isCurrentChain(network))) {
      throw new Error(`Wrong network, switch on ${chain.chainName}, please.`);
    }
    if (Amount === '0') throw new Error("You can't unstake less than 0 $GTON");

    let amount;
    let userBalance;

    if (Amount === 'all') {
      userBalance = await userShare(userAddress);
      amount = userBalance;
    } else {
      amount = toWei(Amount);
      userBalance = await balance(userAddress, stakingAddress);
    }

    if (amount.gt(userBalance)) throw Error('Insufficient amount');
    const TxnHash = await unstake(userAddress, amount);

    print([textLine({ words: [textWord({ characters: messages.stake('unstaked', Amount) })] })]);
    printLink(print, messages.viewTxn, explorerUrl + TxnHash);

    loading(false);
    lock(false);
  } catch (err) {
    if (err.code in ErrorCodes) {
      ErrorHandler(print, err.code, 'unstake');
    } else {
      print([textLine({ words: [textWord({ characters: err.message })] })]);
    }
    loading(false);
    lock(false);
  }
};

const HarvestWorker = async ({ lock, loading, print }, Amount, [userAddress]) => {
  try {
    lock(true);
    loading(true);
    if (!(await isCurrentChain(network))) {
      throw new Error(`Wrong network, switch on ${chain.chainName}, please.`);
    }

    if (Amount === '0') throw new Error("You can't harvest less than 0 $GTON");

    let amount;
    let balanceUser;
    let userStake;

    if (Amount === 'all') {
      const token = tokenMap.sgton;
      const Balance = await balance(userAddress, token.address);

      amount = new Big(Balance).minus(await userShare(userAddress));
    } else {
      amount = toWei(Amount);
      userStake = await userShare(userAddress);
      balanceUser = await balance(userAddress, stakingAddress);
      if (amount.gt(balanceUser.minus(userStake))) throw Error('Insufficient amount');
    }

    const TxnHash = await harvest(userAddress, amount);

    print([textLine({ words: [textWord({ characters: messages.harvested(Amount) })] })]);
    printLink(print, messages.viewTxn, explorerUrl + TxnHash);
    loading(false);
    lock(false);
  } catch (err) {
    if (err.code in ErrorCodes) {
      ErrorHandler(print, err.code, 'harvest');
    } else {
      print([textLine({ words: [textWord({ characters: err.message })] })]);
    }
    loading(false);
    lock(false);
  }
};

const ClaimPostAuditWorker = async ({ lock, loading, print }, Args, [userAddress]) => {
  try {
    lock(true);
    loading(true);
    if (!(await isCurrentChain(claimNetwork))) {
      throw new Error('Wrong network, switch on Fantom Opera, please.');
    }

    if (await userDidClaim()) throw Error('You already claimed your GTON from V1 staking');

    const stakingBalance = await balance(userAddress, fantomStakingAddress);
    if (stakingBalance.eq(0)) throw Error("You don't have any GTON in V1 staking");

    const secondTxn = await claim();

    print([textLine({ words: [textWord({ characters: messages.claim })] })]);
    print([
      textLine({
        words: [
          anchorWord({
            className: 'link-padding',
            characters: messages.viewTxn,
            href: explorerUrl + secondTxn,
          }),
        ],
      }),
    ]);

    loading(false);
    lock(false);
  } catch (err) {
    if (err.code in ErrorCodes) {
      ErrorHandler(print, err.code, 'stake');
    } else {
      print([textLine({ words: [textWord({ characters: err.message })] })]);
    }

    loading(false);
    lock(false);
  }
};

const BuyWorker = async ({ lock, loading, print }, Args, [userAddress]) => {
  try {
    loading(true);
    lock(true);
    if (!(await isCurrentChain(network))) {
      throw new Error(`Wrong network, switch on ${chain.chainName}, please.`);
    }
    const tmpARGS = Args.split(' ');

    if (tmpARGS.length < 3) {
      throw new Error('Invalid input');
    }
    const Amount = tmpARGS[2]; // amount
    const TokenName = tmpARGS[3];
    const token = TokenName in tokenMap ? tokenMap[TokenName] : null;

    if (!token || !token.canBeUsedForPurchase) {
      throw new Error('Wrong symbol, available tokens: usdc');
    }
    const amount = toWei(Amount, token.decimals);

    let userBalance;
    let trx;
    let amountBetweenSwap;

    userBalance = await balance(userAddress, token.address);

    if (amount.gt(userBalance)) throw Error('Insufficient amount');

    const userAllowance = await allowance(token.address, oneInchRouterAddress);
    if (amount.gt(userAllowance)) {
      const firstTxn = await approve(userAddress, token.address, oneInchRouterAddress, amount);
      print([textLine({ words: [textWord({ characters: messages.approve })] })]);
      printLink(print, messages.viewTxn, explorerUrl + firstTxn);
    }

    try {
      amountBetweenSwap = await checkSwapAmount(amount, token.address);
      print([
        textLine({
          words: [textWord({ characters: amountBetweenSwap })],
        }),
      ]);
    } catch (e) {
      throw Error(e);
    }

    try {
      trx = await buy(amount, userAddress, token.address);
      print([
        textLine({
          words: [textWord({ characters: 'You have successfully purchased $GTON!' })],
        }),
      ]);
      print([textLine({ words: [textWord({ characters: '#WA𝔾MI ⚜️' })] })]);
      printLink(print, messages.viewTxn, explorerUrl + trx);
    } catch (e) {
      throw Error(e);
    }
    loading(false);
    lock(false);
  } catch (err) {
    if (err.code in ErrorCodes) {
      ErrorHandler(print, err.code, 'Buy');
    } else {
      print([textLine({ words: [textWord({ characters: err.message })] })]);
    }
    loading(false);
    lock(false);
  }
};

const Commands = [
  'help',
  'join',
  'stake',
  'unstake',
  'balance',
  'add',
  'faucet',
  'harvest',
  'buy',
  'claim',
];

const GTONRouterMap = {
  help: HelpWorker,
  stake: StakeWorker,
  unstake: UnStakeWorker,
  harvest: HarvestWorker,
  buy: BuyWorker,
  claim: ClaimPostAuditWorker,
  ...commonOperators,
};

const ArgsFunctions = ['stake', 'unstake', 'harvest', 'buy'];

async function Parse(eventQueue, state, command) {
  const { print } = eventQueue.handlers;
  const Command = command.split(' ')[0].trim().toLowerCase();
  // split was replaced by substring because of the buy command, which assumes two parameters
  const Arg = command.substring(command.indexOf(' ')).replace(' ', '');

  try {
    for (command in Commands) {
      // check if user provided something like stake10 instead of stake 10
      if (Command.indexOf(command) !== -1)
        throw new Error(
          'It looks like you forgot the space in the command, examples: \n stake 10 \n unstake 10 \n harvest 10',
        );
    }
    // Handle incorrect command
    if (!(Command in GTONRouterMap))
      throw Error(notFoundStrings[Math.floor(Math.random() * notFoundStrings.length)]);
    if (ArgsFunctions.includes(Command) && Arg == Command)
      throw Error('You should provide args for calling this function. e.g stake 1');
    GTONRouterMap[Command](eventQueue.handlers, Arg.toLowerCase(), state);
  } catch (err) {
    print([textLine({ words: [textWord({ characters: err.message })] })]);
  }
}

export { GTONRouterMap };
export default Parse;
