import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setEditOtherStatisticsFormAction } from '../actions/setEditOtherStatisticsFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditOtherStatisticsSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    getCaseAction,
    setCaseAction,
    setEditOtherStatisticsFormAction,
    setupCurrentPageAction('EditOtherStatistics'),
  ]);
