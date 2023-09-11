import { textLine, textWord } from '@gton-capital/crt-terminal';
import { validateConnectedWallet } from '../../../State/validate';
import { Worker } from '../../Common/worker';
import { toWei } from '../../WEB3/API/balance';
import balance from '../../WEB3/Balance';
import { allowance, approve } from '../../WEB3/approve';
import messages, { Prefix, UpdatingCommand } from '../../../Messages/Messages';
import { printLink } from '../../common';
import { bridgeGcdToL2 } from '../../WEB3/Bridge';
import { ErrorCodes, ErrorHandler } from '../errors';

export const BridgeToL2Worker = (coinName: string) =>
  new Worker(async ({ lock, loading, print }, Args, [nonValidatedState], config) => {
    const state = validateConnectedWallet(config, nonValidatedState);

    if (!state.chain.bridgeAddress) {
      throw new Error(`Invalid bridge address ${state.chain.bridgeAddress}`);
    }

    const token = state.chain.tokens[coinName];

    if (!token) {
      throw new Error(`Coin with name ${coinName} not found in network ${state.chain.name}`);
    }

    if (token.isNative) {
      throw new Error(
        `Coin with name ${coinName} is native currency in network ${state.chain.name}. Bridge available only for erc20 compatible tokens`,
      );
    }

    try {
      lock(true);
      loading(true);
      const Amount = Args;
      let userBalance;
      let amount;

      if (Amount === '0') throw new Error(`You can't bridge less then 0`);

      userBalance = await balance(state.address, token.address);

      amount = toWei(Amount, token.decimals);
      if (amount.gt(userBalance)) throw Error('Insufficient amount');

      const userAllowance = await allowance(token.address, state.chain.bridgeAddress);

      if (amount.gt(userAllowance)) {
        const firstTxn = await approve(
          state.address,
          token.address,
          state.chain.bridgeAddress,
          amount,
        );

        print([textLine({ words: [textWord({ characters: messages.approve })] })]);
        printLink(print, messages.viewTxn, state.chain.explorerUrl + firstTxn);
      }

      const secondTxn = await bridgeGcdToL2(state.address, amount, state.chain.bridgeAddress);

      print([
        textLine({
          words: [textWord({ characters: `Succesfull bridged $${token.symbol}.` })],
        }),
      ]);
      printLink(print, messages.viewTxn, state.chain.explorerUrl + secondTxn);

      loading(false);
      lock(false);
    } catch (err) {
      if (err.code in ErrorCodes) {
        ErrorHandler(print, err.code, 'bridge');
      } else {
        print([textLine({ words: [textWord({ characters: err.message })] })]);
      }
      loading(false);
      lock(false);
    }
  }).setDescription({
    description: `${Prefix.PREFIX}${UpdatingCommand.BRIDGE} <amount>  | [UNAUDITED]`,
  });
