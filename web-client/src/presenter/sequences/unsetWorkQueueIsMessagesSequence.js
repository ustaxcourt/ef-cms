import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const unsetWorkQueueIsMessagesSequence = [
  set(state.workQueueIsMessages, false),
  navigateToDashboardAction,
];
