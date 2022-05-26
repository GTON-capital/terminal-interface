export interface MMChains {
  [key: string]: MMChain;
}

interface NativeCurrency {
  name: string;
  decimals: number;
  symbol: string;
}

export interface MMChain {
  evm: boolean;
  chainId: string | number;
  chainIdHex: string;
  chainName: string;
  rpcUrls: Array<string>;
  nativeCurrency: NativeCurrency;
  blockExplorerUrls: Array<string>;
}
