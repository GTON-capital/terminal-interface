import React from 'react';
import classes from './header.module.scss';
import switchChain from '../../Parser/WEB3/Switch';
import { chain } from '../../config/config';
declare const window: any;

function Header() {
  return (
    <div className={classes.headerWrap}>
      <a href="https://gton.capital" target="_blank" className={classes.headerTextWrap}>
        Website
      </a>
      <a href="https://docs.gton.capital" target="_blank" className={classes.headerTextWrap}>
        Docs
      </a>
      <a href="https://gton.capital/faq" target="_blank" className={classes.headerTextWrap}>
        FAQ
      </a>
      <a
        href="https://snapshot.org/#/ftm.gton.eth"
        target="blank"
        className={classes.headerTextWrap}
      >
        Voting
      </a>
      <div className={classes.child}>
        <button
          onClick={() => {
            switchChain('fantom');
          }}
          className={classes.btn}
        >
          Fantom
        </button>
        <button onClick={() => switchChain(chain.chainName)} className={classes.btn}>
          {chain.chainName}
        </button>
      </div>
    </div>
  );
}

export default Header;
