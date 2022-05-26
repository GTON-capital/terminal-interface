import { TerminalError } from '../../Errors/ErrorCodes';
import { network } from '../../config/config';

declare const window: any;

export async function validate() {
  if (!window.ethereum || !window.ethereum!.isMetaMask) {
    throw new TerminalError({ code: 'NO_METAMASK' });
  }

  if (!window.ethereum.request) {
    throw new TerminalError({ code: 'NO_METAMASK' });
  }
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  if (accounts.length === 0) {
    throw new TerminalError({ code: 'NO_METAMASK' });
  }
  const chainId: string = await window.ethereum.request({ method: 'net_version' });
  // if (chainId !== network) {
  //   throw new TerminalError({ code: 'METAMASK_WRONG_NETWORK' });
  // }
}
