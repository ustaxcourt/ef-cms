import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../actions/AdvancedSearch/clearSearchResultsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validatePractitionerSearchByNameAction } from '../actions/AdvancedSearch/validatePractitionerSearchByNameAction';

export const validatePractitionerSearchByNameFormSequence = [
  validatePractitionerSearchByNameAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      clearSearchResultsAction,
      startShowValidationAction,
    ],
    success: [clearAlertsAction, stopShowValidationAction],
  },
];
