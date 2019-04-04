import { clearModalAction } from '../actions/clearModalAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';

export const startACaseConfirmCancelSequence = [
  clearModalAction,
  navigateToDashboardAction,
];
