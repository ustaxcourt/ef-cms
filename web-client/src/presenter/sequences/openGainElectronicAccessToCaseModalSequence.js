import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openGainElectronicAccessToCaseModalSequence = showProgressSequenceDecorator(
  [
    stopShowValidationAction,
    clearAlertsAction,
    setShowModalFactoryAction('MatchingEmailFoundModal'),
  ],
);
