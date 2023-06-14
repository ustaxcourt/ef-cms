import {
  sequences as cerebralSequences,
  state as cerebralState,
} from 'cerebral';
import type { ClientState } from '@web-client/presenter/state';
import type { Sequences } from '@web-client/presenter/presenter';

export const state = cerebralState as unknown as ClientState;

export const sequences = cerebralSequences as unknown as Sequences;
