import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../../actions/shouldValidateAction';
import { validateAddRespondentAction } from '../../actions/caseAssociation/validateAddRespondentAction';

export const validateAddRespondentSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateAddRespondentAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
