import { BigNumber } from 'ethers';
import { tokenAddress, stakingAddress } from 'config/config';

export const addressMap: Record<string, string> = {
  gton: tokenAddress,
  staking: stakingAddress,
};
const defaultDecimals = BigNumber.from(18);
export const fromWei = (n: BigNumber, d: BigNumber = defaultDecimals): BigNumber => n.div(d);
export const toWei = (n: BigNumber, d: BigNumber = defaultDecimals): BigNumber => n.mul(d);

export default addressMap;
