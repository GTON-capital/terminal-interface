import Big from 'big.js';
import { AbiItem } from 'web3-utils'
import Web3 from "web3";
import BONDING from '../ABI/bonding.json';
import { validate } from '../validate';

declare const window: any;

export const mint = async (userAddress: string, address: string, amount: Big): Promise<number> => {
  await validate();
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(BONDING as AbiItem[], address);
  const id = await contract.methods.mint(amount.toFixed()).send({from: userAddress})
  return id;
};
export const mintFTM = async (userAddress: string, address: string, amount: Big): Promise<number> => {
    await validate();
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(BONDING as AbiItem[], address);
    const id = await contract.methods.mint(amount.toFixed()).send({from: userAddress, value: amount.toFixed()})
    return id;
};
