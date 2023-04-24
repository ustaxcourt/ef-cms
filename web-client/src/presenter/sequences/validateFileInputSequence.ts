import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { validateFileAction } from '../actions/FileDocument/validateFileAction';

export const validateFileInputSequence = [
  validateFileAction,
  {
    error: [
      () => {
        console.log('pdf has been validated, it is BORKED!');
      },
    ],
    success: [
      () => {
        console.log('pdf has been validated, it is NOT borked!');
      },
    ],
  },
  // {
  //   error: [setValidationErrorsAction],
  //   success: [clearAlertsAction],
  // },
];
