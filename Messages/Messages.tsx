import { isTestnet } from '../config/config';

enum Commands {
  CD = 'cd',
  LS = 'ls',
  HELP = 'help',
  JOIN = 'join',
  STAKE = 'stake',
  UNSTAKE = 'unstake',
  BALANCE = 'balance',
  ADD_TOKEN = 'add',
  FAUCET = 'faucet',
  HARVEST = 'harvest',
  BUY = 'buy',
  CLAIM = 'claim',
  PRICE = 'price',
  SWITCH = 'switch',
}

export enum UpdatingCommand {
  BORROW = 'borrow',
  REPAY = 'repay',
  BRIDGE = 'bridge',
  VIEW = 'view',
}

enum OptionalActions {
  YES = 'yes',
  NO = 'no',
}

enum Prompt {
  PROMPT = '/gton/testing $ ',
}

enum Prefix {
  PREFIX = '>',
}

enum Links {
  ABOUT = 'https://medium.com/gearbox-protocol/credit-account-mining-guide-fueling-up-for-the-launch-abc17fbddbad',
  WALLETS_TO_PARTICIPATE = 'https://github.com/Gearbox-protocol/launch-snapshot#credit-account-mining-snapshot',
  CLAIM = 'https://medium.com/gearbox-protocol/credit-account-mining-guide-fueling-up-for-the-launch-abc17fbddbad',
}

export const cdHelp = `${Prefix.PREFIX}${Commands.CD} - change project`;
export const lsHelp = `${Prefix.PREFIX}${Commands.LS} - list projects`;

const messages = {
  banner: `

       ██████╗ ████████╗ ██████╗ ███╗   ██╗     ██████╗ █████╗ ██████╗ ██╗████████╗ █████╗ ██╗     
      ██╔════╝ ╚══██╔══╝██╔═══██╗████╗  ██║    ██╔════╝██╔══██╗██╔══██╗██║╚══██╔══╝██╔══██╗██║     
      ██║  ███╗   ██║   ██║   ██║██╔██╗ ██║    ██║     ███████║██████╔╝██║   ██║   ███████║██║     
      ██║   ██║   ██║   ██║   ██║██║╚██╗██║    ██║     ██╔══██║██╔═══╝ ██║   ██║   ██╔══██║██║     
      ╚██████╔╝   ██║   ╚██████╔╝██║ ╚████║    ╚██████╗██║  ██║██║     ██║   ██║   ██║  ██║███████╗
       ╚═════╝    ╚═╝    ╚═════╝ ╚═╝  ╚═══╝     ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
                                                       
                          ⚜️ Welcome to GTON CAPITAL CLI UI 📺!

      This dApp allows to interact with GTON Capital staking core smart contracts on L1
      and later on GTON Network.

      GTON Cli is an old-school console-based user interface.
                          
      Kudos for the inspiration to the intricate brain of ivangbi and the Gearbox team
      who came up with the idea of geeky CLI for their launch.

                        Type ${Prefix.PREFIX}${Commands.HELP} to see the list of available commands.

       #WA𝔾MI ⚜️
  `,
  gc: 'Find more info about GC',

  LINKS: `
  TODO
  `,
  viewTxn: 'View transaction',
  metamaskConnected: `
  Metamask is connected
  `,
  permissionCheckingStarted: `
  ...the machine is checking if you are in the snapshot...
  Learn more about which wallets are allowed to participate: ${Links.WALLETS_TO_PARTICIPATE}
  `,
  almostDone: `
  We're almost done. Now wait till tx is confirmed.
  `,
  approve: `
      You have succesfully approved your funds!
      Transaction approve: 
    `,
  accountsMined: (n: number) => `
  Accounts mined: ${n}
  `,
  balance: (n: string) => `
      Token balance: ${n}
    `,
  addToken: `
  Successfully added token to the MetaMask.
  `,
  switchChain: (name: string) => `
  Successfully switched to ${name} chain.
  `,
};

export { Prefix, Links, Prompt, Commands, OptionalActions };
export default messages;
