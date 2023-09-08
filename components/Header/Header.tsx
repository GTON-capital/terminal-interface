/* eslint-disable */
import React from 'react';
import { useEffect, useState } from 'react';
import classes from './header.module.scss';
import Web3 from 'web3';
import { ApplicationConfig } from '../../config/types';
import { TerminalState } from '../../State/types';
declare const window: any;

interface IHeaderProps {
  config: ApplicationConfig;
  state: TerminalState;
}

function Header({ config, state }: IHeaderProps) {
  let explorerUrl: string;
  let networkName: string;

  if (state) {
    explorerUrl = state.chain.isL2Network
      ? state.chain.explorerUrl
      : config.chains[state.chain.oppositeChainId].explorerUrl; // Only GTON explorers
    networkName = state.chain.name.replace('-', ' ').toUpperCase();
  } else {
    explorerUrl = 'https://explorer.gton.network';
    networkName = 'NOT CONNECTED';
  }

  return (
    <div className={classes.headerContainer}>
      <a
        href="https://gton.capital"
        target="_blank"
        rel="noopener noreferrer"
        className={classes.headerTextWrap}
      >
        WEBSITE
      </a>
      <a
        href="https://docs.gton.capital"
        target="_blank"
        rel="noopener noreferrer"
        className={classes.headerTextWrap}
      >
        DOCS
      </a>
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={classes.headerTextWrap}
      >
        EXPLORER
      </a>
      <a
        href="https://forum.gton.capital"
        target="blank"
        rel="noopener noreferrer"
        className={classes.headerTextWrap}
      >
        FORUM
      </a>
      <div className={classes.btn}>{networkName}</div>
    </div>
  );
}

export default Header;
