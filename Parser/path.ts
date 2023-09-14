import { Projects } from './cd';

export function getStablecoinNameFromPath(path: string): string | null {
  if (path.startsWith(Projects.Stablecoins)) {
    const unprefixedPath = path.substring(Projects.Stablecoins.length);
    if (unprefixedPath.indexOf('\\') === -1) {
      return unprefixedPath;
    }
  }
  return null;
}
