import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const setWorkQueueIsMessagesSequence = [
  set(state.workQueueIsMessages, true),
  navigateToDashboardAction,
];
