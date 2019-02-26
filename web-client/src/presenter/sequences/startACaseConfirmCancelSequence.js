import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { clearModalAction } from '../actions/clearModalAction';

export const startACaseConfirmCancelSequence = [
  clearModalAction,
  navigateToDashboardAction,
];
