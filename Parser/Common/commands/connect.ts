import { textLine, textWord } from '@gton-capital/crt-terminal';
import { connect } from '../../common';
import { Worker } from '../worker';
import { Commands, Prefix } from '../../../Messages/Messages';

export const ConnectMetamaskWorker = new Worker(async ({ print }, _, state, config) => {
  try {
    const address = await connect(config, state);
    print([textLine({ words: [textWord({ characters: `Connected successfuly: ${address}` })] })]);
  } catch (e) {
    throw new Error(e);
  }
}, 'Error while connecting metamask, please try again').setDescription({
  description: `${Prefix.PREFIX}${Commands.JOIN} - connect wallet to the terminal`,
});
