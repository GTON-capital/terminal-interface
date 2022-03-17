import { AbiItem } from 'web3-utils'
import Big from 'big.js';
import Web3 from "web3";
import BONDING from '../ABI/bonding.json';
import { validate } from '../validate';

declare const window: any;

export const claim = async (userAddress: string, address: string, bondId: number): Promise<any> => {
    await validate();
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(BONDING as AbiItem[], address);
    const tx = await contract.methods.claim(bondId).send({from: userAddress})
    return tx;
};
