import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../../actions/shouldValidateAction';
import { validateAddPrivatePractitionerAction } from '../../actions/caseAssociation/validateAddPrivatePractitionerAction';

export const validateAddPrivatePractitionerSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateAddPrivatePractitionerAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
