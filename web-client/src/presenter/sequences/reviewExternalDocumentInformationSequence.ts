import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { generateTitleForSupportingDocumentsAction } from '../actions/FileDocument/generateTitleForSupportingDocumentsAction';
import { navigateToReviewFileADocumentAction } from '../actions/FileDocument/navigateToReviewFileADocumentAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setSupportingDocumentScenarioAction } from '../actions/FileDocument/setSupportingDocumentScenarioAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateExternalDocumentInformationAction } from '../actions/FileDocument/validateExternalDocumentInformationAction';

export const reviewExternalDocumentInformationSequence = [
  clearAlertsAction,
  startShowValidationAction,
  computeCertificateOfServiceFormDateAction,
  setFilersFromFilersMapAction,
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
      generateTitleForSupportingDocumentsAction,
      stopShowValidationAction,
      clearAlertsAction,
      navigateToReviewFileADocumentAction,
    ],
  },
];
