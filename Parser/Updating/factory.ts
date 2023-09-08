import { textLine, textWord } from '@gton-capital/crt-terminal';
import messages, { Commands, Prefix, UpdatingCommand, cdHelp } from '../../Messages/Messages';
import { printLink } from '../common';
import { toWei } from '../WEB3/API/balance';
import tokenMap from '../WEB3/API/addToken';
import { validateConnectedWallet } from '../../State/validate';
import balance, {
  getUniswapBalanceGton,
  getUniswapBalanceWEthAndUsdc,
  getEthBalance,
} from '../WEB3/Balance';
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
import { IWorker, Worker } from '../Common/worker';
import { Operands, Parser, parser } from '../Common/parser';
import { TerminalState } from '../../State/types';
import { commonOperationsFactory } from '../Common/factory';
import { ApplicationConfig } from '../../config/types';

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

const HelpWorker = (operands: Operands): IWorker => ({
  execute: ({ print }, _, [nonValidatedState], config) => {
    const prefix = `${Prefix.PREFIX}${Commands.HELP} - this output\n`;
    const commands = Object.values(operands)
      .map((w) => (w.helpText ? w.helpText(config, nonValidatedState?.chain) : null))
      .filter(Boolean)
      .join('\n');

    const postfix = `\n\n${cdHelp}`;

    print([textLine({ words: [textWord({ characters: prefix + commands + postfix })] })]);
  },
});

const BorrowGcdWorker = new Worker(
  async ({ lock, loading, print }, Args, [nonValidatedState], config) => {
    const state = validateConnectedWallet(config, nonValidatedState);
    try {
      lock(true);
      loading(true);
      if (state.chainId.toString() != network) {
        throw new Error(`Wrong network, switch on ${chain.chainName}, please.`);
      }
      const tmpARGS = Args.split(' ');
      if (tmpARGS.length < 7) {
        throw new Error('Invalid input');
      }

      const Amount = tmpARGS[2];
      const TokenName = tmpARGS[3];
      const percentRisk = +parseInt(tmpARGS[5]) / 100;
      let userAllowanceTokenDeposit;
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
      userBalance =
        TokenName === 'eth'
          ? await getEthBalance(state?.address)
          : await balance(state?.address, token.address);

      amount = toWei(Amount, token.decimals);
      if (amount.gt(userBalance)) throw Error('Insufficient amount');

      switch (TokenName) {
        case 'eth':
          uniSwapOracleBalance = await getUniswapBalanceWEthAndUsdc(tokenMap.weth.address, amount);
          initialCollateralRatio = await getInitialCollateralRatio(tokenMap.weth.address);
          liquidationRatio = await getLiquidationRatio(tokenMap.weth.address);
          break;
        case 'gton':
          uniSwapOracleBalance = await getUniswapBalanceGton(token.address, amount);
          initialCollateralRatio = await getInitialCollateralRatio(token.address);
          liquidationRatio = await getLiquidationRatio(token.address);
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

      if (TokenName !== 'eth') {
        userAllowanceTokenDeposit = await allowance(token.address, vault);

        if (amount.gt(userAllowanceTokenDeposit)) {
          const firstTxn = await approve(state.address, token.address, vault, amount);

          print([textLine({ words: [textWord({ characters: messages.approve })] })]);
          printLink(print, messages.viewTxn, explorerUrl + firstTxn);
        }
      } else {
        userAllowanceTokenDeposit = await allowance(tokenMap.weth.address, vault);

        if (amount.gt(userAllowanceTokenDeposit)) {
          const firstTxn = await approve(state.address, tokenMap.weth.address, vault, amount);

          print([textLine({ words: [textWord({ characters: messages.approve })] })]);
          printLink(print, messages.viewTxn, explorerUrl + firstTxn);
        }
      }

      const userAllowanceGcd = await allowance(tokenMap.gcd.address, vault);

      if (debt.gt(userAllowanceGcd)) {
        const secondTxn = await approve(state.address, tokenMap.gcd.address, vault, debt);

        print([textLine({ words: [textWord({ characters: messages.approve })] })]);
        printLink(print, messages.viewTxn, explorerUrl + secondTxn);
      }

      if (TokenName !== 'eth') {
        const thirdTrx = await join(state.address, token.address, amount, debt);
        print([textLine({ words: [textWord({ characters: 'Succesfull borrowed $GCD.' })] })]);
        printLink(print, messages.viewTxn, explorerUrl + thirdTrx);
      } else {
        const fourthTrx = await join_Eth(state.address, amount, debt);
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
  },
).setDescription({
  description: `${Prefix.PREFIX}${UpdatingCommand.BORROW} gcd with <amount> <token> with <percent>% risk | [UNAUDITED]`,
});

const ExitGcdWorker = new Worker(
  async ({ lock, loading, print }, Args, [nonValidatedState], config) => {
    const state = validateConnectedWallet(config, nonValidatedState);
    try {
      lock(true);
      loading(true);
      if (state.chainId.toString() != network) {
        throw new Error(`Wrong network, switch on ${chain.chainName}, please.`);
      }
      const tmpARGS = Args.split(' ');

      if (tmpARGS.length < 5) {
        throw new Error('Invalid input');
      }

      const AmountGCD = Number.parseFloat(tmpARGS[0]);
      const AmountBorrowedToken = Number.parseFloat(tmpARGS[4]);
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

      userGcdBalance = await balance(state.address, tokenMap.gcd.address);
      userCollateralAmount =
        TokenName === 'eth'
          ? await getCollateral(tokenMap.weth.address, state.address)
          : await getCollateral(token.address, state.address);

      amountGcd = toWei(AmountGCD);
      if (amountGcd.gt(userGcdBalance)) throw Error('Insufficient amount');

      amountBorrowedToken = toWei(AmountBorrowedToken, token.decimals);

      if (amountBorrowedToken.gt(userCollateralAmount))
        throw Error('Insufficient collateral amount');

      const userAllowanceGcd = await allowance(tokenMap.gcd.address, vault);

      if (amountGcd.gt(userAllowanceGcd)) {
        const firstTxn = await approve(state.address, tokenMap.gcd.address, vault, amountGcd);

        print([textLine({ words: [textWord({ characters: messages.approve })] })]);
        printLink(print, messages.viewTxn, explorerUrl + firstTxn);
      }

      if (TokenName === 'eth') {
        userAllowanceToken = await allowance(tokenMap.weth.address, cdpManager01);
      } else {
        userAllowanceToken = await allowance(token.address, cdpManager01);
      }

      if (amountBorrowedToken.gt(userAllowanceToken)) {
        const secondTxn =
          TokenName === 'eth'
            ? await approve(state.address, tokenMap.weth.address, cdpManager01, amountBorrowedToken)
            : await approve(state.address, token.address, cdpManager01, amountBorrowedToken);

        print([textLine({ words: [textWord({ characters: messages.approve })] })]);
        printLink(print, messages.viewTxn, explorerUrl + secondTxn);
      }

      thirdTxn =
        TokenName === 'eth'
          ? (thirdTxn = await exit_Eth(state.address, amountBorrowedToken, amountGcd))
          : (thirdTxn = await exit(state.address, token.address, amountBorrowedToken, amountGcd));
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
  },
).setDescription({
  description: `${Prefix.PREFIX}${UpdatingCommand.REPAY} <amount> gcd and withdraw <amount> <token> | [UNAUDITED]`,
});

const BridgeToL2Worker = new Worker(
  async ({ lock, loading, print }, Args, [nonValidatedState], config) => {
    const state = validateConnectedWallet(config, nonValidatedState);
    try {
      lock(true);
      loading(true);
      if (state.chainId.toString() != network) {
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

      userBalance = await balance(state.address, tokenMap.gcd.address);

      amount = toWei(Amount, tokenMap.gcd.decimals);
      if (amount.gt(userBalance)) throw Error('Insufficient amount');

      const userAllowance = await allowance(tokenMap.gcd.address, bridgeAddress);

      if (amount.gt(userAllowance)) {
        const firstTxn = await approve(state.address, tokenMap.gcd.address, bridgeAddress, amount);

        print([textLine({ words: [textWord({ characters: messages.approve })] })]);
        printLink(print, messages.viewTxn, explorerUrl + firstTxn);
      }

      const secondTxn = await bridgeGcdToL2(state.address, amount);

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
  },
).setDescription({
  description: `${Prefix.PREFIX}${UpdatingCommand.BRIDGE} <amount> gcd  | [UNAUDITED]`,
});

const UpdatingMap: Operands = {
  borrow: BorrowGcdWorker,
  repay: ExitGcdWorker,
  bridge: BridgeToL2Worker,
};

export default function updateParserFactory(
  config: ApplicationConfig,
  state: TerminalState,
): Parser {
  const operands: Operands = {
    ...UpdatingMap,
    ...commonOperationsFactory(state),
  };

  const help = HelpWorker(operands);

  return parser(config, { ...operands, help });
}
