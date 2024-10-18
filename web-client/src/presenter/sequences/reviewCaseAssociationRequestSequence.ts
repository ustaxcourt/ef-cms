import { clearAlertsAction } from '../actions/clearAlertsAction';
import { generateCaseAssociationTitleAction } from '../actions/CaseAssociationRequest/generateCaseAssociationTitleAction';
import { generateEntryOfAppearancePdfAction } from '@web-client/presenter/actions/CaseAssociationRequest/generateEntryOfAppearancePdfAction';
import { generateTitleForSupportingDocumentsAction } from '../actions/FileDocument/generateTitleForSupportingDocumentsAction';
import { navigateToReviewCaseAssociationRequestAction } from '../actions/navigateToReviewCaseAssociationRequestAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setPdfPreviewUrlAction } from '@web-client/presenter/actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setSupportingDocumentScenarioAction } from '../actions/FileDocument/setSupportingDocumentScenarioAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateCaseAssociationRequestAction } from '../actions/validateCaseAssociationRequestAction';

export const reviewCaseAssociationRequestSequence =
  showProgressSequenceDecorator([
    clearAlertsAction,
    startShowValidationAction,
    setSupportingDocumentScenarioAction,
    setFilersFromFilersMapAction,
    validateCaseAssociationRequestAction,
    {
      error: [
        setValidationErrorsAction,
        setScrollToErrorNotificationAction,
        setValidationAlertErrorsAction,
      ],
      success: [
        generateEntryOfAppearancePdfAction,
        setPdfPreviewUrlAction,
        generateCaseAssociationTitleAction,
        generateTitleForSupportingDocumentsAction,
        stopShowValidationAction,
        clearAlertsAction,
        navigateToReviewCaseAssociationRequestAction,
      ],
    },
  ]);
