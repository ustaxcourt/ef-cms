import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getStep2DataAction } from '@web-client/presenter/actions/getStep2DataAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateUploadPetitionStep2Action } from '@web-client/presenter/actions/validateUploadPetitionStep2Action';

export const validateUpdatedFilePetitionStep2Sequence = [
  startShowValidationAction,
  getStep2DataAction,
  validateUploadPetitionStep2Action,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [clearAlertsAction, stopShowValidationAction],
  },
];
