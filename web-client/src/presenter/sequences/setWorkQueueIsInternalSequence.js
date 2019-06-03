import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const setWorkQueueIsInternalSequence = [
  set(state.workQueueIsInternal, true),
];
