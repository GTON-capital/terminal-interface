import Web3 from 'web3';
import Big from 'big.js';
import { AbiItem } from 'web3-utils';
import ERC20_ABI from './ABI/erc20.json';

declare const window: any;

export const approve = async (
  userAddress: string,
  token: string,
  spender: string,
  amount: Big,
): Promise<string> => {
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(ERC20_ABI as AbiItem[], token);
  const tx = await contract.methods.approve(spender, amount.toFixed()).send({ from: userAddress });
  return tx.transactionHash;
};

export const allowance = async (token: string, address: string): Promise<Big> => {
  const web3 = new Web3(window.ethereum);
  const signer = (await web3.eth.getAccounts())[0];
  const contract = new web3.eth.Contract(ERC20_ABI as AbiItem[], token);
  const userBalance: string = await contract.methods.allowance(signer, address).call();
  return Big(userBalance);
};
