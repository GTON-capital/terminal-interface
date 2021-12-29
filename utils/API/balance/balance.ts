import { BigNumber } from 'ethers';
import { tokenAddress } from 'config/config';

export const addressMap: Record<string, string> = {
  gton: tokenAddress,
};
const defaultDecimals = BigNumber.from(18);
export const fromWei = (n: BigNumber, d: BigNumber = defaultDecimals): BigNumber => n.div(d);
export const toWei = (n: BigNumber, d: BigNumber = defaultDecimals): BigNumber => n.mul(d);

export default addressMap;
