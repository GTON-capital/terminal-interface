import { textLine, textWord } from '@gton-capital/crt-terminal';
import { validateConnectedWallet } from '../../../State/validate';
import { Worker } from '../../Common/worker';
import { toWei } from '../../WEB3/API/balance';
import balance from '../../WEB3/Balance';
import { allowance, approve } from '../../WEB3/approve';
import { exit, exit_Eth, getCollateral } from '../../WEB3/cdpManager';
import messages, { Prefix, UpdatingCommand } from '../../../Messages/Messages';
import { printLink } from '../../common';
import { ErrorCodes, ErrorHandler } from '../errors';

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
      let userStablecoinBalance;
      let stablecoinAmountInWei;
      let collateralAmountInWei;
      let thirdTxn;
      let userCollateralAmount;
      let userAllowanceToken;

      if (!stablecoinContracts.collaterals.includes(collateralName)) {
        throw new Error(
          `Collateral ${collateralName} not supported for stablecoin ${coinName} in network ${state.chain.name}`,
        );
      }

      if (stablecoinAmount < 0 || collateralAmount < 0)
        throw new Error(`You can't withdraw 0 tokens`);

      const collateralToken = state.chain.tokens[collateralName];

      if (!collateralToken) {
        throw new Error(
          `Wrong symbol, available tokens: ${stablecoinContracts.collaterals.join(', ')}`,
        );
      }

      userStablecoinBalance = await balance(state.address, stablecoinToken.address);
      userCollateralAmount = collateralToken.isNative
        ? await getCollateral(state.chain.nativeCurrency.wethAddress, state.address)
        : await getCollateral(collateralToken.address, state.address);

      stablecoinAmountInWei = toWei(stablecoinAmount);
      if (stablecoinAmountInWei.gt(userStablecoinBalance)) throw Error('Insufficient amount');

      collateralAmountInWei = toWei(collateralAmount, collateralToken.decimals);

      if (collateralAmountInWei.gt(userCollateralAmount))
        throw Error('Insufficient collateral amount');

      const userAllowanceStablecoinAmount = await allowance(
        state.chain.nativeCurrency.wethAddress,
        stablecoinContracts.vaultAddress,
      );

      if (stablecoinAmountInWei.gt(userAllowanceStablecoinAmount)) {
        const firstTxn = await approve(
          state.address,
          state.chain.nativeCurrency.wethAddress,
          stablecoinContracts.vaultAddress,
          stablecoinAmountInWei,
        );

        print([textLine({ words: [textWord({ characters: messages.approve })] })]);
        printLink(print, messages.viewTxn, state.chain.explorerUrl + firstTxn);
      }

      if (collateralToken.isNative) {
        userAllowanceToken = await allowance(
          state.chain.nativeCurrency.wethAddress,
          stablecoinContracts.cdpManagerAddress,
        );
      } else {
        userAllowanceToken = await allowance(
          collateralToken.address,
          stablecoinContracts.cdpManagerAddress,
        );
      }

      if (collateralAmountInWei.gt(userAllowanceToken)) {
        const secondTxn = collateralToken.isNative
          ? await approve(
              state.address,
              state.chain.nativeCurrency.wethAddress,
              stablecoinContracts.cdpManagerAddress,
              collateralAmountInWei,
            )
          : await approve(
              state.address,
              collateralToken.address,
              stablecoinContracts.cdpManagerAddress,
              collateralAmountInWei,
            );

        print([textLine({ words: [textWord({ characters: messages.approve })] })]);
        printLink(print, messages.viewTxn, state.chain.explorerUrl + secondTxn);
      }

      thirdTxn = collateralToken.isNative
        ? (thirdTxn = await exit_Eth(state.address, collateralAmountInWei, stablecoinAmountInWei))
        : (thirdTxn = await exit(
            state.address,
            collateralToken.address,
            collateralAmountInWei,
            stablecoinAmountInWei,
          ));
      print([
        textLine({
          words: [
            textWord({
              characters: `Succesfull repay ${coinName} and withdraw $${collateralName}.`,
            }),
          ],
        }),
      ]);
      printLink(print, messages.viewTxn, state.chain.explorerUrl + thirdTxn);

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
    getOptions(config, chain) {
      return {
        token: chain?.simulatedTokens[coinName].collaterals || [],
      };
    },
  });
