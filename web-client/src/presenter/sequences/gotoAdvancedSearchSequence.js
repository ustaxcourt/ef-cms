import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoAdvancedSearchSequence = [
  clearAlertsAction,
  setCurrentPageAction('AdvancedSearch'),
];
