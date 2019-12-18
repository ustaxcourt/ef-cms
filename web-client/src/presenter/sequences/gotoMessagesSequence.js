import { chooseWorkQueueSequence } from './chooseWorkQueueSequence';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUserAction } from '../actions/getUserAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { set } from 'cerebral/factories';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setUserAction } from '../actions/setUserAction';
import { setUsersAction } from '../actions/setUsersAction';
import { state } from 'cerebral';
import { takePathForRoles } from './takePathForRoles';

const goToMessages = [
  setCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  getUserAction,
  setUserAction,
  set(state.selectedWorkItems, []),
  clearErrorAlertsAction,
  runPathForUserRoleAction,
  {
    ...takePathForRoles(
      [
        'adc',
        'admissionsclerk',
        'calendarclerk',
        'chambers',
        'clerkofcourt',
        'trialclerk',
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
  setCurrentPageAction('Messages'),
  ...chooseWorkQueueSequence,
];

export const gotoMessagesSequence = [
  isLoggedInAction,
  {
    isLoggedIn: goToMessages,
    unauthorized: [redirectToCognitoAction],
  },
];
