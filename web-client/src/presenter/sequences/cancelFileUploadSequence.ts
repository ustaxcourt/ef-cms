import { cancelUploadsAction } from '../actions/cancelUploadsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

export const cancelFileUploadSequence = [
  setupCurrentPageAction('Interstitial'),
  cancelUploadsAction,
  clearModalAction,
];
