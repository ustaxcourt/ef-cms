import { clearModalAction } from '../actions/clearModalAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';

export const closeModalAndReturnToDashboardSequence = [
  clearModalAction,
  navigateToDashboardAction,
];
