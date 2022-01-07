import { network } from 'config/config';
import {
  RootControllerActions,
  MineChoiceActions,
} from 'redux/terminalController/terminalControllerActionTypes';

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

const etherscanPrefix = network === '4002' ? 'kovan.' : '';

const messages = {
  banner: `

        ██████╗ ████████╗ ██████╗ ███╗   ██╗     ██████╗ █████╗ ██████╗ ██╗████████╗ █████╗ ██╗     
       ██╔════╝ ╚══██╔══╝██╔═══██╗████╗  ██║    ██╔════╝██╔══██╗██╔══██╗██║╚══██╔══╝██╔══██╗██║     
       ██║  ███╗   ██║   ██║   ██║██╔██╗ ██║    ██║     ███████║██████╔╝██║   ██║   ███████║██║     
       ██║   ██║   ██║   ██║   ██║██║╚██╗██║    ██║     ██╔══██║██╔═══╝ ██║   ██║   ██╔══██║██║     
       ╚██████╔╝   ██║   ╚██████╔╝██║ ╚████║    ╚██████╗██║  ██║██║     ██║   ██║   ██║  ██║███████╗
        ╚═════╝    ╚═╝    ╚═════╝ ╚═╝  ╚═══╝     ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
                                                            
                            Welcome to GTON CAPITAL testing platform!

                            Type ${Prefix.PREFIX}${RootControllerActions.HELP} to see list of available commands
  `,

  helpText: `
  Available commands:

  ${Prefix.PREFIX}${RootControllerActions.HELP} - this output
  ${Prefix.PREFIX}${RootControllerActions.JOIN} - connect wallet to the terminal
  ${Prefix.PREFIX}${RootControllerActions.STAKE} <amount> - stake funds
  ${Prefix.PREFIX}${RootControllerActions.UNSTAKE} <amount> - unstake funds
  ${Prefix.PREFIX}${RootControllerActions.SWITCH} - switch chain to test fantom
  ${Prefix.PREFIX}${RootControllerActions.BALANCE} gton | staking - get actual erc20 token balance
  ${Prefix.PREFIX}${RootControllerActions.ADD_TOKEN} gton | sgton - add tokens to metamask
  ${Prefix.PREFIX}${RootControllerActions.FAUCET} - receive gton airdrop
  `,
  links: `
  Empty command rn
  `,
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
  claim: `
  Do you wish to mine a Credit Account? 

  By participating in Gearbox Credit Account mining, I agree to the Terms of Service (https://gearbox.fi/terms) and confirm that I have read and understood the Privacy Notice (https://gearbox.fi/privacy) and Risk Disclosure Statement (https://gearbox.fi/risks).
  
  I hereby further represent and warrant that:
  
  - I am not a citizen or resident of, or person subject to jurisdiction of, or located in, Cuba, Democratic People’s Republic of North Korea, Islamic Republic of Iran, Syria, the Crimea or Sevastopol, the People Republic of China (excluding Hong Kong, Macao and Taiwan), the United States of America (including its territories: American Samoa, Guam, Puerto Rico, the Northern Mariana Islands and the U.S. Virgin Islands), and shall not use or access Gearbox App while in any of the above territories.
  - I am not subject to any sanctions administered or enforced by any country, government or international authority, and that I am not acting in the interests of such persons;
  - I understand that if I fail to maintain sufficient collateral when using the Gearbox Protocol, my credit account(s) may be liquidated, in which case a penalty may be charged by the protocol.
  - I acknowledge that Gearbox App and related software are experimental, and that the use of experimental software may result in complete loss of my funds.
  
  Type ${Prefix.PREFIX}${MineChoiceActions.YES} to proceed or ${Prefix.PREFIX}${MineChoiceActions.NO} to reject. 
  
  Just to make sure once again… you understand what’s about to happen, right? 

  If no, then check this article for complete information: ${Links.CLAIM}

  Ok, now maybe ${Prefix.PREFIX}${MineChoiceActions.YES} then!
  `,
  almostDone: `
  We're almost done. Now wait till tx is confirmed.
  `,
  yourHash: (h: string) => `
  Congratulations, captain! 

  You have received GEAR tokens for your contribution: https://${etherscanPrefix}etherscan.io/tx/${h}

  It’s now time to check the ${Prefix.PREFIX}${RootControllerActions.LINKS} command and join Gearbox socials!

  Governance work is about to begin… in a matter of days.
  `,
  approve(h: string) {
    return `
      You have succesfully approved your funds!
      Transaction approve: https://testnet.ftmscan.com/tx/${h}
    `;
  },
  stake(type: string, a: string, h: string) {
    return `
    You have succesfully ${type} your funds!
    Amount: ${a},
    Transaction stake: https://testnet.ftmscan.com/tx/${h}`;
  },
  accountsMined: (n: number) => `
  Accounts mined: ${n}
  `,
  balance: (n: string) => `
  Token balance: ${n}
  `,
  chainSwitch: `
  Successfully switched to fantom testnet.
  `,
  faucetDeposit: `
  Succesfully airdropped GTON.
  `,
  isGaryQuestion: `
  Is your name GARY by any chance? Please confirm this is NOT the case by typing ${Prefix.PREFIX}${MineChoiceActions.NO}.
  `,
  isGary: `
  Ok, we assume you were joking. Carry on!
  `,
  addToken: `
  Successfully added token to the MetaMask.
  `,
};

export { Prefix, Links, Prompt };
export default messages;
