import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoPublicEmailVerificationSuccessSequence = [
  clearAlertsAction,
  clearScreenMetadataAction,
  setCurrentPageAction('EmailVerificationSuccess'),
];
