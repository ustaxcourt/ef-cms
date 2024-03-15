import { clearFormAction } from '../actions/clearFormAction';
import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoPractitionerAddDocumentSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    clearFormAction,
    stopShowValidationAction,
    getPractitionerDetailAction,
    setPractitionerDetailAction,
    setupCurrentPageAction('PractitionerAddEditDocument'),
  ]);
