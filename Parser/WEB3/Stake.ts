import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import Big from 'big.js';
import STAKING_ABI from './ABI/staking.json';
import CLAIM_ABI from './ABI/claimGtonPostAudit.json';
import CLAIM_OGXT_ABI from './ABI/claimOGXT.json';
import { 
  stakingAddress, 
  claimAddress, 
  gtonTokenNetwork, 
  claimNetwork, 
  gtonNetwork,
  claimOGXTAddress,
} from '../../config/config';
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

export const claimGTON = async (): Promise<void> => {
  await validate();
  await isCorrectChain(claimNetwork);
  const web3 = new Web3(window.ethereum);
  const signer = (await web3.eth.getAccounts())[0];
  const contract = new web3.eth.Contract(CLAIM_ABI as AbiItem[], claimAddress);
  const txn = await contract.methods.withdrawGton().send({ from: signer });
  return txn.transactionHash;
};

export const userDidClaimGTONOnFantom = async (): Promise<boolean> => {
  console.log("222")
  await validate();
  await isCorrectChain(claimNetwork);
  const web3 = new Web3(window.ethereum);
  const signer = (await web3.eth.getAccounts())[0];
  const contract = new web3.eth.Contract(CLAIM_ABI as AbiItem[], claimAddress);
  const txn = await contract.methods.withdrawals(signer).call();
  return txn;
};

export const userDidClaimOGXT = async (): Promise<boolean> => {
  await validate();
  await isCorrectChain(gtonNetwork);
  const web3 = new Web3(window.ethereum);
  const signer = (await web3.eth.getAccounts())[0];
  const contract = new web3.eth.Contract(CLAIM_OGXT_ABI as AbiItem[], claimOGXTAddress);
  console.log(CLAIM_OGXT_ABI)
  const txn = await contract.methods.canUserClaim(signer).call();
  return txn;
};

export const claimOGXT = async (): Promise<void> => {
  await validate();
  await isCorrectChain(gtonNetwork);
  const web3 = new Web3(window.ethereum);
  const signer = (await web3.eth.getAccounts())[0];
  const contract = new web3.eth.Contract(CLAIM_OGXT_ABI as AbiItem[], claimOGXTAddress);
  const txn = await contract.methods.signLiabilityWaiverAndClaimOGXT().send({ from: signer });
  return txn.transactionHash;
};
