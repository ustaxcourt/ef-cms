import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getComputedAdmissionsDateAction } from '../actions/getComputedAdmissionsDateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateAddPractitionerAction } from '../actions/validateAddPractitionerAction';

export const validateAddPractitionerSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      getComputedAdmissionsDateAction,
      validateAddPractitionerAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
