import { ethers } from 'ethers';
import STAKING_ABI from './ABI/staking.json';
import {
  stakingAddress,
} from '../../config/config';
import { validate } from './validate';

declare const window: any;

export const harvest = async (amount: string): Promise<string> => {
  await validate();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(stakingAddress, STAKING_ABI, signer);
  const tx = await contract.harvest(amount);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};