import { Token } from '../../config/types';

declare const window: any;

async function addToken(token: Token): Promise<void> {
  await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: token,
    },
  });
}

export default addToken;
