import { clearModalAction } from '../actions/clearModalAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { navigateToMaintenanceAction } from '../actions/navigateToMaintenanceAction';

export const closeModalAndNavigateToMaintenanceSequence = [
  clearModalAction,
  followRedirectAction,
  {
    default: [navigateToMaintenanceAction],
    success: [],
  },
];
