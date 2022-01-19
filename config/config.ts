import { MerkleDistributorInfo } from 'utils/API/join/join';

const distributorInfo: MerkleDistributorInfo = {
  contract: '0x7B1AAF21AC0D420666B5966338FF9aEe763C29DF',
};

const claimMaxCount = 0;
const videoSource = 'https://youtu.be/2DZafHnECXs';
const network = '250';
const claimsRoute = '/';
const isDev = process.env.NODE_ENV === 'development';
const isLive = 'true';
const backednAddress = 'https://mining.gearbox-api.com';

const stakingAddress = '0xc020EE7e6f1D1C0173a2b00ff9ffAF6Eac079B4c';
const faucetAddress = '';
const tokenAddress = '0xc1be9a4d5d45beeacae296a7bd5fadbfc14602c4';
const fantomTestnet = {
  chainId: '250',
  chainIdHex: '0xFA',
  chainName: 'Fantom Mainnet',
  rpcUrls: ['https://rpc.fantom.network'],
  nativeCurrency: { name: 'FTM', decimals: 18, symbol: 'FTM' },
  blockExplorerUrls: ['https://ftmscan.com/'],
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
