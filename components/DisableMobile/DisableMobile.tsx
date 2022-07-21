/* eslint-disable */
import React, { PropsWithChildren } from 'react';
import { isMobile, isTablet } from 'react-device-detect';
import classes from './disable.module.scss';

interface IDisableMobileProps {}

function DisableMobile({ children }: PropsWithChildren<IDisableMobileProps>) {
  const show = !isMobile && !isTablet;
  return (
    <div className={classes.containerWrap} style={{ position: 'relative', height: '100%' }}>
      {!show && (
        <div className="containerOverlay">
          <img className={classes.logo} src="/images/title.png" />
          <span className={classes.subtitle}>
            Terminal is accessible <br /> from desktop only.
            <br />
            <br /> Apologies for the inconvenience.
          </span>
          <a
            href="https://gton.capital"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.TextWrap}
          >
            WEBSITE
          </a>
          <a
            href="https://docs.gton.capital"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.TextWrap}
          >
            DOCS
          </a>
          <a
            href="https://explorer.testnet.gton.network"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.TextWrap}
          >
            EXPLORER
          </a>
          <a
            href="https://forum.gton.capital"
            target="blank"
            rel="noopener noreferrer"
            className={classes.TextWrap}
          >
            FORUM
          </a>
          <div>
            <a className={classes.link} href="https://twitter.com/GtonCapital">
              <img className={classes.img} src="/images/twitter.svg" />
            </a>
            <a className={classes.link} href="https://t.me/GC_community">
              <img className={classes.img} src="/images/telegram.svg" />
            </a>
            <a className={classes.link} href="https://discord.com/invite/Ce972zqGW6">
              <img className={classes.img} src="/images/discord.svg" />
            </a>
          </div>
        </div>
      )}
      {show && children}
    </div>
  );
}

export default DisableMobile;
