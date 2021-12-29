import { TerminalError } from 'utils/API/errors/TerminalError/TerminalError';
import {
  tokenAddress,
  network,
  faucetAddress,
} from 'config/config';
import { ethers } from 'ethers';
import FAUCET_ABI from './abi/faucet.json';

const faucet = async (): Promise<string> => {
  if (!window.ethereum || !window.ethereum!.isMetaMask) {
    throw new TerminalError({ code: 'NO_METAMASK' });
  }
  if (!window.ethereum.request) {
    throw new TerminalError({ code: 'METAMASK_WRONG_NETWORK' });
  }
  const chainId: string = await window.ethereum.request({ method: 'net_version' });
  if (chainId !== network) {
    throw new TerminalError({ code: 'METAMASK_WRONG_NETWORK' });
  }
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  const signer = provider.getSigner(0);
  const contract = new ethers.Contract(faucetAddress, FAUCET_ABI, signer);
  const tx = await contract.faucet(tokenAddress);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

export default faucet;
