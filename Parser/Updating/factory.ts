import { Operands, Parser, parser } from '../Common/parser';
import { TerminalState } from '../../State/types';
import { commonOperationsFactory } from '../Common/factory';
import { ApplicationConfig } from '../../config/types';
import { HelpWorker } from './comands/help';
import { BorrowGcdWorker } from './comands/borrow';
import { ExitGcdWorker } from './comands/exit';
import { BridgeToL2Worker } from './comands/bridge';

const UpdatingMap: Operands = {
  borrow: BorrowGcdWorker,
  repay: ExitGcdWorker,
  bridge: BridgeToL2Worker,
};

export default function updateParserFactory(
  config: ApplicationConfig,
  state: TerminalState,
): Parser {
  const operands: Operands = {
    ...UpdatingMap,
    ...commonOperationsFactory(state),
  };

  const help = HelpWorker(operands);

  return parser(config, { ...operands, help });
}
