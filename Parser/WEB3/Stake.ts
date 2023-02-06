import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import Big from 'big.js';
import STAKING_ABI from './ABI/staking.json';
import CLAIM_ABI from './ABI/claimGtonPostAudit.json';
import { stakingAddress, claimAddress, gtonTokenNetwork, claimNetwork } from '../../config/config';
import { validate, isCorrectChain } from './validate';

declare const window: any;

export const stake = async (userAddress: string, amount: Big): Promise<string> => {
  await validate();
  await isCorrectChain(gtonTokenNetwork);
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(STAKING_ABI as AbiItem[], stakingAddress);
  const txn = await contract.methods
    .stake(amount.toFixed(), userAddress)
    .send({ from: userAddress });
  return txn.transactionHash;
};

export const unstake = async (userAddress: string, amount: Big): Promise<string> => {
  await validate();
  await isCorrectChain(gtonTokenNetwork);
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(STAKING_ABI as AbiItem[], stakingAddress);
  const txn = await contract.methods
    .unstake(userAddress, amount.toFixed())
    .send({ from: userAddress });
  return txn.transactionHash;
};

export const claim = async (): Promise<void> => {
  await validate();
  await isCorrectChain(claimNetwork);
  const web3 = new Web3(window.ethereum);
  const signer = (await web3.eth.getAccounts())[0];
  const contract = new web3.eth.Contract(CLAIM_ABI as AbiItem[], claimAddress);
  const txn = await contract.methods.withdrawGton().send({ from: signer });
  return txn.transactionHash;
};

export const userDidClaim = async (): Promise<boolean> => {
  await validate();
  await isCorrectChain(claimNetwork);
  const web3 = new Web3(window.ethereum);
  const signer = (await web3.eth.getAccounts())[0];
  const contract = new web3.eth.Contract(CLAIM_ABI as AbiItem[], claimAddress);
  const txn = await contract.methods.withdrawals(signer).call();
  return txn;
};
