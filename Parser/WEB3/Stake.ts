import { ethers } from 'ethers';
import STAKING_ABI from './ABI/staking.json';
import {
  stakingAddress,
} from '../../config/config';
import { validate } from './validate';

declare const window: any;

export const stake = async (amount: string): Promise<string> => {
  await validate();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(stakingAddress, STAKING_ABI, signer);
  const tx = await contract.stake(amount, await signer.getAddress());
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

export const unstake = async (amount: string): Promise<string> => {
  await validate();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(stakingAddress, STAKING_ABI, signer);
  const tx = await contract.unstake(await signer.getAddress(), amount);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};