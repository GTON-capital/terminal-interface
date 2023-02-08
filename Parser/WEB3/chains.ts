import { MMChains } from '../WEB3/internal/MMChaintypes';

export const mmChains: MMChains = {
  ethereum: {
    chainId: '1',
    chainIdHex: '0x1',
    chainName: 'Ethereum',
    rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
    blockExplorerUrls: ['https://etherscan.io'],
  },
  fantom: {
    chainId: '250',
    chainIdHex: '0xFA',
    chainName: 'Fantom',
    rpcUrls: ['https://rpcapi.fantom.network'],
    nativeCurrency: { name: 'FTM', decimals: 18, symbol: 'FTM' },
    blockExplorerUrls: ['https://ftmscan.com/'],
  },
  ropsten: {
    chainId: '3',
    chainIdHex: '0x3',
    chainName: 'Ropsten',
    rpcUrls: ['https://rpc.testnet.fantom.network/'],
    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
    blockExplorerUrls: ['https://ropsten.etherscan.io/'],
  },
  gton: {
    chainId: '1000',
    chainIdHex: '0x3E8',
    chainName: 'GTON',
    rpcUrls: ['https://rpc.gton.network'],
    nativeCurrency: { name: 'GCD', decimals: 18, symbol: 'GCD' },
    blockExplorerUrls: ['https://explorer.gton.network/'],
  },
};
