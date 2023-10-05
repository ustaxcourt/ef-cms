import { clearAlertsAction } from '../actions/clearAlertsAction';
import { generateCaseAssociationTitleAction } from '../actions/CaseAssociationRequest/generateCaseAssociationTitleAction';
import { generateEntryOfAppearancePdfAction } from '@web-client/presenter/actions/CaseAssociationRequest/generateEntryOfAppearancePdfAction';
import { generateTitleForSupportingDocumentsAction } from '../actions/FileDocument/generateTitleForSupportingDocumentsAction';
import { navigateToRequestAccessReviewAction } from '../actions/navigateToRequestAccessReviewAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setPdfPreviewUrlAction } from '@web-client/presenter/actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSupportingDocumentScenarioAction } from '../actions/FileDocument/setSupportingDocumentScenarioAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateCaseAssociationRequestAction } from '../actions/validateCaseAssociationRequestAction';

export const reviewRequestAccessInformationSequence =
  showProgressSequenceDecorator([
    clearAlertsAction,
    startShowValidationAction,
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
        generateEntryOfAppearancePdfAction,
        setPdfPreviewUrlAction,
        generateCaseAssociationTitleAction,
        generateTitleForSupportingDocumentsAction,
        stopShowValidationAction,
        clearAlertsAction,
        navigateToRequestAccessReviewAction,
      ],
    },
  ]);
