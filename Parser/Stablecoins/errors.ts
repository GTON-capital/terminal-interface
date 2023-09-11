import { EventQueueReturnType, textLine, textWord } from '@gton-capital/crt-terminal';

export enum ErrorCodes {
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  USER_DECLINED_TRANSACTION = 3,
  NOT_ENOUGHT_FUNDS = -32000,
}

export const ErrorHandler = (
  print: EventQueueReturnType['handlers']['print'],
  Code: string | number,
  Operation: string,
) => {
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
        words: [
          textWord({ characters: "You don't have enough funds to buy that many Stablecoins" }),
        ],
      }),
    ]);
  }
};
