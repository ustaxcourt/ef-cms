import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePetitionerInformationFormAction } from '../actions/validatePetitionerInformationFormAction';

export const validatePetitionerInformationFormSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validatePetitionerInformationFormAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
