
const network = '4002';
const isDev = process.env.NODE_ENV === 'development';
const isLive = 'true';
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
const ftmscanUrl = "https://testnet.ftmscan.com/tx/"
const faucetLink = "https://faucet.fantom.network/"
const gcLink = "https://gton.capital/"
export {
  faucetLink,
  gcLink,
  network,
  ftmscanUrl,
  isTestnet,
  fantomTestnet,
  stakingAddress,
  faucetAddress,
  tokenAddress,
  isDev,
  isLive,
};
