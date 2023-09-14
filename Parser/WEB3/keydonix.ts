import { getProof, Proof } from '@keydonix/uniswap-oracle-sdk';
import * as OracleSdkAdapter from '@keydonix/uniswap-oracle-sdk-adapter';

declare const window: any;

export async function formProof(
  pairAddress: string,
  denominatorAddress: string,
  blockNumber: number,
): Promise<Proof> {
  const getStorageAtAdapter = OracleSdkAdapter.getStorageAtFactory(window.ethereum);
  const getProofAdapter = OracleSdkAdapter.getProofFactory(window.ethereum);
  const getBlockByNumberAdapter = OracleSdkAdapter.getBlockByNumberFactory(window.ethereum);

  return getProof(
    getStorageAtAdapter,
    getProofAdapter,
    getBlockByNumberAdapter,
    BigInt(pairAddress),
    BigInt(denominatorAddress),
    BigInt(blockNumber),
  );
}
