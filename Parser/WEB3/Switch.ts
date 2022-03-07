import { fantomNet } from '../../config/config';
import { TerminalError } from '../../Errors/ErrorCodes';

declare const window: any;

const switchChain = async (): Promise<void> => {
  if (!window.ethereum || !window.ethereum!.isMetaMask) {
    throw new TerminalError({ code: 'NO_METAMASK' });
  }
  if (!window.ethereum.request) {
    throw new TerminalError({ code: 'METAMASK_WRONG_NETWORK' });
  }
  const {
    chainIdHex,
    chainName,
    rpcUrls,
    nativeCurrency,
    blockExplorerUrls,
  } = fantomNet;

  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: chainIdHex,
        chainName,
        rpcUrls,
        nativeCurrency,
        blockExplorerUrls,
      },
    ],
  });
};

export default switchChain;
