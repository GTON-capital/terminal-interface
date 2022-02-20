import { ethers } from 'ethers';
import { FTMGTONSwapPath as path, spiritswaprouteraddress } from '../../config/config';
import SpiritSwapRouterABI from './ABI/SpiritSwapRouter.json';
import { validate } from './validate';

// WFTM -> GTON

declare const window: any;

const buy = async (amount, gtonftmprice): Promise<string> => 
{
  await validate();
  
  const CurrentUnixTime = Math.round((new Date()).getTime() / 1000);
  const Deadline = CurrentUnixTime + 1200; // Current time + 20 minutes

  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  const signer = provider.getSigner(0);
  const contract = new ethers.Contract(spiritswaprouteraddress, SpiritSwapRouterABI, signer);

  // Rounding up to be sure that the transaction will pass
  gtonftmprice = Math.ceil(gtonftmprice * 100)/100;

  gtonftmprice =  ethers.utils.parseUnits(gtonftmprice.toString(), 18);
  amount =        ethers.utils.parseUnits(amount.toString(), 18);

  const tx = await contract.swapExactETHForTokens(amount.toString(), 
                                                path, 
                                                signer.getAddress(), 
                                                Deadline, { value: gtonftmprice.toString(), })
  console.log(tx)
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

export default buy;