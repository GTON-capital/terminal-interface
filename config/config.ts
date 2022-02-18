const network = '250';
const isDev = process.env.NODE_ENV === 'development';
const isLive = 'true';
const isTestnet = false;

const SpiritSwapRouterAddress = '0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52';
const FTMGTONSwapPath = ['0x39575ceC00dBa1408Baf761A3e093322A6Ce3b94', '0xc4d0a76ba5909c8e764b67acf7360f843fbacb2d']
const stakingAddress = '0xB0dAAb4eb0C23aFFaA5c9943d6f361b51479ac48';
const faucetAddress = '';
const tokenAddress = '0xc1be9a4d5d45beeacae296a7bd5fadbfc14602c4';
const fantomMainnet = {
  chainId: '250',
  chainIdHex: '0xFA',
  chainName: 'Fantom Mainnet',
  rpcUrls: ['https://rpc.fantom.network'],
  nativeCurrency: { name: 'FTM', decimals: 18, symbol: 'FTM' },
  blockExplorerUrls: ['https://ftmscan.com/'],
};
const ftmscanUrl = "https://ftmscan.com/tx/"
const faucetLink = "https://faucet.fantom.network/"
const gcLink = "https://gton.capital/"

export {
  FTMGTONSwapPath,
  network,
  gcLink,
  faucetLink,
  ftmscanUrl,
  isTestnet,
  SpiritSwapRouterAddress,
  fantomMainnet,
  stakingAddress,
  faucetAddress,
  tokenAddress,
  isDev,
  isLive,
};