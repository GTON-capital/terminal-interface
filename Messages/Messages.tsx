import { isTestnet } from '../config/config';

enum Commands {
  CD = 'cd',
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

export const cdHelp = `${Prefix.PREFIX}${Commands.CD} bonding | staking - change project`;

const commonCommands = `
  ${Prefix.PREFIX}${Commands.HELP} - this output
  ${Prefix.PREFIX}${Commands.JOIN} - connect wallet to the terminal
  ${Prefix.PREFIX}${
  Commands.BALANCE
} gton | sgton | harvest | gcd | all - get actual erc20 token balance
  ${Prefix.PREFIX}${Commands.ADD_TOKEN} gton | sgton | gcd | usdc  - add tokens to metamask,
  ${Prefix.PREFIX}${
  Commands.BUY
} gton for <amount> <token>  - available tokens: eth, usdc (more coming soon) 
  ${isTestnet ? `${Prefix.PREFIX}${Commands.SWITCH} - switch chain to GTON` : ''}
  ${isTestnet ? `${Prefix.PREFIX}${Commands.FAUCET} usdc | gton - receive gton airdrop` : ''}`;

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
  faucet: 'Get free testnet $ETH',
  gc: 'Find more info about GC',

  stakingHelpText: `
  Available commands:
  ${Prefix.PREFIX}${Commands.CLAIM} - claim gton and harvest reward from V1 staking contract (Fantom)
  ${Prefix.PREFIX}${Commands.STAKE} <amount> | all - stake funds
  ${Prefix.PREFIX}${Commands.UNSTAKE} <amount> | all - unstake funds
  ${Prefix.PREFIX}${Commands.HARVEST} <amount> | all - harvest reward
  ${commonCommands}
  `,
  updatingHelpText: `
  Available commands:
  ${commonCommands}
  
  ${Prefix.PREFIX}${UpdatingCommand.BORROW} gcd with <amount> <token> with <percent>% risk | [UNAUDITED]
  ${Prefix.PREFIX}${UpdatingCommand.REPAY} <amount> gcd and withdraw <amount> <token> | [UNAUDITED],
  ${Prefix.PREFIX}${UpdatingCommand.BRIDGE} <amount> gcd  | [UNAUDITED]`,
  links: `
  Empty command rn
  `,
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
  amountOfMineAccounts: `
  You have 1 credit accounts to mine
  `,
  almostDone: `
  We're almost done. Now wait till tx is confirmed.
  `,
  approve: `
      You have succesfully approved your funds!
      Transaction approve: 
    `,
  claim: `
      You have succesfully claimed your funds!
      Transaction hash: 
    `,
  stake(type: string, amount: string) {
    return `
    You have succesfully ${type} your funds!
    Amount: ${amount},
    Transaction stake:`;
  },
  harvested(amount: string) {
    return `
    You have succesfully harvested your reward!
    Amount: ${amount},
    Transaction:`;
  },
  accountsMined: (n: number) => `
  Accounts mined: ${n}
  `,
  balance: (n: string) => `
      Token balance: ${n}
    `,
  faucetDeposit: `
  Succesfully airdropped token.
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
