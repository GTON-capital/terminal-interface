import { EventQueueReturnType, textLine, textWord } from '@gton-capital/crt-terminal';
import notFoundStrings from '../../Errors/notfound-strings';
import { IWorker } from './worker';
import { TerminalStateWithDispatch } from '../../State/types';
import { ApplicationConfig } from '../../config/types';

export type Operands = Record<string, IWorker>;
export type Parser = (
  queue: EventQueueReturnType,
  state: TerminalStateWithDispatch,
  command: string,
) => Promise<void>;

export function parser(config: ApplicationConfig, operands: Operands): Parser {
  return async (queue, state, command) => {
    const { print } = queue.handlers;
    const Command = command.split(' ')[0].trim().toLowerCase();
    // split was replaced by substring because of the buy command, which assumes two parameters
    const Arg = command.substring(command.indexOf(' ')).replace(' ', '');

    try {
      // Handle incorrect command
      if (!(Command in operands))
        throw Error(notFoundStrings[Math.floor(Math.random() * notFoundStrings.length)]);
      operands[Command].execute(queue.handlers, Arg, state, config);
    } catch (err) {
      print([textLine({ words: [textWord({ characters: err.message })] })]);
    }
  };
}
