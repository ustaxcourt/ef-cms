import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

export const gotoPublicEmailVerificationSuccessSequence = [
  clearAlertsAction,
  clearScreenMetadataAction,
  setupCurrentPageAction('EmailVerificationSuccess'),
];
