import { chooseWorkQueueAction } from '../actions/chooseWorkQueueAction';
import { clearWorkQueueAction } from '../actions/clearWorkQueueAction';
import { getDocumentQCInboxForSectionAction } from '../actions/getDocumentQCInboxForSectionAction';
import { getDocumentQCInboxForUserAction } from '../actions/getDocumentQCInboxForUserAction';
import { getDocumentQCServedForSectionAction } from '../actions/getDocumentQCServedForSectionAction';
import { getDocumentQCServedForUserAction } from '../actions/getDocumentQCServedForUserAction';
import { getJudgeForCurrentUserAction } from '../actions/getJudgeForCurrentUserAction';
import { getNotificationsAction } from '../actions/getNotificationsAction';
import { parallel } from 'cerebral/factories';
import { setJudgeUserAction } from '../actions/setJudgeUserAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { setWorkItemsAction } from '../actions/setWorkItemsAction';
import { setWorkItemsCountAction } from '../actions/setWorkItemsCountAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const chooseWorkQueueSequence = showProgressSequenceDecorator([
  clearWorkQueueAction,
  getJudgeForCurrentUserAction,
  setJudgeUserAction,
  parallel([
    [getNotificationsAction, setNotificationsAction, setWorkItemsCountAction],
    [
      chooseWorkQueueAction,
      {
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
        documentqcsectioninProgress: [
          getDocumentQCInboxForSectionAction,
          setWorkItemsAction,
        ],
        documentqcsectioninbox: [
          getDocumentQCInboxForSectionAction,
          setWorkItemsAction,
        ],
        documentqcsectionoutbox: [
          getDocumentQCServedForSectionAction,
          setWorkItemsAction,
        ],
      },
    ],
  ]),
]);
