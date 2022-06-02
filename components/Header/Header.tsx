import React from 'react';
import { useEffect, useState } from 'react';
import classes from './header.module.scss';
import { chain, claimNetwork } from '../../config/config';
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

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', function (networkId) {
        const id = parseInt(networkId.toString(16)).toString()
        setChain(id);
        console.log(id);
      });
    }
  });

  useEffect(() => {
    // Set initial chain
    const getChain = async () => {
      const web3 = new Web3(window.ethereum);
      const currentChainId = await (await web3.eth.net.getId()).toString();
      setChain(currentChainId);
    }

    getChain()
      .catch(console.error);
  }, []);

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
        href="https://explorer.testnet.gton.network"
        target="_blank"
        rel="noopener noreferrer"
        className={classes.headerTextWrap}
      >
        GTON Chain Explorer
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
        {isCurrentChainId === chain.chainId
          ? chain.chainName
          : isCurrentChainId === claimNetwork
          ? 'Fantom'
          : 'Wrong network'}
      </div>
    </div>
  );
}

export default Header;
