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
          const firstTxn = await approve(tokenAddress, stakingAddress, amount.toString())

          print([textLine({words:[textWord({ characters: messages.approve })]})]);
          print([textLine({words:[anchorWord({ className: "link-padding", characters: messages.viewTxn, href: ftmscanUrl+firstTxn})]})]);
          
        }

        const secondTxn = await stake(amount.toString());

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
        const TxnHash = await unstake(amount.toString());

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

        const TxnHash = await harvest(amount.toString());

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
    const token = TokenName === "harvest" ? tokenMap.sgton : tokenMap[TokenName]
    if(!token) throw Error("Available tokens are: gton, sgton, harvest");
    const Balance = (await balance(token.address));
    let CoinBalance;
    if(TokenName === "harvest") {
      const share = await userShare();
      CoinBalance = fromWei(Balance.minus(share));
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
  "harvest": HarvestSlave
}

const ArgsFunctions = 
[
  "stake",
  "unstake",
  "harvest",
]

async function Parse(eventQueue, command)
{
  const { print } = eventQueue.handlers;
  const Command = command.split(' ')[0].trim().toLowerCase();
  const Arg = command.split(' ')[1];

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

export default Parse;