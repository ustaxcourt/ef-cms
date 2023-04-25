import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateFileAction } from '../actions/FileDocument/validateFileAction';

export const validateFileInputSequence = [
  validateFileAction,
  {
    error: [
      () => {
        console.log('pdf has been validated, it is BORKED!');
      },
      startShowValidationAction,
      setAlertErrorAction,
      setValidationErrorsAction,
    ],
    success: [
      () => {
        console.log('pdf has been validated, it is NOT borked!');
      },
      stopShowValidationAction,
      clearAlertsAction,
    ],
  },
];
