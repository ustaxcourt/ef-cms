import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getSessionDetailsAction } from '../actions/TrialSession/getSessionDetailsAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setSessionDetailsAction } from '../actions/TrialSession/setSessiondetailsAction';
import { setSessionIdAction } from '../actions/TrialSession/setSessionIdAction';

const gotoSessionDetails = [
  setCurrentPageAction('Interstitial'),
  clearAlertsAction,
  clearErrorAlertsAction,
  setSessionIdAction,
  getSessionDetailsAction,
  setSessionDetailsAction,
  setCurrentPageAction('SessionDetail'),
];

export const gotoSessionDetailSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoSessionDetails,
    unauthorized: [redirectToCognitoAction],
  },
];
