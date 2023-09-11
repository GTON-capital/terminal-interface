import * as env from 'env-var';
import {
  ApplicationConfig,
  ChainConfig,
  ChainId,
  NativeCurrency,
  SimulatedToken,
  Token,
} from './types';

const CONFIG_PREFIX = 'GTON_CLI';
const NATIVE_CURRENCY_INFIX = 'NATIVE';

function parseNativeCurrency(networkName: string): NativeCurrency {
  const ENV_PREFIX = `${CONFIG_PREFIX}_${networkName.toUpperCase()}_${NATIVE_CURRENCY_INFIX}`;

  return {
    name: env.get(`${ENV_PREFIX}_NAME`).required().asString(),
    decimals: env.get(`${ENV_PREFIX}_DECIMALS`).required().asIntPositive(),
    symbol: env.get(`${ENV_PREFIX}_SYMBOL`).required().asString(),
    wethAddress: env.get(`${ENV_PREFIX}_WETH_ADDRESS`).required().asString(),
  };
}

function parseToken(networkName: string, tokenName: string): Token {
  const ENV_PREFIX = `${CONFIG_PREFIX}_${networkName.toUpperCase()}_${tokenName.toUpperCase()}`;

  const isNative = env.get(`${ENV_PREFIX}_IS_NATIVE`).asBool() || false;
  return {
    name: tokenName,
    decimals: env.get(`${ENV_PREFIX}_DECIMALS`).required().asIntPositive(),
    symbol: env.get(`${ENV_PREFIX}_SYMBOL`).required().asString(),
    image: env.get(`${ENV_PREFIX}_IMAGE`).asUrlString() || null,
    isNative: isNative,
    address: !isNative ? env.get(`${ENV_PREFIX}_ADDRESS`).required().asString() : null,
    isBridgeable: env.get(`${ENV_PREFIX}_IS_BRIDGEABLE`).default('false').asBool(),
  } as Token;
}

function parseSimulatedToken(networkName: string, tokenName: string): SimulatedToken {
  const ENV_PREFIX = `${CONFIG_PREFIX}_${networkName.toUpperCase()}_SIMULATED_${tokenName.toUpperCase()}`;

  return {
    name: tokenName,

    vaultAddress: env.get(`${ENV_PREFIX}_VAULT_ADDRESS`).required().asString(),
    oracleRegistryAddress: env.get(`${ENV_PREFIX}_ORACLE_REGISTRY_ADDRESS`).required().asString(),
    cdpManagerAddress: env.get(`${ENV_PREFIX}_CDP_MANAGER_ADDRESS`).required().asString(),
    cdpManagerFallback: env.get(`${ENV_PREFIX}_CDP_MANAGER_FALLBACK_ADDRESS`).asString() || null,
    collaterals: env.get(`${ENV_PREFIX}_COLLATERALS`).required().asArray(','),
    fallbackCollaterals: env.get(`${ENV_PREFIX}_FALLBACK_COLLATERALS`).asArray(',') || [],
  };
}

function parseNetwork(networkName: string): ChainConfig {
  const ENV_PREFIX = `${CONFIG_PREFIX}_${networkName.toUpperCase()}`;

  const tokens = env.get(`${ENV_PREFIX}_TOKENS`).required().asArray(',');
  const simulatedTokens = env.get(`${ENV_PREFIX}_SIMULATED_TOKENS`).required().asArray(',');

  const isL2Network = env.get(`${ENV_PREFIX}_IS_L2`).default('false').asBool();

  const parsedTokens = Object.fromEntries(
    tokens.map((name) => [name, parseToken(networkName, name)]),
  );

  return {
    name: networkName,
    id: env.get(`${ENV_PREFIX}_CHAIN_ID`).required().asIntPositive(),
    rpcUrl: env.get(`${ENV_PREFIX}_RPC_URL`).required().asUrlString(),
    explorerUrl: env.get(`${ENV_PREFIX}_EXPLORER_URL`).required().asUrlString(),
    isTestnet: env.get(`${ENV_PREFIX}_IS_TESTNET`).default('false').asBool(),
    tokens: parsedTokens,
    nativeCurrency: parseNativeCurrency(networkName),
    simulatedTokens: Object.fromEntries(
      simulatedTokens.map((tokenName) => [tokenName, parseSimulatedToken(networkName, tokenName)]),
    ),
    isL2Network: isL2Network,
    bridgeAddress: env.get(`${ENV_PREFIX}_BRIDGE_ADDRESS`).asString() || null,
    oppositeChainId: isL2Network
      ? env.get(`${ENV_PREFIX}_L1_CHAIN_ID`).required().asIntPositive()
      : env.get(`${ENV_PREFIX}_GTON_CHAIN_ID`).required().asIntPositive(),
  };
}

function parseConfiguration(): ApplicationConfig {
  const networks = env.get(`${CONFIG_PREFIX}_CHAINS`).required().asArray(',');

  const chains: Record<ChainId, ChainConfig> = Object.fromEntries(
    networks.map((networkName) => [
      env.get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_CHAIN_ID`).required().asIntPositive(),
      parseNetwork(networkName),
    ]),
  );

  return {
    chains,
    chainsByName: Object.fromEntries(Object.values(chains).map((chain) => [chain.name, chain])),
  };
}

function validateConfiguration(config: ApplicationConfig): ApplicationConfig {
  if (Object.entries(config.chains).length != Object.entries(config.chainsByName).length) {
    throw new Error('Invalid names => chain map size');
  }

  Object.entries(config.chains).forEach(([chainId, chain]) => {
    if (Number.parseInt(chainId) !== chain.id) {
      throw Error(`Chain ${chain.name} has invalid chain id`);
    }

    if (!config.chains[chain.oppositeChainId]) {
      if (chain.isL2Network) {
        throw Error(`Invalid L1 chain ref in network ${chain.name}`);
      } else {
        throw Error(`Invalid GTON chain ref in network ${chain.name}`);
      }
    }

    Object.entries(chain.simulatedTokens).forEach(([tokenName, token]) => {
      if (tokenName !== token.name) {
        throw Error(`Simulated token ${tokenName} has invalid name`);
      }
      if (!chain.tokens[tokenName]) {
        throw Error(`Simulated token ${tokenName} not mentioned in ${chain.name} networks token`);
      }
      token.collaterals.forEach((collateral) => {
        if (!chain.tokens[collateral]) {
          throw Error(
            `Collateral ${collateral} for simulated token ${tokenName} in network ${chain.name} not mentioned in tokens list`,
          );
        }
      });

      const collaterals = new Set(token.collaterals);

      if (token.fallbackCollaterals?.length > 0) {
        if (!token.cdpManagerFallback) {
          throw Error(
            `CDPManager_Fallback not set for simulated token ${
              token.name
            } with falback collaterals ${token.fallbackCollaterals.join(', ')}`,
          );
        }

        token.fallbackCollaterals.forEach((fbCollateral) => {
          if (!collaterals.has(fbCollateral)) {
            throw new Error(
              `Fallback collatral ${fbCollateral} not mentioned in collaterals of token ${token.name}`,
            );
          }
        });
      }
    });
  });

  return config;
}

export const config = () => validateConfiguration(parseConfiguration());
