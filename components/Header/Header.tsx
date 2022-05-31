import React from 'react';
import { useEffect, useState } from 'react';
import classes from './header.module.scss';
import { chain } from '../../config/config';
import { isCurrentChain } from '../../Parser/WEB3/validate';
import Web3 from 'web3';
declare const window: any;

function Header() {
  let isCurrentNetwork = false;

  React.useEffect(() => {
    async () => {
      await isCurrentChain(chain.chainId);
    };
  }),
    [isCurrentNetwork];

  return (
    <div className={classes.headerWrap}>
      <a
        href="https://gton.capital"
        target="_blank"
        rel="noopener noreferrer"
        className={classes.headerTextWrap}
      >
        Website
      </a>
      <a
        href="https://docs.gton.capital"
        target="_blank"
        rel="noopener noreferrer"
        className={classes.headerTextWrap}
      >
        Docs
      </a>
      <a
        href="https://gton.capital/faq"
        target="_blank"
        rel="noopener noreferrer"
        className={classes.headerTextWrap}
      >
        FAQ
      </a>
      <a
        href="https://snapshot.org/#/gton.eth"
        target="blank"
        rel="noopener noreferrer"
        className={classes.headerTextWrap}
      >
        Voting
      </a>
      <div className={classes.btn}>{isCurrentNetwork ? chain.chainName : 'Wrong Network'}</div>
    </div>
  );
}

export default Header;
