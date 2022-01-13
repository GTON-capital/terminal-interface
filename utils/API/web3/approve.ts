import { TerminalError } from 'utils/API/errors/TerminalError/TerminalError';
import {
  network,
  tokenAddress as gton,
  stakingAddress,
} from 'config/config';
import { ethers, BigNumber as OldBigNumber } from 'ethers';
import BigNumber from 'bignumber.js';
import ERC20_ABI from './abi/erc20.json';
import { migrateBigNumber } from '../balance/balance';

export const approve = async (
  tokenAddress: string,
  spender: string,
  amount: string,
): Promise<string> => {
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
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
  const tx = await contract.approve(spender, amount);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

export const allowance = async (): Promise<BigNumber> => {
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
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(gton, ERC20_ABI, signer);
  const userBalance: OldBigNumber = await contract.allowance(signer.getAddress(), stakingAddress);
  return migrateBigNumber(userBalance);
};
