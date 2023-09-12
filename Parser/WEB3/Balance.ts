import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import Big from 'big.js';
import ERC20_ABI from './ABI/erc20.json';
import USD_ORACLE_ABI from './ABI/UsdOracle.json';
import KEYDONIX_USD_ORACLE_ABI from './ABI/KeydonixUsdOracle.json';
import ORACLE_REGISTRY_ABI from './ABI/OracleRegistry.json';
import { gtonUniswapV3Oracle, wEthAndUsdcUniswapV3Oracle } from '../../config/config';
import { SimulatedToken, Token } from '../../config/types';
import { formProof } from './keydonix';

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
  contracts: SimulatedToken,
  collateralToken: Token,
  wethAddress: string,
  amount: Big,
): Promise<Big> {
  const isFallbackCompatible = contracts.fallbackCollaterals.includes(collateralToken.name);

  const Q112 = '5192296858534827628530496329220096';

  const web3 = new Web3(window.ethereum);

  const oracleRegistry = new web3.eth.Contract(
    ORACLE_REGISTRY_ABI as AbiItem[],
    contracts.oracleRegistryAddress,
  );
  const tokenAddress = collateralToken.isNative ? wethAddress : collateralToken.address;
  const oracleAddress = await oracleRegistry.methods.oracleByAsset(tokenAddress).call();

  if (!collateralToken.isNative && isFallbackCompatible) {
    const blockNumber = await web3.eth.getBlockNumber();

    const proof = await formProof(
      contracts.fallbackWethPairs[collateralToken.name],
      wethAddress,
      blockNumber - 100,
    );
    const contract = new web3.eth.Contract(KEYDONIX_USD_ORACLE_ABI as AbiItem[], oracleAddress);

    const collateralBalance = await contract.methods
      .assetToUsd(tokenAddress, amount.toFixed(), proof)
      .call();
    return Big(collateralBalance).div(Q112);
  } else {
    const contract = new web3.eth.Contract(USD_ORACLE_ABI as AbiItem[], oracleAddress);

    const collateralBalance = await contract.methods
      .assetToUsd(tokenAddress, amount.toFixed())
      .call();
    return Big(collateralBalance).div(Q112);
  }
}

export default balance;
