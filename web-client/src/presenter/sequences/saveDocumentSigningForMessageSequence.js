import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { completeDocumentSigningAction } from '../actions/completeDocumentSigningAction';
import { navigateToMessageDetailAction } from '../actions/navigateToMessageDetailAction';
import { parallel } from 'cerebral';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setSignAndCompleteDocumentSigningSuccessAlertAction } from '../actions/setSignAndCompleteDocumentSigningSuccessAlertAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const saveDocumentSigningForMessageSequence = showProgressSequenceDecorator(
  [
    clearAlertsAction,
    setSaveAlertsForNavigationAction,
    setSignAndCompleteDocumentSigningSuccessAlertAction,
    completeDocumentSigningAction,
    parallel([setDocumentIdAction, setDocumentDetailTabAction]),
    clearPDFSignatureDataAction,
    clearFormAction,
    setAlertSuccessAction,
    navigateToMessageDetailAction,
  ],
);
