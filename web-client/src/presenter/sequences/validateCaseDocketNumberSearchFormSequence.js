import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../actions/AdvancedSearch/clearSearchResultsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateCaseDocketNumberSearchAction } from '../actions/AdvancedSearch/validateCaseDocketNumberSearchAction';

export const validateCaseDocketNumberSearchFormSequence = [
  validateCaseDocketNumberSearchAction,
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
