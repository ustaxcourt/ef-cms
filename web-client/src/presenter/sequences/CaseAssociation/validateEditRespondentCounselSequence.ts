import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../../actions/shouldValidateAction';
import { validateEditRespondentCounselAction } from '../../actions/CaseAssociation/validateEditRespondentCounselAction';

export const validateEditRespondentCounselSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateEditRespondentCounselAction,
      {
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
