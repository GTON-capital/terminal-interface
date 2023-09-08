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
  return {
    name: env
      .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_${NATIVE_CURRENCY_INFIX}_NAME`)
      .required()
      .asString(),
    decimals: env
      .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_${NATIVE_CURRENCY_INFIX}_DECIMALS`)
      .required()
      .asIntPositive(),
    symbol: env
      .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_${NATIVE_CURRENCY_INFIX}_SYMBOL`)
      .required()
      .asString(),
  };
}

function parseToken(networkName: string, tokenName: string): Token {
  const isNative =
    env
      .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_${tokenName.toUpperCase()}_IS_NATIVE`)
      .asBool() || false;
  return {
    name: tokenName,
    decimals: env
      .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_${tokenName.toUpperCase()}_DECIMALS`)
      .required()
      .asIntPositive(),
    symbol: env
      .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_${tokenName.toUpperCase()}_SYMBOL`)
      .required()
      .asString(),
    image:
      env
        .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_${tokenName.toUpperCase()}_IMAGE`)
        .asUrlString() || null,
    isNative: isNative,
    wethAddress: isNative
      ? env
          .get(
            `${CONFIG_PREFIX}_${networkName.toUpperCase()}_${tokenName.toUpperCase()}_WETH_ADDRESS`,
          )
          .required()
          .asString()
      : null,
    address: !isNative
      ? env
          .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_${tokenName.toUpperCase()}_ADDRESS`)
          .required()
          .asString()
      : null,
  } as Token;
}

function parseSimulatedToken(networkName: string, tokenName: string): SimulatedToken {
  return {
    name: tokenName,

    cdpManagerAddress: env
      .get(
        `${CONFIG_PREFIX}_${networkName.toUpperCase()}_SIMULATED_${tokenName.toUpperCase()}_CDP_MANAGER_ADDRESS`,
      )
      .required()
      .asString(),
    cdpManagerFallback:
      env
        .get(
          `${CONFIG_PREFIX}_${networkName.toUpperCase()}_SIMULATED_${tokenName.toUpperCase()}_CDP_MANAGER_FALLBACK_ADDRESS`,
        )
        .asString() || null,
    collaterals: env
      .get(
        `${CONFIG_PREFIX}_${networkName.toUpperCase()}_SIMULATED_${tokenName.toUpperCase()}_COLLATERALS`,
      )
      .required()
      .asArray(','),
    fallbackCollaterals:
      env
        .get(
          `${CONFIG_PREFIX}_${networkName.toUpperCase()}_SIMULATED_${tokenName.toUpperCase()}_FALLBACK_COLLATERALS`,
        )
        .asArray(',') || [],
  };
}

function parseNetwork(networkName: string): ChainConfig {
  const tokens = env
    .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_TOKENS`)
    .required()
    .asArray(',');
  const simulatedTokens = env
    .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_SIMULATED_TOKENS`)
    .required()
    .asArray(',');

  const isL2Network = env
    .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_IS_L2`)
    .default('false')
    .asBool();

  const parsedTokens = Object.fromEntries(
    tokens.map((name) => [name, parseToken(networkName, name)]),
  );

  return {
    name: networkName,
    id: env
      .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_CHAIN_ID`)
      .required()
      .asIntPositive(),
    rpcUrl: env
      .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_RPC_URL`)
      .required()
      .asUrlString(),
    explorerUrl: env
      .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_EXPLORER_URL`)
      .required()
      .asUrlString(),
    isTestnet: env
      .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_IS_TESTNET`)
      .default('false')
      .asBool(),
    tokens: parsedTokens,
    nativeCurrency: parseNativeCurrency(networkName),
    simulatedTokens: Object.fromEntries(
      simulatedTokens.map((tokenName) => [tokenName, parseSimulatedToken(networkName, tokenName)]),
    ),
    isL2Network: isL2Network,
    oppositeChainId: isL2Network
      ? env
          .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_L1_CHAIN_ID`)
          .required()
          .asIntPositive()
      : env
          .get(`${CONFIG_PREFIX}_${networkName.toUpperCase()}_GTON_CHAIN_ID`)
          .required()
          .asIntPositive(),
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
