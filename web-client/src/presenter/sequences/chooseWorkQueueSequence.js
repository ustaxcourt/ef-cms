import { chooseWorkQueueAction } from '../actions/chooseWorkQueueAction';
import { clearWorkQueueAction } from '../actions/clearWorkQueueAction';
import { getDocumentQCInProgressForSectionAction } from '../actions/getDocumentQCInProgressForSectionAction';
import { getDocumentQCInProgressForUserAction } from '../actions/getDocumentQCInProgressForUserAction';
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
        documentqcmyinProgress: [getDocumentQCInProgressForUserAction],
        documentqcmyinbox: [getDocumentQCInboxForUserAction],
        documentqcmyoutbox: [getDocumentQCServedForUserAction],
        documentqcsectioninProgress: [getDocumentQCInProgressForSectionAction],
        documentqcsectioninbox: [getDocumentQCInboxForSectionAction],
        documentqcsectionoutbox: [getDocumentQCServedForSectionAction],
      },
      setWorkItemsAction,
    ],
  ]),
]);
