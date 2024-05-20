import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getStep1DataAction } from '@web-client/presenter/actions/getStep1DataAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateUploadPetitionStep1Action } from '@web-client/presenter/actions/validateUploadPetitionStep1Action';

export const validateUpdatedFilePetitionStep1Sequence = [
  startShowValidationAction,
  getStep1DataAction,
  validateUploadPetitionStep1Action,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [clearAlertsAction, stopShowValidationAction],
  },
];
