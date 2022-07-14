import {
  stakingAddress,
  gtonAddress,
  usdcAddress,
  wEthAddress,
  gcdAddress,
} from '../../../config/config';

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
  eth: {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ETH',
    decimals: 18,
    image: '',
    canBeUsedForPurchase: true,
  },
  weth: {
    address: wEthAddress,
    symbol: 'WETH',
    decimals: 18,
    image: '',
    canBeUsedForPurchase: true,
  },
  gcd: {
    address: gcdAddress,
    symbol: 'GCD',
    decimals: 18,
    image: '',
    canBeUsedForPurchase: true,
  },
};

export const tokens: Record<string, string> = {
  gton: gtonAddress,
  usdc: usdcAddress,
  gcd: gcdAddress,
};

export default tokenMap;
