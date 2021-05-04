import { clearAlertsAction } from '../actions/clearAlertsAction';
import { hasSealAddressCheckedAction } from '../actions/hasSealAddressCheckedAction';
import { hasUpdatedPetitionerEmailAction } from '../actions/hasUpdatedPetitionerEmailAction';
import { openGainElectronicAccessToCaseModalSequence } from './openGainElectronicAccessToCaseModalSequence';
import { openSealAddressModalSequence } from './openSealAddressModalSequence';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { submitUpdatePetitionerInformationSequence } from './submitUpdatePetitionerInformationSequence';
import { validatePetitionerAction } from '../actions/validatePetitionerAction';
const sealAddressModalCheck = [
  hasSealAddressCheckedAction,
  {
    no: [submitUpdatePetitionerInformationSequence],
    yes: [
      openSealAddressModalSequence,
      submitUpdatePetitionerInformationSequence,
    ],
  },
];
export const submitEditPetitionerSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validatePetitionerAction,
  {
    error: [setValidationAlertErrorsAction],
    success: showProgressSequenceDecorator([
      hasUpdatedPetitionerEmailAction,
      {
        no: [sealAddressModalCheck],
        yes: [openGainElectronicAccessToCaseModalSequence],
      },
    ]),
  },
];
