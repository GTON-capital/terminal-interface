import React, { useState, useEffect } from 'react';
import {
  Terminal,
  useEventQueue,
  textLine,
  textWord,
  anchorWord,
} from 'crt-terminal';
import Layout from '../components/Layout/Layout';
import DisableMobile from '../components/DisableMobile/DisableMobile';
import classes from './index.module.scss';
import { faucetLink, gcLink, isTestnet } from '../config/config';
import GTONParser from '../Parser/GTONCapitalProjects/GTONCapitalRouter';
import BondingParser from '../Parser/Bonding/Parser';
import ChatParser from '../Parser/Chat/Parser';
import messages from '../Messages/Messages';
import { connect, printLink } from "../Parser/common"

const Projects =
{
  Staking: "staking",
  Candyshop: "candyshop",
  Ogswap: "ogswap",
  Bonding: "bonding",
  Chat: "chat"
}

let CurrentDirectory = Projects.Bonding;

export default function Web() {

  const eventQueue = useEventQueue();
  const { print } = eventQueue.handlers;
  const state = useState(null);
  // it's necessary update state if wallet is available
  useEffect(() => {connect(state).then()}, []);
  return (
    <Layout
      layoutParams={{
        title: 'CLI UI | GTON Capital (𝔾ℂ)',
        description:
          'An inovative way of USER <-> SC interaction for 𝔾ℂEco products.',
        keyWords: 'GTON, GC, bonding, crypto, staking, DeFi, DAO',
        url: 'https://test.cli.gton.capital/',
      }}>
      <main className={classes.mainContainer}>
        <DisableMobile>
          <Terminal
            queue={eventQueue}
            onCommand={(command) => {
              if (command.split(' ')[0] == "cd") {
                switch (command.split(' ')[1]) {
                  case "staking":
                    CurrentDirectory = Projects.Staking;
                    print([textLine({ words: [textWord({ characters: "Succefully switched to " + Projects.Staking })] })]);
                    break;
                  case "bonding":
                    CurrentDirectory = Projects.Bonding;
                    print([textLine({ words: [textWord({ characters: "Succefully switched to " + Projects.Bonding })] })]);
                    break;
                  case "chat":
                    CurrentDirectory = Projects.Chat;
                    print([textLine({ words: [textWord({ characters: "Succefully switched to " + Projects.Chat })] })]);
                    print([textLine({ words: [textWord({ characters: "Keep in mind that chat backend checks only mainnet balances!" })] })]);
                    break;
                  case "candyshop":
                    // CurrentDirectory = Projects.candyshop;
                    // print([textLine({words:[textWord({ characters: "Succefully switched to " + Projects.candyshop })]})]);
                    print([textLine({ words: [textWord({ characters: "Project is coming soon " })] })]);

                    break;
                  case "ogswap":
                    // CurrentDirectory = Projects.ogswap;
                    // print([textLine({words:[textWord({ characters: "Succefully switched to " + Projects.ogswap })]})]);
                    print([textLine({ words: [textWord({ characters: "Project is coming soon " })] })]);
                    break;
                  default:
                    print([textLine({ words: [textWord({ characters: "There is no project with this name " })] })]);
                    break;
                }
                return;
              }

              switch (CurrentDirectory) {
                case Projects.Staking:
                  GTONParser(eventQueue, state, command);
                  break;
                case Projects.Bonding:
                  BondingParser(eventQueue, state, command);
                  break;
                case Projects.Chat:
                  ChatParser(eventQueue, state, command);
                  break;
                case Projects.Candyshop:
                  // import CandyParser from './Parser/CandyShop/CandyShopParser'
                  break;
                case Projects.Ogswap:
                  // import OGSwapParser from './Parser/OGSwap/OGSwapParser'
                  break;
                default:
                  print([textLine({ words: [textWord({ characters: "Error: please refresh page" })] })]);
                  break;
              }

            }
            }
            prompt={"/" + CurrentDirectory + " $ "}
            banner={[
              textLine({ words: [textWord({ characters: messages.banner })] }),
              textLine({ words: [anchorWord({ className: "link-padding", characters: messages.gc, onClick: () => { window.open(gcLink, '_blank'); } })] }),
              isTestnet ? textLine({ words: [anchorWord({ className: "link-padding", characters: messages.faucet, onClick: () => { window.open(faucetLink, '_blank'); } })] }) : null,
            ]}
          />
        </DisableMobile>
      </main>
    </Layout>
  );
}
