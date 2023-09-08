import { TerminalState } from '../../State/types';
import { AddTokenWorker } from './commands/addToken';
import { BalanceWorker } from './commands/balance';
import { ConnectMetamaskWorker } from './commands/connect';
import { SwitchChainWorker } from './commands/switchNetwork';
import { Operands } from './parser';

export function commonOperationsFactory(state: TerminalState): Operands {
  if (!state) {
    return {
      join: ConnectMetamaskWorker,
    };
  }

  return {
    add: AddTokenWorker,
    switch: SwitchChainWorker,
    balance: BalanceWorker,
  };
}
