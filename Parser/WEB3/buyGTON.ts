import { ethers } from 'ethers';
import {
  SpiritSwapRouterAddress,
  FTMGTONSwapPath as path,
} from '../../config/config';
import SpiritSwapRouterABI from './ABI/SpiritSwapRouter.json';
import { validate } from './validate';

// WFTM -> GTON

declare const window: any;

const buy = async (amount, gtonftmprice): Promise<string> => {
  await validate();

  const CurrentUnixTime = Math.round((new Date()).getTime() / 1000);
  const Deadline = CurrentUnixTime + 1200; // Current time + 20 minutes

  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  const signer = provider.getSigner(0);
  const contract = new ethers.Contract(SpiritSwapRouterAddress, SpiritSwapRouterABI, signer);

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