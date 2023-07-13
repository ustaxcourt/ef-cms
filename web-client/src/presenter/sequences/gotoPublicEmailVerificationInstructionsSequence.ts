import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

export const gotoPublicEmailVerificationInstructionsSequence = [
  clearAlertsAction,
  clearScreenMetadataAction,
  setupCurrentPageAction('EmailVerificationInstructions'),
];
