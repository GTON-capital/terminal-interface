
import { TerminalError } from '../../Errors/ErrorCodes';
import {
  network,
} from '../../config/config';

declare const window: any;

export async function validate() {
    if (!window.ethereum || !window.ethereum!.isMetaMask) {
        throw new TerminalError({ code: 'NO_METAMASK' });
      }
      if (!window.ethereum.request) {
        throw new TerminalError({ code: 'METAMASK_WRONG_NETWORK' });
      }
      const chainId: string = await window.ethereum.request({ method: 'net_version' });
      if (chainId !== network) {
        throw new TerminalError({ code: 'METAMASK_WRONG_NETWORK' });
      }
}