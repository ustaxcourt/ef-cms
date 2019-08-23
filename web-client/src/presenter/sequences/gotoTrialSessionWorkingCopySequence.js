import { clearAlertsAction } from '../actions/clearAlertsAction';
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
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';

const gotoTrialSessionDetails = [
  setCurrentPageAction('Interstitial'),
  clearAlertsAction,
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
      updateTrialSessionWorkingCopyAction,
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
