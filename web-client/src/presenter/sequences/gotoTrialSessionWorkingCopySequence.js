import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getCalendaredCasesForTrialSessionAction } from '../actions/TrialSession/getCalendaredCasesForTrialSessionAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { getTrialSessionWorkingCopyAction } from '../actions/TrialSession/getTrialSessionWorkingCopyAction';
import { gotoTrialSessionDetailSequence } from './gotoTrialSessionDetailSequence';
import { isJudgeAssociatedWithTrialSessionAction } from '../actions/TrialSession/isJudgeAssociatedWithTrialSessionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { isTrialSessionCalendaredAction } from '../actions/TrialSession/isTrialSessionCalendaredAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCalendaredCasesOnTrialSessionAction } from '../actions/TrialSession/setCalendaredCasesOnTrialSessionAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultWorkingCopyValuesAction } from '../actions/TrialSessionWorkingCopy/setDefaultWorkingCopyValuesAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { setTrialSessionIdAction } from '../actions/TrialSession/setTrialSessionIdAction';
import { setTrialSessionWorkingCopyAction } from '../actions/TrialSession/setTrialSessionWorkingCopyAction';

const gotoTrialSessionDetails = [
  setCurrentPageAction('Interstitial'),
  clearErrorAlertsAction,
  setBaseUrlAction,
  setTrialSessionIdAction,
  getTrialSessionDetailsAction,
  setTrialSessionDetailsAction,
  isJudgeAssociatedWithTrialSessionAction,
  {
    no: [...gotoTrialSessionDetailSequence],
    yes: [
      getTrialSessionWorkingCopyAction,
      setTrialSessionWorkingCopyAction,
      setDefaultWorkingCopyValuesAction,
      isTrialSessionCalendaredAction,
      {
        no: [],
        yes: [
          getCalendaredCasesForTrialSessionAction,
          setCalendaredCasesOnTrialSessionAction,
        ],
      },
      setCurrentPageAction('TrialSessionWorkingCopy'),
    ],
  },
];

export const gotoTrialSessionWorkingCopySequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoTrialSessionDetails,
    unauthorized: [redirectToCognitoAction],
  },
];
