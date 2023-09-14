import { textLine, textWord } from '@gton-capital/crt-terminal';
import { Commands, Prefix, cdHelp, lsHelp } from '../../../Messages/Messages';
import { Operands } from '../parser';
import { IWorker } from '../worker';

export const HelpWorker = (operands: Operands): IWorker => ({
  execute: ({ print }, _, [nonValidatedState], config) => {
    const prefix = `${Prefix.PREFIX}${Commands.HELP} - this output\n`;
    const commands = Object.values(operands)
      .map((w) => (w.helpText ? w.helpText(config, nonValidatedState?.chain) : null))
      .filter(Boolean)
      .join('\n');

    const postfix = `\n\n${cdHelp}\n${lsHelp}`;

    print([textLine({ words: [textWord({ characters: prefix + commands + postfix })] })]);
  },
});
