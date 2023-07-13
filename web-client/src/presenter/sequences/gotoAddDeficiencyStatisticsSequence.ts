import { clearConfirmationTextAction } from '../actions/clearConfirmationTextAction';
import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setDefaultFormForAddDeficiencyStatisticsAction } from '../actions/setDefaultFormForAddDeficiencyStatisticsAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoAddDeficiencyStatisticsSequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator([
      setCurrentPageAction('Interstitial'),
      stopShowValidationAction,
      clearFormAction,
      clearConfirmationTextAction,
      getCaseAction,
      setCaseAction,
      setDefaultFormForAddDeficiencyStatisticsAction,
      setCurrentPageAction('AddDeficiencyStatistics'),
    ]),
    unauthorized: [redirectToCognitoAction],
  },
];
