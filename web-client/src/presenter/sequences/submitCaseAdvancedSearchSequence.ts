import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../actions/AdvancedSearch/clearSearchResultsAction';
import { clearSearchTermAction } from '../actions/clearSearchTermAction';
import { defaultCaseSearchDatesAction } from '../actions/AdvancedSearch/defaultCaseSearchDatesAction';
import { setAdvancedSearchResultsAction } from '../actions/AdvancedSearch/setAdvancedSearchResultsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitCaseAdvancedSearchAction } from '../actions/AdvancedSearch/submitCaseAdvancedSearchAction';
import { validateCaseAdvancedSearchAction } from '../actions/AdvancedSearch/validateCaseAdvancedSearchAction';

export const submitCaseAdvancedSearchSequence = [
  clearSearchTermAction,
  startShowValidationAction,
  defaultCaseSearchDatesAction,
  validateCaseAdvancedSearchAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      clearSearchResultsAction,
    ],
    success: showProgressSequenceDecorator([
      stopShowValidationAction,
      clearAlertsAction,
      submitCaseAdvancedSearchAction,
      setAdvancedSearchResultsAction,
    ]),
  },
];
