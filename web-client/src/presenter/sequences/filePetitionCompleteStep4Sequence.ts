import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getCreatePetitionStep4DataAction } from '@web-client/presenter/actions/getCreatePetitionStep4DataAction';
import { incrementCurrentStepIndicatorAction } from '@web-client/presenter/actions/incrementCurrentStepIndicatorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateUploadPetitionStep4Action } from '@web-client/presenter/actions/validateUploadPetitionStep4Action';

export const filePetitionCompleteStep4Sequence = [
  startShowValidationAction,
  getCreatePetitionStep4DataAction,
  validateUploadPetitionStep4Action,
  {
    error: [setValidationErrorsAction],
    success: [
      clearAlertsAction,
      stopShowValidationAction,
      incrementCurrentStepIndicatorAction,
    ],
  },
] as unknown as () => void;
