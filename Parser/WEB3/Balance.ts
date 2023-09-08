import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import Big from 'big.js';
import ERC20_ABI from './ABI/erc20.json';
import UNISWAPV3ORACLE_GTON from './ABI/gtonUniswapV3Oracle.json';
import UNISWAPV3ORACLE_WETH from './ABI/wEthUniswapV3Oracle.json';
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

export const getUniswapBalanceGton = async (
  tokenAddress: string,
  amount: Big,
): Promise<Big | undefined> => {
  const Q112 = '5192296858534827628530496329220096';
  try {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(UNISWAPV3ORACLE_GTON as AbiItem[], gtonUniswapV3Oracle);
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
  console.log(Q112);

  try {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(
      UNISWAPV3ORACLE_WETH as AbiItem[],
      wEthAndUsdcUniswapV3Oracle,
    );
    const collateralBalance = await contract.methods
      .assetToUsd(tokenAddress, amount.toFixed())
      .call();
    return Big(collateralBalance).div(Q112);
  } catch (e) {
    console.log(e);
  }
};

export default balance;
