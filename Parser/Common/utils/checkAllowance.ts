import Big from 'big.js';
import messages from '../../../Messages/Messages';
import { State } from '../../../State/types';
import { allowance, approve } from '../../WEB3/approve';
import { printLink } from '../../common';
import { EventQueueReturnType, textLine, textWord } from '@gton-capital/crt-terminal';

export async function checkAllownace(
  print: EventQueueReturnType['handlers']['print'],
  state: State,
  tokenAddress: string,
  spenderAddress: string,
  amountThreshold: Big,
  approveAmount?: Big,
): Promise<void> {
  const userAllowanceTokenDeposit = await allowance(tokenAddress, spenderAddress);

  if (amountThreshold.gt(userAllowanceTokenDeposit)) {
    const firstTxn = await approve(
      state.address,
      tokenAddress,
      spenderAddress,
      approveAmount || amountThreshold,
    );

    print([textLine({ words: [textWord({ characters: messages.approve })] })]);
    printLink(print, messages.viewTxn, state.chain.explorerUrl + firstTxn);
  }
}
