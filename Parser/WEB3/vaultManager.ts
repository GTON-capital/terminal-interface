import vaultManagerParametersAbi from './ABI/vaultManagerParametersAbi.json';
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';

declare const window: any;

export const getInitialCollateralRatio = async (
  vaultManagerParameters: string,
  tokenAddress: string,
): Promise<number> => {
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(
    vaultManagerParametersAbi as AbiItem[],
    vaultManagerParameters,
  );
  const initialCollateralRation = await contract.methods
    .initialCollateralRatio(tokenAddress)
    .call();
  return initialCollateralRation / 100;
};

export const getLiquidationRatio = async (
  vaultManagerParameters: string,
  tokenAddress: string,
): Promise<number> => {
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(
    vaultManagerParametersAbi as AbiItem[],
    vaultManagerParameters,
  );
  const liquidationRatio = await contract.methods.liquidationRatio(tokenAddress).call();
  return liquidationRatio / 100;
};
