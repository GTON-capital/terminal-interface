import { TerminalError } from '../Errors/ErrorCodes';
import { ApplicationConfig } from '../config/types';
import { State, TerminalState } from './types';

export function validateConnectedWallet(config: ApplicationConfig, state: TerminalState): State {
  if (!state) {
    throw new TerminalError({ code: 'NO_METAMASK' });
  }

  const availableChainIds = new Set(Object.keys(config.chains));

  if (!availableChainIds.has(state.chainId.toString())) {
    throw new TerminalError({ code: 'METAMASK_WRONG_NETWORK' });
  }

  return state;
}
