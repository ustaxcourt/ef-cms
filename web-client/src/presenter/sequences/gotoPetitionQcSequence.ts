import { clearFormsAction } from '../actions/clearFormsAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setContactsOnFormAction } from '../actions/setContactsOnFormAction';
import { setDefaultDocumentSelectedForPreviewAction } from '../actions/setDefaultDocumentSelectedForPreviewAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setDocumentForPreviewSequence } from '../sequences/setDocumentForPreviewSequence';
import { setFormForCaseAction } from '../actions/setFormForCaseAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetDocumentSelectedForPreviewAction } from '../actions/unsetDocumentSelectedForPreviewAction';

export const gotoPetitionQcSequence = startWebSocketConnectionSequenceDecorator(
  [
    setupCurrentPageAction('Interstitial'),
    clearFormsAction,
    setRedirectUrlAction,
    stopShowValidationAction,
    setDocumentDetailTabAction,
    getCaseAction,
    setCaseAction,
    setCaseOnFormAction,
    setContactsOnFormAction,
    setFormForCaseAction,
    unsetDocumentSelectedForPreviewAction,
    setDefaultDocumentSelectedForPreviewAction,
    setDocumentForPreviewSequence,
    setupCurrentPageAction('PetitionQc'),
  ],
);
