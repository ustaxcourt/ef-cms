import { getNotificationsAction } from '../actions/getNotificationsAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { set } from 'cerebral/factories';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { state } from 'cerebral';

export const setWorkQueueIsInternalSequence = [
  set(state.workQueueIsInternal, true),
  getNotificationsAction,
  setNotificationsAction,
  navigateToDashboardAction,
];
