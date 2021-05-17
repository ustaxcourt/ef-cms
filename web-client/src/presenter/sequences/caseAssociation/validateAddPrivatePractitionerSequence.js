import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { setFilersFromFilersMapForModalAction } from '../../actions/setFilersFromFilersMapForModalAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../../actions/shouldValidateAction';
import { validateAddPrivatePractitionerAction } from '../../actions/caseAssociation/validateAddPrivatePractitionerAction';

export const validateAddPrivatePractitionerSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      setFilersFromFilersMapForModalAction,
      validateAddPrivatePractitionerAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
