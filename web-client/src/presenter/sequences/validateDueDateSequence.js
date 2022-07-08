import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { setFormDateAction } from '../actions/setFormDateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateDueDateAction } from '../actions/ApplyStamp/validateDueDateAction';

export const validateDueDateSequence = [
  getComputedFormDateFactoryAction(),
  setFormDateAction,
  validateDueDateAction,
  {
    error: [setValidationErrorsAction],
    success: [clearAlertsAction],
  },
  // ],
  // },
];
