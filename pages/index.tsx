import React, { useEffect } from 'react';
import {
  Terminal,
  useEventQueue,
  textLine,
  textWord,
  anchorWord,
} from 'crt-terminal';
import Layout from '../components/Layout/Layout';
import DisableMobile from '../components/DisableMobile/DisableMobile';
import classes from './index.module.scss';
import { faucetLink, gcLink, isTestnet } from '../config/config';
import GTONParser from '../Parser/GTONCapitalProjects/GTONCapitalRouter';
import messages from '../Messages/Messages';
import { ParseJoin, ParseSwitch, ParseStake, ParseUnstake } from '../Parser/PresetParser'

const Projects =
{
  "staking": "staking", 
  "candyshop": "candyshop", 
  "ogswap": "ogswap"
}

var CurrentDirectory = Projects.staking;
var Preset = false

export default function Web() {

  const eventQueue = useEventQueue();
  const { lock, loading, clear, print, focus } = eventQueue.handlers;

  useEffect(() => 
  {
    async function load() 
    {
        Preset = true;
        if(window.location.search.includes("stake"))
        {
          if(await ParseJoin(eventQueue) == true)
          {
            if(await ParseSwitch(eventQueue) == true)
            {
              if(await ParseStake(eventQueue, window.location.search) == true)
              {
                console.log("nice")
              }
            }
          }
        }
        else if(window.location.search.includes("unstake"))
        {
          if(await ParseJoin(eventQueue) == true)
          {
            if(await ParseSwitch(eventQueue) == true)
            {
              if(await ParseUnstake(eventQueue, window.location.search) == true)
              {
                console.log("nice")
              }
            }
          }
        }
    }
    if(window.location.search != "" && !Preset)
    {
      load();
    }
  })

  return (
    <Layout
      layoutParams={{
        title: 'CLI UI | GTON Capital (𝔾ℂ)',
        description:
          'An inovative way of USER <-> SC interaction for 𝔾ℂEco products.',
        keyWords: 'GTON, GC, bonding, crypto, staking, DeFi, DAO',
        url: 'https://test.cli.gton.capital/',
      }}>
      <main className={classes.mainContainer}>
      <DisableMobile>
        <Terminal
          queue={eventQueue}
          onCommand={(command) =>
          {
            if(command.split(' ')[0] == "cd")
            {
              switch(command.split(' ')[1])
              {
                case "staking":
                  CurrentDirectory = Projects.staking;
                  print([textLine({words:[textWord({ characters: "Succefully switched to " + Projects.staking })]})]);
                  break;
                case "candyshop":
                  // CurrentDirectory = Projects.candyshop;
                  // print([textLine({words:[textWord({ characters: "Succefully switched to " + Projects.candyshop })]})]);
                  print([textLine({words:[textWord({ characters: "Project is coming soon " })]})]);

                  break;
                case "ogswap":
                  // CurrentDirectory = Projects.ogswap;
                  // print([textLine({words:[textWord({ characters: "Succefully switched to " + Projects.ogswap })]})]);
                  print([textLine({words:[textWord({ characters: "Project is coming soon " })]})]);
                  break;
                default:
                  print([textLine({words:[textWord({ characters: "There is no project with this name " })]})]);
                  break;
              }
              return;
            }

            switch(CurrentDirectory)
            {
              case Projects.staking:
                GTONParser(eventQueue, command);
                break;
              case Projects.candyshop:
                // import CandyParser from './Parser/CandyShop/CandyShopParser'
                break;
              case Projects.ogswap:
                // import OGSwapParser from './Parser/OGSwap/OGSwapParser'
                break;
              default:
                print([textLine({words:[textWord({ characters: "Error: please refresh page" })]})]);
                break;
            }

          }
        }
        prompt={"/"+CurrentDirectory+" $ "}
        banner={[
          textLine({ words: [textWord({ characters: messages.banner })] }),
          textLine({ words: [anchorWord({ className: "link-padding", characters: messages.gc, href: gcLink })] }),
          isTestnet ? textLine({ words: [anchorWord({ className: "link-padding", characters: messages.faucet, href: faucetLink })] }): null,
        ]}
        />
        </DisableMobile>
      </main>
    </Layout>
  );
}
