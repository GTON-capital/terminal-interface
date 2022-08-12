import {
  stakingAddress,
  gtonAddress,
  gtonL2Adress,
  gcdL2Address,
  usdcAddress,
  wEthAddress,
  gcdAddress,
} from '../../../config/config';

export type Token = {
  address: string;
  l2address: string;
  symbol: string;
  decimals: number;
  image: string;
  canBeUsedForPurchase: boolean;
};

const tokenMap: Record<string, Token> = {
  gton: {
    address: gtonAddress,
    l2address: gtonL2Adress,
    symbol: 'GTON',
    decimals: 18,
    image: '',
    canBeUsedForPurchase: false,
  },
  sgton: {
    address: stakingAddress,
    l2address: '',
    symbol: 'sGTON',
    decimals: 18,
    image: '',
    canBeUsedForPurchase: false,
  },
  harvest: {
    address: stakingAddress,
    l2address: '',
    symbol: 'sGTON',
    decimals: 18,
    image: '',
    canBeUsedForPurchase: false,
  },
  usdc: {
    address: usdcAddress,
    l2address: '',
    symbol: 'USDC',
    decimals: 6,
    image: '',
    canBeUsedForPurchase: true,
  },
  eth: {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    l2address: '',
    symbol: 'ETH',
    decimals: 18,
    image: '',
    canBeUsedForPurchase: true,
  },
  weth: {
    address: wEthAddress,
    l2address: '',
    symbol: 'WETH',
    decimals: 18,
    image: '',
    canBeUsedForPurchase: true,
  },
  gcd: {
    address: gcdAddress,
    l2address: gcdL2Address,
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
