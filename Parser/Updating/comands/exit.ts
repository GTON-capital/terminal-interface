import { textLine, textWord } from '@gton-capital/crt-terminal';
import { validateConnectedWallet } from '../../../State/validate';
import { cdpManager01, chain, explorerUrl, network, vault } from '../../../config/config';
import { Worker } from '../../Common/worker';
import tokenMap from '../../WEB3/API/addToken';
import { toWei } from '../../WEB3/API/balance';
import balance from '../../WEB3/Balance';
import { allowance, approve } from '../../WEB3/approve';
import { exit, exit_Eth, getCollateral } from '../../WEB3/cdpManager';
import messages, { Prefix, UpdatingCommand } from '../../../Messages/Messages';
import { printLink } from '../../common';
import { ErrorCodes, ErrorHandler } from '../errors';

export const ExitGcdWorker = new Worker(
  async ({ lock, loading, print }, Args, [nonValidatedState], config) => {
    const state = validateConnectedWallet(config, nonValidatedState);
    try {
      lock(true);
      loading(true);
      if (state.chainId.toString() != network) {
        throw new Error(`Wrong network, switch on ${chain.chainName}, please.`);
      }
      const tmpARGS = Args.split(' ');

      if (tmpARGS.length < 5) {
        throw new Error('Invalid input');
      }

      const AmountGCD = Number.parseFloat(tmpARGS[0]);
      const AmountBorrowedToken = Number.parseFloat(tmpARGS[4]);
      const TokenName = tmpARGS[5];
      let userGcdBalance;
      let amountGcd;
      let amountBorrowedToken;
      let thirdTxn;
      let userCollateralAmount;
      let userAllowanceToken;

      if (AmountGCD < 0 || AmountBorrowedToken < 0) throw new Error(`You can't withdraw 0 tokens`);

      const token = TokenName in tokenMap ? tokenMap[TokenName] : null;

      if (!token) {
        throw new Error('Wrong symbol, available tokens: gton, eth');
      }

      userGcdBalance = await balance(state.address, tokenMap.gcd.address);
      userCollateralAmount =
        TokenName === 'eth'
          ? await getCollateral(tokenMap.weth.address, state.address)
          : await getCollateral(token.address, state.address);

      amountGcd = toWei(AmountGCD);
      if (amountGcd.gt(userGcdBalance)) throw Error('Insufficient amount');

      amountBorrowedToken = toWei(AmountBorrowedToken, token.decimals);

      if (amountBorrowedToken.gt(userCollateralAmount))
        throw Error('Insufficient collateral amount');

      const userAllowanceGcd = await allowance(tokenMap.gcd.address, vault);

      if (amountGcd.gt(userAllowanceGcd)) {
        const firstTxn = await approve(state.address, tokenMap.gcd.address, vault, amountGcd);

        print([textLine({ words: [textWord({ characters: messages.approve })] })]);
        printLink(print, messages.viewTxn, explorerUrl + firstTxn);
      }

      if (TokenName === 'eth') {
        userAllowanceToken = await allowance(tokenMap.weth.address, cdpManager01);
      } else {
        userAllowanceToken = await allowance(token.address, cdpManager01);
      }

      if (amountBorrowedToken.gt(userAllowanceToken)) {
        const secondTxn =
          TokenName === 'eth'
            ? await approve(state.address, tokenMap.weth.address, cdpManager01, amountBorrowedToken)
            : await approve(state.address, token.address, cdpManager01, amountBorrowedToken);

        print([textLine({ words: [textWord({ characters: messages.approve })] })]);
        printLink(print, messages.viewTxn, explorerUrl + secondTxn);
      }

      thirdTxn =
        TokenName === 'eth'
          ? (thirdTxn = await exit_Eth(state.address, amountBorrowedToken, amountGcd))
          : (thirdTxn = await exit(state.address, token.address, amountBorrowedToken, amountGcd));
      print([
        textLine({
          words: [textWord({ characters: `Succesfull repay $GCD and withdraw $${TokenName}.` })],
        }),
      ]);
      printLink(print, messages.viewTxn, explorerUrl + thirdTxn);

      loading(false);
      lock(false);
    } catch (err) {
      if (err.code in ErrorCodes) {
        ErrorHandler(print, err.code, 'stake');
      } else {
        print([textLine({ words: [textWord({ characters: err.message })] })]);
      }
      loading(false);
      lock(false);
    }
  },
).setDescription({
  description: `${Prefix.PREFIX}${UpdatingCommand.REPAY} <amount> gcd and withdraw <amount> <token> | [UNAUDITED]`,
});
