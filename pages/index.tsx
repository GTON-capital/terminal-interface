import React from 'react';
import dynamic from 'next/dynamic';
import { isLive } from 'config/config';
import Layout from 'components/Layout/Layout';

const LiveIndex = dynamic(() => import('screens/index/Live/Live'), {
  ssr: false,
});
const PlaceholderIndex = dynamic(() => import('screens/index/Placeholder/Placeholder'), {
  ssr: false,
});

function Index() {
  return (
    <Layout
      layoutParams={{
        title: 'CLI UI | GTON Capital (𝔾ℂ)',
        description:
          'An inovative way of USER <-> SC interaction for 𝔾ℂEco products.',
        keyWords: 'GTON, GC, bonding, crypto, staking, DeFi, DAO',
        url: 'https://cli.gton.capital/',
      }}
    >
      {isLive ? <LiveIndex /> : <PlaceholderIndex />}
    </Layout>
  );
}

export default Index;
