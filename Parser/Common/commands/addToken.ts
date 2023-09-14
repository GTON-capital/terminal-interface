import { textLine, textWord } from '@gton-capital/crt-terminal';
import { validateConnectedWallet } from '../../../State/validate';
import addToken from '../../WEB3/addTokenToMM';
import messages, { Commands, Prefix } from '../../../Messages/Messages';
import { Worker } from '../worker';

export const AddTokenWorker = new Worker(
  async ({ print }, TokenName, [nonValidatedState], config) => {
    const state = validateConnectedWallet(config, nonValidatedState);
    const token = state.chain.tokens[TokenName];
    if (!token || token.isNative) {
      const availableTokens = Array.from(
        Object.entries(state.chain.tokens)
          .filter(([_, token]) => !token.isNative)
          .map(([name]) => name),
      );
      throw Error(`Available tokens are: ${availableTokens.join(',')}`);
    }

    await addToken(token);
    print([textLine({ words: [textWord({ characters: messages.addToken })] })]);
  },
  'Error adding token to Meramask',
).setDescription({
  description: `${Prefix.PREFIX}${Commands.ADD_TOKEN} <token>  - add tokens to metamask`,
  getOptions(_, chain) {
    return {
      token: Object.keys(chain!!.tokens).map((token) => token.toLowerCase()),
    };
  },
});
