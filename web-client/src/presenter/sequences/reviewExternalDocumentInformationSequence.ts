import { clearAlertsAction } from '../actions/clearAlertsAction';
import { autoGenerateFilingPdfAction } from '@web-client/presenter/actions/FileDocument/autoGenerateFilingPdfAction';
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
import { setCustomValidationAlertErrorsFileDocumentAction } from '../actions/setCustomValidationAlertErrorsFileDocumentAction';
import { isNoticeOfWithdrawalAction } from '@web-client/presenter/actions/isNoticeOfWithdrawalAction';
import { setPartiesToWithdrawFromAction } from '@web-client/presenter/actions/setPartiesToWithdrawFromAction';

export const reviewExternalDocumentInformationSequence =
  showProgressSequenceDecorator([
    clearAlertsAction,
    startShowValidationAction,
    setFilersFromFilersMapAction,
    isNoticeOfWithdrawalAction,
    { yes: [setPartiesToWithdrawFromAction], no: [] },
    validateExternalDocumentInformationAction,
    {
      error: [
        setValidationErrorsAction,
        setScrollToErrorNotificationAction,
        setValidationAlertErrorsAction,
        setCustomValidationAlertErrorsFileDocumentAction,
      ],
      success: [
        autoGenerateFilingPdfAction,
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
