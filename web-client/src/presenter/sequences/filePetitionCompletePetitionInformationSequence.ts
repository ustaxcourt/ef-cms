import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getFilePetitionPetitionInformationAction } from '@web-client/presenter/actions/getFilePetitionPetitionInformationAction';
import { incrementCurrentStepIndicatorAction } from '@web-client/presenter/actions/incrementCurrentStepIndicatorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateFilePetitionPetitionInformationAction } from '@web-client/presenter/actions/validateFilePetitionPetitionInformationAction';

export const filePetitionCompletePetitionInformationSequence = [
  startShowValidationAction,
  getFilePetitionPetitionInformationAction,
  validateFilePetitionPetitionInformationAction,
  {
    error: [setValidationErrorsAction],
    success: [
      clearAlertsAction,
      stopShowValidationAction,
      incrementCurrentStepIndicatorAction,
    ],
  },
];
