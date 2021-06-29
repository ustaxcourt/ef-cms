import { clearAlertsAction } from '../actions/clearAlertsAction';
import { defaultAdvancedSearchFormAction } from '../actions/AdvancedSearch/defaultAdvancedSearchFormAction';

export const advancedSearchTabChangeSequence = [
  clearAlertsAction,
  defaultAdvancedSearchFormAction,
];
