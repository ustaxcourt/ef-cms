import { ClientState } from '@web-client/presenter/state';
import {
  sequences as cerebralSequences,
  state as cerebralState,
} from 'cerebral';
import { presenterSequences } from './presenter';

export const state = cerebralState as unknown as ClientState;

export const sequences = cerebralSequences as unknown as Sequences;
export type Sequences = typeof presenterSequences;
