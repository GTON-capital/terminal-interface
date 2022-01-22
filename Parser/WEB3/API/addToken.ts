import { stakingAddress, tokenAddress } from '../../../config/config';

export type Token = {
  address: string,
  symbol: string,
  decimals: number,
  image: string,
};

const tokenMap: Record<string, Token> = {
  gton: {
    address: tokenAddress,
    symbol: 'GTON',
    decimals: 18,
    image: 'https://alpha.graviton.one/img/gton-metamask.png',
  },
  sgton: {
    address: stakingAddress,
    symbol: 'sGTON',
    decimals: 18,
    image: 'https://alpha.graviton.one/img/gton-metamask.png',
  },
};

export default tokenMap;