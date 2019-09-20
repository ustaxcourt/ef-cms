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
import { parallel } from 'cerebral/factories';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { setSectionInboxCountAction } from '../actions/setSectionInboxCountAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { setWorkItemsAction } from '../actions/setWorkItemsAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const chooseWorkQueueSequence = [
  setWaitingForResponseAction,
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
        documentqcmyinProgress: [
          getDocumentQCInboxForUserAction,
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
        documentqcsectioninProgress: [
          getDocumentQCInboxForSectionAction,
          setWorkItemsAction,
          setSectionInboxCountAction,
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
          setSectionInboxCountAction,
        ],
        messagessectionoutbox: [
          getSentMessagesForSectionAction,
          setWorkItemsAction,
        ],
      },
    ],
  ]),
  unsetWaitingForResponseAction,
];
