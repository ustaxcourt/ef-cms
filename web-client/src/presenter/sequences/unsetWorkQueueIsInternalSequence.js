import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const unsetWorkQueueIsInternalSequence = [
  set(state.workQueueToDisplay.workQueueIsInternal, false),
  navigateToDashboardAction,
];
