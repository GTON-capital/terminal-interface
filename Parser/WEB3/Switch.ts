import { chain } from '../../config/config';
import { TerminalError } from '../../Errors/ErrorCodes';
import { mmChains } from '../WEB3/chains';
declare const window: any;

const switchChain = async (network: string): Promise<void> => {
  if (!window.ethereum || !window.ethereum!.isMetaMask) {
    throw new TerminalError({ code: 'NO_METAMASK' });
  }
  if (!window.ethereum.request) {
    throw new TerminalError({ code: 'METAMASK_WRONG_NETWORK' });
  }
  const { chainIdHex, chainName, rpcUrls, nativeCurrency, blockExplorerUrls } = mmChains[network];

  if (chainIdHex === '0x1') {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: chainIdHex,
          },
        ],
      });
      return;
    } catch (e) {
      throw new Error(e);
    }
  }
  try {
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
  } catch (e) {
    throw new Error(e);
  }
};

export default switchChain;
