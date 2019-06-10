import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';

export const navigateToPathSequence = [
  clearAlertsAction,
  clearErrorAlertsAction,
  navigateToPathAction,
];
