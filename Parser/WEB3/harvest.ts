import { AbiItem } from 'web3-utils';
import Big from 'big.js';
import Web3 from 'web3';
import STAKING_ABI from './ABI/staking.json';
import { stakingAddress } from '../../config/config';
import { validate } from './validate';

declare const window: any;

export const harvest = async (userAddress: string, amount: Big): Promise<string> => {
  await validate();
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(STAKING_ABI as AbiItem[], stakingAddress);
  const txn = await contract.methods.harvest(amount.toFixed()).send({ from: userAddress });
  return txn.transactionHash;
};
