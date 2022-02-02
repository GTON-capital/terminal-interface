import { fantomTestnet } from '../../config/config';
import { validate } from './validate';

declare const window: any;

const switchChain = async (): Promise<void> => {
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