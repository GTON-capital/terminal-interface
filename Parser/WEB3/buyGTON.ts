import { ethers, utils } from 'ethers';
import { fromWei, toWei } from 'web3-utils';
import {
  tokenAddress,
  spiritswaprouteraddress,
} from '../../config/config';
import SpiritSwapRouterABI from './ABI/SpiritSwapRouter.json';
import { validate } from './validate';

const path = [ '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', '0xC1Be9a4D5D45BeeACAE296a7BD5fADBfc14602C4' ];
// WFTM -> GTON

declare const window: any;

const buy = async (amount, gtonftmprice): Promise<string> => {
  await validate();
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  const signer = provider.getSigner(0);
  const contract = new ethers.Contract(spiritswaprouteraddress, SpiritSwapRouterABI, signer);

  gtonftmprice = toWei(gtonftmprice.toString());
  
  const tx = await contract.swapExactETHForTokens(amount, 
                                                path, 
                                                signer.getAddress(), 
                                                '1649976686', { value: gtonftmprice.toString(), })
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

export default buy;