import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../../actions/shouldValidateAction';
import { validateEditRespondentsAction } from '../../actions/caseAssociation/validateEditRespondentsAction';

export const validateEditRespondentsSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateEditRespondentsAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
