import { clearSearchResultsAction } from '../../actions/AdvancedSearch/clearSearchResultsAction';
import { defaultAdvancedSearchFormAction } from '../../actions/AdvancedSearch/defaultAdvancedSearchFormAction';
import { getPublicJudgesAction } from '../../actions/Public/getPublicJudgesAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { setUsersByKeyAction } from '../../actions/setUsersByKeyAction';

export const gotoPublicSearchSequence = [
  clearSearchResultsAction,
  defaultAdvancedSearchFormAction,
  getPublicJudgesAction,
  setUsersByKeyAction('judges'),
  setCurrentPageAction('PublicSearch'),
];
