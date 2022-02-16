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
import classes from '../../pages/index.module.scss'
import { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType } from '@pancakeswap-libs/sdk';
import buy from '../WEB3/buyGTON';
const ethers = require('ethers');  

const url = 'https://rpc.ftm.tools';
const customHttpProvider = new ethers.providers.JsonRpcProvider(url);

const chainId = ChainId.MAINNET;
const gtonAddress = '0xc1be9a4d5d45beeacae296a7bd5fadbfc14602c4'

// Func Router 

const HelpSlave = (eventQueue) =>
{
  const { print } = eventQueue.handlers;
  print([textLine({words:[textWord({ characters: messages.helpText })]})]);
}

const StakeSlave = async (eventQueue, Amount) => 
{
  const { lock, loading, print } = eventQueue.handlers;
  try
      {

        lock(true);
        loading(true);

        const amount = toWei(new BigNumber(Amount))
        const userBalance = await balance(tokenAddress);
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

const UnStakeSlave = async (eventQueue, Amount) => 
{
  const { lock, loading, print } = eventQueue.handlers;
  try
      {
        lock(true);
        loading(true);
        const amount = toWei(new BigNumber(Amount))
        const userBalance = await balance(stakingAddress);
        if(amount.gt(userBalance)) throw Error("Insufficient amount")
        const TxnHash = await unstake(amount);

        print([textLine({words:[textWord({ characters: messages.stake("unstaked", Amount) })]})]);
        print([textLine({className: classes.customLine, words:[anchorWord({ className: "link-padding", characters: messages.viewTxn, href: ftmscanUrl+TxnHash })]})]);
     
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

const HarvestSlave = async (eventQueue, Amount) => 
{
  const { lock, loading, print } = eventQueue.handlers;
  try
      {
        lock(true);
        loading(true);
        const amount = toWei(new BigNumber(Amount))
        const userStake = await userShare();
        
        const balanceUser = await balance(stakingAddress);
        if(amount.gt(balanceUser.minus(userStake))) throw Error("Insufficient amount")

        const TxnHash = await harvest(amount);

        print([textLine({words:[textWord({ characters: messages.harvested(Amount) })]})]);
        print([textLine({className: classes.customLine, words:[anchorWord({ className: "link-padding", characters: messages.viewTxn, href: ftmscanUrl+TxnHash })]})]);
     
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

const ConnectMetamaskSlave = async (eventQueue) =>
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

const SwitchSlave = async (eventQueue) =>
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

const BalanceSlave = async (eventQueue, TokenName) => 
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

const AddTokenSlave = async (eventQueue, TokenName) =>
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

const FaucetSlave = async (eventQueue) => 
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

const BuySlave = async (eventQueue, GTONAmount) =>
{
  const { lock, loading, print } = eventQueue.handlers;

  try 
  {
    loading(true);
    lock(true);

    const GTON = await Fetcher.fetchTokenData(chainId, tokenAddress, customHttpProvider);
    const FTM = WETH[chainId];
    const pair = await Fetcher.fetchPairData(GTON, FTM, customHttpProvider);
    const route = new Route([pair], FTM);
    const price = ( +route.midPrice.invert().toSignificant(6) * +GTONAmount)
    console.log(price.toString());

    const tx = await buy(+GTONAmount, price.toString());

    print([textLine({words:[textWord({ characters: "You have successfully purchased $GTON!" })]})]);
    print([textLine({words:[textWord({ characters: "#WA𝔾MI ⚜️" })]})]);
    print([textLine({words:[textWord({ characters: "Transaction:" })]})]);
    print([textLine({words:[anchorWord({ className: "link-padding", characters: messages.viewTxn, href: ftmscanUrl+tx })]})]);

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
  "help": HelpSlave,
  "join": ConnectMetamaskSlave,
  "stake": StakeSlave,
  "unstake": UnStakeSlave,
  "switch": SwitchSlave,
  "balance": BalanceSlave,
  "add": AddTokenSlave,
  "faucet": FaucetSlave,
  "harvest": HarvestSlave,
  "buy": BuySlave,
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
  const Arg = command.split(' ')[1] ? command.split(' ')[1].trim().toLowerCase() : "";

  try
  {
    // Handle incorrect command
    if(!(Command in GTONRouterMap)) throw Error(notFoundStrings[Math.floor(Math.random() * notFoundStrings.length)])
    if(ArgsFunctions.includes(Command) && Arg == null) throw Error("You should provide args for calling this function. e.g stake 1")
    GTONRouterMap[Command](eventQueue, Arg);
  }
  catch(err)
  {
    print([textLine({words:[textWord({ characters: err.message })]})]);
  }
}

export { AddTokenSlave, BalanceSlave, SwitchSlave, ConnectMetamaskSlave, HarvestSlave, UnStakeSlave, StakeSlave, GTONRouterMap }
export default Parse;