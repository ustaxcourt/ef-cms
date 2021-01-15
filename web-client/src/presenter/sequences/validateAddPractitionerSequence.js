import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateAddPractitionerAction } from '../actions/validateAddPractitionerAction';

export const validateAddPractitionerSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computeFormDateFactoryAction(null),
      validateAddPractitionerAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
