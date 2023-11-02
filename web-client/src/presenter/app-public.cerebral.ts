import {
  sequences as cerebralSequences,
  state as cerebralState,
} from 'cerebral';
import type { PublicClientState } from './state-public';
import type { PublicSequences } from '@web-client/presenter/presenter-public';

export const state = cerebralState as unknown as PublicClientState;

export const sequences = cerebralSequences as unknown as PublicSequences;
