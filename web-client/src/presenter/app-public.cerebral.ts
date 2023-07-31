import { PublicClientState } from './state-public';
import {
  sequences as cerebralSequences,
  state as cerebralState,
} from 'cerebral';
import type { Sequences } from '@web-client/presenter/presenter';

export const state = cerebralState as unknown as PublicClientState;

export const sequences = cerebralSequences as unknown as Sequences;
