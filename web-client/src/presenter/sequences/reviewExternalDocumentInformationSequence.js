import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { generateTitleForSupportingDocumentsAction } from '../actions/FileDocument/generateTitleForSupportingDocumentsAction';
import { navigateToReviewFileADocumentAction } from '../actions/FileDocument/navigateToReviewFileADocumentAction';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setFileDocumentValidationAlertErrorsAction } from '../actions/FileDocument/setFileDocumentValidationAlertErrorsAction';
import { setSupportingDocumentScenarioAction } from '../actions/FileDocument/setSupportingDocumentScenarioAction';
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
      setFileDocumentValidationAlertErrorsAction,
    ],
    success: [
      setSupportingDocumentScenarioAction,
      generateTitleAction,
      generateTitleForSupportingDocumentsAction,
      set(state.showValidation, false),
      clearAlertsAction,
      navigateToReviewFileADocumentAction,
    ],
  },
];
