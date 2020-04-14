import { chooseWorkQueueSequence } from './chooseWorkQueueSequence';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getConstants } from '../../getConstants';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { parallel, set } from 'cerebral/factories';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setUsersAction } from '../actions/setUsersAction';
import { state } from 'cerebral';
import { takePathForRoles } from './takePathForRoles';
const { USER_ROLES } = getConstants();

const goToMessages = [
  setCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  set(state.selectedWorkItems, []),
  clearErrorAlertsAction,
  parallel([
    [
      runPathForUserRoleAction,
      {
        ...takePathForRoles(
          [
            USER_ROLES.admin,
            USER_ROLES.adc,
            USER_ROLES.admissionsClerk,
            USER_ROLES.chambers,
            USER_ROLES.clerkOfCourt,
            USER_ROLES.floater,
            USER_ROLES.trialClerk,
          ],
          [],
        ),
        clerkofcourt: [
          getUsersInSectionAction({ section: 'docket' }),
          setUsersAction,
        ],
        docketclerk: [
          getUsersInSectionAction({ section: 'docket' }),
          setUsersAction,
        ],
        judge: [getTrialSessionsAction, setTrialSessionsAction],
        petitionsclerk: [
          getUsersInSectionAction({ section: 'petitions' }),
          setUsersAction,
        ],
      },
    ],
    chooseWorkQueueSequence,
  ]),
  setCurrentPageAction('Messages'),
];

export const gotoMessagesSequence = [
  isLoggedInAction,
  {
    isLoggedIn: goToMessages,
    unauthorized: [redirectToCognitoAction],
  },
];
