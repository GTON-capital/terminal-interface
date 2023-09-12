import { Prefix } from '../Messages/Messages';
import { TerminalState } from '../State/types';
import { getDirs } from './dirs';

export const Projects = {
  Home: 'home',
  Ogswap: 'ogswap',
  Stablecoins: 'stablecoins/',
};

type ChangeDirectoryResult = {
  newDirectory: string | null;
  message: string;
};

export function cd(project: string, state: TerminalState): ChangeDirectoryResult {
  const dirs = getDirs(state);

  const dir = dirs.find((dir) => dir.path === project);

  if (!dir) {
    return {
      newDirectory: null,
      message: `There is no project with this name. Try ${Prefix.PREFIX}ls command to list projects`,
    };
  }

  return {
    newDirectory: dir.path,
    message: `Succefully switched to ${project}`,
  };
}
