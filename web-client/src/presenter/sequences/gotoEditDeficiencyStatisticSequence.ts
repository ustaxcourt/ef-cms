import { clearConfirmationTextAction } from '../actions/clearConfirmationTextAction';
import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { setCaseAction } from '../actions/setCaseAction';
import { setEditDeficiencyStatisticFormAction } from '../actions/setEditDeficiencyStatisticFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditDeficiencyStatisticSequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator([
      setupCurrentPageAction('Interstitial'),
      stopShowValidationAction,
      clearFormAction,
      clearConfirmationTextAction,
      getCaseAction,
      setCaseAction,
      setEditDeficiencyStatisticFormAction,
      setupCurrentPageAction('EditDeficiencyStatistic'),
    ]),
    unauthorized: [navigateToLoginSequence],
  },
];
