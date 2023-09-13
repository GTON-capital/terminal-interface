import { textLine, textWord } from '@gton-capital/crt-terminal';
import { validateConnectedWallet } from '../../../State/validate';
import { Worker } from '../../Common/worker';
import { toWei } from '../../WEB3/API/balance';
import balance from '../../WEB3/Balance';
import { exit, exitEth, exitFallback, getCollateral } from '../../WEB3/cdpManager';
import messages, { Prefix, UpdatingCommand } from '../../../Messages/Messages';
import { printLink } from '../../common';
import { ErrorCodes, ErrorHandler } from '../errors';
import { SimulatedToken, Token } from '../../../config/types';
import Big from 'big.js';
import { checkAllownace } from '../../Common/utils/checkAllowance';

export const ExitStablecoinWorker = (coinName: string) =>
  new Worker(async ({ lock, loading, print }, Args, [nonValidatedState], config) => {
    const state = validateConnectedWallet(config, nonValidatedState);
    try {
      lock(true);
      loading(true);

      const stablecoinContracts = state.chain.simulatedTokens[coinName];
      const stablecoinToken = state.chain.tokens[coinName];

      if (stablecoinToken.isNative) {
        throw new Error(`Stablecoin ${coinName} marked as native. Misconfiguration issue`);
      }

      const tmpARGS = Args.split(' ');

      if (tmpARGS.length < 5) {
        throw new Error('Invalid input');
      }

      const stablecoinAmount = Number.parseFloat(tmpARGS[0]);
      const collateralAmount = Number.parseFloat(tmpARGS[4]);
      const collateralName = tmpARGS[5];

      if (!stablecoinContracts.collaterals.includes(collateralName)) {
        throw new Error(
          `Collateral ${collateralName} not supported for stablecoin ${coinName} in network ${state.chain.name}`,
        );
      }

      if (stablecoinAmount < 0 || collateralAmount < 0)
        throw new Error(`You can't withdraw 0 tokens`);

      const collateralToken = state.chain.tokens[collateralName];
      const isFallabckCompatible = stablecoinContracts.fallbackCollaterals.includes(
        collateralToken.name,
      );

      if (!collateralToken) {
        throw new Error(
          `Wrong symbol, available tokens: ${stablecoinContracts.collaterals.join(', ')}`,
        );
      }

      const collateralTokenAddress = collateralToken.isNative
        ? state.chain.nativeCurrency.wethAddress
        : collateralToken.address;

      const userStablecoinBalance = await balance(state.address, stablecoinToken.address);
      const userCollateralAmount = await getCollateral(
        stablecoinContracts.vaultAddress,
        collateralTokenAddress,
        state.address,
      );

      const stablecoinAmountInWei = toWei(stablecoinAmount);
      if (stablecoinAmountInWei.gt(userStablecoinBalance)) throw Error('Insufficient amount');

      const collateralAmountInWei = toWei(collateralAmount, collateralToken.decimals);

      if (collateralAmountInWei.gt(userCollateralAmount))
        throw Error('Insufficient collateral amount');

      await checkAllownace(
        print,
        state,
        stablecoinToken.address,
        stablecoinContracts.vaultAddress,
        stablecoinAmountInWei.mul(2),
      );

      const txn = isFallabckCompatible
        ? await exitFallbackPosition(
            stablecoinContracts,
            state.chain.nativeCurrency.wethAddress,
            state.address,
            collateralToken,
            collateralAmountInWei,
            stablecoinAmountInWei,
          )
        : await exitPosition(
            stablecoinContracts,
            state.address,
            collateralToken,
            collateralAmountInWei,
            stablecoinAmountInWei,
          );

      print([
        textLine({
          words: [
            textWord({
              characters: `Succesfull repay ${coinName} and withdraw ${collateralName}.`,
            }),
          ],
        }),
      ]);
      printLink(print, messages.viewTxn, state.chain.explorerUrl + txn);

      loading(false);
      lock(false);
    } catch (err) {
      if (err.code in ErrorCodes) {
        ErrorHandler(print, err.code, 'repay');
      } else {
        print([textLine({ words: [textWord({ characters: err.message })] })]);
      }
      loading(false);
      lock(false);
    }
  }).setDescription({
    description: `${Prefix.PREFIX}${UpdatingCommand.REPAY} <amount> ${coinName} and withdraw <amount> <token> | [UNAUDITED]`,
    getOptions(_, chain) {
      return {
        token: chain?.simulatedTokens[coinName].collaterals || [],
      };
    },
  });

async function exitFallbackPosition(
  contracts: SimulatedToken,
  wethAddress: string,
  senderAddress: string,
  collateral: Token,
  collateralAmountInWei: Big,
  stablecoinAmountInWei: Big,
): Promise<string> {
  if (collateral.isNative) {
    throw new Error(
      `Native collateral ${collateral.name} marked as fallback compatible. Misconfiguration issue`,
    );
  }

  if (!contracts.cdpManagerFallback) {
    throw new Error(
      `Fallback manager not configured for token ${collateral.name}. Misconfiguration issue`,
    );
  }

  if (!contracts.fallbackWethPairs[collateral.name]) {
    throw new Error(
      `Fallback weth pair for collateral ${collateral.name} not found. Misconfiguration issue`,
    );
  }

  return exitFallback(
    contracts.cdpManagerFallback,
    contracts.fallbackWethPairs[collateral.name],
    wethAddress,
    senderAddress,
    collateral.address,
    collateralAmountInWei,
    stablecoinAmountInWei,
  );
}

async function exitPosition(
  contracts: SimulatedToken,
  senderAddress: string,
  collateral: Token,
  collateralAmountInWei: Big,
  stablecoinAmountInWei: Big,
): Promise<string> {
  return collateral.isNative
    ? exitEth(
        contracts.cdpManagerAddress,
        senderAddress,
        collateralAmountInWei,
        stablecoinAmountInWei,
      )
    : exit(
        contracts.cdpManagerAddress,
        senderAddress,
        collateral.address,
        collateralAmountInWei,
        stablecoinAmountInWei,
      );
}
