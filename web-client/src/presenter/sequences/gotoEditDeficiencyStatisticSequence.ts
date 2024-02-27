import { clearConfirmationTextAction } from '../actions/clearConfirmationTextAction';
import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setEditDeficiencyStatisticFormAction } from '../actions/setEditDeficiencyStatisticFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditDeficiencyStatisticSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    clearConfirmationTextAction,
    getCaseAction,
    setCaseAction,
    setEditDeficiencyStatisticFormAction,
    setupCurrentPageAction('EditDeficiencyStatistic'),
  ]);
