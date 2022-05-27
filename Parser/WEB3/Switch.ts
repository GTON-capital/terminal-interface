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

  network = network.toLowerCase();

  const { chainIdHex, chainName, rpcUrls, nativeCurrency, blockExplorerUrls } = mmChains[network];
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: chainIdHex,
        },
      ],
    });
  } catch (e) {
    if (e.code === 4902) {
      // 4902 is the error code for attempting to switch to an unrecognized chainId
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
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [
              {
                chainId: chainIdHex,
              },
            ],
          });
        } catch (e) {
          throw new Error(e.message);
        }
      }
    } else {
      throw new Error(e.message);
    }
  }
};

export default switchChain;
