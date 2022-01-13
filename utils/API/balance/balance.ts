import { BigNumber } from 'ethers';
import { tokenAddress, stakingAddress } from 'config/config';

export const addressMap: Record<string, string> = {
  gton: tokenAddress,
  staking: stakingAddress,
};
const defaultDecimals = BigNumber.from(18);
export const fromWei = (
  n: BigNumber, d: BigNumber = defaultDecimals,
): BigNumber => n.div(BigNumber.from(10).pow(d));
export const toWei = (
  n: BigNumber, d: BigNumber = defaultDecimals,
): BigNumber => n.mul(BigNumber.from(10).pow(d));

export default addressMap;
