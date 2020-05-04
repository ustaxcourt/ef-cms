import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../actions/AdvancedSearch/clearSearchResultsAction';
import { defaultAdvancedSearchFormAction } from '../actions/AdvancedSearch/defaultAdvancedSearchFormAction';

export const advancedSearchTabChangeSequence = [
  clearAlertsAction,
  defaultAdvancedSearchFormAction,
  clearSearchResultsAction,
];
