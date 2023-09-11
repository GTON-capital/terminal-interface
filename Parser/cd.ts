import { TerminalState } from '../State/types';
import { getStablecoinNameFromPath } from './path';

export const Projects = {
  Root: 'home',
  Ogswap: 'ogswap',
  Stablecoins: 'stablecoins/',
};

type ChangeDirectoryResult = {
  newDirectory: string | null;
  message: string;
};

export function cd(project: string, state: TerminalState): ChangeDirectoryResult {
  switch (project) {
    case Projects.Root:
      return {
        newDirectory: Projects.Root,
        message: 'Succefully switched to ' + Projects.Root,
      };
    case Projects.Ogswap:
      // CurrentDirectory = Projects.ogswap;
      // print([textLine({words:[textWord({ characters: "Succefully switched to " + Projects.ogswap })]})]);
      return {
        newDirectory: null,
        message: 'Project is coming soon ',
      };
    default:
      const stablecoin = getStablecoinNameFromPath(project);
      if (stablecoin && state && state.chain.simulatedTokens[stablecoin]) {
        return {
          newDirectory: project,
          message: `Succesfully switched to stablecoin ${stablecoin} project`,
        };
      }
      return {
        newDirectory: null,
        message: 'There is no project with this name ',
      };
  }
}
