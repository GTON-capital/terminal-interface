import { stakingAddress, gtonAddress, usdcAddress } from '../../../config/config';

export type Token = {
  address: string;
  symbol: string;
  decimals: number;
  image: string;
  canBeUsedForPurchase: boolean;
};

const tokenMap: Record<string, Token> = {
  gton: {
    address: gtonAddress,
    symbol: 'GTON',
    decimals: 18,
    image: '',
    canBeUsedForPurchase: false,
  },
  sgton: {
    address: stakingAddress,
    symbol: 'sGTON',
    decimals: 18,
    image: '',
    canBeUsedForPurchase: false,
  },
  harvest: {
    address: stakingAddress,
    symbol: 'sGTON',
    decimals: 18,
    image: '',
    canBeUsedForPurchase: false,
  },
  usdc: {
    address: usdcAddress,
    symbol: 'USDC',
    decimals: 6,
    image: '',
    canBeUsedForPurchase: true,
  },
};

export const tokens: Record<string, string> = {
  gton: gtonAddress,
  usdc: usdcAddress,
};

export default tokenMap;
