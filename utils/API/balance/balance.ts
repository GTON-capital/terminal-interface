import { BigNumber } from 'bignumber.js';
import { BigNumber as OldBigNumber } from 'ethers';
import { tokenAddress, stakingAddress } from 'config/config';

export const addressMap: Record<string, string> = {
  gton: tokenAddress,
  staking: stakingAddress,
};
const defaultDecimals = new BigNumber(18);
export const fromWei = (
  n: BigNumber, d: BigNumber = defaultDecimals,
): BigNumber => n.dividedBy(new BigNumber(10).exponentiatedBy(d));
export const toWei = (
  n: BigNumber, d: BigNumber = defaultDecimals,
): BigNumber => n.multipliedBy(new BigNumber(10).pow(d));

export const migrateBigNumber = (n: OldBigNumber): BigNumber => new BigNumber(n.toString());

export default addressMap;
