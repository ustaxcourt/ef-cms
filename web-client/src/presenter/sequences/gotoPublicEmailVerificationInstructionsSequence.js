import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoPublicEmailVerificationInstructionsSequence = [
  clearAlertsAction,
  clearScreenMetadataAction,
  setCurrentPageAction('EmailVerificationInstructions'),
];
