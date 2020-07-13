import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { completeDocumentSigningAction } from '../actions/completeDocumentSigningAction';
import { completeWorkItemForDocumentSigningAction } from '../actions/completeWorkItemForDocumentSigningAction';
import { createWorkItemAction } from '../actions/createWorkItemAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { parallel } from 'cerebral';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCompleteDocumentSigningSuccessAlertAction } from '../actions/setCompleteDocumentSigningSuccessAlertAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setValidationErrorsByFlagAction } from '../actions/WorkItem/setValidationErrorsByFlagAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateWorkItemFromPropsOrModalOrFormAction } from '../actions/WorkItem/updateWorkItemFromPropsOrModalOrFormAction';
import { validateInitialWorkItemMessageAction } from '../actions/validateInitialWorkItemMessageAction';

export const completeDocumentSigningSequence = [
  clearAlertsAction,
  startShowValidationAction,
  updateWorkItemFromPropsOrModalOrFormAction,
  validateInitialWorkItemMessageAction,
  {
    error: [setValidationErrorsByFlagAction],
    success: [
      setCurrentPageAction('Interstitial'),
      completeDocumentSigningAction,
      setCompleteDocumentSigningSuccessAlertAction,
      completeWorkItemForDocumentSigningAction,
      parallel([setDocumentIdAction, setDocumentDetailTabAction]),
      updateWorkItemFromPropsOrModalOrFormAction,
      validateInitialWorkItemMessageAction,
      {
        error: [setValidationErrorsByFlagAction],
        success: [
          createWorkItemAction,
          stopShowValidationAction,
          setAlertSuccessAction,
          clearFormAction,
        ],
      },
      clearPDFSignatureDataAction,
      clearFormAction,
      navigateToCaseDetailAction,
    ],
  },
];
