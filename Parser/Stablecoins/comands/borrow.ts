import { textLine, textWord } from '@gton-capital/crt-terminal';
import { validateConnectedWallet } from '../../../State/validate';
import { Worker } from '../../Common/worker';
import { toWei } from '../../WEB3/API/balance';
import balance, { collateralToStablecoinEquivalent, getEthBalance } from '../../WEB3/Balance';
import {
  calculateBorowedStablecoin,
  getLiquidationPrice,
  join,
  joinEth,
  joinFallback,
} from '../../WEB3/cdpManager';
import {
  getBorrowFee,
  getInitialCollateralRatio,
  getLiquidationRatio,
} from '../../WEB3/vaultManager';
import { printLink } from '../../common';
import messages, { Prefix, UpdatingCommand } from '../../../Messages/Messages';
import { ErrorCodes, ErrorHandler } from '../errors';
import { SimulatedToken, Token } from '../../../config/types';
import { checkAllownace } from '../../Common/utils/checkAllowance';

export const BorrowStablecoinWorker = (coinName: string) =>
  new Worker(async ({ lock, loading, print }, Args, [nonValidatedState], config) => {
    const state = validateConnectedWallet(config, nonValidatedState);

    try {
      lock(true);
      loading(true);
      const tmpARGS = Args.split(' ');

      if (tmpARGS.length < 7) {
        throw new Error('Invalid input');
      }

      const stablecoinContracts = state.chain.simulatedTokens[coinName];
      const stablecoinToken = state.chain.tokens[coinName];

      if (stablecoinToken.isNative) {
        throw new Error(`Stablecoin ${coinName} marked as native. Misconfiguration issue`);
      }

      const collateralAmount = tmpARGS[2];
      const collateralName = tmpARGS[3];
      const percentRisk = +parseInt(tmpARGS[5]) / 100;
      const collateralToken = state.chain.tokens[collateralName];

      if (!stablecoinContracts.collaterals.includes(collateralName)) {
        throw new Error(
          `Collateral ${collateralName} not supported for stablecoin ${coinName} in network ${state.chain.name}`,
        );
      }

      const isFallabckCompatible = stablecoinContracts.fallbackCollaterals.includes(
        collateralToken.name,
      );
      const managerAddress = isFallabckCompatible
        ? stablecoinContracts.cdpManagerFallback!!
        : stablecoinContracts.cdpManagerAddress;

      const collateralTokenAddress = collateralToken.isNative
        ? state.chain.nativeCurrency.wethAddress
        : collateralToken.address;

      if (collateralAmount === '0')
        throw new Error(`You can't borrow ${coinName} with 0 ${collateralName}$`);

      if (percentRisk > 1 || percentRisk < 0.01)
        // Converted persent
        throw new Error(`You can't borrow ${coinName} with less than 0% risk and more than 100%`);

      if (!collateralToken) {
        throw new Error(
          `'Wrong symbol ${collateralName}, available tokens: ${stablecoinContracts.collaterals.join(
            ', ',
          )}'`,
        );
      }
      const userBalance = collateralToken.isNative
        ? await getEthBalance(state.address)
        : await balance(state.address, collateralToken.address);

      const collateralAmountInWei = toWei(collateralAmount, collateralToken.decimals);
      if (collateralAmountInWei.gt(userBalance)) throw Error('Insufficient amount');

      const collateralEquivalentInStablecoin = await collateralToStablecoinEquivalent(
        stablecoinContracts,
        collateralToken,
        state.chain.nativeCurrency.wethAddress,
        collateralAmountInWei,
      );
      const initialCollateralRatio = await getInitialCollateralRatio(
        stablecoinContracts.vaultManagerParametersAddress,
        collateralTokenAddress,
      );
      const liquidationRatio = await getLiquidationRatio(
        stablecoinContracts.vaultManagerParametersAddress,
        collateralTokenAddress,
      );

      const calculatedStablecoinAmountInWei = await calculateBorowedStablecoin(
        collateralEquivalentInStablecoin,
        percentRisk,
        initialCollateralRatio,
      );
      const liquidationPrice = await getLiquidationPrice(
        calculatedStablecoinAmountInWei,
        collateralAmountInWei,
        liquidationRatio,
      );

      const borrowFee = await getBorrowFee(
        stablecoinContracts.cdpManagerAddress,
        collateralTokenAddress,
        calculatedStablecoinAmountInWei,
      );

      print([
        textLine({
          words: [
            textWord({
              characters: `Liquidation price for ${collateralName} is ${liquidationPrice.toFixed()} ${
                stablecoinToken.symbol
              }`,
            }),
          ],
        }),
      ]);

      await checkAllownace(
        print,
        state,
        collateralTokenAddress,
        stablecoinContracts.vaultAddress,
        collateralAmountInWei,
      );

      await checkAllownace(
        print,
        state,
        stablecoinToken.address,
        stablecoinContracts.vaultAddress,
        calculatedStablecoinAmountInWei,
      );

      if (borrowFee.gt(0)) {
        await checkAllownace(print, state, stablecoinToken.address, managerAddress, borrowFee);
      }

      const txn = isFallabckCompatible
        ? await joinFallbackPosition(
            stablecoinContracts,
            state.chain.nativeCurrency.wethAddress,
            state.address,
            collateralToken,
            collateralAmountInWei,
            calculatedStablecoinAmountInWei,
          )
        : await joinPosition(
            stablecoinContracts,
            state.address,
            collateralToken,
            collateralAmountInWei,
            calculatedStablecoinAmountInWei,
          );
      print([textLine({ words: [textWord({ characters: `Succesfull borrowed ${coinName}.` })] })]);
      printLink(print, messages.viewTxn, state.chain.explorerUrl + txn);

      loading(false);
      lock(false);
    } catch (err) {
      if (err.code in ErrorCodes) {
        ErrorHandler(print, err.code, 'borrow'); // rename errors
      } else {
        print([textLine({ words: [textWord({ characters: err.message })] })]);
      }
      loading(false);
      lock(false);
    }
  }).setDescription({
    description: `${Prefix.PREFIX}${UpdatingCommand.BORROW} ${coinName} with <amount> <token> with <percent>% risk | [UNAUDITED]`,
    getOptions(_, chain) {
      return {
        token: chain?.simulatedTokens[coinName].collaterals || [],
      };
    },
  });

async function joinFallbackPosition(
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

  return joinFallback(
    contracts.cdpManagerFallback,
    contracts.fallbackWethPairs[collateral.name],
    wethAddress,
    senderAddress,
    collateral.address,
    collateralAmountInWei,
    stablecoinAmountInWei,
  );
}

async function joinPosition(
  contracts: SimulatedToken,
  senderAddress: string,
  collateral: Token,
  collateralAmountInWei: Big,
  stablecoinAmountInWei: Big,
): Promise<string> {
  return collateral.isNative
    ? joinEth(
        contracts.cdpManagerAddress,
        senderAddress,
        collateralAmountInWei,
        stablecoinAmountInWei,
      )
    : join(
        contracts.cdpManagerAddress,
        senderAddress,
        collateral.address,
        collateralAmountInWei,
        stablecoinAmountInWei,
      );
}
