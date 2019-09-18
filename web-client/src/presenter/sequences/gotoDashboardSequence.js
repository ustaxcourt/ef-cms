import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getCasesByUserAction } from '../actions/getCasesByUserAction';
import { getUserAction } from '../actions/getUserAction';
import { getUserRoleAction } from '../actions/getUserRoleAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToMessagesAction } from '../actions/navigateToMessagesAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCasesAction } from '../actions/setCasesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setUserAction } from '../actions/setUserAction';
import { state } from 'cerebral';

const goToDashboard = [
  setCurrentPageAction('Interstitial'),
  getUserAction,
  setUserAction,
  set(state.selectedWorkItems, []),
  clearErrorAlertsAction,
  getUserRoleAction,
  {
    docketclerk: [navigateToMessagesAction],
    judge: [navigateToMessagesAction],
    petitioner: [
      getCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardPetitioner'),
    ],
    petitionsclerk: [navigateToMessagesAction],
    practitioner: [
      getCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardPractitioner'),
    ],
    respondent: [
      getCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardRespondent'),
    ],
    seniorattorney: [navigateToMessagesAction],
  },
];

export const gotoDashboardSequence = [
  isLoggedInAction,
  {
    isLoggedIn: goToDashboard,
    unauthorized: [redirectToCognitoAction],
  },
];
