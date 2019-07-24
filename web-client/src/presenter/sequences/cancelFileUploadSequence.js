import { cancelUploadsAction } from '../actions/cancelUploadsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const cancelFileUploadSequence = [
  setCurrentPageAction('Interstitial'),
  cancelUploadsAction,
  clearModalAction,
];
