import {
  textLine,
  textWord,
  anchorWord,
} from 'crt-terminal';
import Big from 'big.js';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import messages from '../../Messages/Messages';
import {
  gtonAddress,
  stakingAddress,
  explorerUrl,
  WFTMAddress,
  GTONAddress,
  spiritswappooladdress,
} from '../../config/config';
import commonOperators, { printLink } from "../common";
import notFoundStrings from '../../Errors/notfound-strings'
import { stake, unstake, claim } from '../WEB3/Stake';
import { harvest } from '../WEB3/harvest';
import balance, { userShare } from '../WEB3/Balance';
import { toWei } from '../WEB3/API/balance';
import tokenMap from '../WEB3/API/addToken';
import { allowance, approve } from '../WEB3/approve';
import buy from '../WEB3/buyGTON';
import erc20 from '../WEB3/ABI/erc20.json';

declare const window: any;

enum ErrorCodes {
  INVALID_ARGUMENT = "INVALID_ARGUMENT",
  USER_DECLINED_TRANSACTION = 3,
  NOT_ENOUGHT_FUNDS = -32000
}

const ErrorHandler = (print, Code, Operation) => {
  if (Code === ErrorCodes.INVALID_ARGUMENT) {
    print([textLine({ words: [textWord({ characters: `It looks like you specified the quantity incorrectly, for example: ${Operation} 20, or ${Operation} all` })] })]);
  }
  if (Code === ErrorCodes.USER_DECLINED_TRANSACTION) {
    print([textLine({ words: [textWord({ characters: "User declined transaction" })] })]);
  }
  if (Code === ErrorCodes.NOT_ENOUGHT_FUNDS) {
    print([textLine({ words: [textWord({ characters: "You don't have enough funds to buy that many GTON" })] })]);
  }
}

// Func Router 

const HelpWorker = ({ print }) => {
  print([textLine({ words: [textWord({ characters: messages.stakingHelpText })] })]);
}

const StakeWorker = async ({ lock, loading, print }, Amount, [userAddress]) => {
  print([textLine({words:[textWord({ characters: "Temporarily disabled." })]})]);
  return
  try {
    lock(true);
    loading(true);

    if (Amount === 0) throw new Error('You cant stake less than 0 $GTON');

    let amount;
    let userBalance;

    if (Amount === 'all') {
      userBalance = await balance(userAddress, tokenMap.gton.address);
      amount = userBalance;
    }
    else {
      amount = toWei(Amount)
      userBalance = await balance(userAddress, gtonAddress);
      if (amount.gt(userBalance)) throw Error("Insufficient amount")
    }
    const userAllowance = await allowance(gtonAddress, stakingAddress);
    if (amount.gt(userAllowance)) {
      const firstTxn = await approve(userAddress, gtonAddress, stakingAddress, amount)

      print([textLine({ words: [textWord({ characters: messages.approve })] })]);
      printLink(print, messages.viewTxn, explorerUrl + firstTxn)

    }

    const secondTxn = await stake(userAddress, amount);

    print([textLine({ words: [textWord({ characters: messages.stake("staked", Amount) })] })]);
    printLink(print, messages.viewTxn, explorerUrl + secondTxn)

    loading(false);
    lock(false);
  }
  catch (err) {
    if (err.code in ErrorCodes) {
      ErrorHandler(print, err.code, "stake");
    }
    else {
      print([textLine({ words: [textWord({ characters: err.message })] })]);
    }

    loading(false);
    lock(false);
  }
}

const UnStakeWorker = async ({ lock, loading, print }, Amount, [userAddress]) => {
  print([textLine({words:[textWord({ characters: "Temporarily disabled." })]})]);
  return
  try {
    if (Amount === 0) throw new Error('You cant unstake less than 0 $GTON');
    lock(true);
    loading(true);

    let amount;
    let userBalance;

    if (Amount === "all") {
      userBalance = await userShare(userAddress);
      amount = userBalance;
    }
    else {
      amount = toWei(Amount)
      userBalance = await balance(userAddress, stakingAddress);
    }

    if (amount.gt(userBalance)) throw Error("Insufficient amount")
    const TxnHash = await unstake(userAddress, amount);

    print([textLine({ words: [textWord({ characters: messages.stake("unstaked", Amount) })] })]);
    printLink(print, messages.viewTxn, explorerUrl + TxnHash)

    loading(false);
    lock(false);
  }
  catch (err) {
    if (err.code in ErrorCodes) {
      ErrorHandler(print, err.code, "unstake");
    }
    else {
      print([textLine({ words: [textWord({ characters: err.message })] })]);
    }
    loading(false);
    lock(false);
  }
}

const HarvestWorker = async ({ lock, loading, print }, Amount, [userAddress]) => {
  print([textLine({words:[textWord({ characters: "Temporarily disabled." })]})]);
  return
  try {
    lock(true);
    loading(true);

    if (Amount === 0) throw new Error('You cant harvest less than 0 $GTON')

    let amount;
    let balanceUser;
    let userStake;

    if (Amount === 'all') {
      const token = tokenMap.sgton
      const Balance = (await balance(userAddress, token.address));

      amount = new Big(Balance).minus(await userShare(userAddress))
    }
    else {
      amount = toWei(Amount)
      userStake = await userShare(userAddress);
      balanceUser = await balance(userAddress, stakingAddress);
      if (amount.gt(balanceUser.minus(userStake))) throw Error("Insufficient amount")
    }

    const TxnHash = await harvest(userAddress, amount);

    print([textLine({ words: [textWord({ characters: messages.harvested(Amount) })] })]);
    printLink(print, messages.viewTxn, explorerUrl + TxnHash)
    loading(false);
    lock(false);
  }
  catch (err) {
    if (err.code in ErrorCodes) {
      ErrorHandler(print, err.code, "harvest");
    }
    else {
      print([textLine({ words: [textWord({ characters: err.message })] })]);
    }
    loading(false);
    lock(false);
  }
}

const ClaimPostAuditWorker = async ({ lock, loading, print }, Args, [userAddress]) => 
{
  try
  {
    lock(true);
    loading(true);

    const secondTxn = await claim();

    print([textLine({words:[textWord({ characters: messages.claim })]})]);
    print([textLine({words:[anchorWord({ className: "link-padding", characters: messages.viewTxn, href: explorerUrl+secondTxn })]})]);
  
    loading(false);
    lock(false);
  }
  catch(err)
  {
    if (err.code in ErrorCodes)
    {
      ErrorHandler(print, err.code, "stake");
    }
    else
    {
      print([textLine({words:[textWord({ characters: err.message })]})]);
    }
    
    loading(false);
    lock(false);
  }
}

const BuyWorker = async ({ lock, loading, print }, Args, [userAddress]) => {
  try {
    loading(true);
    lock(true);

    const tmpARGS = Args.split(' ');

    const Token1 = tmpARGS[0]; // GTON amount
    const Token2 = tmpARGS[2]; // FTM, USDC, etc
    const token = toWei(Token1)

    if (Token1 === 0) throw new Error('You cant buy 0 $GTON')
    if (Token1 < 0) throw new Error('You cant buy less than 0 $GTON')
    if (Token2 === undefined) throw new Error("Apparently you did not specify for which token you want to buy $GTON, example: buy 1 with ftm")

    let TradePrice;
    const web3 = new Web3(window.ethereum);
    switch (Token2) // Find pairs on spirit
    {
      case 'ftm': // By default, buy for native FTM
        {
          // Get tokens contract, for executing balanceOf, so we can calculate price later
          const WFTMContract = new web3.eth.Contract(erc20 as AbiItem[], WFTMAddress);
          const GTONContract = new web3.eth.Contract(erc20 as AbiItem[], GTONAddress);

          const wftmPoolValue: string = await WFTMContract.methods.balanceOf(spiritswappooladdress).call();
          const gtonPoolValue: string = await GTONContract.methods.balanceOf(spiritswappooladdress).call();

          const wftm = Big(wftmPoolValue)
          const gton = Big(gtonPoolValue)
          const priceRN = wftm.div(gton);                        // price right now
          const ExecFTM = wftm.plus(priceRN.mul(token));           // how much ftm be in the pool
          const ExecGTON = gton.minus(token);                       // how much gton be in the pool

          TradePrice = ExecFTM.div(ExecGTON);
          TradePrice = TradePrice.add(TradePrice.mul(0.003)) // slippage
          console.log(TradePrice.toFixed());
          break;
        }
        default: {
          throw new Error("Incorrect payment token")
        }
    }
    const tx = await buy(token, TradePrice, userAddress);

    print([textLine({ words: [textWord({ characters: "You have successfully purchased $GTON!" })] })]);
    print([textLine({ words: [textWord({ characters: "#WA𝔾MI ⚜️" })] })]);
    print([textLine({ words: [textWord({ characters: "Transaction:" })] })]);
    printLink(print, messages.viewTxn, explorerUrl + tx)

    loading(false);
    lock(false);
  }
  catch (err) {
    if (err.code in ErrorCodes) {
      ErrorHandler(print, err.code, "Buy");
    }
    else {
      print([textLine({ words: [textWord({ characters: err.message })] })]);
    }
    loading(false);
    lock(false);
  }
}

const Commands =
  [
    "help",
    "join",
    "stake",
    "unstake",
    "switch",
    "balance",
    "add",
    "faucet",
    "harvest",
    "buy",
    "claim",
  ]

const GTONRouterMap =
{
  "help": HelpWorker,
  "stake": StakeWorker,
  "unstake": UnStakeWorker,
  "harvest": HarvestWorker,
  "buy": BuyWorker,
  "claim": ClaimPostAuditWorker,
  ...commonOperators
}

const ArgsFunctions =
  [
    "stake",
    "unstake",
    "harvest",
    "buy"
  ]

async function Parse(eventQueue, state, command) {
  const { print } = eventQueue.handlers;
  const Command = command.split(' ')[0].trim().toLowerCase();
  // split was replaced by substring because of the buy command, which assumes two parameters
  const Arg = command.substring(command.indexOf(' ')).replace(' ', '');

  try {
    for (command in Commands) // check if user provided something like stake10 instead of stake 10
    {
      if (Command.indexOf(command) !== -1) throw new Error("It looks like you forgot the space in the command, examples: \n stake 10 \n unstake 10 \n harvest 10");
    }
    // Handle incorrect command
    if (!(Command in GTONRouterMap)) throw Error(notFoundStrings[Math.floor(Math.random() * notFoundStrings.length)]);
    if (ArgsFunctions.includes(Command) && Arg == Command) throw Error("You should provide args for calling this function. e.g stake 1");
    GTONRouterMap[Command](eventQueue.handlers, Arg.toLowerCase(), state);
  }
  catch (err) {
    print([textLine({ words: [textWord({ characters: err.message })] })]);
  }
}

export { GTONRouterMap }
export default Parse;
