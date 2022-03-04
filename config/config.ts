const network = '250';
const isDev = process.env.NODE_ENV === 'development';
const isLive = 'true';
const isTestnet = false;

const WFTMAddress = '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83';
const GTONAddress = '0xC1Be9a4D5D45BeeACAE296a7BD5fADBfc14602C4';

const spiritswaprouteraddress = '0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52';
const spiritswappooladdress = '0x25f5b3840d414a21c4fc46d21699e54d48f75fdd';
const FTMGTONSwapPath = ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', '0xC1Be9a4D5D45BeeACAE296a7BD5fADBfc14602C4']

const stakingAddress = '0xB0dAAb4eb0C23aFFaA5c9943d6f361b51479ac48';
const faucetAddress = '';
const tokenAddress = '0xc1be9a4d5d45beeacae296a7bd5fadbfc14602c4';
const fantomNet = {
  chainId: '250',
  chainIdHex: '0xFA',
  chainName: 'Fantom Mainnet',
  rpcUrls: ['https://rpc.fantom.network'],
  nativeCurrency: { name: 'FTM', decimals: 18, symbol: 'FTM' },
  blockExplorerUrls: ['https://ftmscan.com/'],
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
const ftmscanUrl = "https://ftmscan.com/tx/"
const faucetLink = "https://faucet.fantom.network/"
const gcLink = "https://gton.capital/"

export {
  WFTMAddress,
  GTONAddress,
  spiritswappooladdress,
  FTMGTONSwapPath,
  network,
  gcLink,
  faucetLink,
  ftmscanUrl,
  isTestnet,
  spiritswaprouteraddress,
  fantomNet,
  fantomTestnet,
  stakingAddress,
  faucetAddress,
  tokenAddress,
  isDev,
  isLive,
};