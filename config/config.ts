const network = '3'; // Ropsten
const isDev = process.env.NODE_ENV === 'development';
const isLive = 'true';
const isTestnet = true;

const claimNetwork = '250';
// WFTMAddress -> wTokenAddress
const wTokenAddress = '0xc778417e063141139fce010982780140aa0cd5ab';
const GTONAddress = '0xaab9f76100e3332dc559878b0ebbf31cc4ab72e6';

// spiritswaprouteraddress -> routeraddress
const routeraddress = '0x3c4925b50e337aecc2cf4b9e4767b43dcfbad286';

// spiritswappooladdress -> poolAddress
const poolAddress = '0x131ee332febf8d2aa5f18f0d2c444e99411462e5';

// FTMGTONSwapPath -> swapPath
const pairSwapPath = [
  '0xD0011dE099E514c2094a510dd0109F91bf8791Fa',
  '0xc4d0a76BA5909c8e764B67aCF7360f843FbACB2d',
];

const usdcAddress = '0x46aff14b22e4717934edc2cb99bcb5ea1185a5e8';
const stakingAddress = '0x2061489A2AE30D0ced15F4721c0bb53f30DE175c';
const claimAddress = '0xB48327cC1804A0DCf2F85A09e0fBBB5e4d8f4830'; // Fantom network, not eth

const faucetAddress = '0x013Da22e5aa1Aa49cae61A1b06B240164021CF22'; // Inactive contract, need on Ropsten
const gtonAddress = '0xaab9f76100e3332dc559878b0ebbf31cc4ab72e6';

// fantomNet -> network
const chain = {
  chainId: '3',
  chainIdHex: '0x3',
  chainName: 'Ropsten',
  rpcUrls: ['https://rpc.testnet.fantom.network/'],
  nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
  blockExplorerUrls: ['https://ropsten.etherscan.io/'],
};

const explorerUrl = 'https://ropsten.etherscan.io/tx/';
const faucetLink = 'https://faucet.egorfine.com/';
const gcLink = 'https://gton.capital/';

const storageAddress = '0x9E8bcf8360Da63551Af0341A67538c918ba81007';
const bondingETHAddress = '0xc7b266aafcea5c1d8e6d90339a73cca34e476492';

enum BondTokens {
  ftm = 'ftm',
  usdc = 'usdc',
}

enum BondTypes {
  week = 'week',
  quarter = 'quarter',
}

const tokenAddresses = {
  [BondTokens.usdc]: '0xA2DCeFfc29003101b4bca24134dd1437106A7f81',
};

const bondingContracts = {
  [BondTokens.ftm]: {
    [BondTypes.week]: '0xc7b266aafcea5c1d8e6d90339a73cca34e476492',
    [BondTypes.quarter]: '0xc1c672e75c6D68cc480c4a8083370a4D9CD9EC83',
  },
  [BondTokens.usdc]: {
    [BondTypes.week]: '0x98E81943Aba1aC87EF4c28eE08afAd1FDc5E7D9f',
    [BondTypes.quarter]: '0x0d479c7a1099f59D9489cae9E452498A736A3221',
  },
};

const fantomRpc = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161/';
const gtonMainnetAddress = '0x01e0e2e61f554ecaaec0cc933e739ad90f24a86d';
const testnetFantomRpc = 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161/';

export {
  BondTokens,
  BondTypes,
  fantomRpc,
  testnetFantomRpc,
  tokenAddresses,
  wTokenAddress,
  GTONAddress,
  poolAddress,
  routeraddress,
  pairSwapPath,
  bondingETHAddress,
  faucetLink,
  bondingContracts,
  gcLink,
  network,
  claimNetwork,
  explorerUrl,
  isTestnet,
  chain,
  stakingAddress,
  storageAddress,
  claimAddress,
  faucetAddress,
  gtonAddress,
  usdcAddress,
  isDev,
  isLive,
  gtonMainnetAddress,
};
