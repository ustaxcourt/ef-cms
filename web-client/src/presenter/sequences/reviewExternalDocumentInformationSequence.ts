import { clearAlertsAction } from '../actions/clearAlertsAction';
import { generateEntryOfAppearancePdfAction } from '@web-client/presenter/actions/CaseAssociationRequest/generateEntryOfAppearancePdfAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { generateTitleForSupportingDocumentsAction } from '../actions/FileDocument/generateTitleForSupportingDocumentsAction';
import { navigateToReviewFileADocumentAction } from '../actions/FileDocument/navigateToReviewFileADocumentAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setPdfPreviewUrlAction } from '@web-client/presenter/actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setSupportingDocumentScenarioAction } from '../actions/FileDocument/setSupportingDocumentScenarioAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateExternalDocumentInformationAction } from '../actions/FileDocument/validateExternalDocumentInformationAction';

export const reviewExternalDocumentInformationSequence =
  showProgressSequenceDecorator([
    clearAlertsAction,
    startShowValidationAction,
    setFilersFromFilersMapAction,
    validateExternalDocumentInformationAction,
    {
      error: [
        setValidationErrorsAction,
        setScrollToErrorNotificationAction,
        setValidationAlertErrorsAction,
      ],
      success: [
        generateEntryOfAppearancePdfAction,
        setPdfPreviewUrlAction,
        setSupportingDocumentScenarioAction,
        generateTitleAction,
        generateTitleForSupportingDocumentsAction,
        stopShowValidationAction,
        clearAlertsAction,
        navigateToReviewFileADocumentAction,
      ],
    },
  ]);
