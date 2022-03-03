import {
    textLine,
    textWord,
    anchorWord
  } from 'crt-terminal';
import connectMetamask from './WEB3/ConnectMetamask';
import switchChain from './WEB3/Switch';
import addToken from './WEB3/addTokenToMM';
import faucet from './WEB3/Faucet';
import messages from '../Messages/Messages';
import balance, {userShare} from './WEB3/Balance';
import { fromWei } from './WEB3/API/balance';
import tokenMap, {tokens} from './WEB3/API/addToken';

const ConnectMetamaskWorker = async ({ lock, loading, print }) =>
{
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

const SwitchWorker = async ({ lock, loading, print }) =>
{
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

const BalanceWorker = async ({ lock, loading, print }, TokenName) => 
{
  try
  {
    lock(true);
    loading(true);

    if(TokenName === "all")
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

const AddTokenWorker = async ({ lock, loading, print }, TokenName) =>
{
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
    console.log(err);
    
    print([textLine({words:[textWord({ characters: "Error while add token to metamask" })]})]);
    loading(false);
    lock(false);
  }
}

const FaucetWorker = async ({ lock, loading, print }, token) => 
{
  try
  {
    lock(true);
    loading(true);
    const tokenAddress = tokens[token]
    
    if(!tokenAddress) {
        print([textLine({words:[textWord({ characters: "Pass token name as second argument" })]})]);
        return;
    }
    await faucet(tokenAddress);
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

const commonOperators = {
    faucet: FaucetWorker,
    add: AddTokenWorker,
    balance: BalanceWorker,
    switch: SwitchWorker,
    join: ConnectMetamaskWorker
}

export function printLink(print, text, link) {
  print([textLine({words:[anchorWord({ className: "link-padding", characters: text,  onClick: () => {window.open(link, '_blank');} })]})]);

}

export default commonOperators;