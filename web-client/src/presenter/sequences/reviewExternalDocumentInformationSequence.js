import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { navigateToReviewFileADocumentAction } from '../actions/FileDocument/navigateToReviewFileADocumentAction';
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
  computeCertificateOfServiceFormDateAction,
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
      navigateToReviewFileADocumentAction,
    ],
  },
];
