import { AbiItem } from 'web3-utils'
import Big from 'big.js';
import Web3 from "web3";
import BONDING from '../ABI/bonding.json';
import { validate } from '../validate';

declare const window: any;

const getAmountOut = async (address: string, amountIn: Big): Promise<Big[]> => {
  await validate();
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(BONDING as AbiItem[], address);
  const dis = await contract.methods.amountWithoutDiscount(amountIn.toFixed()).call()
  const out = await contract.methods.bondAmountOut(dis).call()
  const staking = await contract.methods.getStakingReward(out).call()
  return [Big(out).plus(staking), new Big(dis).minus(amountIn)];
};

export const getDiscount = async (address: string): Promise<number> => {
  await validate();
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(BONDING as AbiItem[], address);
  const discountNominator = await contract.methods.discountNominator.call().call()
  return discountNominator / 100;
};

export default getAmountOut;