import cdpManagerAbi from './ABI/cdpManager01.json';
import cdpManagerFallbackAbi from './ABI/cdpManager01_fallback.json';
import vaultAbi from './ABI/vaultGcd.json';
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import Big from 'big.js';
import { formProof } from './keydonix';

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

export const joinFallback = async (
  cdpManagerFallbackAddress: string,
  pairAddress: string,
  wethAddress: string,
  userAddress: string,
  assetAddress: string,
  assetAmount: Big,
  stablecoinAmount: Big,
): Promise<string> => {
  const web3 = new Web3(window.ethereum);

  const blockNumber = await web3.eth.getBlockNumber();

  const proof = await formProof(pairAddress, wethAddress, blockNumber - 100);

  const contract = new web3.eth.Contract(
    cdpManagerFallbackAbi as AbiItem[],
    cdpManagerFallbackAddress,
  );

  let txn = await contract.methods
    .join(assetAddress, assetAmount.toFixed(), stablecoinAmount.toFixed(), proof)
    .send({ from: userAddress });
  return txn.transactionHash;
};

export const join = async (
  cdpManager: string,
  userAddress: string,
  assetAddress: string,
  assetAmount: Big,
  stablecoinAmount: Big,
): Promise<string> => {
  try {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(cdpManagerAbi as AbiItem[], cdpManager);
    let txn = await contract.methods
      .join(assetAddress, assetAmount.toFixed(), stablecoinAmount.toFixed())
      .send({ from: userAddress });
    return txn.transactionHash;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

export const joinEth = async (
  cdpManager: string,
  userAddress: string,
  payableAmount: Big,
  stablecoinAmount: Big,
): Promise<string> => {
  try {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(cdpManagerAbi as AbiItem[], cdpManager);
    let txn = await contract.methods
      .join_Eth(stablecoinAmount.toFixed())
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
  stablecoinAmount: Big,
): Promise<string> => {
  try {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(cdpManagerAbi as AbiItem[], cdpManager);
    let txn = await contract.methods
      .exit(assetAddress, assetAmount.toFixed(), stablecoinAmount.toFixed())
      .send({ from: userAddress });
    return txn.transactionHash;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

export const exitEth = async (
  cdpManager: string,
  userAddress: string,
  assetAmount: Big,
  stablecoinAmount: Big,
): Promise<string> => {
  try {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(cdpManagerAbi as AbiItem[], cdpManager);
    let txn = await contract.methods
      .exit_Eth(assetAmount.toFixed(), stablecoinAmount.toFixed())
      .send({ from: userAddress });
    return txn.transactionHash;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

export const exitFallback = async (
  cdpManagerFallbackAddress: string,
  pairAddress: string,
  wethAddress: string,
  userAddress: string,
  assetAddress: string,
  assetAmount: Big,
  stablecoinAmount: Big,
): Promise<string> => {
  const web3 = new Web3(window.ethereum);

  const blockNumber = await web3.eth.getBlockNumber();

  const proof = await formProof(pairAddress, wethAddress, blockNumber - 100);

  const contract = new web3.eth.Contract(
    cdpManagerFallbackAbi as AbiItem[],
    cdpManagerFallbackAddress,
  );

  const txn = await contract.methods
    .exit(assetAddress, assetAmount.toFixed(), stablecoinAmount.toFixed(), proof)
    .send({ from: userAddress });

  return txn.transactionHash;
};
