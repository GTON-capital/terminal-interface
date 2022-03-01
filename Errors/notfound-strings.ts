import { Commands, Prefix } from '../Messages/Messages';

const notFoundStrings = [
  `
  You really need to ${Commands.HELP} yourself with getting rich. Type ${Prefix.PREFIX}${Commands.HELP}..
  `,
  `
  HELP! They kidnapped me and made me ask you to type help messages! Please, type ${Prefix.PREFIX}${Commands.HELP} to save...
  `,
  `
  if you type ${Prefix.PREFIX}${Commands.HELP} you will be able to see available commands.
  `,
  `
  Maybe we will add your command in future, but now you should use one of the help list. Type ${Prefix.PREFIX}${Commands.HELP} and see.
  `,
  `
  I have a tip for you. Type ${Commands.HELP} and you’ll get access to a magnificent collection of commands available for this app
  `,
  `
  Andre Cronje is an amazing builder, and if you think otherwise - type ${Prefix.PREFIX}${Commands.HELP}.
  `,
  `
  How many times have you typed random stuff? You need to type ${Prefix.PREFIX}${Commands.HELP}.
  `,
  `
  I’m just a heartless machine but you’re making me cry by typing this irrelevant stuff. Just use ${Commands.HELP}
  `,
  `
  If you don’t have a comfy couch, reach out to mewny. But first, type ${Prefix.PREFIX}${Commands.HELP}.
  `,
  `
  Ma brain is too smol to figure out what you’re trying to do. Just type ${Commands.HELP}
  `,
];

export default notFoundStrings;