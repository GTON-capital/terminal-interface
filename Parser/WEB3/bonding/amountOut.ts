import { AbiItem } from 'web3-utils'
import Web3 from "web3";
import BigNumber from 'bignumber.js';
import BONDING from '../ABI/bonding.json';
import { validate } from '../validate';

declare const window: any;

const getAmountOut = async (address: string, amountIn: BigNumber): Promise<BigNumber> => {
  await validate();
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(BONDING as AbiItem[], address);
  const dis = await contract.methods.amountWithoutDiscount(amountIn).call()
  const out = await contract.methods.bondAmountOut(dis).call()
  const staking = await contract.methods.getStakingReward(out).call()
  return new BigNumber(out).plus(staking);
};

export default getAmountOut;