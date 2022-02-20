const network = '4002';
const isDev = process.env.NODE_ENV === 'development';
const isLive = 'true';
const isTestnet = true;

const WFTMAddress = "0x684ef2e18b9e1aefeeaf82bef1cfe37f3f07f162";
const GTONAddress = "0xc4d0a76BA5909c8e764B67aCF7360f843FbACB2d";

const spiritswaprouteraddress = '0x5B1769426C7AAf156d44A7fd542394B3b26dD134';
const spiritswappooladdress = '0x5B1769426C7AAf156d44A7fd542394B3b26dD134';
const FTMGTONSwapPath = ['0x684ef2e18b9e1aefeeaf82bef1cfe37f3f07f162', '0xc4d0a76BA5909c8e764B67aCF7360f843FbACB2d']

const stakingAddress = '0x314650ac2876c6B6f354499362Df8B4DC95E4750';
const faucetAddress = '0x013Da22e5aa1Aa49cae61A1b06B240164021CF22';
const tokenAddress = '0xc4d0a76BA5909c8e764B67aCF7360f843FbACB2d';
const fantomNet = {
  chainId: '4002',
  chainIdHex: '0xFA2',
  chainName: 'Fantom Testnet',
  rpcUrls: ['https://rpc.testnet.fantom.network/'],
  nativeCurrency: { name: 'FTM', decimals: 18, symbol: 'FTM' },
  blockExplorerUrls: ['https://testnet.ftmscan.com/'],
};
const ftmscanUrl = "https://testnet.ftmscan.com/tx/"
const faucetLink = "https://faucet.fantom.network/"
const gcLink = "https://gton.capital/"
export {
  WFTMAddress,
  GTONAddress,
  spiritswappooladdress,
  spiritswaprouteraddress,
  FTMGTONSwapPath,
  faucetLink,
  gcLink,
  network,
  ftmscanUrl,
  isTestnet,
  fantomNet,
  stakingAddress,
  faucetAddress,
  tokenAddress,
  isDev,
  isLive,
};