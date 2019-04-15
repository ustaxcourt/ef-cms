import { clearAlertsAction } from '../actions/clearAlertsAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setSupportingDocumentScenarioAction } from '../actions/FileDocument/setSupportingDocumentScenarioAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { state } from 'cerebral';
import { validateExternalDocumentInformationAction } from '../actions/FileDocument/validateExternalDocumentInformationAction';

export const reviewExternalDocumentInformationSequence = [
  clearAlertsAction,
  set(state.showValidation, true),
  validateExternalDocumentInformationAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      setSupportingDocumentScenarioAction,
      generateTitleAction,
      set(state.showValidation, false),
      clearAlertsAction,
      set(state.wizardStep, 'FileDocumentReview'),
    ],
  },
];
