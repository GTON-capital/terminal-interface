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
        title: 'Testing | GTON Capital',
        description:
          'Test the GTON ecosystem via terminal UI.',
        keyWords: 'GTON, crypto, staking',
        url: 'https://test.cli.gton.capital/',
      }}
    >
      {isLive ? <LiveIndex /> : <PlaceholderIndex />}
    </Layout>
  );
}

export default Index;
