import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { setTrialSessionDetailsOnFormAction } from '../actions/TrialSession/setTrialSessionDetailsOnFormAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setTrialStartTimeAction } from '../actions/setTrialStartTimeAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoEditTrialSession = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  getTrialSessionsAction,
  setTrialSessionsAction,
  getTrialSessionDetailsAction,
  setTrialSessionDetailsAction,
  setTrialSessionDetailsOnFormAction,
  getSetJudgesSequence,
  getUsersInSectionAction({ section: 'trialClerks' }),
  setUsersByKeyAction('trialClerks'),
  setTrialStartTimeAction,
  setCurrentPageAction('EditTrialSession'),
];

export const gotoEditTrialSessionSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoEditTrialSession,
    unauthorized: [redirectToCognitoAction],
  },
];
