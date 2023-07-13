import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPdfPreviewSequence = startWebSocketConnectionSequenceDecorator(
  [setupCurrentPageAction('SimplePdfPreviewPage')],
);
