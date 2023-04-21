const gtonTokenNetwork = '1'; // Ethereum
const rollupL1NetworkId = '56'; // BSC
const isDev = process.env.NODE_ENV === 'development';
const isLive = 'true';
const isTestnet = false;
const claimNetwork = '250';
const bsc = '56';
const gtonNetwork = '1000';

const oneInchRouterAddress = '0x1111111254fb6c44bac0bed2854e76f90643097d';

const usdcAddressEth = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const usdcAddressBsc = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d';
const busdAddressBsc = '0xe9e7cea3dedca5984780bafc599bd69add087d56';
const stakingAddress = '0xeff66b4a84c8a6b69b99eb1c5e39af8fc35d13db';
const claimAddress = '0xbceb65916a02804acfc32983a52b07f07e1c5477'; // Fantom
const claimOGXTAddress = '0xdC1b3cDa1Bc3d1EE3f1d769d531d4a99e392A4D3'; // GTON
const fantomStakingAddress = '0xb0daab4eb0c23affaa5c9943d6f361b51479ac48'; // Fantom
const bridgeAddress = '0x6d0E7094a385396F78399b5c679be09d8702555B';

const faucetAddress = '';

const gtonAddress = '0x01e0e2e61f554ecaaec0cc933e739ad90f24a86d';
const gtonL2Adress = '0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2';
const gcdAddress = '0x213ecAe6b3CbC0AD976f7d82626546d5b63A71cB';
const gcdL2Address = '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000';
const wEthAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

const gtonUniswapV3Oracle = '0x67717ea6376F18F217b733eE18abaAD480dAC928';
const chainlinkedOracleAddress = '0xa424eB5D1098EA644591d49b96D39dbc69675F04';

const cdpManager01 = '0x6aA3cDc7a0Ab05C58105AA4C85568583f2b7e02f';
const vaultManagerParameters = '0x3888C25AcDaB370dc2B85550E0943B4253346174';
const vault = '0xAAbBB7471bCA1C152C690f10A1A9e006FE17BD7e';

// chain

const chain = {
  chainId: '1',
  chainIdHex: '0x1',
  chainName: 'Ethereum',
  rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
  nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
  blockExplorerUrls: ['https://etherscan.io/'],
};

const explorerUrl = 'https://etherscan.io/tx/';
const bscScanUrl = 'https://bscscan.com/tx/';
const faucetLink = 'https://faucet.fantom.network/';
const gcLink = 'https://gton.capital/';
const gtonScanUrl = 'https://explorer.gton.network/tx/';

const storageAddress = '';
const bondingETHAddress = '';

enum BondTokens {
  ftm = 'ftm',
  usdc = 'usdc',
}

enum BondTypes {
  week = 'week',
  quarter = 'quarter',
}

const tokenAddresses = {
  [BondTokens.usdc]: '',
};

const bondingContracts = {
  [BondTokens.ftm]: {
    [BondTypes.week]: '',
    [BondTypes.quarter]: '',
  },
  [BondTokens.usdc]: {
    [BondTypes.week]: '',
    [BondTypes.quarter]: '',
  },
};

const bscRpc = 'https://bsc-dataseed.binance.org/';
const fantomRpc = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161/';
const gtonMainnetAddress = '0x01e0e2e61f554ecaaec0cc933e739ad90f24a86d';
const testnetFantomRpc = 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161/';

export {
  BondTokens,
  BondTypes,
  bscRpc,
  fantomRpc,
  testnetFantomRpc,
  tokenAddresses,
  bondingETHAddress,
  faucetLink,
  bondingContracts,
  gcLink,
  gtonTokenNetwork,
  rollupL1NetworkId,
  claimNetwork,
  explorerUrl,
  bscScanUrl,
  gtonScanUrl,
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
  usdcAddressBsc,
  busdAddressBsc,
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
  bsc,
  gtonNetwork,
};
