import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultFormForAddDeficiencySatisticsAction } from '../actions/setDefaultFormForAddDeficiencySatisticsAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditDeficiencyStatisticsSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      setCurrentPageAction('Interstitial'),
      stopShowValidationAction,
      clearFormAction,
      getCaseAction,
      setCaseAction,
      setDefaultFormForAddDeficiencySatisticsAction,
      setCurrentPageAction('EditDeficiencyStatistics'),
    ],
    unauthorized: [redirectToCognitoAction],
  },
];
