import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getAssociatedCasesForTrialSessionAction } from '../actions/TrialSession/getAssociatedCasesForTrialSessionAction';
import { getEligibleCasesForTrialSessionAction } from '../actions/TrialSession/getEligibleCasesForTrialSessionAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { isTrialSessionCalendaredAction } from '../actions/TrialSession/isTrialSessionCalendaredAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setAssociatedCasesOnTrialSessionAction } from '../actions/TrialSession/setAssociatedCasesOnTrialSessionAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setEligibleCasesOnTrialSessionAction } from '../actions/TrialSession/setEligibleCasesOnTrialSessionAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { setTrialSessionIdAction } from '../actions/TrialSession/setTrialSessionIdAction';

const gotoTrialSessionDetails = [
  setCurrentPageAction('Interstitial'),
  clearAlertsAction,
  clearErrorAlertsAction,
  setTrialSessionIdAction,
  getTrialSessionDetailsAction,
  setTrialSessionDetailsAction,
  isTrialSessionCalendaredAction,
  {
    no: [
      getEligibleCasesForTrialSessionAction,
      setEligibleCasesOnTrialSessionAction,
    ],
    yes: [
      getAssociatedCasesForTrialSessionAction,
      setAssociatedCasesOnTrialSessionAction,
    ],
  },
  setCurrentPageAction('TrialSessionDetail'),
];

export const gotoTrialSessionDetailSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoTrialSessionDetails,
    unauthorized: [redirectToCognitoAction],
  },
];
