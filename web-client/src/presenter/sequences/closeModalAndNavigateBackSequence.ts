import { clearModalAction } from '../actions/clearModalAction';
import { navigateBackAction } from '../actions/navigateBackAction';

export const closeModalAndNavigateBackSequence = [
  clearModalAction,
  navigateBackAction,
];
