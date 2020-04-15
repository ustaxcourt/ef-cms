import { clearSearchResultsAction } from '../../actions/AdvancedSearch/clearSearchResultsAction';
import { defaultAdvancedSearchFormAction } from '../../actions/AdvancedSearch/defaultAdvancedSearchFormAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';

export const gotoPublicSearchSequence = [
  clearSearchResultsAction,
  defaultAdvancedSearchFormAction,
  setCurrentPageAction('PublicSearch'),
];
