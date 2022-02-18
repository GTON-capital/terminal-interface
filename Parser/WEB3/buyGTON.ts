import { ethers, utils } from 'ethers';
import BigNumber from 'bignumber.js';
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

  const CurrentUnixTime = Math.round((new Date()).getTime() / 1000);
  const Deadline = CurrentUnixTime + 1200; // Current time + 20 minutes

  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  const signer = provider.getSigner(0);
  const contract = new ethers.Contract(spiritswaprouteraddress, SpiritSwapRouterABI, signer);

  gtonftmprice =  ethers.utils.parseUnits(gtonftmprice.toString(), 18)
  amount =        ethers.utils.parseUnits(amount.toString(), 18)
  
  const tx = await contract.swapExactETHForTokens(amount, 
                                                path, 
                                                signer.getAddress(), 
                                                Deadline, { value: gtonftmprice.toString(), })
  console.log(tx)
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

export default buy;