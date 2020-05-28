import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setEditDeficiencyStatisticFormAction } from '../actions/setEditDeficiencyStatisticFormAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditDeficiencyStatisticSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      setCurrentPageAction('Interstitial'),
      stopShowValidationAction,
      clearFormAction,
      getCaseAction,
      setCaseAction,
      setEditDeficiencyStatisticFormAction,
      setCurrentPageAction('EditDeficiencyStatistic'),
    ],
    unauthorized: [redirectToCognitoAction],
  },
];
