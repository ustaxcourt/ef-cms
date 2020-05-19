import { clearSearchResultsAction } from '../../actions/AdvancedSearch/clearSearchResultsAction';
import { defaultAdvancedSearchFormAction } from '../../actions/AdvancedSearch/defaultAdvancedSearchFormAction';
import { getOpinionTypesAction } from '../../actions/getOpinionTypesAction';
import { getPublicJudgesAction } from '../../actions/Public/getPublicJudgesAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { setOpinionTypesAction } from '../../actions/setOpinionTypesAction';
import { setUsersByKeyAction } from '../../actions/setUsersByKeyAction';

export const gotoPublicSearchSequence = [
  clearSearchResultsAction,
  defaultAdvancedSearchFormAction,
  getPublicJudgesAction,
  setUsersByKeyAction('judges'),
  getOpinionTypesAction,
  setOpinionTypesAction,
  setCurrentPageAction('PublicSearch'),
];
