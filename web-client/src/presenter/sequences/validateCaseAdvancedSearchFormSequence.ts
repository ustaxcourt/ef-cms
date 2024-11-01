import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCaseAdvancedSearchAction } from '../actions/AdvancedSearch/validateCaseAdvancedSearchAction';

export const validateCaseAdvancedSearchFormSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateCaseAdvancedSearchAction,
      {
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
