import { textLine, textWord } from '@gton-capital/crt-terminal';
import { validateConnectedWallet } from '../../../State/validate';
import switchChain from '../../WEB3/Switch';
import messages, { Commands, Prefix } from '../../../Messages/Messages';
import { ApplicationConfig } from '../../../config/types';
import { Worker } from '../worker';

export const SwitchChainWorker = new Worker(
  async ({ print }, chainName, [nonValidatedState, setState], config: ApplicationConfig) => {
    const state = validateConnectedWallet(config, nonValidatedState);

    const availableChains = Array.from(Object.keys(config.chainsByName));

    if (!availableChains.includes(chainName)) {
      throw new Error(
        `Chain with name ${chainName} not supported. Available chains ${availableChains.join(',')}`,
      );
    }

    if (chainName === state.chain.name) {
      throw new Error(
        `You already connected to ${chainName} chain. Available chains ${availableChains.join(
          ',',
        )}`,
      );
    }

    await switchChain(config, chainName);
    setState({
      ...state,
      chain: config.chainsByName[chainName],
    });
    print([textLine({ words: [textWord({ characters: messages.switchChain(chainName) })] })]);
  },
  'Error adding token to Meramask',
).setDescription({
  description: `${Prefix.PREFIX}${Commands.SWITCH} <chain> - switch to specified chain`,
  getOptions(config, chain) {
    return {
      chain: Object.keys(config.chainsByName)
        .map((c) => c.toLowerCase())
        .filter((c) => c !== chain!!.name.toLowerCase()),
    };
  },
});
