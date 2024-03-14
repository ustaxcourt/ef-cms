import { clearModalAction } from '../../actions/clearModalAction';
import { clearUserAction } from '../../actions/clearUserAction';
import { logOldLoginAttemptAction } from '@web-client/presenter/actions/Login/logOldLoginAttemptAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const gotoOldLoginSequence = [
  setupCurrentPageAction('Interstitial'),
  clearModalAction,
  clearUserAction,
  logOldLoginAttemptAction,
  setupCurrentPageAction('OldLogin'),
];
