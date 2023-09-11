import { textLine, textWord } from '@gton-capital/crt-terminal';
import { validateConnectedWallet } from '../../../State/validate';
import { chain, explorerUrl, network, vault } from '../../../config/config';
import { Worker } from '../../Common/worker';
import tokenMap from '../../WEB3/API/addToken';
import { toWei } from '../../WEB3/API/balance';
import balance, {
  getEthBalance,
  getUniswapBalanceGton,
  getUniswapBalanceWEthAndUsdc,
} from '../../WEB3/Balance';
import { calculateBorowedGCD, getLiquidationPrice, join, join_Eth } from '../../WEB3/cdpManager';
import { getInitialCollateralRatio, getLiquidationRatio } from '../../WEB3/vaultManager';
import { allowance, approve } from '../../WEB3/approve';
import { printLink } from '../../common';
import messages, { Prefix, UpdatingCommand } from '../../../Messages/Messages';
import { ErrorCodes, ErrorHandler } from '../errors';

export const BorrowGcdWorker = new Worker(
  async ({ lock, loading, print }, Args, [nonValidatedState], config) => {
    const state = validateConnectedWallet(config, nonValidatedState);
    try {
      lock(true);
      loading(true);
      if (state.chainId.toString() != network) {
        throw new Error(`Wrong network, switch on ${chain.chainName}, please.`);
      }
      const tmpARGS = Args.split(' ');
      if (tmpARGS.length < 7) {
        throw new Error('Invalid input');
      }

      const Amount = tmpARGS[2];
      const TokenName = tmpARGS[3];
      const percentRisk = +parseInt(tmpARGS[5]) / 100;
      let userAllowanceTokenDeposit;
      let userBalance;
      let amount;
      let debt;
      let liquidationPrice;
      let initialCollateralRatio;
      let liquidationRatio;
      let uniSwapOracleBalance;

      if (Amount === '0') throw new Error(`You can't borrow $GCD with 0 ${TokenName}$`);

      if (percentRisk > 1 || percentRisk < 0.01)
        // Converted persent
        throw new Error(`You can't borrow $GCD with less than 0% risk and more than 100%`);

      const token = TokenName in tokenMap ? tokenMap[TokenName] : null;

      if (!token) {
        throw new Error('Wrong symbol, available tokens: gton, eth');
      }
      userBalance =
        TokenName === 'eth'
          ? await getEthBalance(state?.address)
          : await balance(state?.address, token.address);

      amount = toWei(Amount, token.decimals);
      if (amount.gt(userBalance)) throw Error('Insufficient amount');

      switch (TokenName) {
        case 'eth':
          uniSwapOracleBalance = await getUniswapBalanceWEthAndUsdc(tokenMap.weth.address, amount);
          initialCollateralRatio = await getInitialCollateralRatio(tokenMap.weth.address);
          liquidationRatio = await getLiquidationRatio(tokenMap.weth.address);
          break;
        case 'gton':
          uniSwapOracleBalance = await getUniswapBalanceGton(token.address, amount);
          initialCollateralRatio = await getInitialCollateralRatio(token.address);
          liquidationRatio = await getLiquidationRatio(token.address);
          break;
      }

      debt = await calculateBorowedGCD(uniSwapOracleBalance, percentRisk, initialCollateralRatio);
      liquidationPrice = await getLiquidationPrice(debt, amount, liquidationRatio);

      print([
        textLine({
          words: [
            textWord({
              characters: `Liquidation price for ${TokenName} is $${liquidationPrice}`,
            }),
          ],
        }),
      ]);

      if (TokenName !== 'eth') {
        userAllowanceTokenDeposit = await allowance(token.address, vault);

        if (amount.gt(userAllowanceTokenDeposit)) {
          const firstTxn = await approve(state.address, token.address, vault, amount);

          print([textLine({ words: [textWord({ characters: messages.approve })] })]);
          printLink(print, messages.viewTxn, explorerUrl + firstTxn);
        }
      } else {
        userAllowanceTokenDeposit = await allowance(tokenMap.weth.address, vault);

        if (amount.gt(userAllowanceTokenDeposit)) {
          const firstTxn = await approve(state.address, tokenMap.weth.address, vault, amount);

          print([textLine({ words: [textWord({ characters: messages.approve })] })]);
          printLink(print, messages.viewTxn, explorerUrl + firstTxn);
        }
      }

      const userAllowanceGcd = await allowance(tokenMap.gcd.address, vault);

      if (debt.gt(userAllowanceGcd)) {
        const secondTxn = await approve(state.address, tokenMap.gcd.address, vault, debt);

        print([textLine({ words: [textWord({ characters: messages.approve })] })]);
        printLink(print, messages.viewTxn, explorerUrl + secondTxn);
      }

      if (TokenName !== 'eth') {
        const thirdTrx = await join(state.address, token.address, amount, debt);
        print([textLine({ words: [textWord({ characters: 'Succesfull borrowed $GCD.' })] })]);
        printLink(print, messages.viewTxn, explorerUrl + thirdTrx);
      } else {
        const fourthTrx = await join_Eth(state.address, amount, debt);
        print([textLine({ words: [textWord({ characters: 'Succesfull borrowed $GCD.' })] })]);
        printLink(print, messages.viewTxn, explorerUrl + fourthTrx);
      }

      loading(false);
      lock(false);
    } catch (err) {
      if (err.code in ErrorCodes) {
        ErrorHandler(print, err.code, 'stake'); // rename errors
      } else {
        print([textLine({ words: [textWord({ characters: err.message })] })]);
      }
      loading(false);
      lock(false);
    }
  },
).setDescription({
  description: `${Prefix.PREFIX}${UpdatingCommand.BORROW} gcd with <amount> <token> with <percent>% risk | [UNAUDITED]`,
});
