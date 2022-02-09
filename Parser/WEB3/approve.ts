// import { ethers, BigNumber as OldBigNumber } from 'ethers';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import BigNumber from 'bignumber.js';
import {
  tokenAddress as gton,
  stakingAddress,
} from '../../config/config';

import ERC20_ABI from './ABI/erc20.json';
import { validate } from './validate';

declare const window: any;

export const approve = async (
  tokenAddress: string,
  spender: string,
  amount: BigNumber,
): Promise<string> => {
  await validate();
  const web3 = new Web3(window.ethereum);
  const signer = (await web3.eth.getAccounts())[0]
  const contract = new web3.eth.Contract(ERC20_ABI as AbiItem[], gton);
  const tx = await contract.methods.approve(spender, amount).send(
    { from: signer }
  );
  return tx.transactionHash;
};

export const allowance = async (): Promise<BigNumber> => {
  await validate();
  const web3 = new Web3(window.ethereum);
  const signer = (await web3.eth.getAccounts())[0]
  const contract = new web3.eth.Contract(ERC20_ABI as AbiItem[], gton);
  const userBalance: string = await contract.methods.allowance(signer, stakingAddress).call();
  return new BigNumber(userBalance);
};
