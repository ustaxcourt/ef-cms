import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCaseWorksheetAction } from '@web-client/presenter/actions/validateCaseWorksheetAction';

export const validateCaseWorksheetSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      getComputedFormDateFactoryAction(undefined),
      validateCaseWorksheetAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
