import { TerminalState } from '../State/types';
import { Projects } from './cd';

type DirectoryDescriptor = {
  path: string;
  description: string;
};

export function getDirs(state: TerminalState): Array<DirectoryDescriptor> {
  const defaultDirectories: Array<DirectoryDescriptor> = [
    {
      path: Projects.Home,
      description: 'Your home directory',
    },
    {
      path: Projects.Ogswap,
      description: 'Project is coming soon',
    },
  ];

  if (state) {
    const stablecoinDirs: Array<DirectoryDescriptor> = Object.keys(state.chain.simulatedTokens).map(
      (name) => ({
        path: `${Projects.Stablecoins}${name}`,
        description: `Manage your ${name} tokens from this directory`,
      }),
    );
    return defaultDirectories.concat(...stablecoinDirs);
  }
  return defaultDirectories;
}
