import Big, {BigSource} from 'big.js';
import { gtonAddress, stakingAddress } from '../../../config/config';

export const addressMap: Record<string, string> = {
  gton: gtonAddress,
  staking: stakingAddress,
};
const defaultDecimals = 18;

export const fromWei = (
  n: BigSource, d: number = defaultDecimals,
): Big => Big(n).div(new Big(10).pow(d));

export const toWei = (
  n: BigSource, d: number = defaultDecimals,
): Big => Big(n).mul(new Big(10).pow(d));

export default addressMap;