const network = '1'; // Ethereum
const isDev = process.env.NODE_ENV === 'development';
const isLive = 'true';
const isTestnet = false;
const claimNetwork = '250';

const oneInchRouterAddress = '0x1111111254fb6c44bac0bed2854e76f90643097d';

const stakingAddress = '0xeff66b4a84c8a6b69b99eb1c5e39af8fc35d13db';
const claimAddress = '0xbceb65916a02804acfc32983a52b07f07e1c5477'; // Fantom
const fantomStakingAddress = '0xb0daab4eb0c23affaa5c9943d6f361b51479ac48'; // Fantom

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
  network,
  claimNetwork,
  gcLink,
  faucetLink,
  explorerUrl,
  isTestnet,
  chain,
  stakingAddress,
  claimAddress,
  fantomStakingAddress,
  faucetAddress,
  gtonAddress,
  usdcAddress,
  isDev,
  isLive,
  oneInchRouterAddress,
};
