import { chooseWorkQueueSequence } from './chooseWorkQueueSequence';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getConsolidatedCasesByUserAction } from '../actions/caseConsolidation/getConsolidatedCasesByUserAction';
import { getJudgeForCurrentUserAction } from '../actions/getJudgeForCurrentUserAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUserAction } from '../actions/getUserAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToMessagesAction } from '../actions/navigateToMessagesAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { set } from 'cerebral/factories';
import { setCasesAction } from '../actions/setCasesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setJudgeUserAction } from '../actions/setJudgeUserAction';
import { setMessageInboxPropsAction } from '../actions/setMessageInboxPropsAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setUserAction } from '../actions/setUserAction';
import { state } from 'cerebral';
import { takePathForRoles } from './takePathForRoles';

const proceedToMessages = [navigateToMessagesAction];

const goToDashboard = [
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
        'admin',
        'adc',
        'admissionsclerk',
        'clerkofcourt',
        'docketclerk',
        'floater',
        'petitionsclerk',
        'trialclerk',
      ],
      proceedToMessages,
    ),
    chambers: [
      setMessageInboxPropsAction,
      ...chooseWorkQueueSequence,
      getJudgeForCurrentUserAction,
      setJudgeUserAction,
      getTrialSessionsAction,
      setTrialSessionsAction,
      setCurrentPageAction('DashboardChambers'),
    ],
    inactivePractitioner: [setCurrentPageAction('DashboardInactive')],
    irsPractitioner: [
      getConsolidatedCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardRespondent'),
    ],
    irsSuperuser: [setCurrentPageAction('DashboardIrsSuperuser')],
    judge: [
      setMessageInboxPropsAction,
      ...chooseWorkQueueSequence,
      getTrialSessionsAction,
      setTrialSessionsAction,
      setCurrentPageAction('DashboardJudge'),
    ],
    petitioner: [
      getConsolidatedCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardPetitioner'),
    ],
    privatePractitioner: [
      getConsolidatedCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardPractitioner'),
    ],
  },
];

export const gotoDashboardSequence = [
  isLoggedInAction,
  {
    isLoggedIn: goToDashboard,
    unauthorized: [redirectToCognitoAction],
  },
];
