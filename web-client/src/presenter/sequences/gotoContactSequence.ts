import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoContactSequence = startWebSocketConnectionSequenceDecorator([
  clearAlertsAction,
  clearScreenMetadataAction,
  setupCurrentPageAction('Contact'),
]);
