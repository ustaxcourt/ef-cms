import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getStep4DataAction } from '@web-client/presenter/actions/getStep4DataAction';
import { incrementCurrentStepIndicatorAction } from '@web-client/presenter/actions/incrementCurrentStepIndicatorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateUploadPetitionStep4Action } from '@web-client/presenter/actions/validateUploadPetitionStep4Action';

export const updatedFilePetitionCompleteStep4Sequence = [
  startShowValidationAction,
  getStep4DataAction,
  validateUploadPetitionStep4Action,
  {
    error: [setValidationErrorsAction],
    success: [
      clearAlertsAction,
      stopShowValidationAction,
      incrementCurrentStepIndicatorAction,
    ],
  },
];
