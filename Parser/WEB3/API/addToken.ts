import { stakingAddress, gtonAddress, usdcAddress } from '../../../config/config';

export type Token = {
  address: string,
  symbol: string,
  decimals: number,
  image: string,
};

const tokenMap: Record<string, Token> = {
  gton: {
    address: gtonAddress,
    symbol: 'GTON',
    decimals: 18,
    image: '',
  },
  sgton: {
    address: stakingAddress,
    symbol: 'sGTON',
    decimals: 18,
    image: '',
  },
  harvest: {
    address: stakingAddress,
    symbol: 'sGTON',
    decimals: 18,
    image: '',
  },
  usdc: {
    address: usdcAddress,
    symbol: 'USDC',
    decimals: 18,
    image: '',
  },
};

export const tokens: Record<string, string> = {
  gton: gtonAddress,
  usdc: usdcAddress,
}

export default tokenMap;