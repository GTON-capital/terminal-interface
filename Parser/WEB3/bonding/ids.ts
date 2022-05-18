import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import { storageAddress } from '../../../config/config-test';
import STORAGE from '../ABI/storage.json';
import BONDING from '../ABI/bonding.json';
import { validate } from '../validate';

declare const window: any;

const userBondIds = async (userAddress: string): Promise<number[]> => {
  await validate();
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(STORAGE as AbiItem[], storageAddress);
  let len = await contract.methods.userIdsLength(userAddress).call();

  const res = [];
  while (len > 0) {
    len -= 1;
    res.push(contract.methods.userIds(userAddress, len).call());
  }
  const result = await Promise.all(res);
  return result;
};

export const getBondingByBondId = async (id: string): Promise<string> => {
  await validate();
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(STORAGE as AbiItem[], storageAddress);
  const address = await contract.methods.issuedBy(id).call();
  return address;
};

export const separateBonds = async (ids: number[]): Promise<Array<string[]>> => {
  const web3 = new Web3(window.ethereum);
  const storage = new web3.eth.Contract(STORAGE as AbiItem[], storageAddress);
  const contractsProm = ids.map((e) => storage.methods.issuedBy(e).call());
  const contracts = await Promise.all(contractsProm);
  const isActiveArrayProm = ids.map((e, i) => {
    const bonding = new web3.eth.Contract(BONDING as AbiItem[], contracts[i]);
    const id = ids[i];
    return bonding.methods.isActiveBond(id).call();
  });
  const isActiveArray = await Promise.all(isActiveArrayProm);
  const active = [];
  const claimed = [];
  isActiveArray.forEach((e, i) => {
    if (e) {
      active.push(ids[i]);
    } else {
      claimed.push(ids[i]);
    }
  });
  return [active, claimed];
};

interface BondInfo {
  isActive: boolean;
  issueTimestamp: number;
  releaseTimestamp: number;
  releaseAmount: number;
}

export const bondInfo = async (bondingAddress: string, bondId: string): Promise<BondInfo> => {
  await validate();
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(BONDING as AbiItem[], bondingAddress);
  const info: BondInfo = await contract.methods.activeBonds(bondId).call();
  return info;
};

export default userBondIds;
