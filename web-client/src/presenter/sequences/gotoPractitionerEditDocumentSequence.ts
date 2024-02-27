import { clearFormAction } from '../actions/clearFormAction';
import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { getPractitionerDocumentAction } from '../actions/getPractitionerDocumentAction';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';
import { setPractitionerDocumentFormForEditAction } from '../actions/Practitioners/setPractitionerDocumentFormForEditAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoPractitionerEditDocumentSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    clearFormAction,
    stopShowValidationAction,
    getPractitionerDetailAction,
    setPractitionerDetailAction,
    getPractitionerDocumentAction,
    setPractitionerDocumentFormForEditAction,
    setupCurrentPageAction('PractitionerAddEditDocument'),
  ]);
