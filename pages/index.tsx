import React, { useEffect } from 'react';
import {
  Terminal,
  useEventQueue,
  textLine,
  textWord,
  anchorWord,
  TextLine,
} from '@gton-capital/crt-terminal';
import Layout from '../components/Layout/Layout';
import DisableMobile from '../components/DisableMobile/DisableMobile';
import classes from './index.module.scss';
import { faucetLink, gcLink, isTestnet, chain } from '../config/config';
import UpdatesParser from '../Parser/Updating/factory';
import messages from '../Messages/Messages';
import Header from '../components/Header/Header';
import { useRouter } from 'next/router';
import { Projects, cd } from '../Parser/cd';
import { useTerminalState } from '../State/hook';
import updateParserFactory from '../Parser/Updating/factory';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { ApplicationConfig } from '../config/types';
import { config } from '../config';

declare const window: any;

let CurrentDirectory = Projects.Updates;

export const getStaticProps: GetStaticProps<{
  config: ApplicationConfig;
}> = async () => {
  return { props: { config: config() } };
};

export default function Web({ config }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const eventQueue = useEventQueue();
  const { print, typeCommand } = eventQueue.handlers;

  const state = useTerminalState(config);

  useEffect(() => {
    if (router.isReady) {
      if (typeof router.query.c === 'string') {
        typeCommand(router.query.c);
      }
    }
  }, [router.isReady]);

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
                const result = cd(command.split(' ')[1]);
                if (result.newDirectory) {
                  CurrentDirectory = result.newDirectory;
                }

                print([
                  textLine({
                    words: [textWord({ characters: result.message })],
                  }),
                ]);
              }

              switch (CurrentDirectory) {
                case Projects.Updates:
                  const parser = updateParserFactory(config, state[0]);
                  parser(eventQueue, state, command);
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
            banner={
              [
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
              ].filter(Boolean) as Array<TextLine>
            }
          ></Terminal>
          <Header config={config} state={state[0]} />
        </DisableMobile>
      </main>
    </Layout>
  );
}
