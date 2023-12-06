import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCaseAssociationRequestAction } from '../actions/validateCaseAssociationRequestAction';

export const validateCaseAssociationRequestSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      setFilersFromFilersMapAction,
      validateCaseAssociationRequestAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
