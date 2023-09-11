import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import Big from 'big.js';
import ERC20_ABI from './ABI/erc20.json';
import USD_ORACLE_ABI from './ABI/UsdOracle.json';
import ORACLE_REGISTRY_ABI from './ABI/OracleRegistry.json';
import { gtonUniswapV3Oracle, wEthAndUsdcUniswapV3Oracle } from '../../config/config';

declare const window: any;

const balance = async (
  userAddress: string,
  tokenAddress: string,
  rpc: any = window.ethereum,
): Promise<Big> => {
  const web3 = new Web3(rpc);
  const contract = new web3.eth.Contract(ERC20_ABI as AbiItem[], tokenAddress);
  const userBalance: string = await contract.methods.balanceOf(userAddress).call();
  return Big(userBalance);
};

export const getEthBalance = async (userAddress: string): Promise<Big> => {
  const web3 = new Web3(window.ethereum);
  const ethBalance = await web3.eth.getBalance(userAddress);
  return Big(ethBalance);
};

export async function collateralToStablecoinEquivalent(
  oracleRegistryAddress: string,
  tokenAddress: string,
  amount: Big,
): Promise<Big | undefined> {
  const Q112 = '5192296858534827628530496329220096';

  try {
    const web3 = new Web3(window.ethereum);

    const oracleRegistry = new web3.eth.Contract(
      ORACLE_REGISTRY_ABI as AbiItem[],
      oracleRegistryAddress,
    );
    const oracleAddress = await oracleRegistry.methods.oracleByAsset(tokenAddress).call();

    const contract = new web3.eth.Contract(USD_ORACLE_ABI as AbiItem[], oracleAddress);

    const collateralBalance = await contract.methods
      .assetToUsd(tokenAddress, amount.toFixed())
      .call();
    return Big(collateralBalance).div(Q112);
  } catch (e) {
    console.log(e);
  }
}

export const getUniswapBalanceGton = async (
  tokenAddress: string,
  amount: Big,
): Promise<Big | undefined> => {
  const Q112 = '5192296858534827628530496329220096';
  try {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(USD_ORACLE_ABI as AbiItem[], gtonUniswapV3Oracle);
    const collateralBalance = await contract.methods
      .assetToUsd(tokenAddress, amount.toFixed())
      .call();
    return Big(collateralBalance).div(Q112);
  } catch (e) {
    console.log(e);
  }
};

export const getUniswapBalanceWEthAndUsdc = async (
  tokenAddress: string,
  amount: Big,
): Promise<Big | undefined> => {
  const Q112 = '5192296858534827628530496329220096';

  try {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(USD_ORACLE_ABI as AbiItem[], wEthAndUsdcUniswapV3Oracle);
    const collateralBalance = await contract.methods
      .assetToUsd(tokenAddress, amount.toFixed())
      .call();
    return Big(collateralBalance).div(Q112);
  } catch (e) {
    console.log(e);
  }
};

export default balance;
