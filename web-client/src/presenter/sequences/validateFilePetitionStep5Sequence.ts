import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getCreatePetitionStep5DataAction } from '@web-client/presenter/actions/getCreatePetitionStep5DataAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateUploadPetitionStep5Action } from '@web-client/presenter/actions/validateUploadPetitionStep5Action';

export const validateFilePetitionStep5Sequence = [
  startShowValidationAction,
  getCreatePetitionStep5DataAction,
  validateUploadPetitionStep5Action,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [clearAlertsAction, stopShowValidationAction],
  },
] as unknown as () => void;
