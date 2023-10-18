import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearOtherIterationAction } from '../actions/clearOtherIterationAction';
import { defaultSecondaryDocumentAction } from '../actions/FileDocument/defaultSecondaryDocumentAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { navigateToFileADocumentAction } from '../actions/FileDocument/navigateToFileADocumentAction';
import { refreshExternalDocumentTitleFromEventCodeAction } from '../actions/FileDocument/refreshExternalDocumentTitleFromEventCodeAction';
import { setDefaultFileDocumentFormValuesAction } from '../actions/FileDocument/setDefaultFileDocumentFormValuesAction';
import { setDocketNumberPropAction } from '../actions/FileDocument/setDocketNumberPropAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';

export const completeDocumentSelectSequence = [
  startShowValidationAction,
  defaultSecondaryDocumentAction,
  refreshExternalDocumentTitleFromEventCodeAction,
  generateTitleAction,
  validateSelectDocumentTypeAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [
      clearAlertsAction,
      stopShowValidationAction,
      setDocketNumberPropAction,
      setDefaultFileDocumentFormValuesAction,
      clearOtherIterationAction,
      navigateToFileADocumentAction,
    ],
  },
];
