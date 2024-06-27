import { chooseWorkQueueAction } from '../actions/chooseWorkQueueAction';
import { clearSelectAllWorkItemsCheckboxAction } from '../actions/clearSelectAllWorkItemsCheckboxAction';
import { clearWorkQueueAction } from '../actions/clearWorkQueueAction';
import { getConstants } from '../../getConstants';
import { getDocumentQCAction } from '../actions/getDocumentQCAction';
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
        USER_ROLES.caseServicesSupervisor,
        USER_ROLES.floater,
        USER_ROLES.general,
        USER_ROLES.petitionsClerk,
        USER_ROLES.reportersOffice,
        USER_ROLES.trialClerk,
      ],
      [],
    ),
    ...takePathForRoles(
      [USER_ROLES.chambers, USER_ROLES.judge, USER_ROLES.adc],
      [getJudgeForCurrentUserAction, setJudgeUserAction],
    ),
  },
  parallel([
    [getNotificationsAction, setNotificationsAction, setWorkItemsCountAction],
    [
      // refactor this since there are essentially only two paths now
      chooseWorkQueueAction,
      {
        documentqcmyinProgress: [getDocumentQCAction],
        documentqcmyinbox: [getDocumentQCAction],
        documentqcmyoutbox: [getDocumentQCAction],
        documentqcsectioninProgress: [
          clearSelectAllWorkItemsCheckboxAction,
          getDocumentQCAction,
        ],
        documentqcsectioninbox: [
          clearSelectAllWorkItemsCheckboxAction,
          getDocumentQCAction,
        ],
        documentqcsectionoutbox: [getDocumentQCAction],
      },
      setWorkItemsAction,
    ],
  ]),
]);
