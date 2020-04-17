import { clearAdvancedSearchFormAction } from '../actions/AdvancedSearch/clearAdvancedSearchFormAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearSearchResultsAction } from '../actions/AdvancedSearch/clearSearchResultsAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const clearAdvancedSearchFormSequence = [
  stopShowValidationAction,
  clearAlertsAction,
  clearErrorAlertsAction,
  clearSearchResultsAction,
  clearAdvancedSearchFormAction,
];
