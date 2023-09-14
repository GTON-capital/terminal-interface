import { textLine, textWord } from '@gton-capital/crt-terminal';
import { validateConnectedWallet } from '../../../State/validate';
import { Worker } from '../../Common/worker';
import messages, { Prefix, UpdatingCommand } from '../../../Messages/Messages';
import { ErrorCodes, ErrorHandler } from '../errors';
import { getCdpInfo } from '../../WEB3/cdpViewer';
import { buyout } from '../../WEB3/liquidationAuction';
import { printLink } from '../../common';
import { formTxLink } from '../../Common/utils/explorer';

export const BuyoutCDPStablecoinWorker = (coinName: string) =>
  new Worker(async ({ lock, loading, print }, Args, [nonValidatedState], config) => {
    const state = validateConnectedWallet(config, nonValidatedState);

    try {
      lock(true);
      loading(true);
      const tmpARGS = Args.split(' ');

      if (tmpARGS.length < 6) {
        throw new Error('Invalid input');
      }

      const stablecoinContracts = state.chain.simulatedTokens[coinName];
      const stablecoinToken = state.chain.tokens[coinName];

      const collateralName = tmpARGS[5];

      if (!stablecoinContracts.collaterals.includes(collateralName)) {
        const availableCollaterals = stablecoinContracts.collaterals.join(', ');
        throw new Error(
          `Invalid collateral name ${collateralName} available collaterals: ${availableCollaterals}`,
        );
      }

      const collateralToken = state.chain.tokens[collateralName];

      const cdpInfo = await getCdpInfo(
        {
          wethAddress: state.chain.nativeCurrency.wethAddress,
          cdpViewerAddress: stablecoinContracts.cdpViewer,
          vaultAddress: stablecoinContracts.vaultAddress,
          vaulManagerParametersAddress: stablecoinContracts.vaultManagerParametersAddress,
        },
        collateralToken,
        state.address,
      );

      if (!cdpInfo.liquidation) {
        throw Error(
          `No liquidation in progress for position with collateral ${collateralName} and owner ${state.address}`,
        );
      }

      const description =
        `You will receive ${cdpInfo.liquidation.assetToBuyer.add(
          cdpInfo.liquidation.assetToOwner,
        )} ${collateralToken.symbol}.` + cdpInfo.liquidation.price.gt(0)
          ? ` You need to burn ${cdpInfo.liquidation.price} ${stablecoinToken.symbol}.`
          : '';

      print([
        textLine({
          words: [textWord({ characters: description })],
        }),
      ]);

      const tokenAddress = collateralToken.isNative
        ? state.chain.nativeCurrency.wethAddress
        : collateralToken.address;

      const txn = await buyout(
        stablecoinContracts.liquidationAuctionAddress,
        tokenAddress,
        state.address,
        state.address,
      );

      print([textLine({ words: [textWord({ characters: `Succesfull liquidated.` })] })]);
      printLink(print, messages.viewTxn, formTxLink(state.chain.explorerUrl, txn));

      loading(false);
      lock(false);
    } catch (err) {
      if (err.code in ErrorCodes) {
        ErrorHandler(print, err.code, 'buyout'); // rename errors
      } else {
        print([textLine({ words: [textWord({ characters: err.message })] })]);
      }
      loading(false);
      lock(false);
    }
  }).setDescription({
    description: `${Prefix.PREFIX}${UpdatingCommand.BUYOUT} my ${coinName} position with collateral <token>`,
    getOptions(_, chain) {
      return {
        token: chain?.simulatedTokens[coinName].collaterals || [],
      };
    },
  });
