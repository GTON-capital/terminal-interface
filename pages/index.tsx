import React, { useState, useEffect } from 'react';
import {
  Terminal,
  useEventQueue,
  textLine,
  textWord,
  anchorWord,
} from '@gton-capital/crt-terminal';
import Layout from '../components/Layout/Layout';
import DisableMobile from '../components/DisableMobile/DisableMobile';
import classes from './index.module.scss';
import { faucetLink, gcLink, isTestnet, chain } from '../config/config';
import GTONParser from '../Parser/GTONCapitalProjects/GTONCapitalRouter';
import BondingParser from '../Parser/Bonding/Parser';
import UpdatesParser from '../Parser/Updating/Parser';
import ChatParser from '../Parser/Chat/Parser';
import messages from '../Messages/Messages';
import { connect, printLink } from '../Parser/common';
import Header from '../components/Header/Header';

declare const window: any;

const Projects = {
  Staking: 'staking',
  Candyshop: 'candyshop',
  Ogswap: 'ogswap',
  Bonding: 'bonding',
  Chat: 'chat',
  Updates: 'updates',
};

let CurrentDirectory = Projects.Staking;

export default function Web() {
  const eventQueue = useEventQueue();
  const { print } = eventQueue.handlers;
  const state = useState(null);

  // it's necessary update state if wallet is available
  useEffect(() => {
    connect(state)
      .then()
      .catch((e) => console.error(e));
  }, []);
  return (
    <Layout
      layoutParams={{
        title: 'CLI UI | GTON Capital',
        description: 'An inovative way of USER <-> SC interaction for GTON ecosystem products.',
        keyWords: 'GTON, GC, bonding, crypto, staking, DeFi, DAO',
        url: isTestnet ? 'https://test.cli.gton.capital/' : 'https://cli.gton.capital/',
      }}
    >
      <main className={classes.mainContainer}>
        <DisableMobile>
          <Terminal
            queue={eventQueue}
            onCommand={(command) => {
              if (command.split(' ')[0] == 'cd') {
                switch (command.split(' ')[1]) {
                  case 'staking':
                    CurrentDirectory = Projects.Staking;
                    print([
                      textLine({
                        words: [
                          textWord({ characters: 'Succefully switched to ' + Projects.Staking }),
                        ],
                      }),
                    ]);
                    break;
                  case 'bonding':
                    CurrentDirectory = Projects.Bonding;
                    print([
                      textLine({
                        words: [
                          textWord({ characters: 'Succefully switched to ' + Projects.Bonding }),
                        ],
                      }),
                    ]);
                    break;
                  case 'updates':
                    CurrentDirectory = Projects.Updates;
                    print([
                      textLine({
                        words: [
                          textWord({ characters: 'Succefully switched to ' + Projects.Updates }),
                        ],
                      }),
                    ]);
                    break;
                  case 'chat':
                    CurrentDirectory = Projects.Chat;
                    print([
                      textLine({
                        words: [
                          textWord({ characters: 'Succefully switched to ' + Projects.Chat }),
                        ],
                      }),
                    ]);
                    print([
                      textLine({
                        words: [
                          textWord({
                            characters:
                              'Keep in mind that chat backend checks only mainnet balances!',
                          }),
                        ],
                      }),
                    ]);
                    break;
                  case 'candyshop':
                    // CurrentDirectory = Projects.candyshop;
                    // print([textLine({words:[textWord({ characters: "Succefully switched to " + Projects.candyshop })]})]);
                    print([
                      textLine({ words: [textWord({ characters: 'Project is coming soon ' })] }),
                    ]);

                    break;
                  case 'ogswap':
                    // CurrentDirectory = Projects.ogswap;
                    // print([textLine({words:[textWord({ characters: "Succefully switched to " + Projects.ogswap })]})]);
                    print([
                      textLine({ words: [textWord({ characters: 'Project is coming soon ' })] }),
                    ]);
                    break;
                  default:
                    print([
                      textLine({
                        words: [textWord({ characters: 'There is no project with this name ' })],
                      }),
                    ]);
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
                case Projects.Updates:
                  UpdatesParser(eventQueue, state, command);
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
                  print([
                    textLine({ words: [textWord({ characters: 'Error: please refresh page' })] }),
                  ]);
                  break;
              }
            }}
            prompt={'/' + CurrentDirectory + ' $ '}
            banner={[
              textLine({ words: [textWord({ characters: messages.banner })] }),
              textLine({
                words: [
                  anchorWord({
                    className: 'link-padding',
                    characters: messages.gc,
                    onClick: () => {
                      window.open(gcLink, '_blank');
                    },
                  }),
                ],
              }),
              isTestnet
                ? textLine({
                    words: [
                      anchorWord({
                        className: 'link-padding',
                        characters: messages.faucet,
                        onClick: () => {
                          window.open(faucetLink, '_blank');
                        },
                      }),
                    ],
                  })
                : null,
            ]}
          ></Terminal>
          <Header />
        </DisableMobile>
      </main>
    </Layout>
  );
}
