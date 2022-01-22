import React, { PropsWithChildren } from 'react';
import classes from './layout.module.scss';
import SiteHead, { ISiteHeadProps } from './SiteHead';

type LayoutProps = {
  layoutParams: ISiteHeadProps;
};

const Layout = function Layout({
  layoutParams: {
    title, description, keyWords, url,
  },
  children }:  PropsWithChildren<LayoutProps>) {
    return (
      <>
        <SiteHead title={title} description={description} keyWords={keyWords} url={url} />
        <div className={classes.layout}>{children}</div>
      </>
    );
};

export default Layout;
