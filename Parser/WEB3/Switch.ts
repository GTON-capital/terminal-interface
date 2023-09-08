import { BigNumber } from 'ethers';
import { ApplicationConfig, NativeCurrency } from '../../config/types';

declare const window: any;

const switchChain = async (config: ApplicationConfig, network: string): Promise<void> => {
  const { id, name, rpcUrl, explorerUrl, nativeCurrency } = config.chainsByName[network];
  const chainIdHex = `0x${id.toString(16)}`;

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
              chainName: name,
              rpcUrls: [rpcUrl],
              nativeCurrency,
              blockExplorerUrls: [explorerUrl],
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
