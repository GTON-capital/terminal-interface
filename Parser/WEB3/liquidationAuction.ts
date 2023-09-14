import Web3 from 'web3';

import liquidationAuction from './ABI/liquidationAuction.json';
import { AbiItem } from 'web3-utils';

declare const window: any;

export async function buyout(
  auctionAddress: string,
  asset: string,
  owner: string,
  sender: string,
): Promise<string> {
  const web3 = new Web3(window.ethereum);

  const auction = new web3.eth.Contract(liquidationAuction as AbiItem[], auctionAddress);

  const txn = await auction.methods.buyout(asset, owner).send({ from: sender });
  return txn.transactionHash;
}
