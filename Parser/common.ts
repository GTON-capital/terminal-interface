import { textLine, textWord, anchorWord } from 'crt-terminal';
import axios from 'axios';
import Big from 'big.js';
import { chain, network } from '../config/config';
import connectMetamask from './WEB3/ConnectMetamask';
import addToken from './WEB3/addTokenToMM';
import faucet from './WEB3/Faucet';
import messages from '../Messages/Messages';
import balance, { userShare } from './WEB3/Balance';
import { fromWei } from './WEB3/API/balance';
import tokenMap, { tokens } from './WEB3/API/addToken';
import notFoundStrings from '../Errors/notfound-strings';
import { isCurrentChain } from '../Parser/WEB3/validate';
import { mmChains } from './WEB3/chains';

enum ErrorCodes {
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  USER_DECLINED_TRANSACTION = 3,
  NOT_ENOUGHT_FUNDS = -32000,
}

const errorStrings = {
  [ErrorCodes.INVALID_ARGUMENT]: 'Please provide correct argument',
  [ErrorCodes.USER_DECLINED_TRANSACTION]: 'You have declined transaction',
  [ErrorCodes.NOT_ENOUGHT_FUNDS]: "You don't have enough funds to proceed transaction",
};

export function timeConverter(UNIX_timestamp: number): string {
  const a = new Date(UNIX_timestamp * 1000);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  const time = `${date} ${month} ${year} ${hour}:${min}:${sec}`;
  return time;
}

export function createWorker(
  handler: (handlers, arg, state) => Promise<void>,
  errMessage: string | null = null,
) {
  return async ({ lock, loading, print }, args: string, state) => {
    try {
      lock(true);
      loading(true);
      await handler({ lock, loading, print }, args, state);
      loading(false);
      lock(false);
    } catch (err) {
      let message;
      if (!state[0]) {
        message = 'First - connect the website by typing >join';
      } else if (err.code in ErrorCodes) {
        message = errorStrings[err.code];
      } else {
        message = err.message || errMessage;
      }
      console.log(err);

      print([textLine({ words: [textWord({ characters: message })] })]);
      loading(false);
      lock(false);
    }
  };
}

export async function connect(state) {
  const address = await connectMetamask();
  state[1](address);
  return address;
}

const ConnectMetamaskWorker = createWorker(async ({ print }, _, state) => {
  const address = await connect(state);
  print([textLine({ words: [textWord({ characters: `Connected successfuly: ${address}` })] })]);
}, 'Error while connecting metamask, please try again');

const BalanceWorker = createWorker(async ({ print }, TokenName, [userAddress]) => {
  try {
    await isCurrentChain(network);
  } catch (e) {
    print([
      textLine({
        words: [
          textWord({
            characters: `Wrong network. Switch to ${mmChains[network].chainName}, please.`,
          }),
        ],
      }),
    ]);
    return;
  }

  if (TokenName === 'all') {
    const token = tokenMap.sgton;
    const balanceWei = Big(await balance(userAddress, token.address));
    const shareWei = await userShare(userAddress);

    const harvest = fromWei(balanceWei.minus(shareWei).toFixed(18));
    const share = fromWei(shareWei);
    const gton = fromWei(await balance(userAddress, tokenMap.gton.address));

    print([
      textLine({
        words: [textWord({ characters: `Harvest: ${harvest.toFixed(4).replace(/0*$/, '')}` })],
      }),
    ]);
    print([
      textLine({
        words: [textWord({ characters: `SGTON:   ${share.toFixed(4).replace(/0*$/, '')}` })],
      }),
    ]);
    print([
      textLine({
        words: [textWord({ characters: `GTON:    ${gton.toFixed(4).replace(/0*$/, '')}` })],
      }),
    ]);
    return;
  }

  const token = TokenName === 'harvest' ? tokenMap.sgton : tokenMap[TokenName];
  if (!token) throw Error('Available tokens are: gton, sgton, harvest');
  const Balance = Big(await balance(userAddress, token.address));

  let CoinBalance;

  if (TokenName === 'harvest') {
    const share = await userShare(userAddress);
    CoinBalance = fromWei(Balance.minus(share).toFixed(18));
  } else if (TokenName === 'sgton') {
    CoinBalance = fromWei(await userShare(userAddress));
  } else {
    CoinBalance = fromWei(Balance.toFixed(18));
  }
  const res = messages.balance(CoinBalance.toFixed(18));
  print([textLine({ words: [textWord({ characters: res })] })]);
}, 'Something went wrong, please try again');

const AddTokenWorker = createWorker(async ({ print }, TokenName) => {
  const token = tokenMap[TokenName];
  if (!token) throw Error('Available tokens are: gton, sgton');
  await addToken(token);
  print([textLine({ words: [textWord({ characters: messages.addToken })] })]);
}, 'Error adding token to Meramask');

const FaucetWorker = createWorker(async ({ print }, token) => {
  const tokenAddress = tokens[token];

  if (!tokenAddress) {
    print([textLine({ words: [textWord({ characters: 'Pass token name as second argument' })] })]);
    return;
  }
  await faucet(tokenAddress);
  print([textLine({ words: [textWord({ characters: messages.faucetDeposit })] })]);
});

const PriceWorker = createWorker(async ({ print }) => {
  const urlPrice = 'https://pw.gton.capital/rpc/base-to-usdc-price';

  const result = await axios.get(urlPrice);

  print([
    textLine({ words: [textWord({ characters: `$GTON price right now: ${result.data.result}` })] }),
  ]);
}, 'The request failed, please try again later.');

const commonOperators = {
  faucet: FaucetWorker,
  add: AddTokenWorker,
  balance: BalanceWorker,
  join: ConnectMetamaskWorker,
  price: PriceWorker,
};

export function printLink(print, text, link) {
  print([
    textLine({
      words: [
        anchorWord({
          className: 'link-padding',
          characters: text,
          onClick: () => {
            window.open(link, '_blank');
          },
        }),
      ],
    }),
  ]);
}

export function parser(operands) {
  return async (queue, state, command) => {
    const { print } = queue.handlers;
    const Command = command.split(' ')[0].trim().toLowerCase();
    // split was replaced by substring because of the buy command, which assumes two parameters
    const Arg = command.substring(command.indexOf(' ')).replace(' ', '');

    try {
      // Handle incorrect command
      if (!(Command in operands))
        throw Error(notFoundStrings[Math.floor(Math.random() * notFoundStrings.length)]);
      operands[Command](queue.handlers, Arg, state);
    } catch (err) {
      print([textLine({ words: [textWord({ characters: err.message })] })]);
    }
  };
}
export default commonOperators;
