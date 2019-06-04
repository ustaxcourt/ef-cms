import { getNotificationsAction } from '../actions/getNotificationsAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { set } from 'cerebral/factories';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { state } from 'cerebral';

import { getWorkItemsForSectionAction } from '../actions/getWorkItemsForSectionAction';
import { setSectionInboxCountAction } from '../actions/setSectionInboxCountAction';
import { setWorkItemsAction } from '../actions/setWorkItemsAction';

export const unsetWorkQueueIsInternalSequence = [
  set(state.workQueueIsInternal, false),
  getNotificationsAction,
  setNotificationsAction,
  getWorkItemsForSectionAction,
  setWorkItemsAction,
  setSectionInboxCountAction,
  navigateToDashboardAction,
];
