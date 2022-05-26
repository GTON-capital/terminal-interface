// This config uses for mainnet

const network = '1'; // Ethereum
const isDev = process.env.NODE_ENV === 'development';
const isLive = 'true';
const isTestnet = false;

// WFTMAddress -> wTokenAddress
const wTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const GTONAddress = '0x01e0e2e61f554ecaaec0cc933e739ad90f24a86d';

// spiritswaprouteraddress -> routeraddress
const spiritswaprouteraddress = '0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52';

// spiritswappooladdress -> poolAddress
const spiritswappooladdress = '0x25f5b3840d414a21c4fc46d21699e54d48f75fdd';

// FTMGTONSwapPath -> swapPath
const FTMGTONSwapPath = [
  '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  '0xC1Be9a4D5D45BeeACAE296a7BD5fADBfc14602C4',
];

const stakingAddress = '0xeff66b4a84c8a6b69b99eb1c5e39af8fc35d13db';
const claimAddress = '0xbceb65916a02804acfc32983a52b07f07e1c5477'; // Fantom

const faucetAddress = '';
const gtonAddress = '0x01e0e2e61f554ecaaec0cc933e739ad90f24a86d';
const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

// fantomNet -> chain

const chain = {
  chainId: '1',
  chainIdHex: '0x1',
  chainName: 'Ethereum',
  rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
  nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
  blockExplorerUrls: ['https://etherscan.io/'],
};

const explorerUrl = 'https://etherscan.io/tx/';
const faucetLink = 'https://faucet.fantom.network/';
const gcLink = 'https://gton.capital/';

export {
  wTokenAddress,
  GTONAddress,
  spiritswappooladdress,
  FTMGTONSwapPath,
  network,
  gcLink,
  faucetLink,
  explorerUrl,
  isTestnet,
  spiritswaprouteraddress,
  chain,
  stakingAddress,
  claimAddress,
  faucetAddress,
  gtonAddress,
  usdcAddress,
  isDev,
  isLive,
};
