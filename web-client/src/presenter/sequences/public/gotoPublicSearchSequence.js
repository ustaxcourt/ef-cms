import { defaultAdvancedSearchFormAction } from '../../actions/AdvancedSearch/defaultAdvancedSearchFormAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';

export const gotoPublicSearchSequence = [
  defaultAdvancedSearchFormAction,
  setCurrentPageAction('PublicSearch'),
];
