import { textLine, textWord } from '@gton-capital/crt-terminal';
import { validateConnectedWallet } from '../../../State/validate';
import { Worker } from '../../Common/worker';
import { Prefix, UpdatingCommand } from '../../../Messages/Messages';
import { ErrorCodes, ErrorHandler } from '../errors';
import { CDPInfo, getCdpInfo } from '../../WEB3/cdpViewer';
import { Token } from '../../../config/types';
import Big from 'big.js';

export const ViewCDPStablecoinWorker = (coinName: string) =>
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
      const stablecoinsToken = state.chain.tokens[coinName];

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

      if (cdpInfo.collateral.eq(0)) {
        print([
          textLine({
            words: [
              textWord({
                characters: `Position for collateral ${collateralName} and owner ${state.address} not found`,
              }),
            ],
          }),
        ]);
      } else {
        const message = cdpInfoDescription(cdpInfo, stablecoinsToken, collateralToken);
        print([
          textLine({
            words: [
              textWord({
                characters: message,
              }),
            ],
          }),
        ]);
      }

      loading(false);
      lock(false);
    } catch (err) {
      if (err.code in ErrorCodes) {
        ErrorHandler(print, err.code, 'view'); // rename errors
      } else {
        print([textLine({ words: [textWord({ characters: err.message })] })]);
      }
      loading(false);
      lock(false);
    }
  }).setDescription({
    description: `${Prefix.PREFIX}${UpdatingCommand.VIEW} my ${coinName} position with collateral <token>`,
    getOptions(_, chain) {
      return {
        token: chain?.simulatedTokens[coinName].collaterals || [],
      };
    },
  });

function cdpInfoDescription(info: CDPInfo, stablecoinToken: Token, collateralToken: Token): string {
  const liquidationMessage = info.liquidation
    ? `\n\tLiquidation in progress
        \tLiquidation block: ${info.liquidation.block}
        \tOwner will receive ${info.liquidation.assetToOwner.div(
          Big(10).pow(collateralToken.decimals),
        )} ${collateralToken.symbol}
        \tBuyer will receive ${info.liquidation.assetToBuyer.div(
          Big(10).pow(collateralToken.decimals),
        )} ${collateralToken.symbol}
        \tLiquidation price: ${
          info.liquidation.price.eq(0)
            ? 'free'
            : `${info.liquidation.price.div(Big(10).pow(stablecoinToken.decimals))} ${
                stablecoinToken.symbol
              }`
        }`
    : '';
  return `CDP with collateral: ${collateralToken.name} and owner: ${info.owner}
        collateral amount: ${info.collateral.div(Big(10).pow(collateralToken.decimals))}
        stablecoin amount: ${info.debt.div(Big(10).pow(stablecoinToken.decimals))}
        liquidation price: ${info.liquidationPrice}${liquidationMessage}`;
}
