export type TokenName = string;
export type ChainId = number;
export type ChainName = string;

export interface NativeToken {
  isNative: true;
  wethAddress: string;
  address: null;
}

export interface ERC20Token {
  isNative?: false;
  address: string;
  wethAddress: null;
}

export type BaseToken = {
  name: TokenName;
  decimals: number;
  symbol: string;
  image: string;
};

export type Token = BaseToken & (NativeToken | ERC20Token);

export type NativeCurrency = Omit<BaseToken, 'image'>;

export interface L2Network {
  isL2Network: true;
  oppositeChainId: ChainId;
}

export interface L1Network {
  isL2Network?: false;
  oppositeChainId: ChainId;
}

export type SimulatedToken = {
  name: TokenName;

  cdpManagerAddress: string;
  cdpManagerFallback: string | null;

  collaterals: Array<TokenName>;
  fallbackCollaterals: Array<TokenName>;
};

export type ChainConfig = {
  id: ChainId;
  name: string;

  rpcUrl: string;
  explorerUrl: string;
  isTestnet: boolean;

  nativeCurrency: NativeCurrency;

  tokens: Record<TokenName, Token>;

  simulatedTokens: Record<TokenName, SimulatedToken>;
} & (L2Network | L1Network);

export interface ApplicationConfig {
  chains: Record<ChainId, ChainConfig>;
  chainsByName: Record<ChainName, ChainConfig>;
}
