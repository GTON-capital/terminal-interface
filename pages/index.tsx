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
        title: 'Credit account mining | Gearbox',
        description:
          'Composable leverage starts with Credit Account Mining. Gear up and join Gearbox DAO!',
        keyWords: 'Gearbox, crypto, credit account mining',
        url: 'https://credit-mining.gearbox.finance',
      }}
    >
      {isLive ? <LiveIndex /> : <PlaceholderIndex />}
    </Layout>
  );
}

export default Index;
