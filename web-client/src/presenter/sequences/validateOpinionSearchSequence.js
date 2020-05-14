import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../actions/AdvancedSearch/clearSearchResultsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateOpinionAdvancedSearchAction } from '../actions/AdvancedSearch/validateOpinionAdvancedSearchAction';

export const validateOpinionSearchSequence = [
  validateOpinionAdvancedSearchAction,
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
