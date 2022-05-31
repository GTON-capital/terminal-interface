import React from 'react';
import { useEffect, useState } from 'react';
import classes from './header.module.scss';
import { chain, network } from '../../config/config';
import { isCurrentChain } from '../../Parser/WEB3/validate';
import Web3 from 'web3';
declare const window: any;

function Header() {
  let chainId;
  useEffect(() => {
    chainId = async () => {
      const web3 = new Web3(window.ethereum);
      return await web3.eth.net.getId();
    };
  });

  let [isCurrentChainId, setChain] = useState(chainId);
  console.log(isCurrentChainId);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('networkChanged', function (networkId) {
        setChain(networkId);
        console.log(chainId);
      });
    }
  });

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
      <div className={classes.btn}>
        {isCurrentChainId === chain.chainId ? chain.chainName : 'Wrong network'}
      </div>
    </div>
  );
}

export default Header;
