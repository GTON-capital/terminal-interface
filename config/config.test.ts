import { MerkleDistributorInfo } from 'utils/API/join/join';

const distributorInfo: MerkleDistributorInfo = {
  contract: '0x7B1AAF21AC0D420666B5966338FF9aEe763C29DF',
};

const claimMaxCount = 0;
const videoSource = 'https://youtu.be/2DZafHnECXs';
const network = '4002';
const claimsRoute = '/';
const isDev = process.env.NODE_ENV === 'development';
const isLive = 'true';
const backednAddress = 'https://mining.gearbox-api.com';
const isTestnet = true;

const stakingAddress = '0x76bf9655e325fe28F14862bCc117173d845CbC82';
const faucetAddress = '0x013Da22e5aa1Aa49cae61A1b06B240164021CF22';
const tokenAddress = '0xc4d0a76BA5909c8e764B67aCF7360f843FbACB2d';
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
  isTestnet,
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
