import React from 'react';
import classes from './header.module.scss';
import { chain } from '../../config/config';
import { isCurrentChain } from '../../Parser/WEB3/validate';
let cc;
isCurrentChain(chain.chainId).then((i) => (cc = i));
function Header() {
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
      <div className={classes.btn}>{cc ? chain.chainName : 'Wrong network'}</div>
    </div>
  );
}

export default Header;
