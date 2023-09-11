import { textLine, textWord } from '@gton-capital/crt-terminal';
import { validateConnectedWallet } from '../../../State/validate';
import { bridgeAddress, chain, explorerUrl, network } from '../../../config/config';
import { Worker } from '../../Common/worker';
import tokenMap from '../../WEB3/API/addToken';
import { toWei } from '../../WEB3/API/balance';
import balance from '../../WEB3/Balance';
import { allowance, approve } from '../../WEB3/approve';
import messages, { Prefix, UpdatingCommand } from '../../../Messages/Messages';
import { printLink } from '../../common';
import { bridgeGcdToL2 } from '../../WEB3/Bridge';
import { ErrorCodes, ErrorHandler } from '../errors';

export const BridgeToL2Worker = new Worker(
  async ({ lock, loading, print }, Args, [nonValidatedState], config) => {
    const state = validateConnectedWallet(config, nonValidatedState);
    try {
      lock(true);
      loading(true);
      if (state.chainId.toString() != network) {
        throw new Error(`Wrong network, switch on ${chain.chainName}, please.`);
      }
      const tmpARGS = Args.split(' ');

      if (tmpARGS.length < 2) {
        throw new Error('Invalid input');
      }
      const Amount = tmpARGS[0];
      let userBalance;
      let amount;

      if (Amount === '0') throw new Error(`You can't bridge less then 0`);

      userBalance = await balance(state.address, tokenMap.gcd.address);

      amount = toWei(Amount, tokenMap.gcd.decimals);
      if (amount.gt(userBalance)) throw Error('Insufficient amount');

      const userAllowance = await allowance(tokenMap.gcd.address, bridgeAddress);

      if (amount.gt(userAllowance)) {
        const firstTxn = await approve(state.address, tokenMap.gcd.address, bridgeAddress, amount);

        print([textLine({ words: [textWord({ characters: messages.approve })] })]);
        printLink(print, messages.viewTxn, explorerUrl + firstTxn);
      }

      const secondTxn = await bridgeGcdToL2(state.address, amount);

      print([textLine({ words: [textWord({ characters: 'Succesfull bridged $GCD.' })] })]);
      printLink(print, messages.viewTxn, explorerUrl + secondTxn);

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
  description: `${Prefix.PREFIX}${UpdatingCommand.BRIDGE} <amount> gcd  | [UNAUDITED]`,
});
