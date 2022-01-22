import { TerminalError } from '../../Errors/ErrorCodes';
import { fantomTestnet } from '../../config/config';

declare const window: any;

const switchChain = async (): Promise<void> => {
  if (!window.ethereum || !window.ethereum!.isMetaMask) {
    throw new TerminalError({ code: 'NO_METAMASK' });
  }
  if (!window.ethereum.request) {
    throw new TerminalError({ code: 'METAMASK_WRONG_NETWORK' });
  }
  const chainId: string = await window.ethereum.request({ method: 'net_version' });
  if (chainId === fantomTestnet.chainId) {
    throw new TerminalError({ code: 'METAMASK_CORRECT_NETWORK' });
  }

  const {
    chainIdHex,
    chainName,
    rpcUrls,
    nativeCurrency,
    blockExplorerUrls,
  } = fantomTestnet;

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