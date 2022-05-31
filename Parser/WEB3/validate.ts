import { TerminalError } from '../../Errors/ErrorCodes';
import { network, claimNetwork, chain } from '../../config/config';
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
  const chainId: string = await window.ethereum.request({ method: 'net_version' });
  if (chainId !== network && chainId !== claimNetwork) {
    throw new TerminalError({ code: 'METAMASK_WRONG_NETWORK' });
  }
}

//'https://mainnet.infura.io/v3/a0ac7126b5af4519ad7c2b62f98d6139'
export async function isCurrentChain(chainId: string): Promise<Boolean> {
  const web3 = new Web3(window.ethereum);
  let currentChainId = await web3.eth.net.getId();
  return currentChainId == +chainId;
}
