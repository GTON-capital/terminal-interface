import { Token } from './API/addToken';
import { validate } from './validate';

declare const window: any;

async function addToken (token: Token): Promise<void> {
  await validate();
  await ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: token,
    },
  });
};

export default addToken;
