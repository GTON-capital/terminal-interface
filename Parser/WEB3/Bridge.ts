import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { bridgeAddress } from '../../config/config';
import bridgeAbi from './ABI/bridge.json';
import Big from 'big.js';
import { isTestnet } from '../../config/config';
declare const window: any;

export const bridgeToL2 = async (
  userAddress: string,
  tokenAmount: Big,
  tokenAddressL1: string,
  tokenAddressL2: string,
): Promise<string> => {
  const depositErc20 = '2000000000000000';
  const gcNetId = isTestnet ? '50021' : '1000';
  const gas = 0;
  const data = '0x00';
  try {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(bridgeAbi as AbiItem[], bridgeAddress);
    let txn = await contract.methods
      .depositERC20ByChainId(
        gcNetId,
        tokenAddressL1,
        tokenAddressL2,
        tokenAmount.toFixed(),
        gas,
        data,
      )
      .send({ from: userAddress, value: depositErc20 });
    return txn.transactionHash;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};
