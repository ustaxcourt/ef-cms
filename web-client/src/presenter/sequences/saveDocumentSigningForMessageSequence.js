import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { completeDocumentSigningActionFactory } from '../actions/completeDocumentSigningActionFactory';
import { navigateToMessageDetailAction } from '../actions/navigateToMessageDetailAction';
import { parallel } from 'cerebral';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const saveDocumentSigningForMessageSequence = showProgressSequenceDecorator(
  [
    clearAlertsAction,
    setSaveAlertsForNavigationAction,
    completeDocumentSigningActionFactory({
      successMessage:
        'Your document has been successfully created and attached to this message',
    }),
    parallel([setDocumentIdAction, setDocumentDetailTabAction]),
    clearPDFSignatureDataAction,
    clearFormAction,
    setAlertSuccessAction,
    navigateToMessageDetailAction,
  ],
);
