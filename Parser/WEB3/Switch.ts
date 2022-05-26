import { chain } from '../../config/config';
import { TerminalError } from '../../Errors/ErrorCodes';

declare const window: any;

const switchChain = async (): Promise<void> => {
  if (!window.ethereum || !window.ethereum!.isMetaMask) {
    throw new TerminalError({ code: 'NO_METAMASK' });
  }
  if (!window.ethereum.request) {
    throw new TerminalError({ code: 'METAMASK_WRONG_NETWORK' });
  }
  const { chainIdHex, chainName, rpcUrls, nativeCurrency, blockExplorerUrls } = chain;

  if (chainIdHex === '0x1') {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: chainIdHex,
        },
      ],
    });
    return;
  }
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
