import { MMChains } from '../WEB3/internal/MMChaintypes';

export const mmChains: MMChains = {
  1: {
    chainId: 1,
    chainIdHex: '0x1',
    chainName: 'Ethereum',
    rpcUrls: ['https://mainnet.infura.io/v3/ec6afadb1810471dbb600f24b86391d2'],
    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
    blockExplorerUrls: ['https://etherscan.io'],
  },
  250: {
    chainId: 250,
    chainIdHex: '0xFA',
    chainName: 'Fantom',
    rpcUrls: ['https://rpcapi.fantom.network'],
    nativeCurrency: { name: 'FTM', decimals: 18, symbol: 'FTM' },
    blockExplorerUrls: ['https://ftmscan.com/'],
  },
  3: {
    chainId: 3,
    chainIdHex: '0x3',
    chainName: 'Ropsten',
    rpcUrls: ['https://rpc.testnet.fantom.network/'],
    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
    blockExplorerUrls: ['https://ropsten.etherscan.io/'],
  },
};
