import { AbiItem } from 'web3-utils'
import Web3 from 'web3';
import Big from 'big.js';
import STAKING_ABI from './ABI/staking.json';
import ERC20_ABI from './ABI/erc20.json';
import { validate } from './validate';
import {
  stakingAddress,
} from '../../config/config';

declare const window: any;

const balance = async (userAddress: string, gtonAddress: string): Promise<Big> => {
  await validate();
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(ERC20_ABI as AbiItem[], gtonAddress);
  const userBalance: string = await contract.methods.balanceOf(userAddress).call()
  return Big(userBalance);
};

export const userShare = async (userAddress: string): Promise<Big> => {
  await validate()
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(STAKING_ABI as AbiItem[], stakingAddress);
  const userBalance = await contract.methods.userInfo(userAddress).call();
  return Big(userBalance.amount);
}
export default balance;