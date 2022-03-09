import Big from 'big.js';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { FTMGTONSwapPath as path, spiritswaprouteraddress } from '../../config/config';
import SpiritSwapRouterABI from './ABI/SpiritSwapRouter.json';
import { toWei } from './API/balance';
import { validate } from './validate';

// WFTM -> GTON

declare const window: any;

const buy = async (amount, gtonftmprice: Big, userAddress: string): Promise<string> => 
{
  await validate();
  
  const CurrentUnixTime = Math.round((new Date()).getTime() / 1000);
  const Deadline = CurrentUnixTime + 1200; // Current time + 20 minutes
  const web3 = new Web3(window.ethereum)
  const contract = new web3.eth.Contract(SpiritSwapRouterABI as AbiItem[], spiritswaprouteraddress);

  const res = toWei(gtonftmprice.mul(amount));
  console.log(toWei(amount).toFixed());
  console.log(res.toFixed());
  
  const tx = await contract.methods.swapExactETHForTokens(toWei(amount).toFixed(), 
                                                path, 
                                                userAddress, 
                                                Deadline)
                                                .send({from: userAddress, value: res.toFixed()})
  return tx.transactionHash;
};

export default buy;