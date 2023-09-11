import { textLine, textWord } from '@gton-capital/crt-terminal';
import { validateConnectedWallet } from '../../../State/validate';
import { Worker } from '../../Common/worker';
import { toWei } from '../../WEB3/API/balance';
import balance, { collateralToStablecoinEquivalent, getEthBalance } from '../../WEB3/Balance';
import {
  calculateBorowedStablecoin,
  getLiquidationPrice,
  join,
  join_Eth,
} from '../../WEB3/cdpManager';
import { getInitialCollateralRatio, getLiquidationRatio } from '../../WEB3/vaultManager';
import { allowance, approve } from '../../WEB3/approve';
import { printLink } from '../../common';
import messages, { Prefix, UpdatingCommand } from '../../../Messages/Messages';
import { ErrorCodes, ErrorHandler } from '../errors';

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

      let userAllowanceTokenDeposit;
      let userBalance;
      let amount;
      let debt;
      let liquidationPrice;
      let initialCollateralRatio;
      let liquidationRatio;
      let uniSwapOracleBalance;

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
      userBalance = collateralToken.isNative
        ? await getEthBalance(state.address)
        : await balance(state.address, collateralToken.address);

      amount = toWei(collateralAmount, collateralToken.decimals);
      if (amount.gt(userBalance)) throw Error('Insufficient amount');

      if (collateralToken.isNative) {
        uniSwapOracleBalance = await collateralToStablecoinEquivalent(
          stablecoinContracts.oracleRegistryAddress,
          state.chain.nativeCurrency.wethAddress,
          amount,
        );
        initialCollateralRatio = await getInitialCollateralRatio(
          stablecoinContracts.vaultManagerParametersAddress,
          state.chain.nativeCurrency.wethAddress,
        );
        liquidationRatio = await getLiquidationRatio(
          stablecoinContracts.vaultManagerParametersAddress,
          state.chain.nativeCurrency.wethAddress,
        );
      } else {
        uniSwapOracleBalance = await collateralToStablecoinEquivalent(
          stablecoinContracts.oracleRegistryAddress,
          collateralToken.address,
          amount,
        );
        initialCollateralRatio = await getInitialCollateralRatio(
          stablecoinContracts.vaultManagerParametersAddress,
          collateralToken.address,
        );
        liquidationRatio = await getLiquidationRatio(
          stablecoinContracts.vaultManagerParametersAddress,
          collateralToken.address,
        );
      }

      debt = await calculateBorowedStablecoin(
        uniSwapOracleBalance,
        percentRisk,
        initialCollateralRatio,
      );
      liquidationPrice = await getLiquidationPrice(debt, amount, liquidationRatio);

      print([
        textLine({
          words: [
            textWord({
              characters: `Liquidation price for ${collateralName} is ${liquidationPrice} ${stablecoinToken.symbol}`,
            }),
          ],
        }),
      ]);

      if (!collateralToken.isNative) {
        userAllowanceTokenDeposit = await allowance(
          collateralToken.address,
          stablecoinContracts.vaultAddress,
        );

        if (amount.gt(userAllowanceTokenDeposit)) {
          const firstTxn = await approve(
            state.address,
            collateralToken.address,
            stablecoinContracts.vaultAddress,
            amount,
          );

          print([textLine({ words: [textWord({ characters: messages.approve })] })]);
          printLink(print, messages.viewTxn, state.chain.explorerUrl + firstTxn);
        }
      } else {
        userAllowanceTokenDeposit = await allowance(
          state.chain.nativeCurrency.wethAddress,
          stablecoinContracts.vaultAddress,
        );

        if (amount.gt(userAllowanceTokenDeposit)) {
          const firstTxn = await approve(
            state.address,
            state.chain.nativeCurrency.wethAddress,
            stablecoinContracts.vaultAddress,
            amount,
          );

          print([textLine({ words: [textWord({ characters: messages.approve })] })]);
          printLink(print, messages.viewTxn, state.chain.explorerUrl + firstTxn);
        }
      }

      const userAllowanceStablecoins = await allowance(
        stablecoinToken.address,
        stablecoinContracts.vaultAddress,
      );

      if (debt.gt(userAllowanceStablecoins)) {
        const secondTxn = await approve(
          state.address,
          stablecoinToken.address,
          stablecoinContracts.vaultAddress,
          debt,
        );

        print([textLine({ words: [textWord({ characters: messages.approve })] })]);
        printLink(print, messages.viewTxn, state.chain.explorerUrl + secondTxn);
      }

      if (!collateralToken.isNative) {
        const thirdTrx = await join(
          stablecoinContracts.cdpManagerAddress,
          state.address,
          collateralToken.address,
          amount,
          debt,
        );
        print([
          textLine({ words: [textWord({ characters: `Succesfull borrowed ${coinName}.` })] }),
        ]);
        printLink(print, messages.viewTxn, state.chain.explorerUrl + thirdTrx);
      } else {
        const fourthTrx = await join_Eth(
          stablecoinContracts.cdpManagerAddress,
          state.address,
          amount,
          debt,
        );
        print([
          textLine({ words: [textWord({ characters: `Succesfull borrowed ${coinName}.` })] }),
        ]);
        printLink(print, messages.viewTxn, state.chain.explorerUrl + fourthTrx);
      }

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
    getOptions(config, chain) {
      return {
        token: chain?.simulatedTokens[coinName].collaterals || [],
      };
    },
  });
