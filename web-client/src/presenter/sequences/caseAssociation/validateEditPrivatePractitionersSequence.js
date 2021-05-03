import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../../actions/shouldValidateAction';
import { validateEditPrivatePractitionersAction } from '../../actions/caseAssociation/validateEditPrivatePractitionersAction';

export const validateEditPrivatePractitionersSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateEditPrivatePractitionersAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
