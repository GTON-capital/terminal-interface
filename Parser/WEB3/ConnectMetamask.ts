import { utils } from 'ethers';
import { TerminalError } from '../../Errors/ErrorCodes';

declare const window: any;

const { isAddress, getAddress } = utils;

const connectMetamask = async () => {
  let accounts;
  if (!window.ethereum || !window.ethereum!.isMetaMask) {
    throw new TerminalError({ code: 'NO_METAMASK' });
  }
  try {
    accounts = await window.ethereum.request!({ method: 'eth_requestAccounts' });
  } catch (e) {
    throw new Error(e.message);
  }
  if (!accounts) {
    accounts = await window.ethereum.enable!();
  }
  if (!accounts) {
    throw new TerminalError({ code: 'METAMASK_RELOGIN' });
  }

  if (!window.ethereum.request) {
    throw new TerminalError({ code: 'METAMASK_WRONG_NETWORK' });
  }

  const account = accounts[0];
  if (!isAddress(account)) {
    throw new TerminalError({ code: 'GET_ADDRESS_FAILED' });
  }

  return getAddress(account).toLocaleLowerCase();
};

export default connectMetamask;
