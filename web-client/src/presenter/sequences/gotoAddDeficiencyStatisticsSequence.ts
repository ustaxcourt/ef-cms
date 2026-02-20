import { clearConfirmationTextAction } from '../actions/clearConfirmationTextAction';
import { clearFormAction } from '../actions/clearFormAction';
import { getCaseMetadataAction } from '../actions/getCaseMetadataAction';
import { setCaseMetadataAction } from '../actions/setCaseMetadataAction';
import { setDefaultFormForAddDeficiencyStatisticsAction } from '../actions/setDefaultFormForAddDeficiencyStatisticsAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoAddDeficiencyStatisticsSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    clearConfirmationTextAction,
    getCaseMetadataAction,
    setCaseMetadataAction,
    setDefaultFormForAddDeficiencyStatisticsAction,
    setupCurrentPageAction('AddDeficiencyStatistics'),
  ]);
