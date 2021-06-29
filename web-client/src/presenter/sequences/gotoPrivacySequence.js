import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoPrivacySequence = [
  clearAlertsAction,
  clearScreenMetadataAction,
  setCurrentPageAction('Privacy'),
];
