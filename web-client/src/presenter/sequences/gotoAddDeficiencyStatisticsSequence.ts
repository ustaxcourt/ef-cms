import { clearConfirmationTextAction } from '../actions/clearConfirmationTextAction';
import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { gotoLoginSequence } from '@web-client/presenter/sequences/Login/goToLoginSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDefaultFormForAddDeficiencyStatisticsAction } from '../actions/setDefaultFormForAddDeficiencyStatisticsAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoAddDeficiencyStatisticsSequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator([
      setupCurrentPageAction('Interstitial'),
      stopShowValidationAction,
      clearFormAction,
      clearConfirmationTextAction,
      getCaseAction,
      setCaseAction,
      setDefaultFormForAddDeficiencyStatisticsAction,
      setupCurrentPageAction('AddDeficiencyStatistics'),
    ]),
    unauthorized: [gotoLoginSequence],
  },
];
