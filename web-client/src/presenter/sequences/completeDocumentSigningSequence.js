import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { completeDocumentSigningAction } from '../actions/completeDocumentSigningAction';
import { createWorkItemAction } from '../actions/createWorkItemAction';
import { createWorkItemSequence } from './createWorkItemSequence';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { parallel } from 'cerebral';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { validateInitialWorkItemMessageAction } from '../actions/validateInitialWorkItemMessageAction';

export const completeDocumentSigningSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateInitialWorkItemMessageAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setFormSubmittingAction,
      completeDocumentSigningAction,
      parallel([setDocumentIdAction, setDocumentDetailTabAction]),
      validateInitialWorkItemMessageAction,
      {
        error: [setValidationErrorsAction],
        success: [
          createWorkItemAction,
          {
            success: [stopShowValidationAction, setAlertSuccessAction],
          },
          clearFormAction,
        ],
      },
      unsetFormSubmittingAction,
      clearPDFSignatureDataAction,
      clearFormAction,
      navigateToCaseDetailAction,
    ],
  },
];
