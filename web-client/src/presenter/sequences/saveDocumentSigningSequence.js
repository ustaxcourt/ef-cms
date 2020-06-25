import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { completeDocumentSigningActionFactory } from '../actions/completeDocumentSigningActionFactory';
import { completeWorkItemForDocumentSigningAction } from '../actions/completeWorkItemForDocumentSigningAction';
import { navigateToDraftDocumentsAction } from '../actions/navigateToDraftDocumentsAction';
import { parallel } from 'cerebral';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const saveDocumentSigningSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  setSaveAlertsForNavigationAction,
  completeDocumentSigningActionFactory({ successMessage: 'Signature added.' }),
  completeWorkItemForDocumentSigningAction,
  parallel([setDocumentIdAction, setDocumentDetailTabAction]),
  clearPDFSignatureDataAction,
  clearFormAction,
  setAlertSuccessAction,
  setCaseDetailPageTabActionGenerator('drafts'),
  navigateToDraftDocumentsAction,
]);
