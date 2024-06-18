import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getFilePetitionPetitionInformationAction } from '@web-client/presenter/actions/getFilePetitionPetitionInformationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateFilePetitionPetitionInformationAction } from '@web-client/presenter/actions/validateFilePetitionPetitionInformationAction';

export const validateFilePetitionPetitionInformationSequence = [
  startShowValidationAction,
  getFilePetitionPetitionInformationAction,
  validateFilePetitionPetitionInformationAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [clearAlertsAction, stopShowValidationAction],
  },
];
