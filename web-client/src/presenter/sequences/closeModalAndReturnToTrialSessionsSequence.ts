import { clearModalAction } from '../actions/clearModalAction';
import { navigateToTrialSessionsAction } from '../actions/TrialSession/navigateToTrialSessionsAction';

export const closeModalAndReturnToTrialSessionsSequence = [
  clearModalAction,
  navigateToTrialSessionsAction,
];
