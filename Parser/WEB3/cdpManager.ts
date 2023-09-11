import cdpManagerAbi from './ABI/cdpManager01.json';
import vaultAbi from './ABI/vaultGcd.json';
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import Big from 'big.js';

declare const window: any;

export const calculateBorowedStablecoin = async (
  userBalance: Big,
  percentRisk: number,
  icr: number,
): Promise<Big> => {
  let ICR = Big(icr);
  let risk = Big(percentRisk);
  return userBalance.mul(ICR).mul(risk).round();
};

export const getLiquidationPrice = async (debt: Big, deposit: Big, lr: number): Promise<Big> => {
  return debt.div(lr).div(deposit);
};

export const getCollateral = async (
  vaultAddress: string,
  tokenAddress: string,
  userAddress: string,
): Promise<Big> => {
  try {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(vaultAbi as AbiItem[], vaultAddress);
    let collateralAmount: Big = await contract.methods
      .collaterals(tokenAddress, userAddress)
      .call();
    return collateralAmount;
  } catch (e) {
    throw new Error(e);
  }
};

export const join = async (
  cdpManager: string,
  userAddress: string,
  assetAddress: string,
  assetAmount: Big,
  gcdAmount: Big,
): Promise<string> => {
  try {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(cdpManagerAbi as AbiItem[], cdpManager);
    let txn = await contract.methods
      .join(assetAddress, assetAmount.toFixed(), gcdAmount.toFixed())
      .send({ from: userAddress });
    return txn.transactionHash;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

export const join_Eth = async (
  cdpManager: string,
  userAddress: string,
  payableAmount: Big,
  gcdAmount: Big,
): Promise<string> => {
  try {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(cdpManagerAbi as AbiItem[], cdpManager);
    let txn = await contract.methods
      .join_Eth(gcdAmount.toFixed())
      .send({ from: userAddress, value: payableAmount });
    return txn.transactionHash;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

export const exit = async (
  cdpManager: string,
  userAddress: string,
  assetAddress: string,
  assetAmount: Big,
  gcdAmount: Big,
): Promise<string> => {
  try {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(cdpManagerAbi as AbiItem[], cdpManager);
    let txn = await contract.methods
      .exit(assetAddress, assetAmount.toFixed(), gcdAmount.toFixed())
      .send({ from: userAddress });
    return txn.transactionHash;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

export const exit_Eth = async (
  cdpManager: string,
  userAddress: string,
  assetAmount: Big,
  gcdAmount: Big,
): Promise<string> => {
  try {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(cdpManagerAbi as AbiItem[], cdpManager);
    let txn = await contract.methods
      .exit_Eth(assetAmount.toFixed(), gcdAmount.toFixed())
      .send({ from: userAddress });
    return txn.transactionHash;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};
