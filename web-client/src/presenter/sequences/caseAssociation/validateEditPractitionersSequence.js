import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../../actions/shouldValidateAction';
import { validateEditPractitionersAction } from '../../actions/caseAssociation/validateEditPractitionersAction';

export const validateEditPractitionersSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateEditPractitionersAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
