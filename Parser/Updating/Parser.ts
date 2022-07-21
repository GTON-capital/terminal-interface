import { textLine, textWord } from 'crt-terminal';
import messages from '../../Messages/Messages';
import commonOperators, { printLink, createWorker, parser } from '../common';
import { toWei } from '../WEB3/API/balance';
import tokenMap from '../WEB3/API/addToken';
import { isCurrentChain } from '../WEB3/validate';
import balance, { getUniswapBalanceGton, getUniswapBalanceWEthAndUsdc } from '../WEB3/Balance';
import {
  explorerUrl,
  network,
  chain,
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
import { bridgeGcdToL2 } from '../WEB3/Bridge';
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
  try {
    lock(true);
    loading(true);
    if (!(await isCurrentChain(network))) {
      throw new Error(`Wrong network, switch on ${chain.chainName}, please.`);
    }
    const tmpARGS = Args.split(' ');
    if (tmpARGS.length < 7) {
      throw new Error('Invalid input');
    }

    const Amount = tmpARGS[2];
    const TokenName = tmpARGS[3];
    const percentRisk = +parseInt(tmpARGS[5]) / 100;

    let userBalance;
    let amount;
    let debt;
    let liquidationPrice;
    let initialCollateralRatio;
    let liquidationRatio;
    let uniSwapOracleBalance;

    if (Amount === '0') throw new Error(`You can't borrow $GCD with 0 ${TokenName}$`);

    if (percentRisk > 1 || percentRisk < 0.01)
      // Converted persent
      throw new Error(`You can't borrow $GCD with less than 0% risk and more than 100%`);

    const token = TokenName in tokenMap ? tokenMap[TokenName] : null;

    if (!token) {
      throw new Error('Wrong symbol, available tokens: gton, eth');
    }

    userBalance = await balance(userAddress, token.address);

    amount = toWei(Amount, token.decimals);
    if (amount.gt(userBalance)) throw Error('Insufficient amount');

    initialCollateralRatio = await getInitialCollateralRatio(token.address);
    liquidationRatio = await getLiquidationRatio(token.address);
    token;

    switch (TokenName) {
      case 'weth':
        uniSwapOracleBalance = await getUniswapBalanceWEthAndUsdc(token.address, amount);
        break;
      case 'gton':
        uniSwapOracleBalance = await getUniswapBalanceGton(token.address, amount);
        break;
    }

    debt = await calculateBorowedGCD(uniSwapOracleBalance, percentRisk, initialCollateralRatio);
    liquidationPrice = await getLiquidationPrice(debt, amount, liquidationRatio);

    print([
      textLine({
        words: [
          textWord({
            characters: `Liquidation price for ${TokenName} is $${liquidationPrice}`,
          }),
        ],
      }),
    ]);

    const userAllowanceTokenDeposit = await allowance(token.address, vault);

    if (amount.gt(userAllowanceTokenDeposit)) {
      const firstTxn = await approve(userAddress, token.address, vault, amount);

      print([textLine({ words: [textWord({ characters: messages.approve })] })]);
      printLink(print, messages.viewTxn, explorerUrl + firstTxn);
    }

    const userAllowanceGcd = await allowance(tokenMap.gcd.address, vault);

    if (debt.gt(userAllowanceGcd)) {
      const secondTxn = await approve(userAddress, tokenMap.gcd.address, vault, debt);

      print([textLine({ words: [textWord({ characters: messages.approve })] })]);
      printLink(print, messages.viewTxn, explorerUrl + secondTxn);
    }

    if (TokenName !== 'weth') {
      const thirdTrx = await join(userAddress, token.address, amount, debt);
      print([textLine({ words: [textWord({ characters: 'Succesfull borrowed $GCD.' })] })]);
      printLink(print, messages.viewTxn, explorerUrl + thirdTrx);
    } else {
      const fourthTrx = await join_Eth(userAddress, amount, debt);
      print([textLine({ words: [textWord({ characters: 'Succesfull borrowed $GCD.' })] })]);
      printLink(print, messages.viewTxn, explorerUrl + fourthTrx);
    }

    loading(false);
    lock(false);
  } catch (err) {
    if (err.code in ErrorCodes) {
      ErrorHandler(print, err.code, 'stake'); // rename errors
    } else {
      print([textLine({ words: [textWord({ characters: err.message })] })]);
    }
    loading(false);
    lock(false);
  }
});

const ExitGcdWorker = async ({ lock, loading, print }, Args, [userAddress]) => {
  try {
    lock(true);
    loading(true);
    if (!(await isCurrentChain(network))) {
      throw new Error(`Wrong network, switch on ${chain.chainName}, please.`);
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

    if (AmountGCD < 0 || AmountBorrowedToken < 0) throw new Error(`You can't withdraw 0 tokens`);

    const token = TokenName in tokenMap ? tokenMap[TokenName] : null;

    if (!token) {
      throw new Error('Wrong symbol, available tokens: gton, eth');
    }

    userGcdBalance = await balance(userAddress, tokenMap.gcd.address);
    userCollateralAmount = await getCollateral(token.address, userAddress);

    amountGcd = toWei(AmountGCD);
    if (amountGcd.gt(userGcdBalance)) throw Error('Insufficient amount');

    amountBorrowedToken = toWei(AmountBorrowedToken, token.decimals);

    if (amountBorrowedToken.gt(userCollateralAmount)) throw Error('Insufficient collateral amount');

    const userAllowanceGcd = await allowance(tokenMap.gcd.address, vault);

    if (amountGcd.gt(userAllowanceGcd)) {
      const firstTxn = await approve(userAddress, tokenMap.gcd.address, vault, amountGcd);

      print([textLine({ words: [textWord({ characters: messages.approve })] })]);
      printLink(print, messages.viewTxn, explorerUrl + firstTxn);
    }

    const userAllowanceToken = await allowance(token.address, cdpManager01);

    if (amountBorrowedToken.gt(userAllowanceToken)) {
      const secondTxn = await approve(
        userAddress,
        token.address,
        cdpManager01,
        amountBorrowedToken,
      );

      print([textLine({ words: [textWord({ characters: messages.approve })] })]);
      printLink(print, messages.viewTxn, explorerUrl + secondTxn);
    }

    thirdTxn =
      TokenName === 'weth'
        ? (thirdTxn = await exit_Eth(userAddress, amountBorrowedToken, amountGcd))
        : (thirdTxn = await exit(userAddress, token.address, amountBorrowedToken, amountGcd));
    print([
      textLine({
        words: [textWord({ characters: `Succesfull repay $GCD and withdraw $${TokenName}.` })],
      }),
    ]);
    printLink(print, messages.viewTxn, explorerUrl + thirdTxn);

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
  try {
    lock(true);
    loading(true);
    if (!(await isCurrentChain(network))) {
      throw new Error(`Wrong network, switch on ${chain.chainName}, please.`);
    }
    const tmpARGS = Args.split(' ');

    if (tmpARGS.length < 2) {
      throw new Error('Invalid input');
    }
    const Amount = tmpARGS[0];
    let userBalance;
    let amount;

    if (Amount === '0') throw new Error(`You can't bridge less then 0`);

    userBalance = await balance(userAddress, tokenMap.gcd.address);

    amount = toWei(Amount, tokenMap.gcd.decimals);
    if (amount.gt(userBalance)) throw Error('Insufficient amount');

    const userAllowance = await allowance(tokenMap.gcd.address, bridgeAddress);

    if (amount.gt(userAllowance)) {
      const firstTxn = await approve(userAddress, tokenMap.gcd.address, bridgeAddress, amount);

      print([textLine({ words: [textWord({ characters: messages.approve })] })]);
      printLink(print, messages.viewTxn, explorerUrl + firstTxn);
    }

    const secondTxn = await bridgeGcdToL2(userAddress, amount);

    print([textLine({ words: [textWord({ characters: 'Succesfull bridged $GCD.' })] })]);
    printLink(print, messages.viewTxn, explorerUrl + secondTxn);

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

const UpdatingMap = {
  help: HelpWorker,
  borrow: BorrowGcdWorker,
  repay: ExitGcdWorker,
  bridge: BridgeToL2Worker,
  ...commonOperators,
};

const Parse = parser(UpdatingMap);

export default Parse;
