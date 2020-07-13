import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setEditOtherStatisticsFormAction } from '../actions/setEditOtherStatisticsFormAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditOtherStatisticsSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      setCurrentPageAction('Interstitial'),
      stopShowValidationAction,
      clearFormAction,
      getCaseAction,
      setCaseAction,
      setEditOtherStatisticsFormAction,
      setCurrentPageAction('EditOtherStatistics'),
    ],
    unauthorized: [redirectToCognitoAction],
  },
];
