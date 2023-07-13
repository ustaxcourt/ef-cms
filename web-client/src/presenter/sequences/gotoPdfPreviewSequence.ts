import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPdfPreviewSequence = startWebSocketConnectionSequenceDecorator(
  [setCurrentPageAction('SimplePdfPreviewPage')],
);
