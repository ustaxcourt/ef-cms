import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../../actions/shouldValidateAction';
import { validateEditIrsPractitionersAction } from '../../actions/caseAssociation/validateEditIrsPractitionersAction';

export const validateEditIrsPractitionersSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateEditIrsPractitionersAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
