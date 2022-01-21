import { RootControllerActions } from 'redux/terminalController/terminalControllerActionTypes';
import { Prefix } from '../../messages/messages';

const notFoundStrings = [
  `
  You really need to ${RootControllerActions.HELP} yourself with getting rich. Type ${Prefix.PREFIX}${RootControllerActions.HELP}.
  `,
  `
  HELP! They kidnapped me and made me ask you to type help messages! Please, type ${Prefix.PREFIX}${RootControllerActions.HELP} to save...
  `,
  `
  if you type ${Prefix.PREFIX}${RootControllerActions.HELP} you will be able to see available commands.
  `,
  `
  Maybe we will add your command in future, but now you should use one of the help list. Type ${Prefix.PREFIX}${RootControllerActions.HELP} and see.
  `,
  `
  Don’t break the gears! Machines are orderly systems, so don’t disrupt the engines. Follow the process by typing ${Prefix.PREFIX}${RootControllerActions.HELP} in the command line below.
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
];

export default notFoundStrings;
