import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getCreatePetitionStep2DataAction } from '@web-client/presenter/actions/getCreatePetitionStep2DataAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateUploadPetitionStep2Action } from '@web-client/presenter/actions/validateUploadPetitionStep2Action';

export const validateFilePetitionStep2Sequence = [
  startShowValidationAction,
  getCreatePetitionStep2DataAction,
  validateUploadPetitionStep2Action,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [clearAlertsAction, stopShowValidationAction],
  },
] as unknown as () => void;
