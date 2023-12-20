import { CASE_SERVICES_SUPERVISOR_SECTION } from '../../../../shared/src/business/entities/EntityConstants';
import { chooseWorkQueueSequence } from './chooseWorkQueueSequence';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearSelectedWorkItemsAction } from '../actions/clearSelectedWorkItemsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getConstants } from '../../getConstants';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { parallel } from 'cerebral/factories';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { setSectionForWorkQueueAction } from '../actions/setSectionForWorkQueueAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setUsersAction } from '../actions/setUsersAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { takePathForRoles } from './takePathForRoles';
const { DOCKET_SECTION, PETITIONS_SECTION, USER_ROLES } = getConstants();

const goToWorkQueue = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  clearSelectedWorkItemsAction,
  clearErrorAlertsAction,
  setSectionForWorkQueueAction,
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
        judge: [getTrialSessionsAction, setTrialSessionsAction],
        petitionsclerk: [
          getUsersInSectionAction({ section: PETITIONS_SECTION }),
          setUsersAction,
        ],
      },
    ],
    chooseWorkQueueSequence,
  ]),
  setupCurrentPageAction('WorkQueue'),
]);

export const gotoWorkQueueSequence = [goToWorkQueue];
