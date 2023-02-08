import { textLine, textWord } from '@gton-capital/crt-terminal';
import Big from 'big.js';
import messages from '../../Messages/Messages';
import commonOperators, { printLink, createWorker, parser } from '../common';
import { toWei, fromWei } from '../WEB3/API/balance';
import { tokenMap, collateralsTokenMap } from '../WEB3/API/addToken';
import { isCorrectChain } from '../WEB3/validate';
import balance, {
  getChainlinkedAssetUsdValue,
  getEthBalance,
} from '../WEB3/Balance';
import {
  bscScanUrl,
  rollupL1NetworkId,
  vault,
  bridgeAddress,
  cdpManager01,
} from '../../config/config';
import { getInitialCollateralRatio, getLiquidationRatio } from '../WEB3/vaultManager';
import {
  calculateBorowedGCD,
  getLiquidationPrice,
  join,
  join_Eth,
  exit,
  exit_Eth,
  getCollateral,
} from '../WEB3/cdpManager';
import { bridgeToL2, bridgeGCDToL2 } from '../WEB3/Bridge';
import { allowance, approve } from '../WEB3/approve';

declare const window: any;

enum ErrorCodes {
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  USER_DECLINED_TRANSACTION = 3,
  NOT_ENOUGHT_FUNDS = -32000,
}

const ErrorHandler = (print, Code, Operation) => {
  if (Code === ErrorCodes.INVALID_ARGUMENT) {
    print([
      textLine({
        words: [
          textWord({
            characters: `It looks like you specified the quantity incorrectly, for example: ${Operation} 20`,
          }),
        ],
      }),
    ]);
  }
  if (Code === ErrorCodes.USER_DECLINED_TRANSACTION) {
    print([textLine({ words: [textWord({ characters: 'User declined transaction' })] })]);
  }
  if (Code === ErrorCodes.NOT_ENOUGHT_FUNDS) {
    print([
      textLine({
        words: [textWord({ characters: "You don't have enough funds to buy that many GTON" })],
      }),
    ]);
  }
};

const HelpWorker = ({ print }) => {
  print([textLine({ words: [textWord({ characters: messages.updatingHelpText })] })]);
};

const BorrowGcdWorker = createWorker(async ({ lock, loading, print }, Args, [userAddress]) => {
  const tmpARGS = Args.split(' ');
    if (tmpARGS.length < 7) {
      throw new Error('Invalid input');
    }

  const Amount = tmpARGS[2];
  const TokenName = tmpARGS[3];
  const percentRisk = parseInt(tmpARGS[5]) / 100;

  await borrowGCDWithRisk(Amount, TokenName, percentRisk, userAddress, lock, loading, print);
});

export async function borrowGCDWithRisk(tokenAmount, tokenName, percentRisk, userAddress, lock, loading, print): Promise<Big> {
  const token = tokenName in collateralsTokenMap ? collateralsTokenMap[tokenName] : null;
  if (!token) {
    throw new Error('Wrong symbol, available tokens: busd, usdc');
  }

  if (percentRisk > 1 || percentRisk < 0.01)
      // Converted percent
      throw new Error(`You can't borrow $GCD with less than 0% risk and more than 100%`);

  // For ERC-20 tokens with chainlink oracles, might need a switch in case it changes
  const tokenInWei = toWei(tokenAmount, token.decimals);
  const assetUsdValue = await getChainlinkedAssetUsdValue(token.address, tokenInWei);
  const initialCollateralRatio = await getInitialCollateralRatio(token.address);
  const amountGCDWei = await calculateBorowedGCD(assetUsdValue, percentRisk, initialCollateralRatio);
  const amountGCD = fromWei(amountGCDWei)

  const borrowedAmount = await borrowExactGCDForToken(tokenAmount, tokenName, amountGCD, userAddress, lock, loading, print);
  return borrowedAmount
}

export async function borrowExactGCDForToken(tokenAmount, tokenName, gcdAmount, userAddress, lock, loading, print): Promise<Big> {
  try {
    lock(true);
    loading(true);
    if (!(await isCorrectChain(rollupL1NetworkId))) {
      throw new Error(`Wrong network, switch to BNB Chain, please.`);
    }
    
    let userAllowanceTokenDeposit;
    let userBalance;
    let amount;
    let liquidationPrice;
    let liquidationRatio;

    if (tokenAmount === '0') throw new Error(`You can't borrow $GCD with 0 ${tokenName}`);

    const token = tokenName in collateralsTokenMap ? collateralsTokenMap[tokenName] : null;

    if (!token) {
      throw new Error('Wrong symbol, available tokens: busd, usdc');
    }
    userBalance =
      tokenName === 'eth'
        ? await getEthBalance(userAddress)
        : await balance(userAddress, token.address);

    amount = toWei(tokenAmount, token.decimals);
    const amountGCDWei = toWei(gcdAmount, 18);
    if (amount.gt(userBalance)) throw Error('Insufficient amount');

    liquidationRatio = await getLiquidationRatio(token.address);
    liquidationPrice = await getLiquidationPrice(amountGCDWei, amount, liquidationRatio);

    // print([textLine({ words: [textWord({ characters: `Price of ${tokenName} is $${liquidationPrice}`, })] })]);
    print([
      textLine({
        words: [
          textWord({
            characters: `Liquidation price for ${tokenName} is $${liquidationPrice}`,
          }),
        ],
      }),
    ]);

    if (tokenName !== 'eth') {
      userAllowanceTokenDeposit = await allowance(token.address, vault);

      if (amount.gt(userAllowanceTokenDeposit)) {
        const firstTxn = await approve(userAddress, token.address, vault, amount);

        print([textLine({ words: [textWord({ characters: messages.approve })] })]);
        printLink(print, messages.viewTxn, bscScanUrl + firstTxn);
      }
    } else {
      userAllowanceTokenDeposit = await allowance(tokenMap.weth.address, vault);

      if (amount.gt(userAllowanceTokenDeposit)) {
        const firstTxn = await approve(userAddress, tokenMap.weth.address, vault, amount);

        print([textLine({ words: [textWord({ characters: messages.approve })] })]);
        printLink(print, messages.viewTxn, bscScanUrl + firstTxn);
      }
    }

    const userAllowanceGcd = await allowance(tokenMap.gcd.address, vault);

    if (amountGCDWei.gt(userAllowanceGcd)) {
      const secondTxn = await approve(userAddress, tokenMap.gcd.address, vault, amountGCDWei);

      print([textLine({ words: [textWord({ characters: messages.approve })] })]);
      printLink(print, messages.viewTxn, bscScanUrl + secondTxn);
    }

    if (tokenName !== 'eth') {
      const thirdTrx = await join(userAddress, token.address, amount, amountGCDWei);
      print([textLine({ words: [textWord({ characters: 'Succesfully borrowed $GCD.' })] })]);
      printLink(print, messages.viewTxn, bscScanUrl + thirdTrx);
    } else {
      const fourthTrx = await join_Eth(userAddress, amount, amountGCDWei);
      print([textLine({ words: [textWord({ characters: 'Succesfully borrowed $GCD.' })] })]);
      printLink(print, messages.viewTxn, bscScanUrl + fourthTrx);
    }

    loading(false);
    lock(false);
    return fromWei(amountGCDWei)
  } catch (err) {
    if (err.code in ErrorCodes) {
      ErrorHandler(print, err.code, 'borrowGCD'); // rename errors
    } else {
      print([textLine({ words: [textWord({ characters: err.message })] })]);
    }
    loading(false);
    lock(false);
  }
}

const ExitGcdWorker = async ({ lock, loading, print }, Args, [userAddress]) => {
  try {
    lock(true);
    loading(true);
    if (!(await isCorrectChain(rollupL1NetworkId))) {
      throw new Error(`Wrong network, switch to BNB Chain, please.`);
    }
    const tmpARGS = Args.split(' ');

    if (tmpARGS.length < 5) {
      throw new Error('Invalid input');
    }

    const AmountGCD = tmpARGS[0];
    const AmountBorrowedToken = tmpARGS[4];
    const TokenName = tmpARGS[5];
    let userGcdBalance;
    let amountGcd;
    let amountBorrowedToken;
    let thirdTxn;
    let userCollateralAmount;
    let userAllowanceToken;

    if (AmountGCD < 0 || AmountBorrowedToken < 0) throw new Error(`You can't withdraw 0 tokens`);

    const token = TokenName in tokenMap ? tokenMap[TokenName] : null;

    if (!token) {
      throw new Error('Wrong symbol, available tokens: gton, eth');
    }

    userGcdBalance = await balance(userAddress, tokenMap.gcd.address);
    userCollateralAmount =
      TokenName === 'eth'
        ? await getCollateral(tokenMap.weth.address, userAddress)
        : await getCollateral(token.address, userAddress);

    amountGcd = toWei(AmountGCD);
    if (amountGcd.gt(userGcdBalance)) throw Error('Insufficient amount');

    amountBorrowedToken = toWei(AmountBorrowedToken, token.decimals);

    if (amountBorrowedToken.gt(userCollateralAmount)) throw Error('Insufficient collateral amount');

    const userAllowanceGcd = await allowance(tokenMap.gcd.address, vault);

    if (amountGcd.gt(userAllowanceGcd)) {
      const firstTxn = await approve(userAddress, tokenMap.gcd.address, vault, amountGcd);

      print([textLine({ words: [textWord({ characters: messages.approve })] })]);
      printLink(print, messages.viewTxn, bscScanUrl + firstTxn);
    }

    if (TokenName === 'eth') {
      userAllowanceToken = await allowance(tokenMap.weth.address, cdpManager01);
    } else {
      userAllowanceToken = await allowance(token.address, cdpManager01);
    }

    if (amountBorrowedToken.gt(userAllowanceToken)) {
      const secondTxn =
        TokenName === 'eth'
          ? await approve(userAddress, tokenMap.weth.address, cdpManager01, amountBorrowedToken)
          : await approve(userAddress, token.address, cdpManager01, amountBorrowedToken);

      print([textLine({ words: [textWord({ characters: messages.approve })] })]);
      printLink(print, messages.viewTxn, bscScanUrl + secondTxn);
    }

    thirdTxn =
      TokenName === 'eth'
        ? (thirdTxn = await exit_Eth(userAddress, amountBorrowedToken, amountGcd))
        : (thirdTxn = await exit(userAddress, token.address, amountBorrowedToken, amountGcd));
    print([
      textLine({
        words: [textWord({ characters: `Succesfull repay $GCD and withdraw $${TokenName}.` })],
      }),
    ]);
    printLink(print, messages.viewTxn, bscScanUrl + thirdTxn);

    loading(false);
    lock(false);
  } catch (err) {
    if (err.code in ErrorCodes) {
      ErrorHandler(print, err.code, 'stake');
    } else {
      print([textLine({ words: [textWord({ characters: err.message })] })]);
    }
    loading(false);
    lock(false);
  }
};

const BridgeToL2Worker = async ({ lock, loading, print }, Args, [userAddress]) => {
  const tmpARGS = Args.split(' ');

    if (tmpARGS.length < 2) {
      throw new Error('Invalid input');
    }
    const Amount = tmpARGS[0];
    const TokenName = tmpARGS[1];

    await bridgeTokenToL2(Amount, TokenName, userAddress, lock, loading, print);
};

export async function bridgeTokenToL2(tokenAmount, tokenName, userAddress, lock, loading, print) {
  try {
    lock(true);
    loading(true);

    if (!(await isCorrectChain(rollupL1NetworkId))) {
      throw new Error(`Wrong network, switch to BNB Chain, please.`);
    }

    let userBalance;
    let amount;

    const token = tokenName in tokenMap ? tokenMap[tokenName] : null;

    if (!token || !['GCD', 'GTON'].includes(token.symbol)) {
      throw new Error('Wrong symbol, available tokens: gton, gcd');
    }

    if (tokenAmount === '0') throw new Error(`You can't bridge less then 0`);

    userBalance = await balance(userAddress, token.address);

    amount = toWei(tokenAmount, token.decimals);
    if (amount.gt(userBalance)) throw Error('Insufficient amount');

    const userAllowance = await allowance(token.address, bridgeAddress);

    if (amount.gt(userAllowance)) {
      const firstTxn = await approve(userAddress, token.address, bridgeAddress, amount);

      print([textLine({ words: [textWord({ characters: messages.approve })] })]);
      printLink(print, messages.viewTxn, bscScanUrl + firstTxn);
    }

    let secondTxn;
    if (token.symbol === 'GCD') {
      secondTxn = await bridgeGCDToL2(userAddress, amount);
    } else {
      secondTxn = await bridgeToL2(userAddress, amount, token.address, token.l2address);
    }

    print([
      textLine({ words: [textWord({ characters: `Succesfully bridged $${token.symbol}.` })] }),
    ]);
    printLink(print, messages.viewTxn, bscScanUrl + secondTxn);

    loading(false);
    lock(false);
  } catch (err) {
    if (err.code in ErrorCodes) {
      ErrorHandler(print, err.code, 'stake');
    } else {
      print([textLine({ words: [textWord({ characters: err.message })] })]);
    }
    loading(false);
    lock(false);
  }
}

const UpdatingMap = {
  help: HelpWorker,
  borrow: BorrowGcdWorker,
  repay: ExitGcdWorker,
  bridge: BridgeToL2Worker,
  ...commonOperators,
};

const Parse = parser(UpdatingMap);

export default Parse;
