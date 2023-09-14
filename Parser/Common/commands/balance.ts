import { textLine, textWord } from '@gton-capital/crt-terminal';
import { validateConnectedWallet } from '../../../State/validate';
import balance, { getEthBalance } from '../../WEB3/Balance';
import Big from 'big.js';
import { fromWei } from '../../WEB3/API/balance';
import messages, { Commands, Prefix } from '../../../Messages/Messages';
import { Token } from '../../../config/types';
import { Worker } from '../worker';

async function getTokenBalance(address: string, token: Token): Promise<Big> {
  if (token.isNative) {
    return fromWei(await getEthBalance(address));
  } else {
    return fromWei(await balance(address, token.address));
  }
}

export const BalanceWorker = new Worker(
  async ({ print }, TokenName, [nonValidatedState], config) => {
    const state = validateConnectedWallet(config, nonValidatedState);

    if (TokenName === 'all') {
      const tokens = Array.from(Object.values(state.chain.tokens));

      for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
        const token = tokens[tokenIndex];
        const amount = await getTokenBalance(state.address, token);

        print([
          textLine({
            words: [
              textWord({
                characters: `${token.symbol}:     ${amount
                  .toFixed(token.decimals)
                  .replace(/0*$/, '')}`,
              }),
            ],
          }),
        ]);
      }
      return;
    } else {
      const token = state.chain.tokens[TokenName];

      if (!token) {
        const availableTokens = Array.from(Object.keys(state.chain.tokens)).concat('all');

        throw new Error(
          `Token ${TokenName} not found in network ${
            state.chain.name
          }. Available token options: ${availableTokens.join(',')}`,
        );
      }
      const amount = await getTokenBalance(state.address, token);

      print([
        textLine({
          words: [
            textWord({
              characters: `${token.symbol}:     ${amount
                .toFixed(token.decimals)
                .replace(/0*$/, '')}`,
            }),
          ],
        }),
      ]);
    }
  },
  'Something went wrong, please try again',
).setDescription({
  description: `${Prefix.PREFIX}${Commands.BALANCE} <token> - get actual erc20 token balance`,
  getOptions(_, chain) {
    return {
      token: Object.keys(chain!!.tokens)
        .map((token) => token.toLowerCase())
        .concat('all'),
    };
  },
});
