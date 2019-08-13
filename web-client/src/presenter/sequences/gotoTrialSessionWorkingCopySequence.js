import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getCalendaredCasesForTrialSessionAction } from '../actions/TrialSession/getCalendaredCasesForTrialSessionAction';
import { getEligibleCasesForTrialSessionAction } from '../actions/TrialSession/getEligibleCasesForTrialSessionAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { gotoTrialSessionDetailSequence } from './gotoTrialSessionDetailSequence';
import { isJudgeAssociatedWithTrialSessionAction } from '../actions/TrialSession/isJudgeAssociatedWithTrialSessionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { isTrialSessionCalendaredAction } from '../actions/TrialSession/isTrialSessionCalendaredAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCalendaredCasesOnTrialSessionAction } from '../actions/TrialSession/setCalendaredCasesOnTrialSessionAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultWorkingCopySortAction } from '../actions/TrialSessionWorkingCopy/setDefaultWorkingCopySortAction';
import { setEligibleCasesOnTrialSessionAction } from '../actions/TrialSession/setEligibleCasesOnTrialSessionAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { setTrialSessionIdAction } from '../actions/TrialSession/setTrialSessionIdAction';

const gotoTrialSessionDetails = [
  setCurrentPageAction('Interstitial'),
  isJudgeAssociatedWithTrialSessionAction,
  {
    no: [...gotoTrialSessionDetailSequence],
    yes: [
      clearAlertsAction,
      clearErrorAlertsAction,
      setTrialSessionIdAction,
      getTrialSessionDetailsAction,
      setTrialSessionDetailsAction,
      setDefaultWorkingCopySortAction,
      isTrialSessionCalendaredAction,
      {
        no: [
          getEligibleCasesForTrialSessionAction,
          setEligibleCasesOnTrialSessionAction,
        ],
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
