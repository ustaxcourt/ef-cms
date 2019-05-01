import { chooseWorkQueueAction } from '../actions/chooseWorkQueueAction';
import { clearWorkQueueAction } from '../actions/clearWorkQueueAction';
import { getNotificationsAction } from '../actions/getNotificationsAction';
import { getSentWorkItemsForSectionAction } from '../actions/getSentWorkItemsForSectionAction';
import { getSentWorkItemsForUserAction } from '../actions/getSentWorkItemsForUserAction';
import { getWorkItemsByUserAction } from '../actions/getWorkItemsByUserAction';
import { getWorkItemsForSectionAction } from '../actions/getWorkItemsForSectionAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { setWorkItemsAction } from '../actions/setWorkItemsAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const chooseWorkQueueSequence = [
  setFormSubmittingAction,
  clearWorkQueueAction,
  getNotificationsAction,
  setNotificationsAction,
  chooseWorkQueueAction,
  {
    myinbox: [getWorkItemsByUserAction, setWorkItemsAction],
    myoutbox: [getSentWorkItemsForUserAction, setWorkItemsAction],
    sectioninbox: [getWorkItemsForSectionAction, setWorkItemsAction],
    sectionoutbox: [getSentWorkItemsForSectionAction, setWorkItemsAction],
  },
  unsetFormSubmittingAction,
];
