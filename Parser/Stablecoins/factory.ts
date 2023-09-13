import { Operands, Parser, parser } from '../Common/parser';
import { TerminalState } from '../../State/types';
import { commonOperationsFactory } from '../Common/factory';
import { ApplicationConfig } from '../../config/types';
import { HelpWorker } from '../Common/commands/help';
import { BorrowStablecoinWorker } from './comands/borrow';
import { ExitStablecoinWorker } from './comands/exit';
import { BridgeToL2Worker } from './comands/bridge';
import { IWorker } from '../Common/worker';
import { ViewCDPStablecoinWorker } from './comands/view';

function operandsFromState(
  stablecoinName: string,
  _: ApplicationConfig,
  state: NonNullable<TerminalState>,
): Operands {
  const operands: Map<string, IWorker> = new Map();

  if (state.chain.bridgeAddress && state.chain.tokens[stablecoinName].isBridgeable) {
    operands.set('bridge', BridgeToL2Worker(stablecoinName));
  }

  operands.set('borrow', BorrowStablecoinWorker(stablecoinName));
  operands.set('repay', ExitStablecoinWorker(stablecoinName));
  operands.set('view', ViewCDPStablecoinWorker(stablecoinName));

  return Object.fromEntries(operands.entries());
}

export default function stablecoinsParserFactory(
  stablecoinName: string,
  config: ApplicationConfig,
  state: TerminalState,
): Parser {
  const stablecoinsOperands =
    state && state.chain.simulatedTokens[stablecoinName]
      ? operandsFromState(stablecoinName, config, state)
      : {};

  const operands: Operands = {
    ...stablecoinsOperands,
    ...commonOperationsFactory(state),
  };

  const help = HelpWorker(operands);

  return parser(config, { ...operands, help });
}
