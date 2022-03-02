import { AbiItem } from 'web3-utils'
import Web3 from "web3";
import BigNumber from 'bignumber.js';
import BONDING from '../ABI/bonding.json';
import { validate } from '../validate';

declare const window: any;

export const claim = async (address: string, bondId: BigNumber): Promise<any> => {
    await validate();
    const web3 = new Web3(window.ethereum);
    const signer = (await web3.eth.getAccounts())[0]
    const contract = new web3.eth.Contract(BONDING as AbiItem[], address);
    const tx = await contract.methods.claim(bondId).send({from: signer})
    return tx;
};
