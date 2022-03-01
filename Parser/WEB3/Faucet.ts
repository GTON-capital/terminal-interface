import { ethers, utils } from 'ethers';
import {
  gtonAddress,
  faucetAddress,
} from '../../config/config';
import FAUCET_ABI from './ABI/faucet.json';
import { validate } from './validate';

declare const window: any;

const faucet = async (): Promise<string> => {
  await validate();
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  const signer = provider.getSigner(0);
  const contract = new ethers.Contract(faucetAddress, FAUCET_ABI, signer);
  const tx = await contract.faucet(gtonAddress);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

export default faucet;