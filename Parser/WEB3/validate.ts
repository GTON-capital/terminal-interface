import { TerminalError } from '../../Errors/ErrorCodes';
import { gtonTokenNetwork, claimNetwork, chain } from '../../config/config';
import Web3 from 'web3';

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
  // This check shouldn't be here, the caller needs to know the correct
  // network that it needs and validate with 'isCorrectChain'

  // const chainId: string = await window.ethereum.request({ method: 'net_version' });
  // if (chainId !== gtonTokenNetwork && chainId !== claimNetwork) {
  //   throw new TerminalError({ code: 'METAMASK_WRONG_NETWORK' });
  // }
}

export async function isCorrectChain(chainId: string): Promise<Boolean> {
  const web3 = new Web3(window.ethereum);
  let currentChainId;
  try {
    currentChainId = await web3.eth.net.getId();
  } catch (e) {
    console.error(e);
    return;
  }
  return currentChainId == +chainId;
}
