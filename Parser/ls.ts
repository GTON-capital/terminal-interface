import { TerminalState } from '../State/types';
import { getDirs } from './dirs';

export function ls(state: TerminalState): string {
  const dirs = getDirs(state);

  return dirs.map((dir) => `/${dir.path} - ${dir.description}`).join('\n');
}
