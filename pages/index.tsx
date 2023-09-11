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
import { gcLink } from '../config/config';
import messages from '../Messages/Messages';
import Header from '../components/Header/Header';
import { useRouter } from 'next/router';
import { Projects, cd } from '../Parser/cd';
import { useTerminalState } from '../State/hook';
import stablecoinsParserFactory from '../Parser/Stablecoins/factory';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { ApplicationConfig } from '../config/types';
import { config } from '../config';
import rootParserFectory from '../Parser/Root/factory';
import { Parser } from '../Parser/Common/parser';
import { getStablecoinNameFromPath } from '../Parser/path';
import { ls } from '../Parser/ls';

declare const window: any;

let CurrentDirectory = Projects.Home;

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
        url: 'https://cli.gton.capital/',
      }}
    >
      <main className={classes.mainContainer}>
        <DisableMobile>
          <Terminal
            queue={eventQueue}
            onCommand={(command) => {
              const commandName = command.split(' ')[0];
              if (commandName == 'cd') {
                const result = cd(command.split(' ')[1], state[0]);
                if (result.newDirectory) {
                  CurrentDirectory = result.newDirectory;
                }

                print([
                  textLine({
                    words: [textWord({ characters: result.message })],
                  }),
                ]);
              }

              if (commandName === 'ls') {
                const result = ls(state[0]);

                print([
                  textLine({
                    words: [textWord({ characters: result })],
                  }),
                ]);
              }

              let parser: Parser;

              switch (CurrentDirectory) {
                case Projects.Home:
                  parser = rootParserFectory(config, state[0]);
                  parser(eventQueue, state, command);
                  break;
                case Projects.Ogswap:
                  // import OGSwapParser from './Parser/OGSwap/OGSwapParser'
                  break;
                default:
                  const stablecoinName = getStablecoinNameFromPath(CurrentDirectory);
                  if (stablecoinName) {
                    parser = stablecoinsParserFactory(stablecoinName, config, state[0]);
                    parser(eventQueue, state, command);
                  } else {
                    print([
                      textLine({ words: [textWord({ characters: 'Error: please refresh page' })] }),
                    ]);
                  }
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
              ].filter(Boolean) as Array<TextLine>
            }
          ></Terminal>
          <Header config={config} state={state[0]} />
        </DisableMobile>
      </main>
    </Layout>
  );
}
