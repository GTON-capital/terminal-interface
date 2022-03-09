import { BigNumber as OldBigNumber, ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import {
  stakingAddress,
} from '../../config/config';
import STAKING_ABI from './ABI/staking.json';
import ERC20_ABI from './ABI/erc20.json';
import { migrateBigNumber } from './API/balance';
import { validate } from './validate';

declare const window: any;

const balance = async (userAddress: string, gtonAddress: string): Promise<BigNumber> => {
  await validate();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(gtonAddress, ERC20_ABI, signer);
  const userBalance: OldBigNumber = await contract.balanceOf(userAddress);
  return migrateBigNumber(userBalance);
};

export const userShare = async (userAddress: string): Promise<BigNumber> => {
  await validate()
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(stakingAddress, STAKING_ABI, signer);
  const userBalance: OldBigNumber = (await contract.userInfo(userAddress)).amount;
  return migrateBigNumber(userBalance);
}
export default balance;