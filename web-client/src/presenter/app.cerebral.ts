import { baseState, computeds } from './state';
import {
  sequences as cerebralSequences,
  state as cerebralState,
} from 'cerebral';
import { presenterSequences } from './presenter';

export const initialState = {
  ...baseState,
  ...computeds,
};

export type ClientState = typeof initialState;
export const state = cerebralState as unknown as ClientState;

export const sequences = cerebralSequences as unknown as Sequences;
export type Sequences = typeof presenterSequences;
