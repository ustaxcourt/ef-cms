import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCaseWorksheetAction } from '@web-client/presenter/actions/validateCaseWorksheetAction';

export const validateCaseWorksheetSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateCaseWorksheetAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
