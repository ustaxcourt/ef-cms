import { clearConfirmationTextAction } from '../actions/clearConfirmationTextAction';
import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDefaultFormForAddDeficiencyStatisticsAction } from '../actions/setDefaultFormForAddDeficiencyStatisticsAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoAddDeficiencyStatisticsSequence = [
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    clearConfirmationTextAction,
    getCaseAction,
    setCaseAction,
    setDefaultFormForAddDeficiencyStatisticsAction,
    setupCurrentPageAction('AddDeficiencyStatistics'),
  ]),
];
