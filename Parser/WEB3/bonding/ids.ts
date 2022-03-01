import { AbiItem } from 'web3-utils'
import Web3 from "web3";
import {
  storageAddress,
} from '../../../config/config';
import STORAGE from '../ABI/storage.json';
import { validate } from '../validate';

declare const window: any;

const userBondIds = async (): Promise<number[]> => {
  await validate();
  const web3 = new Web3(window.ethereum);
  const signer = (await web3.eth.getAccounts())[0]
  const contract = new web3.eth.Contract(STORAGE as AbiItem[], storageAddress);
  let len = await contract.methods.userIdsLength(signer).call();
  
  const res = []
  while(len > 0) {
      len -= 1;
      res.push(contract.methods.userIds(signer, len).call());
  }
  const result = await Promise.all(res)
  return result;
};

export default userBondIds;