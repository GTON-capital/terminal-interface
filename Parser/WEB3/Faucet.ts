import { ethers } from 'ethers';
import { faucetAddress } from '../../config/config';
import FAUCET_ABI from './ABI/faucet.json';
import { validate } from './validate';

declare const window: any;

const faucet = async (tokenAddress: string, userAddress: string): Promise<string> => {
  await validate();

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const signer = provider.getSigner(0);
    const contract = new ethers.Contract(faucetAddress, FAUCET_ABI, signer);
    if (await contract.canIWithdraw(userAddress, tokenAddress)) {
      const tx = await contract.send(tokenAddress);
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } else {
      throw new Error('You`ve got tokens already. Try later!');
    }
  } catch (e) {
    throw new Error(e);
  }
};

export default faucet;
