import { Operands, Parser, parser } from '../Common/parser';
import { TerminalState } from '../../State/types';
import { commonOperationsFactory } from '../Common/factory';
import { ApplicationConfig } from '../../config/types';
import { HelpWorker } from '../Common/commands/help';
import { IWorker } from '../Common/worker';

export default function rootParserFectory(config: ApplicationConfig, state: TerminalState): Parser {
  const operands: Operands = {
    ...commonOperationsFactory(state),
  };

  const help = HelpWorker(operands);

  return parser(config, { ...operands, help });
}
