import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';

export const gotoPublicEmailVerificationSuccessSequence = [
  clearAlertsAction,
  clearScreenMetadataAction,
  setCurrentPageAction('EmailVerificationSuccess'),
];
