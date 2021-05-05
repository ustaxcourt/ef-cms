import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../../actions/shouldValidateAction';
import { validateEditRespondentCounselAction } from '../../actions/caseAssociation/validateEditRespondentCounselAction';

export const validateEditRespondentCounselSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateEditRespondentCounselAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
