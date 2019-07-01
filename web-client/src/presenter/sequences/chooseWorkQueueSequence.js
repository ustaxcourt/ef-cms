import { chooseWorkQueueAction } from '../actions/chooseWorkQueueAction';
import { clearWorkQueueAction } from '../actions/clearWorkQueueAction';
import { getDocumentQCBatchedForSectionAction } from '../actions/getDocumentQCBatchedForSectionAction';
import { getDocumentQCBatchedForUserAction } from '../actions/getDocumentQCBatchedForUserAction';
import { getDocumentQCInboxForSectionAction } from '../actions/getDocumentQCInboxForSectionAction';
import { getDocumentQCInboxForUserAction } from '../actions/getDocumentQCInboxForUserAction';
import { getDocumentQCServedForSectionAction } from '../actions/getDocumentQCServedForSectionAction';
import { getDocumentQCServedForUserAction } from '../actions/getDocumentQCServedForUserAction';
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
  parallel([
    [getNotificationsAction, setNotificationsAction],
    [
      chooseWorkQueueAction,
      {
        documentqcmybatched: [
          getDocumentQCBatchedForUserAction,
          setWorkItemsAction,
        ],
        documentqcmyinbox: [
          getDocumentQCInboxForUserAction,
          setWorkItemsAction,
        ],
        documentqcmyoutbox: [
          getDocumentQCServedForUserAction,
          setWorkItemsAction,
        ],
        documentqcsectionbatched: [
          getDocumentQCBatchedForSectionAction,
          setWorkItemsAction,
        ],
        documentqcsectioninbox: [
          getDocumentQCInboxForSectionAction,
          setWorkItemsAction,
          setSectionInboxCountAction,
        ],
        documentqcsectionoutbox: [
          getDocumentQCServedForSectionAction,
          setWorkItemsAction,
        ],
        messagesmyinbox: [getInboxMessagesForUserAction, setWorkItemsAction],
        messagesmyoutbox: [getSentMessagesForUserAction, setWorkItemsAction],
        messagessectioninbox: [
          getInboxMessagesForSectionAction,
          setWorkItemsAction,
        ],
        messagessectionoutbox: [
          getSentMessagesForSectionAction,
          setWorkItemsAction,
        ],
        mybatched: [getSentWorkItemsForUserAction, setWorkItemsAction],
        myinbox: [getWorkItemsByUserAction, setWorkItemsAction],
        myoutbox: [getSentWorkItemsForUserAction, setWorkItemsAction],
        sectionbatched: [getSentWorkItemsForSectionAction, setWorkItemsAction],
        sectioninbox: [
          getWorkItemsForSectionAction,
          setWorkItemsAction,
          setSectionInboxCountAction,
        ],
        sectionoutbox: [getSentWorkItemsForSectionAction, setWorkItemsAction],
      },
    ],
  ]),
  unsetFormSubmittingAction,
];
