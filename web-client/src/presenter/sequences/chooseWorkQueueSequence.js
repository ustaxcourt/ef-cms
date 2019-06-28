import { chooseWorkQueueAction } from '../actions/chooseWorkQueueAction';
import { clearWorkQueueAction } from '../actions/clearWorkQueueAction';
import { getInboxMessagesForSectionAction } from '../actions/getInboxMessagesForSectionAction';
import { getInboxMessagesForUserAction } from '../actions/getInboxMessagesForUserAction';
import { getNotificationsAction } from '../actions/getNotificationsAction';
import { getSentMessagesForSectionAction } from '../actions/getSentMessagesForSectionAction';
import { getSentMessagesForUserAction } from '../actions/getSentMessagesForUserAction';
import { getSentWorkItemsForSectionAction } from '../actions/getSentWorkItemsForSectionAction';
import { getSentWorkItemsForUserAction } from '../actions/getSentWorkItemsForUserAction';
import { getWorkItemsByUserAction } from '../actions/getWorkItemsByUserAction';
import { getWorkItemsForSectionAction } from '../actions/getWorkItemsForSectionAction';
import { parallel } from 'cerebral/factories';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { setSectionInboxCountAction } from '../actions/setSectionInboxCountAction';
import { setWorkItemsAction } from '../actions/setWorkItemsAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const chooseWorkQueueSequence = [
  setFormSubmittingAction,
  clearWorkQueueAction,
  chooseWorkQueueAction,
  {
    messagesmyinbox: [
      parallel([
        [getNotificationsAction, setNotificationsAction],
        [getInboxMessagesForUserAction, setWorkItemsAction],
      ]),
    ],
    messagesmyoutbox: [
      parallel([
        [getNotificationsAction, setNotificationsAction],
        [getSentMessagesForUserAction, setWorkItemsAction],
      ]),
    ],
    messagessectioninbox: [
      parallel([
        [getNotificationsAction, setNotificationsAction],
        [getInboxMessagesForSectionAction, setWorkItemsAction],
      ]),
    ],
    messagessectionoutbox: [
      parallel([
        [getNotificationsAction, setNotificationsAction],
        [getSentMessagesForSectionAction, setWorkItemsAction],
      ]),
    ],
    mybatched: [
      parallel([
        [getNotificationsAction, setNotificationsAction],
        [getSentWorkItemsForUserAction, setWorkItemsAction],
      ]),
    ],
    myinbox: [
      parallel([
        [getNotificationsAction, setNotificationsAction],
        [getWorkItemsByUserAction, setWorkItemsAction],
      ]),
    ],
    myoutbox: [
      parallel([
        [getNotificationsAction, setNotificationsAction],
        [getSentWorkItemsForUserAction, setWorkItemsAction],
      ]),
    ],
    sectionbatched: [
      parallel([
        [getNotificationsAction, setNotificationsAction],
        [getSentWorkItemsForSectionAction, setWorkItemsAction],
      ]),
    ],
    sectioninbox: [
      parallel([
        [getNotificationsAction, setNotificationsAction],
        [
          getWorkItemsForSectionAction,
          setWorkItemsAction,
          setSectionInboxCountAction,
        ],
      ]),
    ],
    sectionoutbox: [
      parallel([
        [getNotificationsAction, setNotificationsAction],
        [getSentWorkItemsForSectionAction, setWorkItemsAction],
      ]),
    ],
  },
  unsetFormSubmittingAction,
];
