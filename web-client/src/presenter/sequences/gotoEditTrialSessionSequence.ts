import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { computeTrialSessionStartTimeAction } from '../actions/TrialSession/computeTrialSessionStartTimeAction';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { setTrialSessionDetailsOnFormAction } from '../actions/TrialSession/setTrialSessionDetailsOnFormAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setTrialStartTimeAction } from '../actions/setTrialStartTimeAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoEditTrialSession = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  getTrialSessionsAction,
  setTrialSessionsAction,
  getTrialSessionDetailsAction,
  setTrialSessionDetailsAction,
  setTrialSessionDetailsOnFormAction,
  computeTrialSessionStartTimeAction,
  setTrialStartTimeAction,
  getSetJudgesSequence,
  getUsersInSectionAction({ section: 'trialClerks' }),
  setUsersByKeyAction('trialClerks'),
  setupCurrentPageAction('EditTrialSession'),
]);

export const gotoEditTrialSessionSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoEditTrialSession,
    unauthorized: [navigateToLoginSequence],
  },
];
