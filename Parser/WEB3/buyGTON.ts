import Big from 'big.js';
import Web3 from 'web3';
import axios from 'axios';
import { AbiItem } from 'web3-utils';
import { pairSwapPath as path, routeraddress, gtonAddress, usdcAddress } from '../../config/config';
import { fromWei } from '../WEB3/API/balance';
import SpiritSwapRouterABI from './ABI/SpiritSwapRouter.json';
import { validate } from './validate';

// WFTM -> GTON

declare const window: any;

// const buy = async (amount: Big, gtonftmprice: Big, userAddress: string): Promise<string> => {
//   await validate();

//   const CurrentUnixTime = Math.round(new Date().getTime() / 1000);
//   const Deadline = CurrentUnixTime + 1200; // Current time + 20 minutes
//   const web3 = new Web3(window.ethereum);
//   const contract = new web3.eth.Contract(SpiritSwapRouterABI as AbiItem[], routeraddress);

//   const res = gtonftmprice.mul(amount);

//   const tx = await contract.methods
//     .swapExactETHForTokens(amount.toFixed(), path, userAddress, Deadline)
//     .send({ from: userAddress, value: res.toFixed(0) });
//   return tx.transactionHash;
// };

export const checkSwapAmount = async (amount: Big): Promise<string> => {
  try {
    let status = await axios.get('https://api.1inch.io/v4.0/1/healthcheck');
    if (status) {
      let quote = await axios.get(
        `https://api.1inch.io/v4.0/1/quote?fromTokenAddress=${usdcAddress}&toTokenAddress=${gtonAddress}&amount=${amount}`,
      );
      return `
          You will swap ${fromWei(quote.data.fromTokenAmount, 6)} $USDC on ${fromWei(
        quote.data.toTokenAmount,
      )} $GTON
            `;
      // 6 decimals for usdc
    } else {
      return 'Swap is not available at the moment';
    }
  } catch (e) {
    console.log(e);
  }
};

export const buy = async (amount: Big, userAddress: string): Promise<string> => {
  const web3 = new Web3(window.ethereum);
  try {
    const response = await axios.get(
      `https://api.1inch.io/v4.0/1/swap?fromTokenAddress=${usdcAddress}&toTokenAddress=${gtonAddress}&amount=${amount}&fromAddress=${userAddress}&slippage=0.1`,
    );
    if (response.data) {
      let data = response.data;
      let tx = await web3.eth.sendTransaction(data.tx);
      if (tx.status) {
        return tx.transactionHash;
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export default buy;
