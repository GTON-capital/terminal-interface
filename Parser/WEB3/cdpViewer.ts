import Big from 'big.js';
import Web3 from 'web3';

import cdpViewerAbi from './ABI/cdpViewer.json';
import vaultAbi from './ABI/vaultGcd.json';

import { Token } from '../../config/types';
import { AbiItem } from 'web3-utils';
import { getLiquidationRatio } from './vaultManager';
import { getLiquidationPrice } from './cdpManager';

type LiquidationInfo = {
  block: number;
  assetToOwner: Big;
  assetToBuyer: Big;
  price: Big;
};

export type CDPInfo = {
  asset: string;
  owner: string;
  collateral: Big;
  debt: Big;
  liquidationPrice: Big;
  liquidation?: LiquidationInfo;
};

type LiquidationParams = {
  liquidationBlock: number;
  debtWithPenalty: Big;
  devaluationPeriod: number;
};

declare const window: any;

type CDPRegularInfo = Omit<CDPInfo, 'liquidation'> & LiquidationParams;

export async function getCdpInfo(
  contracts: {
    wethAddress: string;
    cdpViewerAddress: string;
    vaultAddress: string;
    vaulManagerParametersAddress: string;
  },
  asset: Token,
  owner: string,
): Promise<CDPInfo> {
  const web3 = new Web3(window.ethereum);

  const regularInfo = await getCdpRegularInfo(
    web3,
    asset,
    owner,
    contracts.wethAddress,
    contracts.cdpViewerAddress,
    contracts.vaultAddress,
    contracts.vaulManagerParametersAddress,
  );

  if (regularInfo.liquidationBlock > 0) {
    const currentBlock = await web3.eth.getBlockNumber();

    const liquidationInfo = await getCdpLiqidationInfo(
      web3,
      contracts.vaultAddress,
      regularInfo,
      currentBlock,
    );

    return {
      ...regularInfo,
      liquidation: liquidationInfo,
    };
  }

  return {
    ...regularInfo,
  };
}

async function getCdpRegularInfo(
  web3: Web3,
  asset: Token,
  owner: string,
  wethAddress: string,
  cdpViewerAddress: string,
  vaultAddress: string,
  vaulManagerParametersAddress: string,
): Promise<CDPRegularInfo> {
  const tokenAddress = asset.isNative ? wethAddress : asset.address;

  const viewer = new web3.eth.Contract(cdpViewerAbi as AbiItem[], cdpViewerAddress);
  const vault = new web3.eth.Contract(vaultAbi as AbiItem[], vaultAddress);

  const response = await viewer.methods.getCollateralParameters(tokenAddress, owner).call();

  const totalDebt = Big(response.cdp.totalDebt);
  const liquidationFee = Big(response.cdp.liquidationFee);

  const debtWithPenalty = totalDebt.add(totalDebt.mul(liquidationFee).div(100)).round();

  const liquidationBlock = await vault.methods.liquidationBlock(tokenAddress, owner).call();

  const liquidationRatio = await getLiquidationRatio(vaulManagerParametersAddress, tokenAddress);

  const debt = Big(response.cdp.debt.toString());
  const collateral = Big(response.cdp.collateral.toString());

  return {
    asset: tokenAddress,
    owner,
    collateral,
    debt,
    devaluationPeriod: Number.parseInt(response.devaluationPeriod.toString()),
    debtWithPenalty,
    liquidationBlock: Number.parseInt(liquidationBlock.toString()),
    liquidationPrice: collateral.eq(0)
      ? Big(0)
      : await getLiquidationPrice(debt, collateral, liquidationRatio),
  };
}

async function getCdpLiqidationInfo(
  web3: Web3,
  vaultAddress: string,
  info: CDPRegularInfo,
  blockNumber: number,
): Promise<LiquidationInfo> {
  const vault = new web3.eth.Contract(vaultAbi as AbiItem[], vaultAddress);

  const liquidationPrice = vault.methods.liquidationPrice(info.asset, info.owner);

  const blockPast = blockNumber - info.liquidationBlock;

  if (blockPast < info.devaluationPeriod) {
    const collateralPrice = Big(liquidationPrice)
      .mul(info.devaluationPeriod - blockPast)
      .div(info.devaluationPeriod)
      .round();

    if (collateralPrice.gt(info.debtWithPenalty)) {
      const collateralToBuyer = info.collateral
        .mul(info.debtWithPenalty)
        .div(collateralPrice)
        .round();
      const collateralToOwner = info.collateral.sub(collateralToBuyer);

      return {
        block: info.liquidationBlock,
        assetToBuyer: collateralToBuyer,
        assetToOwner: collateralToOwner,
        price: info.debtWithPenalty,
      };
    } else {
      return {
        block: info.liquidationBlock,
        assetToBuyer: info.collateral,
        assetToOwner: Big(0),
        price: collateralPrice,
      };
    }
  }

  return {
    block: info.liquidationBlock,
    assetToBuyer: info.collateral,
    assetToOwner: Big(0),
    price: Big(0),
  };
}
