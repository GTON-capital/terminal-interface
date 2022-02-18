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
import { ChainId, Fetcher, WETH, Route } from 'spiritswap-sdk';
import buy from '../WEB3/buyGTON';
const ethers = require('ethers');  

const url = fantomNet.rpcUrls[0];
const customHttpProvider = new ethers.providers.JsonRpcProvider(url);

const chainId = ChainId.MAINNET;

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

    let gton, amount, userBalance;

    if(Amount == 'all')
    {
      userBalance = await balance(tokenMap['gton'].address);
    }
    else
    {
      amount = toWei(new BigNumber(Amount))
      userBalance = await balance(tokenAddress);
    }

    if(amount.gt(userBalance)) throw Error("Insufficient amount")

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
    print([textLine({words:[textWord({ characters: err.message })]})]);
    loading(false);
    lock(false);
  }
}

const UnStakeWorker = async (eventQueue, Amount) => 
{
  const { lock, loading, print } = eventQueue.handlers;
  try
  {
    lock(true);
    loading(true);

    let amount, userBalance, TxnHash;

    if(Amount === "all")
    {
      userBalance = await balance(await (await userShare()).toString());
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
    print([textLine({words:[textWord({ characters: err.message })]})]);
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

    let TxnHash, amount, balanceUser, userStake

    if(Amount == 'all')
    {
      amount = toWei(new BigNumber(tokenMap['sgton'].address))
    }
    else
    {
      amount = toWei(new BigNumber(Amount))
    }

    userStake = await userShare();
    balanceUser = await balance(stakingAddress);
    if(amount.gt(balanceUser.minus(userStake))) throw Error("Insufficient amount")

    TxnHash = await harvest(amount);

    print([textLine({words:[textWord({ characters: messages.harvested(Amount) })]})]);
    print([textLine({words:[anchorWord({ className: "link-padding", characters: messages.viewTxn,  onClick: () => {window.open(ftmscanUrl+TxnHash, '_blank');} })]})]);
  
    loading(false);
    lock(false);
  }
  catch(err)
  {
    print([textLine({words:[textWord({ characters: err.message })]})]);
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
    print([textLine({words:[textWord({ characters: err.message })]})]);
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
    print([textLine({words:[textWord({ characters: err.message })]})]);
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
    print([textLine({words:[textWord({ characters: err.message })]})]);
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
    print([textLine({words:[textWord({ characters: err.message })]})]);
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
    print([textLine({words:[textWord({ characters: err.message })]})]);
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
    const Token2 = tmpARGS[3]; // FTM, USDC, etc

    const GTON = await Fetcher.fetchTokenData(chainId, tokenAddress, customHttpProvider);
    const FTM = WETH[chainId];

    let tx, price, route;

    switch (Token2) // Find pairs on spirit
    {
      case 'ftm': // By default, buy for native FTM
      {
        const pair = await Fetcher.fetchPairData(GTON, FTM, customHttpProvider);
        route = new Route([pair], FTM);

        loading(false);
        lock(false);
      }
      default: 
      {
        print([textLine({words:[textWord({ characters: 'Sorry ' + Token2 + ' not found' })]})]);

        loading(false);
        lock(false);
      }
    }
    price = (+route.midPrice.invert().toSignificant(6) * +Token1)
    tx = await buy(+Token1, price.toFixed(2));

    print([textLine({words:[textWord({ characters: "You have successfully purchased $GTON!" })]})]);
    print([textLine({words:[textWord({ characters: "#WA𝔾MI ⚜️" })]})]);
    print([textLine({words:[textWord({ characters: "Transaction:" })]})]);
    print([textLine({words:[anchorWord({ className: "link-padding", characters: messages.viewTxn,  onClick: () => {window.open(ftmscanUrl+tx, '_blank');} })]})]);

    loading(false);
    lock(false);
  }
  catch (err) 
  {
    print([textLine({words:[textWord({ characters: err.message })]})]);
    loading(false);
    lock(false);
  }
}

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
    // Handle incorrect command
    if(!(Command in GTONRouterMap)) throw Error(notFoundStrings[Math.floor(Math.random() * notFoundStrings.length)]);
    if(ArgsFunctions.includes(Command) && Arg == "") throw Error("You should provide args for calling this function. e.g stake 1");
    GTONRouterMap[Command](eventQueue, Arg.toLowerCase());
  }
  catch(err)
  {
    print([textLine({words:[textWord({ characters: err.message })]})]);
  }
}

export { AddTokenWorker, BalanceWorker, SwitchWorker, ConnectMetamaskWorker, HarvestWorker, UnStakeWorker, StakeWorker, GTONRouterMap }
export default Parse;