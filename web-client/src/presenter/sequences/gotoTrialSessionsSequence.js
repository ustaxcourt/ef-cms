import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setTrialSessionsFiltersAction } from '../actions/TrialSession/setTrialSessionsFiltersAction';

const gotoTrialSessions = [
  setCurrentPageAction('Interstitial'),
  clearAlertsAction,
  clearScreenMetadataAction,
  clearErrorAlertsAction,
  getTrialSessionsAction,
  setTrialSessionsAction,
  setTrialSessionsFiltersAction,
  setCurrentPageAction('TrialSessions'),
];

export const gotoTrialSessionsSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoTrialSessions,
    unauthorized: [redirectToCognitoAction],
  },
];
