// const network = '250';
// const isDev = process.env.NODE_ENV === 'development';
// const isLive = 'true';
// const isTestnet = false;

// const stakingAddress = '0x72AC9b5825cC063834C1A5720726A37432568B8c';
// const faucetAddress = '';
// const tokenAddress = '0xc1be9a4d5d45beeacae296a7bd5fadbfc14602c4';
// const fantomTestnet = {
//   chainId: '250',
//   chainIdHex: '0xFA',
//   chainName: 'Fantom Mainnet',
//   rpcUrls: ['https://rpc.fantom.network'],
//   nativeCurrency: { name: 'FTM', decimals: 18, symbol: 'FTM' },
//   blockExplorerUrls: ['https://ftmscan.com/'],
// };
// const ftmscanUrl = "https://ftmscan.com/tx/"
// const faucetLink = "https://faucet.fantom.network/"
// const gcLink = "https://gton.capital/"

// export {
//   network,
//   gcLink,
//   faucetLink,
//   ftmscanUrl,
//   isTestnet,
//   fantomTestnet,
//   stakingAddress,
//   faucetAddress,
//   tokenAddress,
//   isDev,
//   isLive,
// };


const network = '4002';
const isDev = process.env.NODE_ENV === 'development';
const isLive = 'true';
const isTestnet = true;

const stakingAddress = '0x314650ac2876c6B6f354499362Df8B4DC95E4750';
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
