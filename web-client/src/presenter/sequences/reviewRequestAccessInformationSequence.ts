import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { generateCaseAssociationTitleAction } from '../actions/CaseAssociationRequest/generateCaseAssociationTitleAction';
import { generateTitleForSupportingDocumentsAction } from '../actions/FileDocument/generateTitleForSupportingDocumentsAction';
import { navigateToRequestAccessReviewAction } from '../actions/navigateToRequestAccessReviewAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setSupportingDocumentScenarioAction } from '../actions/FileDocument/setSupportingDocumentScenarioAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateCaseAssociationRequestAction } from '../actions/validateCaseAssociationRequestAction';

export const reviewRequestAccessInformationSequence = [
  clearAlertsAction,
  startShowValidationAction,
  computeCertificateOfServiceFormDateAction,
  setSupportingDocumentScenarioAction,
  setFilersFromFilersMapAction,
  validateCaseAssociationRequestAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      generateCaseAssociationTitleAction,
      generateTitleForSupportingDocumentsAction,
      stopShowValidationAction,
      clearAlertsAction,
      navigateToRequestAccessReviewAction,
    ],
  },
];
