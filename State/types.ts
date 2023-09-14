import { Dispatch, SetStateAction } from 'react';
import { ChainConfig, ChainId } from '../config/types';

export type State = {
  address: string;
  chainId: number;
  chain: ChainConfig;
};

export type TerminalState = State | null;

export type TerminalStateWithDispatch = [TerminalState, Dispatch<SetStateAction<TerminalState>>];
