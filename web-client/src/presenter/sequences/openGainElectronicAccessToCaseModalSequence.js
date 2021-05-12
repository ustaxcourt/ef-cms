import { checkEmailAvailabilityForPetitionerAction } from '../actions/checkEmailAvailabilityForPetitionerAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openGainElectronicAccessToCaseModalSequence =
  showProgressSequenceDecorator([
    stopShowValidationAction,
    clearAlertsAction,
    checkEmailAvailabilityForPetitionerAction,
    {
      emailAvailable: [setShowModalFactoryAction('NoMatchingEmailFoundModal')],
      emailInUse: [setShowModalFactoryAction('MatchingEmailFoundModal')],
    },
  ]);
