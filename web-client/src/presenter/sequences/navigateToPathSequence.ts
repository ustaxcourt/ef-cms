import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';

export const navigateToPathSequence = [
  clearErrorAlertsAction,
  navigateToPathAction,
];
