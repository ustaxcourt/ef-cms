import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getStep5DataAction } from '@web-client/presenter/actions/getStep5DataAction';
import { incrementCurrentStepIndicatorAction } from '@web-client/presenter/actions/incrementCurrentStepIndicatorAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateUploadPetitionStep5Action } from '@web-client/presenter/actions/validateUploadPetitionStep5Action';

export const updatedFilePetitionCompleteStep5Sequence = [
  startShowValidationAction,
  getStep5DataAction,
  validateUploadPetitionStep5Action,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [
      clearAlertsAction,
      stopShowValidationAction,
      incrementCurrentStepIndicatorAction,
    ],
  },
];
