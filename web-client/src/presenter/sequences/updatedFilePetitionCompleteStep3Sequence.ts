import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getCreatePetitionStep3DataAction } from '@web-client/presenter/actions/getCreatePetitionStep3DataAction';
import { incrementCurrentStepIndicatorAction } from '@web-client/presenter/actions/incrementCurrentStepIndicatorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateUploadPetitionStep3Action } from '@web-client/presenter/actions/validateUploadPetitionStep3Action';

export const updatedFilePetitionCompleteStep3Sequence = [
  startShowValidationAction,
  getCreatePetitionStep3DataAction,
  validateUploadPetitionStep3Action,
  {
    error: [setValidationErrorsAction],
    success: [
      clearAlertsAction,
      stopShowValidationAction,
      incrementCurrentStepIndicatorAction,
    ],
  },
] as unknown as () => void;
