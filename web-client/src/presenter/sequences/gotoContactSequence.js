import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoContactSequence = [
  clearAlertsAction,
  clearScreenMetadataAction,
  setCurrentPageAction('Contact'),
];
