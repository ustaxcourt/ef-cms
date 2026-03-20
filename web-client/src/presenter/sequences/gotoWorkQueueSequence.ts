import { CASE_SERVICES_SUPERVISOR_SECTION } from '../../../../shared/src/business/entities/EntityConstants';
import { chooseWorkQueueAction } from '../actions/chooseWorkQueueAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearSelectAllWorkItemsCheckboxAction } from '../actions/clearSelectAllWorkItemsCheckboxAction';
import { clearSelectedWorkItemsAction } from '../actions/clearSelectedWorkItemsAction';
import { clearWorkQueueAction } from '../actions/clearWorkQueueAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getConstants } from '../../getConstants';
import { getDocumentQCInboxForSectionAction } from '../actions/getDocumentQCInboxForSectionAction';
import { getDocumentQCInboxForUserAction } from '../actions/getDocumentQCInboxForUserAction';
import { getDocumentQCServedForSectionAction } from '../actions/getDocumentQCServedForSectionAction';
import { getDocumentQCServedForUserAction } from '../actions/getDocumentQCServedForUserAction';
import { getJudgeForCurrentUserAction } from '../actions/getJudgeForCurrentUserAction';
import { getNotificationsAction } from '../actions/getNotificationsAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { parallel } from 'cerebral/factories';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { setIsLoadingWorkQueueAction } from '../actions/WorkQueue/setIsLoadingWorkQueueAction';
import { setJudgeUserAction } from '../actions/setJudgeUserAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { setSectionForWorkQueueAction } from '../actions/setSectionForWorkQueueAction';
import { setUsersAction } from '../actions/setUsersAction';
import { setWorkItemsAction } from '../actions/setWorkItemsAction';
import { setWorkItemsCountAction } from '../actions/setWorkItemsCountAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { takePathForRoles } from './takePathForRoles';
const { DOCKET_SECTION, PETITIONS_SECTION, USER_ROLES } = getConstants();

export const gotoWorkQueueSequence = startWebSocketConnectionSequenceDecorator([
  setIsLoadingWorkQueueAction(true),
  closeMobileMenuAction,
  clearSelectedWorkItemsAction,
  clearErrorAlertsAction,
  setSectionForWorkQueueAction,
  setupCurrentPageAction('WorkQueue'),
  parallel([
    [
      runPathForUserRoleAction,
      {
        ...takePathForRoles(
          [
            USER_ROLES.adc,
            USER_ROLES.admin,
            USER_ROLES.admissionsClerk,
            USER_ROLES.chambers,
            USER_ROLES.clerkOfCourt,
            USER_ROLES.floater,
            USER_ROLES.general,
            USER_ROLES.caseServicesSupervisor,
            USER_ROLES.reportersOffice,
            USER_ROLES.trialClerk,
            USER_ROLES.judge,
          ],
          [],
        ),
        caseServicesSupervisor: [
          getUsersInSectionAction({
            section: CASE_SERVICES_SUPERVISOR_SECTION,
          }),
          setUsersAction,
        ],
        clerkofcourt: [
          getUsersInSectionAction({ section: DOCKET_SECTION }),
          setUsersAction,
        ],
        docketclerk: [
          getUsersInSectionAction({ section: DOCKET_SECTION }),
          setUsersAction,
        ],
        petitionsclerk: [
          getUsersInSectionAction({ section: PETITIONS_SECTION }),
          setUsersAction,
        ],
      },
    ],
    [
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
          chooseWorkQueueAction,
          {
            documentqcmyinProgress: [getDocumentQCInboxForUserAction],
            documentqcmyinbox: [getDocumentQCInboxForUserAction],
            documentqcmyoutbox: [getDocumentQCServedForUserAction],
            documentqcsectioninProgress: [
              clearSelectAllWorkItemsCheckboxAction,
              getDocumentQCInboxForSectionAction,
            ],
            documentqcsectioninbox: [
              clearSelectAllWorkItemsCheckboxAction,
              getDocumentQCInboxForSectionAction,
            ],
            documentqcsectionoutbox: [getDocumentQCServedForSectionAction],
          },
          setWorkItemsAction,
        ],
      ]),
    ],
  ]),
  setIsLoadingWorkQueueAction(false),
]);
