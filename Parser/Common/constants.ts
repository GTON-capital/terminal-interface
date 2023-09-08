export enum ErrorCodes {
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  USER_DECLINED_TRANSACTION = 3,
  NOT_ENOUGHT_FUNDS = -32000,
}

export const errorStrings = {
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
