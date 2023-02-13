import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPrivacySequence = startWebSocketConnectionSequenceDecorator([
  clearAlertsAction,
  clearScreenMetadataAction,
  setCurrentPageAction('Privacy'),
]);
