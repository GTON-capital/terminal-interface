import {
  textLine,
  textWord,
  anchorWord
} from 'crt-terminal';
import BigNumber from 'bignumber.js';
import messages from '../../Messages/Messages';
import {
  tokenAddress,
  stakingAddress,
  ftmscanUrl,
  fantomNet,
  WFTMAddress,
  GTONAddress,
  spiritswappooladdress,
} from '../../config/config';
import notFoundStrings from '../../Errors/notfound-strings'
import { stake, unstake } from '../WEB3/Stake';
import connectMetamask from '../WEB3/ConnectMetamask';
import switchChain from '../WEB3/Switch';
import {harvest} from '../WEB3/harvest';
import balance, {userShare} from '../WEB3/Balance';
import addToken from '../WEB3/addTokenToMM';
import tokenMap from '../WEB3/API/addToken';
import { allowance, approve } from '../WEB3/approve';
import faucet from '../WEB3/Faucet';
import { fromWei, toWei } from '../WEB3/API/balance';
import buy from '../WEB3/buyGTON';
import erc20 from '../WEB3/ABI/erc20.json';
const ethers = require('ethers');  

const url = fantomNet.rpcUrls[0];
const customHttpProvider = new ethers.providers.JsonRpcProvider(url);

enum ErrorCodes 
{
  INVALID_ARGUMENT = "INVALID_ARGUMENT",
  USER_DECLINED_TRANSACTION = 3,
  NOT_ENOUGHT_FUNDS = -32000
}

const ErrorHandler = (eventQueue, Code, Operation) =>
{
  const { print } = eventQueue.handlers;
  if(Code == ErrorCodes.INVALID_ARGUMENT) 
  {
    print([textLine({words:[textWord({ characters: "It looks like you specified the quantity incorrectly, for example: " + Operation + " 20, or " + Operation + " all" })]})]);
  }
  if(Code == ErrorCodes.USER_DECLINED_TRANSACTION) 
  {
    print([textLine({words:[textWord({ characters: "User declined transaction" })]})]);
  }
  if(Code == ErrorCodes.NOT_ENOUGHT_FUNDS) 
  {
    print([textLine({words:[textWord({ characters: "You don't have enough funds to buy that many GTON" })]})]);
  }
}

// Func Router 

const HelpWorker = (eventQueue) =>
{
  const { print } = eventQueue.handlers;
  print([textLine({words:[textWord({ characters: messages.helpText })]})]);
}

const StakeWorker = async (eventQueue, Amount) => 
{
  const { lock, loading, print } = eventQueue.handlers;
  try
  {
    lock(true);
    loading(true);

    if(Amount == 0) throw new Error('You cant stake less than 0 $GTON');

    let amount, userBalance;

    if(Amount == 'all')
    {
      userBalance = await balance(tokenMap['gton'].address);
      amount =      userBalance;
    }
    else
    {
      amount = toWei(new BigNumber(Amount))
      userBalance = await balance(tokenAddress);
      if(amount.gt(userBalance)) throw Error("Insufficient amount")
    }

    const userAllowance = await allowance();
    if(amount.gt(userAllowance)) {
      const firstTxn = await approve(tokenAddress, stakingAddress, amount)

      print([textLine({words:[textWord({ characters: messages.approve })]})]);
      print([textLine({words:[anchorWord({ className: "link-padding", characters: messages.viewTxn, href: ftmscanUrl+firstTxn})]})]);
      
    }

    const secondTxn = await stake(amount);

    print([textLine({words:[textWord({ characters: messages.stake("staked", Amount) })]})]);
    print([textLine({words:[anchorWord({ className: "link-padding", characters: messages.viewTxn, href: ftmscanUrl+secondTxn })]})]);
  
    loading(false);
    lock(false);
  }
  catch(err)
  {
    if (err.code in ErrorCodes)
    {
      ErrorHandler(eventQueue, err.code, "stake");
    }
    else
    {
      print([textLine({words:[textWord({ characters: err.message })]})]);
    }
    
    loading(false);
    lock(false);
  }
}

const UnStakeWorker = async (eventQueue, Amount) => 
{
  const { lock, loading, print } = eventQueue.handlers;
  try
  {
    if(Amount == 0) throw new Error('You cant unstake less than 0 $GTON');
    lock(true);
    loading(true);

    let amount, userBalance, TxnHash;

    if(Amount === "all")
    {
      userBalance = await userShare();
      amount = userBalance;
    }
    else 
    {
      amount = toWei(new BigNumber(Amount))
      userBalance = await balance(stakingAddress);
    }

    if(amount.gt(userBalance)) throw Error("Insufficient amount")
    TxnHash = await unstake(amount);

    print([textLine({words:[textWord({ characters: messages.stake("unstaked", Amount) })]})]);
    print([textLine({words:[anchorWord({ className: "link-padding", characters: messages.viewTxn,  onClick: () => {window.open(ftmscanUrl+TxnHash, '_blank');} })]})]);
  
    loading(false);
    lock(false);
  }
  catch(err)
  {
    if (err.code in ErrorCodes)
    {
      ErrorHandler(eventQueue, err.code, "unstake");
    }
    else
    {
      print([textLine({words:[textWord({ characters: err.message })]})]);
    }
    loading(false);
    lock(false);
  }
}

const HarvestWorker = async (eventQueue, Amount) => 
{
  const { lock, loading, print } = eventQueue.handlers;
  try
  {
    lock(true);
    loading(true);

    if(Amount == 0) throw new Error('You cant harvest less than 0 $GTON')

    let TxnHash, amount, balanceUser, userStake

    if(Amount == 'all')
    {
      const token = tokenMap['sgton']
      const Balance = (await balance(token.address));

      amount = toWei(Balance.minus(await userShare()))
    }
    else
    {
      amount = toWei(new BigNumber(Amount))
      userStake = await userShare();
      balanceUser = await balance(stakingAddress);
      if(amount.gt(balanceUser.minus(userStake))) throw Error("Insufficient amount")
    }

    TxnHash = await harvest(amount);

    print([textLine({words:[textWord({ characters: messages.harvested(Amount) })]})]);
    print([textLine({words:[anchorWord({ className: "link-padding", characters: messages.viewTxn,  onClick: () => {window.open(ftmscanUrl+TxnHash, '_blank');} })]})]);
  
    loading(false);
    lock(false);
  }
  catch(err)
  {
    if (err.code in ErrorCodes)
    {
      ErrorHandler(eventQueue, err.code, "harvest");
    }
    else
    {
      print([textLine({words:[textWord({ characters: err.message })]})]);
    }
    loading(false);
    lock(false);
  }
}

const ConnectMetamaskWorker = async (eventQueue) =>
{
  const { lock, loading, print } = eventQueue.handlers;
  try
  {
    lock(true);
    loading(true);

    const address = await connectMetamask();
    print([textLine({words:[textWord({ characters: "Connected succefuly: " + address })]})]);

    loading(false);
    lock(false);
  }
  catch(err)
  {
    print([textLine({words:[textWord({ characters: "Error while connecting metamask, please try again" })]})]);
    loading(false);
    lock(false);
  }
}

const SwitchWorker = async (eventQueue) =>
{
  const { lock, loading, print } = eventQueue.handlers;
  try
  {
    lock(true);
    loading(true);

    await switchChain();
    print([textLine({words:[textWord({ characters: messages.chainSwitch })]})]);

    loading(false);
    lock(false);
  }
  catch(err)
  {
    print([textLine({words:[textWord({ characters: "Error while switching chain, make sure metamask are connected." })]})]);
    loading(false);
    lock(false);
  }
}

const BalanceWorker = async (eventQueue, TokenName) => 
{
  const { lock, loading, print } = eventQueue.handlers;

  try
  {
    lock(true);
    loading(true);

    if(TokenName == "all")
    {
      const token = tokenMap['sgton']
      const Balance = (await balance(token.address));

      const harvest = fromWei(Balance.minus(await userShare()));
      const share = fromWei(await userShare())
      const gton = fromWei(await balance(tokenMap['gton'].address))

      print([textLine({words:[textWord({ characters: "Harvest: " + harvest.toFixed(4).replace(/0*$/,"") })]})]);
      print([textLine({words:[textWord({ characters: "SGTON:   " + share.toFixed(4).replace(/0*$/,"") })]})]);
      print([textLine({words:[textWord({ characters: "GTON:    " + gton.toFixed(4).replace(/0*$/,"") })]})]);

      loading(false);
      lock(false);
      return
    }

    const token = TokenName === "harvest" ? tokenMap.sgton : tokenMap[TokenName]
    if(!token) throw Error("Available tokens are: gton, sgton, harvest");
    const Balance = (await balance(token.address));
    let CoinBalance;

    if(TokenName === "harvest") {
      const share = await userShare();
      CoinBalance = fromWei(Balance.minus(share));
    } else if(TokenName === "sgton") {
      CoinBalance = fromWei(await userShare())
    } else {
      CoinBalance = fromWei(Balance);
    }
    const res = messages.balance(CoinBalance.toFixed(18));
    print([textLine({words:[textWord({ characters: res })]})]);

    loading(false);
    lock(false);
  }
  catch(err)
  {
    print([textLine({words:[textWord({ characters: "Something went wrong, please try again" })]})]);
    loading(false);
    lock(false);
  }
}

const AddTokenWorker = async (eventQueue, TokenName) =>
{
  const { lock, loading, print } = eventQueue.handlers;

  try
  {
    lock(true);
    loading(true);
    const token = tokenMap[TokenName]
    if(!token) throw Error("Available tokens are: gton, sgton");
    await addToken(token);
    print([textLine({words:[textWord({ characters: messages.addToken })]})]);

    loading(false);
    lock(false);
  }
  catch(err)
  {
    print([textLine({words:[textWord({ characters: "Error while add token to metamask" })]})]);
    loading(false);
    lock(false);
  }
}

const FaucetWorker = async (eventQueue) => 
{
  const { lock, loading, print } = eventQueue.handlers;
  try
  {
    lock(true);
    loading(true);

    await faucet();
    print([textLine({words:[textWord({ characters: messages.faucetDeposit })]})]);

    loading(false);
    lock(false);
  }
  catch(err)
  {
    print([textLine({words:[textWord({ characters: "" })]})]);
    loading(false);
    lock(false);
  }
}

const BuyWorker = async (eventQueue, Args) =>
{
  const { lock, loading, print } = eventQueue.handlers;

  try 
  {
    loading(true);
    lock(true);

    const tmpARGS = Args.split(' ');

    const Token1 = tmpARGS[0]; // GTON amount
    const Token2 = tmpARGS[2]; // FTM, USDC, etc

    if(Token1 == 0)         throw new Error('You cant buy 0 $GTON')
    if(Token1 < 0)          throw new Error('You cant buy less than 0 $GTON')
    if(Token2 == undefined) throw new Error("Apparently you did not specify for which token you want to buy $GTON, example: buy 1 with ftm")

    let tx, TradePrice;

    switch (Token2) // Find pairs on spirit
    {
      case 'ftm': // By default, buy for native FTM
      {
        // Get tokens contract, for executing balanceOf, so we can calculate price later
        const WFTMContract = await new ethers.Contract(WFTMAddress, erc20, customHttpProvider); 
        const GTONContract = await new ethers.Contract(GTONAddress, erc20, customHttpProvider);

        let wftmPoolValue : BigNumber = await WFTMContract.balanceOf(spiritswappooladdress);
        let gtonPoolValue : BigNumber = await GTONContract.balanceOf(spiritswappooladdress);

        const wftm = ethers.utils.formatEther(wftmPoolValue.toString()).toString()
        const gton = ethers.utils.formatEther(gtonPoolValue.toString()).toString()

        const priceRN = (+wftm / +gton);                        // price right now
        const ExecFTM = +wftm + (+priceRN * +Token1);           // how much ftm be in the pool
        const ExecGTON = +gton - +Token1;                       // how much gton be in the pool

        TradePrice = ExecFTM / ExecGTON;
        TradePrice = TradePrice + (TradePrice * 0.003) // slippage
        break;
      }
    }
    tx = await buy(+Token1, TradePrice);

    print([textLine({words:[textWord({ characters: "You have successfully purchased $GTON!" })]})]);
    print([textLine({words:[textWord({ characters: "#WA𝔾MI ⚜️" })]})]);
    print([textLine({words:[textWord({ characters: "Transaction:" })]})]);
    print([textLine({words:[anchorWord({ className: "link-padding", characters: messages.viewTxn,  onClick: () => {window.open(ftmscanUrl+tx, '_blank');} })]})]);

    loading(false);
    lock(false);
  }
  catch (err) 
  {
    if (err.code in ErrorCodes)
    {
      ErrorHandler(eventQueue, err.code, "Buy");
    }
    else
    {
      print([textLine({words:[textWord({ characters: err.message })]})]);
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
]

const GTONRouterMap =
{
  "help": HelpWorker,
  "join": ConnectMetamaskWorker,
  "stake": StakeWorker,
  "unstake": UnStakeWorker,
  "switch": SwitchWorker,
  "balance": BalanceWorker,
  "add": AddTokenWorker,
  "faucet": FaucetWorker,
  "harvest": HarvestWorker,
  "buy": BuyWorker,
}

const ArgsFunctions = 
[
  "stake",
  "unstake",
  "harvest",
  "buy"
]

async function Parse(eventQueue, command)
{
  const { print } = eventQueue.handlers;
  const Command = command.split(' ')[0].trim().toLowerCase();
  // split was replaced by substring because of the buy command, which assumes two parameters
  const Arg = command.substring(command.indexOf(' ')).replace(' ', '');

  try
  {
    for (command in Commands) // check if user provided something like stake10 instead of stake 10
    {
      if(Command.indexOf(command) !== -1) throw new Error("It looks like you forgot the space in the command, examples: \n stake 10 \n unstake 10 \n harvest 10");
    }
    // Handle incorrect command
    if(!(Command in GTONRouterMap)) throw Error(notFoundStrings[Math.floor(Math.random() * notFoundStrings.length)]);
    if(ArgsFunctions.includes(Command) && Arg == Command) throw Error("You should provide args for calling this function. e.g stake 1");
    GTONRouterMap[Command](eventQueue, Arg.toLowerCase());
  }
  catch(err)
  {
    print([textLine({words:[textWord({ characters: err.message })]})]);
  }
}

export { AddTokenWorker, BalanceWorker, SwitchWorker, ConnectMetamaskWorker, HarvestWorker, UnStakeWorker, StakeWorker, GTONRouterMap }
export default Parse;
