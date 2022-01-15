import { RootControllerActions } from 'redux/terminalController/terminalControllerActionTypes';
import { Prefix } from '../../messages/messages';

const notFoundStrings = [
  `
  Don’t break the gears! Machines are orderly systems, so don’t disrupt the engines. Follow the process by typing ${Prefix.PREFIX}${RootControllerActions.HELP} in the command line below.
  `,
  `
  Anon-kun, did 0xtuba bite you? Stop doing weird stuff and go type ${Prefix.PREFIX}${RootControllerActions.HELP}.
  `,
  `
  Andre Cronje is an amazing builder, and if you think otherwise - type ${Prefix.PREFIX}${RootControllerActions.HELP}.
  `,
  `
  How many times have you typed random stuff? You need to type ${Prefix.PREFIX}${RootControllerActions.HELP}.
  `,
  `
  You might be attracted to scoopy so you need to type ${Prefix.PREFIX}${RootControllerActions.HELP}.
  `,
  `
  If you don’t have a comfy couch, reach out to mewny. But first, type ${Prefix.PREFIX}${RootControllerActions.HELP}.
  `,
  `
  Ivangbi has a terrible sense of humour, type ${Prefix.PREFIX}${RootControllerActions.HELP} to literally help him with the recovery.
  `,
  `
  Let’s collect NFTs, screw DeFi? Type ${Prefix.PREFIX}${RootControllerActions.HELP} if you want to proceed.
  `,
];

export default notFoundStrings;
