import messages, { Prefix, OptionalActions } from '../Messages/Messages';
import { isTestnet } from '../config/config';

import notFoundStrings from './notfound-strings';
  
  type TerminalErrorCodes =
    | 'COMMAND_NOT_FOUND'
    | 'EMPTY_ADDRESS_ARG'
    | 'NO_METAMASK'
    | 'METAMASK_NOT_CONNECTED'
    | 'METAMASK_WRONG_NETWORK'
    | 'METAMASK_RELOGIN'
    | 'GET_ADDRESS_FAILED'
    | 'PERMISSION_DENIED'
    | 'ALREADY_CLAIMED'
    | 'DENIED_BY_USER'
    | 'ACCOUNT_CHANGED'
    | 'CHAIN_CHANGED'
    | 'DISCONNECTED'
    | 'UNEXPECTED_ERROR'
    | 'ACTION_ABORTED'
    | 'REJECTED'
    | 'ENDPOINT_IS_BUSY'
    | 'METAMASK_CORRECT_NETWORK';
  
  const errorStrings: Record<TerminalErrorCodes, string> = {
    get COMMAND_NOT_FOUND() {
      return notFoundStrings[Math.floor(Math.random() * notFoundStrings.length)];
    },
    NO_METAMASK: `
    Metamask not found. Please install Metamask.
    `,
    METAMASK_NOT_CONNECTED: `
    Failed to connect to Metamask. Try again.
    `,
    METAMASK_WRONG_NETWORK: `
    Please switch to Fantom${isTestnet? 'Testnet' : ''}.
    `,
    METAMASK_CORRECT_NETWORK: `
    You are currently on Fantom${isTestnet? 'Testnet' : ''}.
    `,
    METAMASK_RELOGIN: `
    Log in and try again.
    `,
    GET_ADDRESS_FAILED: `
    Failed to get your account address.
    `,
    EMPTY_ADDRESS_ARG: `
    Please provide token name or address. To get list of available tokens, type >help.
    `,
    PERMISSION_DENIED: `
    Houston, we have a problem! 
    Looks like you haven’t been active in the governance of protocols selected. 
    Please check other activities you can join in order to become part of Gearbox governance: <>link<>
    `,
    ALREADY_CLAIMED: `
    Hold up, you have already mined 1 Credit Account designated for you.
    It’s now time to check the ${Prefix.PREFIX}${messages.LINKS} command and join Gearbox socials!
    `,
    DENIED_BY_USER: `
    Seems like you are NGMI, anon! You skipped financial freedom.
    Type ${Prefix.PREFIX}${OptionalActions.NO} if you exited by mistake.
    `,
    ACCOUNT_CHANGED: `
    You have just changed your account. All active actions were aborted.
    `,
    CHAIN_CHANGED: `
    You have just changed active chain. All active actions were aborted.
    `,
    DISCONNECTED: `
    You have just disconnected. Please, connect and try again.
    `,
    UNEXPECTED_ERROR: `
    Unexpected Error.
    `,
    ACTION_ABORTED: '',
    REJECTED: `
    Request rejected.
    `,
    ENDPOINT_IS_BUSY: `
    Endpoint is busy.
    `,
  };
  
  export type { TerminalErrorCodes };
  export default errorStrings;
