const network = '3'; // Ropsten
const isDev = process.env.NODE_ENV === 'development';
const isLive = 'true';
const isTestnet = true;
const claimNetwork = '250';
const gtonNetwork = '1000';

const oneInchRouterAddress = '';

const usdcAddressEth = '0x46aff14b22e4717934edc2cb99bcb5ea1185a5e8';
const stakingAddress = '0x2061489A2AE30D0ced15F4721c0bb53f30DE175c';
const claimAddress = '0xB48327cC1804A0DCf2F85A09e0fBBB5e4d8f4830'; // Fantom network, not eth
const claimOGXTAddress = '0xdC1b3cDa1Bc3d1EE3f1d769d531d4a99e392A4D3'; // GTON
const fantomStakingAddress = '0xb0daab4eb0c23affaa5c9943d6f361b51479ac48'; // Fantom
const bridgeAddress = '0xd23CBBCDBB88302cD2f4dFe3fE62fE27Ec5762fF';

const faucetAddress = '0xBf5F86594cbDf911376c776A291b8Eb921D82CA1'; // Inactive contract, need on Ropsten

const gtonAddress = '0xaab9f76100e3332dc559878b0ebbf31cc4ab72e6';
const gtonL2Adress = '';
const gcdAddress = '0xEfedaF36c785dcEd1CebEA0A1BdBb5ae08022dAF';
const gcdL2Address = '';
const wEthAddress = '0xc778417e063141139fce010982780140aa0cd5ab';

const gtonUniswapV3Oracle = '0xaa2Cc9ca2251D1FF1B130a5514357E290574169F';
const chainlinkedOracleAddress = '0x5B9082Ac5E0be515DDa3f699C895AC0CD2751A65';

const cdpManager01 = '0x6aA3cDc7a0Ab05C58105AA4C85568583f2b7e02f';
const vaultManagerParameters = '0x3888C25AcDaB370dc2B85550E0943B4253346174';
const vault = '0xAAbBB7471bCA1C152C690f10A1A9e006FE17BD7e';

// chain

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
  claimOGXTAddress,
  fantomStakingAddress,
  faucetAddress,
  gtonAddress,
  gtonL2Adress,
  usdcAddressEth,
  isDev,
  isLive,
  gtonMainnetAddress,
  oneInchRouterAddress,
  gtonUniswapV3Oracle,
  cdpManager01,
  vaultManagerParameters,
  vault,
  gcdAddress,
  gcdL2Address,
  bridgeAddress,
  chainlinkedOracleAddress,
  wEthAddress,
  gtonNetwork,
};
