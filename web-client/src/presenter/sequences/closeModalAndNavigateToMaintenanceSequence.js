import { clearModalAction } from '../actions/clearModalAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';

export const closeModalAndNavigateToMaintenanceSequence = [
  clearModalAction,
  navigateToPathAction,
];
