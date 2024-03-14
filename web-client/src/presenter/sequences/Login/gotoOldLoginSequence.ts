import { clearModalAction } from '../../actions/clearModalAction';
import { clearUserAction } from '../../actions/clearUserAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const gotoOldLoginSequence = [
  setupCurrentPageAction('Interstitial'),
  clearModalAction,
  clearUserAction,
  setupCurrentPageAction('OldLogin'),
];
