import { isTestnet } from '../config/config';

enum Commands 
{
    CD = "cd",
    HELP = "help",
    JOIN = "join",
    STAKE = "stake",
    UNSTAKE = "unstake",
    SWITCH = "switch",
    BALANCE = "balance",
    ADD_TOKEN = "add",
    FAUCET = "faucet",
    HARVEST = "harvest",
    BUY = "buy",
    PRICE = "price",
}

enum BondingCommands {
  Tokens = "tokens",
  Mint = "mint",
  Claim = "claim",
  Info = "info",
  Bonds = "bonds",
  Preview = "preview",
  Types = "types"
}

enum ChatCommands {
  Send = "send",
  Load = "load",
  Login = "login",
  Members = "members"
}

enum OptionalActions {
  YES = 'yes',
  NO = 'no'
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

const cdHelp =  
`
  ${Prefix.PREFIX}${Commands.CD} bonding | staking | chat - change project
`

const commonCommands = 
`
  ${Prefix.PREFIX}${Commands.HELP} - this output
  ${Prefix.PREFIX}${Commands.JOIN} - connect wallet to the terminal
  ${Prefix.PREFIX}${Commands.BALANCE} gton | sgton | harvest | all - get actual erc20 token balance
  ${Prefix.PREFIX}${Commands.ADD_TOKEN} gton | sgton | usdc - add tokens to metamask
  ${ isTestnet ? `${Prefix.PREFIX}${Commands.FAUCET} usdc | gton - receive gton airdrop` : ''}`

const messages = {
  banner: `

       ██████╗ ████████╗ ██████╗ ███╗   ██╗     ██████╗ █████╗ ██████╗ ██╗████████╗ █████╗ ██╗     
      ██╔════╝ ╚══██╔══╝██╔═══██╗████╗  ██║    ██╔════╝██╔══██╗██╔══██╗██║╚══██╔══╝██╔══██╗██║     
      ██║  ███╗   ██║   ██║   ██║██╔██╗ ██║    ██║     ███████║██████╔╝██║   ██║   ███████║██║     
      ██║   ██║   ██║   ██║   ██║██║╚██╗██║    ██║     ██╔══██║██╔═══╝ ██║   ██║   ██╔══██║██║     
      ╚██████╔╝   ██║   ╚██████╔╝██║ ╚████║    ╚██████╗██║  ██║██║     ██║   ██║   ██║  ██║███████╗
       ╚═════╝    ╚═╝    ╚═════╝ ╚═╝  ╚═══╝     ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
                                                       
                          ⚜️ Welcome to GTON CAPITAL (𝔾ℂ) CLI UI 📺!

      This dApp allows to interact with GTON Capital staking smart contracts on Fantom${isTestnet? ' Testnet' : ''}.
                                    ${isTestnet? 'Mainnet coming soon!' : ''}
      The old-school console-based user interface was forked from Gearbox protocol. 
                          
      Kudos for the inspiration to the intricate brain of ivangbi and the Gearbox team 
      who came up with the idea of geeky CLI for their launch.

                       Type ${Prefix.PREFIX}${Commands.HELP} to see the list of available commands.

       #WA𝔾MI ⚜️
  `,
  faucet: 'Get free testnet $FTMs',
  gc: 'Find more info about GC',

  stakingHelpText: `
  Available commands:
  ${commonCommands}
  ${Prefix.PREFIX}${Commands.STAKE} <amount> | all - stake funds
  ${Prefix.PREFIX}${Commands.UNSTAKE} <amount> | all - unstake funds
  ${Prefix.PREFIX}${Commands.HARVEST} <amount> | all - harvest reward
  ${Prefix.PREFIX}${Commands.SWITCH} - switch chain to Fantom ${isTestnet? 'Testnet' : ''}
  ${Prefix.PREFIX}${Commands.BUY} <amount> with ftm - buy <amount> of gton via CLI
  ${Prefix.PREFIX}${Commands.PRICE} - get current gton price in USDC pool
  ${cdHelp}
  `,
  bondingHelpText: `
  Available commands:
  ${commonCommands}
  ${Prefix.PREFIX}${BondingCommands.Tokens} - prints list of tokens, that are available to spend on bond
  ${Prefix.PREFIX}${BondingCommands.Types} - prints list of available bond types
  ${Prefix.PREFIX}${BondingCommands.Bonds} - prints bonds ids of connected wallet
  ${Prefix.PREFIX}${BondingCommands.Mint} <token> <type> <amount> - buy <type> of bond, spending <amount> of <token> via CLI
  ${Prefix.PREFIX}${BondingCommands.Claim} <bondId> - claim bond with given id
  ${Prefix.PREFIX}${BondingCommands.Info} <bondId> - prints info about given bond id
  ${Prefix.PREFIX}${BondingCommands.Preview} <token> <type> <amount> - shows amount gton out after claim
  ${cdHelp}
  `,
  chatHelpText: `
  Available commands:
  ${commonCommands}
  ${Prefix.PREFIX}${ChatCommands.Login} - logs in connected account
  ${Prefix.PREFIX}${ChatCommands.Load} <amount> - load and print last <amount> messages
  ${Prefix.PREFIX}${ChatCommands.Send} <message> - sends message to the chat
  ${Prefix.PREFIX}${ChatCommands.Members} - prints addresses that are registered in the chat
  
  ${cdHelp}
  `,
  links: `
  Empty command rn
  `,
  LINKS: 
  `
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
    `
  ,
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
    `
  ,
  chainSwitch: `
  Successfully switched to Fantom ${isTestnet? 'Testnet' : ''}.
  `,
  faucetDeposit: `
  Succesfully airdropped token.
  `,
  addToken: `
  Successfully added token to the MetaMask.
  `,
};

export { Prefix, Links, Prompt, Commands, OptionalActions };
export default messages;