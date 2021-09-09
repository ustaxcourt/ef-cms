import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPdfPreviewSequence = startWebSocketConnectionSequenceDecorator(
  [setCurrentPageAction('SimplePdfPreviewPage')],
);
