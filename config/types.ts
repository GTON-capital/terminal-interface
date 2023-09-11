export type TokenName = string;
export type ChainId = number;
export type ChainName = string;

export interface NativeToken {
  isNative: true;
  address: null;
}

export interface ERC20Token {
  isNative?: false;
  address: string;
}

export type BaseToken = {
  name: TokenName;
  decimals: number;
  symbol: string;
  image: string;
  isBridgeable: boolean;
};

export type Token = BaseToken & (NativeToken | ERC20Token);

export type NativeCurrency = Omit<BaseToken, 'image' | 'isBridgeable'> & {
  wethAddress: string;
};

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
  vaultAddress: string;
  vaultManagerParametersAddress: string;

  oracleRegistryAddress: string;

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

  bridgeAddress: string | null;
} & (L2Network | L1Network);

export interface ApplicationConfig {
  chains: Record<ChainId, ChainConfig>;
  chainsByName: Record<ChainName, ChainConfig>;
}
