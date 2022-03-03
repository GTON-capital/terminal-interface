
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

const storageAddress = "0xd9c72C722e35d6C773695412a232969AE0a6c898";
const bondingETHAddress = "0x84535E0a5f03B295908a4ADf436D17B537EFb567"

enum BondTokens {
  FTM = "ftm",
  USDC = "usdc"
}

enum BondTypes {
  Week = "week",
  Quarter = "quarter"
}

const tokenAddresses = {
  [BondTokens.USDC]: "0xA2DCeFfc29003101b4bca24134dd1437106A7f81"
}

const bondingContracts = {
  [BondTokens.FTM]: {
      [BondTypes.Week]: "0xADe54e7bc3708dC227D91c00688fC5DFa24DBbCB",
      [BondTypes.Quarter]: "0xdE1c20F0369934337096180F802814Ecf473Dcf0",
  },
  [BondTokens.USDC]: {
    [BondTypes.Week]: "0x98E81943Aba1aC87EF4c28eE08afAd1FDc5E7D9f",
    [BondTypes.Quarter]: "0x0d479c7a1099f59D9489cae9E452498A736A3221",
  }
}
export {
  BondTokens,
  BondTypes,
  tokenAddresses,
  WFTMAddress,
  GTONAddress,
  spiritswappooladdress,
  spiritswaprouteraddress,
  FTMGTONSwapPath,
  bondingETHAddress,
  faucetLink,
  bondingContracts,
  gcLink,
  network,
  ftmscanUrl,
  isTestnet,
  fantomNet,
  fantomTestnet,
  stakingAddress,
  storageAddress,
  faucetAddress,
  gtonAddress,
  usdcAddress,
  isDev,
  isLive,
};