import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getFilePetitionPetitionerInformationAction } from '@web-client/presenter/actions/getFilePetitionPetitionerInformationAction';
import { incrementCurrentStepIndicatorAction } from '@web-client/presenter/actions/incrementCurrentStepIndicatorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateFilePetitionPetitionerInformationAction } from '@web-client/presenter/actions/validateFilePetitionPetitionerInformationAction';

export const filePetitionCompletePetitionerInformationSequence = [
  startShowValidationAction,
  getFilePetitionPetitionerInformationAction,
  validateFilePetitionPetitionerInformationAction,
  {
    error: [setValidationErrorsAction],
    success: [
      clearAlertsAction,
      stopShowValidationAction,
      incrementCurrentStepIndicatorAction,
    ],
  },
];
