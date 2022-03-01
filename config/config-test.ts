const network = '4002';
const isDev = process.env.NODE_ENV === 'development';
const isLive = 'true';
const isTestnet = true;

const WFTMAddress = "0xd0011de099e514c2094a510dd0109f91bf8791fa";
const GTONAddress = "0xc4d0a76BA5909c8e764B67aCF7360f843FbACB2d";

const spiritswaprouteraddress = '0x3c4925b50e337aecc2cf4b9e4767b43dcfbad286';
const spiritswappooladdress = '0x131ee332febf8d2aa5f18f0d2c444e99411462e5';
const FTMGTONSwapPath = ['0xD0011dE099E514c2094a510dd0109F91bf8791Fa', '0xc4d0a76BA5909c8e764B67aCF7360f843FbACB2d']

const usdcAddress = "0xA2DCeFfc29003101b4bca24134dd1437106A7f81";
const stakingAddress = '0x314650ac2876c6B6f354499362Df8B4DC95E4750';
const faucetAddress = '0x013Da22e5aa1Aa49cae61A1b06B240164021CF22';
const gtonAddress = '0xc4d0a76BA5909c8e764B67aCF7360f843FbACB2d';
const fantomNet = 
{
  chainId: '4002',
  chainIdHex: '0xFA2',
  chainName: 'Fantom Testnet',
  rpcUrls: ['https://rpc.testnet.fantom.network/'],
  nativeCurrency: { name: 'FTM', decimals: 18, symbol: 'FTM' },
  blockExplorerUrls: ['https://testnet.ftmscan.com/'],
};

const fantomTestnet = 
{
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
  fantomTestnet,
  stakingAddress,
  faucetAddress,
  gtonAddress,
  usdcAddress,
  isDev,
  isLive,
};