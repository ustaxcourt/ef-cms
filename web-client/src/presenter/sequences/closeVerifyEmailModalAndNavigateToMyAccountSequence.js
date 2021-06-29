import { clearModalSequence } from './clearModalSequence';
import { navigateToPathAction } from '../actions/navigateToPathAction';

export const closeVerifyEmailModalAndNavigateToMyAccountSequence = [
  clearModalSequence,
  navigateToPathAction,
];
