import { AbiItem } from 'web3-utils'
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import STAKING_ABI from './ABI/staking.json';
import {
  stakingAddress,
} from '../../config/config';
import { validate } from './validate';

declare const window: any;

export const stake = async (amount: BigNumber): Promise<string> => {
  await validate();
  const web3 = new Web3(window.ethereum);
  const signer = (await web3.eth.getAccounts())[0]
  const contract = new web3.eth.Contract(STAKING_ABI as AbiItem[], stakingAddress);
  const txn = await contract.methods.stake(amount, signer)
    .send({ from: signer })
  return txn.transactionHash;
};

export const unstake = async (amount: BigNumber): Promise<string> => {
  await validate();
  const web3 = new Web3(window.ethereum);
  const signer = (await web3.eth.getAccounts())[0]
  const contract = new web3.eth.Contract(STAKING_ABI as AbiItem[], stakingAddress);
  const txn = await contract.methods.unstake(signer, amount)
  .send({ from: signer })
  return txn.transactionHash;
};