import Big from 'big.js';
import Web3 from 'web3';
import axios from 'axios';
import { gtonAddress, usdcAddress } from '../../config/config';
import { fromWei } from '../WEB3/API/balance';

import { validate } from './validate';

// USDC -> GTON

declare const window: any;

export const checkSwapAmount = async (amount: Big): Promise<string> => {
  await validate();
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
  await validate();
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
