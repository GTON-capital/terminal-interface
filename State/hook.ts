import { useEffect, useState } from 'react';
import { TerminalState, TerminalStateWithDispatch } from './types';
import { EMPTY_STATE } from './constants';
import { connect } from '../Parser/common';
import { ApplicationConfig } from '../config/types';

export function useTerminalState(config: ApplicationConfig): TerminalStateWithDispatch {
  const [terminalState, setTerminalState] = useState<TerminalState>(EMPTY_STATE);

  useEffect(() => {
    connect(config, [terminalState, setTerminalState])
      .then()
      .catch((e) => console.error(e));
  }, []);

  return [terminalState, setTerminalState];
}
