import { MerkleDistributorInfo } from 'utils/API/join/join';

const distributorInfo: MerkleDistributorInfo = {
  contract: process.env.NEXT_PUBLIC_CONTRACT || '',
};

const claimMaxCount = Number(process.env.NEXT_PUBLIC_CLAIM_MAX_COUNT) || 0;
const videoSource = 'https://youtu.be/2DZafHnECXs';
const network = '4002';
const claimsRoute = process.env.NEXT_PUBLIC_CLAIMS_ROUTE || '/';
const isDev = process.env.NODE_ENV === 'development';
const isLive = process.env.NEXT_PUBLIC_APP_LIVE === 'true';
const backednAddress = 'https://mining.gearbox-api.com';

const stakingAddress = process.env.STAKING_ADDRESS || '0xAc87D270029A4d55a3eb2f9e8b2846a026A8a72e';
const faucetAddress = process.env.FAUCET_ADDRESS || '0xB85D194500b177516Fb252c92851158DB81b305F';
const tokenAddress = process.env.TOKEN_ADDRESS || '0xEb172F12C9D5E08d0A551050e33464138039aA9E';
const fantomTestnet = {
  chainId: '4002',
  chainIdHex: '0xFA2',
  chainName: 'Fantom Testnet',
  rpcUrls: ['https://rpc.testnet.fantom.network'],
  nativeCurrency: { name: 'FTM', decimals: 18, symbol: 'FTM' },
  blockExplorerUrls: ['https://testnet.ftmscan.com/'],
};

export {
  network,
  fantomTestnet,
  stakingAddress,
  claimsRoute,
  faucetAddress,
  tokenAddress,
  distributorInfo,
  isDev,
  videoSource,
  isLive,
  claimMaxCount,
  backednAddress,
};
