import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '@web-client/presenter/actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePetitionerAction } from '../actions/validatePetitionerAction';

export const validatePetitionerSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validatePetitionerAction,
      {
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
