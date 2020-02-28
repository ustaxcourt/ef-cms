import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { parallel } from 'cerebral/factories';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultTrialStartTimeAction } from '../actions/setDefaultTrialStartTimeAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoAddTrialSession = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  parallel([
    [getTrialSessionsAction, setTrialSessionsAction],
    getSetJudgesSequence,
    [
      getUsersInSectionAction({ section: 'trialClerks' }),
      setUsersByKeyAction('trialClerks'),
    ],
  ]),
  setDefaultTrialStartTimeAction,
  setCurrentPageAction('AddTrialSession'),
];

export const gotoAddTrialSessionSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoAddTrialSession,
    unauthorized: [redirectToCognitoAction],
  },
];
