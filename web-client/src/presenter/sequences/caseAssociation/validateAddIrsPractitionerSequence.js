import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../../actions/shouldValidateAction';
import { validateAddIrsPractitionerAction } from '../../actions/caseAssociation/validateAddIrsPractitionerAction';

export const validateAddIrsPractitionerSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateAddIrsPractitionerAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
