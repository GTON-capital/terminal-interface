import { utils, BigNumber } from 'ethers';
import { TerminalError } from '../../Errors/ErrorCodes';

declare const window: any;

const { isAddress, getAddress } = utils;

const connectMetamask = async (): Promise<[string, number]> => {
  let accounts;
  if (!window.ethereum || !window.ethereum.isMetaMask) {
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
  const chainId: string = await window.ethereum.request({ method: 'eth_chainId' });
  if (!isAddress(account)) {
    throw new TerminalError({ code: 'GET_ADDRESS_FAILED' });
  }

  return [getAddress(account).toLocaleLowerCase(), BigNumber.from(chainId).toNumber()];
};

export default connectMetamask;
