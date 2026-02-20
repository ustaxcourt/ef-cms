import { clearConfirmationTextAction } from '../actions/clearConfirmationTextAction';
import { clearFormAction } from '../actions/clearFormAction';
import { getCaseMetadataAction } from '../actions/getCaseMetadataAction';
import { setCaseMetadataAction } from '../actions/setCaseMetadataAction';
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
    getCaseMetadataAction,
    setCaseMetadataAction,
    setEditDeficiencyStatisticFormAction,
    setupCurrentPageAction('EditDeficiencyStatistic'),
  ]);
