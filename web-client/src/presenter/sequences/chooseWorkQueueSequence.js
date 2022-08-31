import { chooseWorkQueueAction } from '../actions/chooseWorkQueueAction';
import { clearWorkQueueAction } from '../actions/clearWorkQueueAction';
import { getConstants } from '../../getConstants';
import { getDocumentQCInboxForSectionAction } from '../actions/getDocumentQCInboxForSectionAction';
import { getDocumentQCInboxForUserAction } from '../actions/getDocumentQCInboxForUserAction';
import { getDocumentQCServedForSectionAction } from '../actions/getDocumentQCServedForSectionAction';
import { getDocumentQCServedForUserAction } from '../actions/getDocumentQCServedForUserAction';
import { getJudgeForCurrentUserAction } from '../actions/getJudgeForCurrentUserAction';
import { getNotificationsAction } from '../actions/getNotificationsAction';
import { parallel } from 'cerebral/factories';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { setJudgeUserAction } from '../actions/setJudgeUserAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { setWorkItemsAction } from '../actions/setWorkItemsAction';
import { setWorkItemsCountAction } from '../actions/setWorkItemsCountAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { takePathForRoles } from './takePathForRoles';
const { USER_ROLES } = getConstants();

export const chooseWorkQueueSequence = showProgressSequenceDecorator([
  clearWorkQueueAction,
  runPathForUserRoleAction,
  {
    ...takePathForRoles(
      [
        USER_ROLES.admin,
        USER_ROLES.admissionsClerk,
        USER_ROLES.clerkOfCourt,
        USER_ROLES.docketClerk,
        USER_ROLES.floater,
        USER_ROLES.petitionsClerk,
        USER_ROLES.reportersOffice,
        USER_ROLES.trialClerk,
        USER_ROLES.general,
        USER_ROLES.inactivePractitioner,
        USER_ROLES.irsPractitioner,
        USER_ROLES.irsSuperuser,
        USER_ROLES.petitioner,
        USER_ROLES.privatePractitioner,
      ],
      () => {}, // noop, we don't do anything extra with these roles
    ),
    ...takePathForRoles(
      [USER_ROLES.chambers, USER_ROLES.judge, USER_ROLES.adc],
      [getJudgeForCurrentUserAction, setJudgeUserAction],
    ),
  },
  parallel([
    [getNotificationsAction, setNotificationsAction, setWorkItemsCountAction],
    [
      chooseWorkQueueAction,
      {
        documentqcmyinProgress: [getDocumentQCInboxForUserAction],
        documentqcmyinbox: [getDocumentQCInboxForUserAction],
        documentqcmyoutbox: [getDocumentQCServedForUserAction],
        documentqcsectioninProgress: [getDocumentQCInboxForSectionAction],
        documentqcsectioninbox: [getDocumentQCInboxForSectionAction],
        documentqcsectionoutbox: [getDocumentQCServedForSectionAction],
      },
      setWorkItemsAction,
    ],
  ]),
]);
