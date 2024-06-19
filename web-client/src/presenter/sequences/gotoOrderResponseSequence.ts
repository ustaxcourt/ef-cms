import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setDocketEntrySelectedFromMessageAction } from '../actions/setDocketEntrySelectedFromMessageAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
// import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoOrderResponseSequence =
  //startWebSocketConnectionSequenceDecorator(
  [
    setupCurrentPageAction('Interstitial'),
    getCaseAction,
    setCaseAction,
    setDocketEntryIdAction,
    setDocketEntrySelectedFromMessageAction,
    clearFormAction,
    // need to load the PDF into state?
    // see setPDFForStampAction for an example
    setupCurrentPageAction('OrderResponse'),
  ]; //);
