import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const unsetWorkQueueIsInternalSequence = [
  set(state.workQueueIsInternal, false),
  navigateToDashboardAction,
];
