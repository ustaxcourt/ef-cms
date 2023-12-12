/* eslint-disable max-lines */
import { ActionError } from './errors/ActionError';
import { ClientApplicationContext } from '../applicationContext';
import { GatewayTimeoutError } from './errors/GatewayTimeoutError';
import { InvalidRequestError } from './errors/InvalidRequestError';
import { NotFoundError } from './errors/NotFoundError';
import { ServerInvalidResponseError } from './errors/ServerInvalidResponseError';
import { UnauthorizedRequestError } from './errors/UnauthorizedRequestError';
import { UnidentifiedUserError } from './errors/UnidentifiedUserError';
import { addCaseToTrialSessionSequence } from './sequences/addCaseToTrialSessionSequence';
import { addPenaltyInputSequence } from './sequences/addPenaltyInputSequence';
import { addStatisticToFormSequence } from './sequences/addStatisticToFormSequence';
import { addSupportingDocumentToFormSequence } from './sequences/addSupportingDocumentToFormSequence';
import { adminContactUpdateCompleteSequence } from './sequences/adminContactUpdateCompleteSequence';
import { adminContactUpdateInitialUpdateCompleteSequence } from './sequences/adminContactUpdateInitialUpdateCompleteSequence';
import { adminContactUpdateProgressSequence } from './sequences/adminContactUpdateProgressSequence';
import { advancedSearchTabChangeSequence } from './sequences/advancedSearchTabChangeSequence';
import { applyStampFormChangeSequence } from './sequences/applyStampFormChangeSequence';
import { archiveDraftDocumentModalSequence } from './sequences/archiveDraftDocumentModalSequence';
import { archiveDraftDocumentSequence } from './sequences/archiveDraftDocumentSequence';
import { assignSelectedWorkItemsSequence } from './sequences/assignSelectedWorkItemsSequence';
import { associateIrsPractitionerWithCaseSequence } from './sequences/CaseAssociation/associateIrsPractitionerWithCaseSequence';
import { associatePrivatePractitionerWithCaseSequence } from './sequences/CaseAssociation/associatePrivatePractitionerWithCaseSequence';
import { autoSaveTrialSessionWorkingCopySequence } from './sequences/autoSaveTrialSessionWorkingCopySequence';
import { batchDownloadErrorSequence } from './sequences/batchDownloadErrorSequence';
import { batchDownloadReadySequence } from './sequences/batchDownloadReadySequence';
import { batchDownloadTrialSessionSequence } from './sequences/batchDownloadTrialSessionSequence';
import { blockCaseFromTrialSequence } from './sequences/blockCaseFromTrialSequence';
import { broadcastIdleStatusActiveSequence } from './sequences/broadcastIdleStatusActiveSequence';
import { broadcastLogoutSequence } from './sequences/broadcastLogoutSequence';
import { broadcastStayLoggedInSequence } from './sequences/broadcastStayLoggedInSequence';
import { calculatePenaltiesSequence } from './sequences/calculatePenaltiesSequence';
import { canEditContactInformationSequence } from './sequences/canEditContactInformationSequence';
import { cancelAddDraftDocumentSequence } from './sequences/cancelAddDraftDocumentSequence';
import { cancelAddStatisticSequence } from './sequences/cancelAddStatisticSequence';
import { cancelAndNavigateToCorrespondenceSequence } from './sequences/cancelAndNavigateToCorrespondenceSequence';
import { cancelFileUploadSequence } from './sequences/cancelFileUploadSequence';
import { cancelRemovePetitionerSequence } from './sequences/cancelRemovePetitionerSequence';
import { caseDetailPrimaryTabChangeSequence } from './sequences/caseDetailPrimaryTabChangeSequence';
import { caseInventoryReportLoadMoreSequence } from './sequences/caseInventoryReportLoadMoreSequence';
import { cerebralBindSimpleSetStateSequence } from './sequences/cerebralBindSimpleSetStateSequence';
import { changePasswordLocalSequence } from './sequences/changePasswordLocalSequence';
import { changeTabAndSetViewerDocumentToDisplaySequence } from './sequences/changeTabAndSetViewerDocumentToDisplaySequence';
import { checkForNegativeValueSequence } from './sequences/checkForNegativeValueSequence';
import { chooseModalWizardStepSequence } from './sequences/chooseModalWizardStepSequence';
import { chooseStartCaseWizardStepSequence } from './sequences/chooseStartCaseWizardStepSequence';
import { chooseWizardStepSequence } from './sequences/chooseWizardStepSequence';
import { chooseWorkQueueSequence } from './sequences/chooseWorkQueueSequence';
import { clearAdvancedSearchFormSequence } from './sequences/clearAdvancedSearchFormSequence';
import { clearAlertSequence } from './sequences/clearAlertSequence';
import { clearDropDownMenuStateSequence } from './sequences/clearDropDownMenuStateSequence';
import { clearDueDateSequence } from './sequences/clearDueDateSequence';
import { clearExistingDocumentSequence } from './sequences/clearExistingDocumentSequence';
import { clearModalFormSequence } from './sequences/clearModalFormSequence';
import { clearModalSequence } from './sequences/clearModalSequence';
import { clearOpenClosedCasesCurrentPageSequence } from './sequences/clearOpenClosedCasesCurrentPageSequence';
import { clearOptionalCustomCaseReportFilterSequence } from './sequences/clearOptionalCustomCaseReportFilterSequence';
import { clearOptionalFieldsStampFormSequence } from './sequences/clearOptionalFieldsStampFormSequence';
import { clearPdfPreviewUrlSequence } from './sequences/clearPdfPreviewUrlSequence';
import { clearPreferredTrialCitySequence } from './sequences/clearPreferredTrialCitySequence';
import { clearSelectedWorkItemsSequence } from './sequences/clearSelectedWorkItemsSequence';
import { clearViewerDocumentToDisplaySequence } from './sequences/clearViewerDocumentToDisplaySequence';
import { closeModalAndNavigateBackSequence } from './sequences/closeModalAndNavigateBackSequence';
import { closeModalAndNavigateSequence } from './sequences/closeModalAndNavigateSequence';
import { closeModalAndNavigateToMaintenanceSequence } from './sequences/closeModalAndNavigateToMaintenanceSequence';
import { closeModalAndRefetchCase } from './sequences/DocketEntry/closeModalAndRefetchCase';
import { closeModalAndReturnToCaseDetailDraftDocumentsSequence } from './sequences/closeModalAndReturnToCaseDetailDraftDocumentsSequence';
import { closeModalAndReturnToCaseDetailSequence } from './sequences/closeModalAndReturnToCaseDetailSequence';
import { closeModalAndReturnToDashboardSequence } from './sequences/closeModalAndReturnToDashboardSequence';
import { closeModalAndReturnToPractitionerDocumentsPageSequence } from './sequences/closeModalAndReturnToPractitionerDocumentsPageSequence';
import { closeModalAndReturnToTrialSessionsSequence } from './sequences/closeModalAndReturnToTrialSessionsSequence';
import { closeTrialSessionSequence } from './sequences/closeTrialSessionSequence';
import { closeVerifyEmailModalAndNavigateToMyAccountSequence } from './sequences/closeVerifyEmailModalAndNavigateToMyAccountSequence';
import { closeVerifyEmailModalAndNavigateToPractitionerDetailSequence } from './sequences/closeVerifyEmailModalAndNavigateToPractitionerDetailSequence';
import { completeDocketEntryQCAndSendMessageSequence } from './sequences/completeDocketEntryQCAndSendMessageSequence';
import { completeDocketEntryQCSequence } from './sequences/completeDocketEntryQCSequence';
import { completeDocumentSelectSequence } from './sequences/completeDocumentSelectSequence';
import { completeMessageSequence } from './sequences/completeMessageSequence';
import { completePrintPaperPetitionReceiptSequence } from './sequences/completePrintPaperPetitionReceiptSequence';
import { completeStartCaseWizardStepSequence } from './sequences/completeStartCaseWizardStepSequence';
import { confirmSignUpLocalSequence } from './sequences/confirmSignUpLocalSequence';
import { confirmStayLoggedInSequence } from './sequences/confirmStayLoggedInSequence';
import { confirmWorkItemAlreadyCompleteSequence } from './sequences/confirmWorkItemAlreadyCompleteSequence';
import { consolidatedCaseCheckboxAllChangeSequence } from './sequences/consolidatedCaseCheckboxAllChangeSequence';
import { contactPrimaryCountryTypeChangeSequence } from './sequences/contactPrimaryCountryTypeChangeSequence';
import { convertHtml2PdfSequence } from './sequences/convertHtml2PdfSequence';
import { copyPrimaryContactSequence } from './sequences/copyPrimaryContactSequence';
import { countryTypeUserContactChangeSequence } from './sequences/countryTypeUserContactChangeSequence';
import { createCaseDeadlineSequence } from './sequences/createCaseDeadlineSequence';
import { createMessageSequence } from './sequences/createMessageSequence';
import { deleteCalendarNoteSequence } from './sequences/deleteCalendarNoteSequence';
import { deleteCaseDeadlineSequence } from './sequences/deleteCaseDeadlineSequence';
import { deleteCaseNoteSequence } from './sequences/deleteCaseNoteSequence';
import { deleteCorrespondenceDocumentSequence } from './sequences/deleteCorrespondenceDocumentSequence';
import { deleteDeficiencyStatisticsSequence } from './sequences/deleteDeficiencyStatisticsSequence';
import { deleteJudgesCaseNoteFromCaseDetailSequence } from './sequences/deleteJudgesCaseNoteFromCaseDetailSequence';
import { deleteOtherStatisticsSequence } from './sequences/deleteOtherStatisticsSequence';
import { deletePractitionerDocumentSequence } from './sequences/deletePractitionerDocumentSequence';
import { deleteTrialSessionSequence } from './sequences/deleteTrialSessionSequence';
import { deleteUploadedPdfSequence } from './sequences/deleteUploadedPdfSequence';
import { deleteUserCaseNoteFromWorkingCopySequence } from './sequences/deleteUserCaseNoteFromWorkingCopySequence';
import { deleteWorkingCopySessionNoteSequence } from './sequences/deleteWorkingCopySessionNoteSequence';
import { disengageAppMaintenanceSequence } from './sequences/disengageAppMaintenanceSequence';
import { dismissAddEditCaseWorksheetModalSequence } from '@web-client/presenter/sequences/dismissAddEditCaseWorksheetModalSequence';
import { dismissAlertSequence } from './sequences/dismissAlertSequence';
import { dismissCreateMessageModalSequence } from './sequences/dismissCreateMessageModalSequence';
import { dismissModalSequence } from './sequences/dismissModalSequence';
import { dismissThirtyDayTrialAlertSequence } from './sequences/dismissThirtyDayTrialAlertSequence';
import { editCorrespondenceDocumentSequence } from './sequences/editCorrespondenceDocumentSequence';
import { editUploadCourtIssuedDocumentSequence } from './sequences/editUploadCourtIssuedDocumentSequence';
import { exportPendingReportSequence } from '@web-client/presenter/sequences/exportPendingReportSequence';
import { fetchUserNotificationsSequence } from './sequences/fetchUserNotificationsSequence';
import { fileAndServeCourtIssuedDocumentFromDocketEntrySequence } from './sequences/fileAndServeCourtIssuedDocumentFromDocketEntrySequence';
import { filterCaseDeadlinesByJudgeSequence } from './sequences/filterCaseDeadlinesByJudgeSequence';
import { formCancelToggleCancelSequence } from './sequences/formCancelToggleCancelSequence';
import { formatAndUpdateDateFromDatePickerSequence } from './sequences/formatAndUpdateDateFromDatePickerSequence';
import { forwardMessageSequence } from './sequences/forwardMessageSequence';
import { gatewayTimeoutErrorSequence } from './sequences/gatewayTimeoutErrorSequence';
import { generateCaseCaptionSequence } from './sequences/generateCaseCaptionSequence';
import { generatePdfFromScanSessionSequence } from './sequences/generatePdfFromScanSessionSequence';
import { getBlockedCasesByTrialLocationSequence } from './sequences/getBlockedCasesByTrialLocationSequence';
import { getCaseInventoryReportSequence } from './sequences/getCaseInventoryReportSequence';
import { getCustomCaseReportSequence } from './sequences/getCustomCaseReportSequence';
import { getUsersInSectionSequence } from './sequences/getUsersInSectionSequence';
import { goToApplyStampSequence } from './sequences/gotoApplyStampSequence';
import { goToCreatePetitionerAccountSequence } from '@web-client/presenter/sequences/Public/goToCreatePetitionerAccountSequence';
import { gotoAccessibilityStatementSequence } from './sequences/gotoAccessibilityStatementSequence';
import { gotoAddCourtIssuedDocketEntrySequence } from './sequences/gotoAddCourtIssuedDocketEntrySequence';
import { gotoAddDeficiencyStatisticsSequence } from './sequences/gotoAddDeficiencyStatisticsSequence';
import { gotoAddOtherStatisticsSequence } from './sequences/gotoAddOtherStatisticsSequence';
import { gotoAddPaperFilingSequence } from './sequences/gotoAddPaperFilingSequence';
import { gotoAddPetitionerToCaseSequence } from './sequences/gotoAddPetitionerToCaseSequence';
import { gotoAddTrialSessionSequence } from './sequences/gotoAddTrialSessionSequence';
import { gotoAdvancedSearchSequence } from './sequences/gotoAdvancedSearchSequence';
import { gotoBeforeStartCaseSequence } from './sequences/gotoBeforeStartCaseSequence';
import { gotoBeforeYouFileDocumentSequence } from './sequences/gotoBeforeYouFileDocumentSequence';
import { gotoBlockedCasesReportSequence } from './sequences/gotoBlockedCasesReportSequence';
import { gotoCaseDeadlineReportSequence } from './sequences/gotoCaseDeadlineReportSequence';
import { gotoCaseDetailSequence } from './sequences/gotoCaseDetailSequence';
import { gotoCaseInventoryReportSequence } from './sequences/gotoCaseInventoryReportSequence';
import { gotoCaseSearchNoMatchesSequence } from './sequences/gotoCaseSearchNoMatchesSequence';
import { gotoChangeLoginAndServiceEmailSequence } from './sequences/gotoChangeLoginAndServiceEmailSequence';
import { gotoChangePasswordLocalSequence } from './sequences/gotoChangePasswordLocalSequence';
import { gotoCompleteDocketEntryQCSequence } from './sequences/gotoCompleteDocketEntryQCSequence';
import { gotoContactEditSequence } from './sequences/gotoContactEditSequence';
import { gotoContactSequence } from './sequences/gotoContactSequence';
import { gotoCreateOrderSequence } from './sequences/gotoCreateOrderSequence';
import { gotoCreatePractitionerUserSequence } from './sequences/gotoCreatePractitionerUserSequence';
import { gotoCustomCaseReportSequence } from './sequences/gotoCustomCaseReportSequence';
import { gotoDashboardSequence } from './sequences/gotoDashboardSequence';
import { gotoDocketEntryQcSequence } from './sequences/gotoDocketEntryQcSequence';
import { gotoEditCaseDetailsSequence } from './sequences/gotoEditCaseDetailsSequence';
import { gotoEditCorrespondenceDocumentSequence } from './sequences/gotoEditCorrespondenceDocumentSequence';
import { gotoEditCourtIssuedDocketEntrySequence } from './sequences/gotoEditCourtIssuedDocketEntrySequence';
import { gotoEditDeficiencyStatisticSequence } from './sequences/gotoEditDeficiencyStatisticSequence';
import { gotoEditDocketEntryMetaSequence } from './sequences/gotoEditDocketEntryMetaSequence';
import { gotoEditOrderSequence } from './sequences/gotoEditOrderSequence';
import { gotoEditOtherStatisticsSequence } from './sequences/gotoEditOtherStatisticsSequence';
import { gotoEditPaperFilingSequence } from './sequences/gotoEditPaperFilingSequence';
import { gotoEditPetitionerCounselSequence } from './sequences/gotoEditPetitionerCounselSequence';
import { gotoEditPetitionerInformationInternalSequence } from './sequences/gotoEditPetitionerInformationInternalSequence';
import { gotoEditPractitionerUserSequence } from './sequences/gotoEditPractitionerUserSequence';
import { gotoEditRespondentCounselSequence } from './sequences/gotoEditRespondentCounselSequence';
import { gotoEditTrialSessionSequence } from './sequences/gotoEditTrialSessionSequence';
import { gotoEditUploadCourtIssuedDocumentSequence } from './sequences/gotoEditUploadCourtIssuedDocumentSequence';
import { gotoFileDocumentSequence } from './sequences/gotoFileDocumentSequence';
import { gotoFilePetitionSuccessSequence } from './sequences/gotoFilePetitionSuccessSequence';
import { gotoIdleLogoutSequence } from './sequences/gotoIdleLogoutSequence';
import { gotoJudgeActivityReportSequence } from './sequences/JudgeActivityReport/gotoJudgeActivityReportSequence';
import { gotoMaintenanceSequence } from './sequences/gotoMaintenanceSequence';
import { gotoMessageDetailSequence } from './sequences/gotoMessageDetailSequence';
import { gotoMessagesSequence } from './sequences/gotoMessagesSequence';
import { gotoMyAccountSequence } from './sequences/gotoMyAccountSequence';
import { gotoPdfPreviewSequence } from './sequences/gotoPdfPreviewSequence';
import { gotoPendingReportSequence } from './sequences/gotoPendingReportSequence';
import { gotoPetitionQcSequence } from './sequences/gotoPetitionQcSequence';
import { gotoPractitionerAddDocumentSequence } from './sequences/gotoPractitionerAddDocumentSequence';
import { gotoPractitionerDetailSequence } from './sequences/gotoPractitionerDetailSequence';
import { gotoPractitionerDocumentationSequence } from './sequences/gotoPractitionerDocumentationSequence';
import { gotoPractitionerEditDocumentSequence } from './sequences/gotoPractitionerEditDocumentSequence';
import { gotoPrintPaperServiceSequence } from './sequences/gotoPrintPaperServiceSequence';
import { gotoPrintPaperTrialNoticesSequence } from '@web-client/presenter/sequences/gotoPrintPaperTrialNoticesSequence';
import { gotoPrintPractitionerCasesSequence } from './sequences/gotoPrintPractitionerCasesSequence';
import { gotoPrintableCaseConfirmationSequence } from './sequences/gotoPrintableCaseConfirmationSequence';
import { gotoPrintableCaseInventoryReportSequence } from './sequences/gotoPrintableCaseInventoryReportSequence';
import { gotoPrintableDocketRecordSequence } from './sequences/gotoPrintableDocketRecordSequence';
import { gotoPrintablePendingReportForCaseSequence } from './sequences/gotoPrintablePendingReportForCaseSequence';
import { gotoPrintablePendingReportSequence } from './sequences/gotoPrintablePendingReportSequence';
import { gotoPrintableTrialSessionWorkingCopySequence } from './sequences/gotoPrintableTrialSessionWorkingCopySequence';
import { gotoPrivacySequence } from './sequences/gotoPrivacySequence';
import { gotoRequestAccessSequence } from './sequences/gotoRequestAccessSequence';
import { gotoReviewSavedPetitionSequence } from './sequences/gotoReviewSavedPetitionSequence';
import { gotoSignOrderSequence } from './sequences/gotoSignOrderSequence';
import { gotoStartCaseWizardSequence } from './sequences/gotoStartCaseWizardSequence';
import { gotoStyleGuideSequence } from './sequences/gotoStyleGuideSequence';
import { gotoTrialSessionDetailSequence } from './sequences/gotoTrialSessionDetailSequence';
import { gotoTrialSessionPlanningReportSequence } from './sequences/gotoTrialSessionPlanningReportSequence';
import { gotoTrialSessionWorkingCopySequence } from './sequences/gotoTrialSessionWorkingCopySequence';
import { gotoTrialSessionsSequence } from './sequences/gotoTrialSessionsSequence';
import { gotoUploadCorrespondenceDocumentSequence } from './sequences/gotoUploadCorrespondenceDocumentSequence';
import { gotoUploadCourtIssuedDocumentSequence } from './sequences/gotoUploadCourtIssuedDocumentSequence';
import { gotoUserContactEditSequence } from './sequences/gotoUserContactEditSequence';
import { gotoVerifyEmailSequence } from './sequences/gotoVerifyEmailSequence';
import { gotoViewAllDocumentsSequence } from './sequences/gotoViewAllDocumentsSequence';
import { gotoWorkQueueSequence } from './sequences/gotoWorkQueueSequence';
import { handleIdleLogoutSequence } from './sequences/handleIdleLogoutSequence';
import { initialState } from '@web-client/presenter/state';
import { leaveCaseForLaterServiceSequence } from './sequences/leaveCaseForLaterServiceSequence';
import { loadDefaultDocketViewerDocumentToDisplaySequence } from './sequences/DocketEntry/loadDefaultDocketViewerDocumentToDisplaySequence';
import { loadDefaultDraftViewerDocumentToDisplaySequence } from './sequences/DocketEntry/loadDefaultDraftViewerDocumentToDisplaySequence';
import { loadDefaultViewerCorrespondenceSequence } from './sequences/loadDefaultViewerCorrespondenceSequence';
import { loadMoreCaseDeadlinesSequence } from './sequences/loadMoreCaseDeadlinesSequence';
import { loadMorePendingItemsSequence } from './sequences/loadMorePendingItemsSequence';
import { loadPdfSequence } from './sequences/PDFPreviewModal/loadPdfSequence';
import { loginWithTokenSequence } from './sequences/loginWithTokenSequence';
import { navigateBackSequence } from './sequences/navigateBackSequence';
import { navigateToCaseDetailFromPaperServiceSequence } from './sequences/navigateToCaseDetailFromPaperServiceSequence';
import { navigateToCaseDetailSequence } from './sequences/navigateToCaseDetailSequence';
import { navigateToCaseDetailWithDraftDocumentSequence } from './sequences/navigateToCaseDetailWithDraftDocumentSequence';
import { navigateToEditOrderSequence } from './sequences/navigateToEditOrderSequence';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { navigateToPathAndSetRedirectUrlSequence } from './sequences/navigateToPathAndSetRedirectUrlSequence';
import { navigateToPathSequence } from './sequences/navigateToPathSequence';
import { navigateToPrintPaperServiceSequence } from './sequences/navigateToPrintPaperServiceSequence';
import { navigateToPrintableCaseConfirmationSequence } from './sequences/navigateToPrintableCaseConfirmationSequence';
import { notFoundErrorSequence } from './sequences/notFoundErrorSequence';
import { noticeGenerationCompleteSequence } from './sequences/noticeGenerationCompleteSequence';
import { onPractitionerInformationTabSelectSequence } from './sequences/onPractitionerInformationTabSelectSequence';
import { openAddDocketNumbersModalSequence } from './sequences/openAddDocketNumbersModalSequence';
import { openAddEditCalendarNoteModalSequence } from './sequences/openAddEditCalendarNoteModalSequence';
import { openAddEditCaseNoteModalSequence } from './sequences/openAddEditCaseNoteModalSequence';
import { openAddEditCaseWorksheetModalSequence } from './sequences/openAddEditCaseWorksheetModalSequence';
import { openAddEditHearingNoteModalSequence } from './sequences/openAddEditHearingNoteModalSequence';
import { openAddEditSessionNoteModalSequence } from './sequences/openAddEditSessionNoteModalSequence';
import { openAddEditUserCaseNoteModalFromDetailSequence } from './sequences/openAddEditUserCaseNoteModalFromDetailSequence';
import { openAddEditUserCaseNoteModalFromListSequence } from './sequences/openAddEditUserCaseNoteModalFromListSequence';
import { openAddIrsPractitionerModalSequence } from './sequences/openAddIrsPractitionerModalSequence';
import { openAddPrivatePractitionerModalSequence } from './sequences/openAddPrivatePractitionerModalSequence';
import { openAddToTrialModalSequence } from './sequences/openAddToTrialModalSequence';
import { openAppMaintenanceModalSequence } from './sequences/openAppMaintenanceModalSequence';
import { openBlockFromTrialModalSequence } from './sequences/openBlockFromTrialModalSequence';
import { openCancelDraftDocumentModalSequence } from './sequences/openCancelDraftDocumentModalSequence';
import { openCaseDifferenceModalSequence } from './sequences/openCaseDifferenceModalSequence';
import { openCaseDocumentDownloadUrlSequence } from './sequences/openCaseDocumentDownloadUrlSequence';
import { openCaseInNewTabSequence } from './sequences/openCaseInNewTabSequence';
import { openCaseInventoryReportModalSequence } from './sequences/openCaseInventoryReportModalSequence';
import { openChangeScannerSourceModalSequence } from './sequences/openChangeScannerSourceModalSequence';
import { openCleanModalSequence } from './sequences/openCleanModalSequence';
import { openCompleteAndSendMessageModalSequence } from './sequences/openCompleteAndSendMessageModalSequence';
import { openCompleteMessageModalSequence } from './sequences/openCompleteMessageModalSequence';
import { openCompleteSelectDocumentTypeModalSequence } from './sequences/openCompleteSelectDocumentTypeModalSequence';
import { openConfirmDeleteBatchModalSequence } from './sequences/openConfirmDeleteBatchModalSequence';
import { openConfirmDeleteCorrespondenceModalSequence } from './sequences/openConfirmDeleteCorrespondenceModalSequence';
import { openConfirmDeleteDeficiencyStatisticsModalSequence } from './sequences/openConfirmDeleteDeficiencyStatisticsModalSequence';
import { openConfirmDeleteOtherStatisticsModalSequence } from './sequences/openConfirmDeleteOtherStatisticsModalSequence';
import { openConfirmDeletePDFModalSequence } from './sequences/openConfirmDeletePDFModalSequence';
import { openConfirmDeleteTrialSessionModalSequence } from './sequences/openConfirmDeleteTrialSessionModalSequence';
import { openConfirmEditModalSequence } from './sequences/openConfirmEditModalSequence';
import { openConfirmInitiateCourtIssuedFilingServiceModalSequence } from './sequences/openConfirmInitiateCourtIssuedFilingServiceModalSequence';
import { openConfirmModalSequence } from './sequences/openConfirmModalSequence';
import { openConfirmPaperServiceModalSequence } from './sequences/openConfirmPaperServiceModalSequence';
import { openConfirmRemoveCaseDetailPendingItemModalSequence } from './sequences/openConfirmRemoveCaseDetailPendingItemModalSequence';
import { openConfirmRemoveSignatureModalSequence } from './sequences/openConfirmRemoveSignatureModalSequence';
import { openConfirmReplacePetitionPdfSequence } from './sequences/openConfirmReplacePetitionPdfSequence';
import { openConfirmRescanBatchModalSequence } from './sequences/openConfirmRescanBatchModalSequence';
import { openConfirmServeCourtIssuedDocumentSequence } from './sequences/openConfirmServeCourtIssuedDocumentSequence';
import { openConfirmServePaperFiledDocumentSequence } from './sequences/openConfirmServePaperFiledDocumentSequence';
import { openConfirmServeToIrsModalSequence } from './sequences/openConfirmServeToIrsModalSequence';
import { openCreateCaseDeadlineModalSequence } from './sequences/openCreateCaseDeadlineModalSequence';
import { openCreateMessageModalSequence } from './sequences/openCreateMessageModalSequence';
import { openCreateOrderChooseTypeModalSequence } from './sequences/openCreateOrderChooseTypeModalSequence';
import { openDeleteCaseDeadlineModalSequence } from './sequences/openDeleteCaseDeadlineModalSequence';
import { openDeleteCaseNoteConfirmModalSequence } from './sequences/openDeleteCaseNoteConfirmModalSequence';
import { openDeletePractitionerDocumentConfirmModalSequence } from './sequences/openDeletePractitionerDocumentConfirmModalSequence';
import { openDeleteSessionNoteConfirmModalSequence } from './sequences/openDeleteSessionNoteConfirmModalSequence';
import { openDeleteUserCaseNoteConfirmModalSequence } from './sequences/openDeleteUserCaseNoteConfirmModalSequence';
import { openEditCaseDeadlineModalSequence } from './sequences/openEditCaseDeadlineModalSequence';
import { openEditOrderTitleModalSequence } from './sequences/openEditOrderTitleModalSequence';
import { openForwardMessageModalSequence } from './sequences/openForwardMessageModalSequence';
import { openGainElectronicAccessToCaseModalSequence } from './sequences/openGainElectronicAccessToCaseModalSequence';
import { openItemizedPenaltiesModalSequence } from './sequences/openItemizedPenaltiesModalSequence';
import { openPdfPreviewModalSequence } from './sequences/openPdfPreviewModalSequence';
import { openPractitionerDocumentDownloadUrlSequence } from './sequences/openPractitionerDocumentDownloadUrlSequence';
import { openPrintGeneratedPaperServiceSequence } from '@web-client/presenter/sequences/openPrintGeneratedPaperServiceSequence';
import { openPrintableTrialSessionWorkingCopyModalSequence } from './sequences/openPrintableTrialSessionWorkingCopyModalSequence';
import { openPrioritizeCaseModalSequence } from './sequences/openPrioritizeCaseModalSequence';
import { openRemoveFromTrialSessionModalSequence } from './sequences/openRemoveFromTrialSessionModalSequence';
import { openRemovePetitionerCounselModalSequence } from './sequences/openRemovePetitionerCounselModalSequence';
import { openRemovePetitionerModalSequence } from './sequences/openRemovePetitionerModalSequence';
import { openRemoveRespondentCounselModalSequence } from './sequences/openRemoveRespondentCounselModalSequence';
import { openReplyToMessageModalSequence } from './sequences/openReplyToMessageModalSequence';
import { openSealAddressModalSequence } from './sequences/openSealAddressModalSequence';
import { openSealDocketEntryModalSequence } from './sequences/openSealDocketEntryModalSequence';
import { openSelectedTrialSessionPaperServicePdfSequence } from '@web-client/presenter/sequences/openSelectedTrialSessionPaperServicePdfSequence';
import { openSetCalendarModalSequence } from './sequences/openSetCalendarModalSequence';
import { openSetForHearingModalSequence } from './sequences/openSetForHearingModalSequence';
import { openStrikeDocketEntryModalSequence } from './sequences/openStrikeDocketEntryModalSequence';
import { openTrialSessionPlanningModalSequence } from './sequences/openTrialSessionPlanningModalSequence';
import { openUnblockFromTrialModalSequence } from './sequences/openUnblockFromTrialModalSequence';
import { openUnprioritizeCaseModalSequence } from './sequences/openUnprioritizeCaseModalSequence';
import { openUnsealDocketEntryModalSequence } from './sequences/openUnsealDocketEntryModalSequence';
import { openUpdateCaseModalSequence } from './sequences/openUpdateCaseModalSequence';
import { paperServiceCompleteSequence } from './sequences/paperServiceCompleteSequence';
import { printPaperServiceForTrialCompleteSequence } from './sequences/printPaperServiceForTrialCompleteSequence';
import { printTrialCalendarSequence } from './sequences/printTrialCalendarSequence';
import { prioritizeCaseSequence } from './sequences/prioritizeCaseSequence';
import { refreshPdfSequence } from './sequences/refreshPdfSequence';
import { refreshStatisticsSequence } from './sequences/refreshStatisticsSequence';
import { removeBatchSequence } from './sequences/removeBatchSequence';
import { removeCaseDetailPendingItemSequence } from './sequences/removeCaseDetailPendingItemSequence';
import { removeCaseFromTrialSequence } from './sequences/removeCaseFromTrialSequence';
import { removePetitionForReplacementSequence } from './sequences/removePetitionForReplacementSequence';
import { removePetitionerAndUpdateCaptionSequence } from './sequences/removePetitionerAndUpdateCaptionSequence';
import { removePetitionerCounselFromCaseSequence } from './sequences/removePetitionerCounselFromCaseSequence';
import { removeRespondentCounselFromCaseSequence } from './sequences/removeRespondentCounselFromCaseSequence';
import { removeScannedPdfSequence } from './sequences/removeScannedPdfSequence';
import { removeSecondarySupportingDocumentSequence } from './sequences/removeSecondarySupportingDocumentSequence';
import { removeSignatureSequence } from './sequences/removeSignatureSequence';
import { removeSupportingDocumentSequence } from './sequences/removeSupportingDocumentSequence';
import { replyToMessageSequence } from './sequences/replyToMessageSequence';
import { rescanBatchSequence } from './sequences/rescanBatchSequence';
import { resetCaseMenuSequence } from './sequences/resetCaseMenuSequence';
import { resetHeaderAccordionsSequence } from './sequences/resetHeaderAccordionsSequence';
import { resetIdleTimerSequence } from './sequences/resetIdleTimerSequence';
import { retryAsyncRequestSequence } from './sequences/retryAsyncRequestSequence';
import { reviewExternalDocumentInformationSequence } from './sequences/reviewExternalDocumentInformationSequence';
import { reviewRequestAccessInformationSequence } from './sequences/reviewRequestAccessInformationSequence';
import { runTrialSessionPlanningReportSequence } from './sequences/runTrialSessionPlanningReportSequence';
import { saveCourtIssuedDocketEntrySequence } from './sequences/saveCourtIssuedDocketEntrySequence';
import { saveDocketEntryForLaterCompleteSequence } from './sequences/saveDocketEntryForLaterCompleteSequence';
import { saveDocumentSigningSequence } from './sequences/saveDocumentSigningSequence';
import { saveSavedCaseForLaterSequence } from './sequences/saveSavedCaseForLaterSequence';
import { scannerStartupSequence } from './sequences/scannerStartupSequence';
import { sealAddressSequence } from './sequences/sealAddressSequence';
import { sealCaseSequence } from './sequences/sealCaseSequence';
import { sealDocketEntrySequence } from './sequences/sealDocketEntrySequence';
import { selectAssigneeSequence } from './sequences/selectAssigneeSequence';
import { selectDateRangeFromCalendarSequence } from './sequences/selectDateRangeFromCalendarSequence';
import { selectDocumentForPreviewSequence } from './sequences/selectDocumentForPreviewSequence';
import { selectDocumentForScanSequence } from './sequences/selectDocumentForScanSequence';
import { selectScannerSequence } from './sequences/selectScannerSequence';
import { selectWorkItemSequence } from './sequences/selectWorkItemSequence';
import { serveCaseToIrsSequence } from './sequences/serveCaseToIrsSequence';
import { serveCourtIssuedDocumentSequence } from './sequences/serveCourtIssuedDocumentSequence';
import { serveDocumentCompleteSequence } from './sequences/serveDocumentCompleteSequence';
import { serveDocumentErrorSequence } from './sequences/serveDocumentErrorSequence';
import { servePaperFiledDocumentSequence } from './sequences/servePaperFiledDocumentSequence';
import { serveThirtyDayNoticeOfTrialSequence } from './sequences/serveThirtyDayNoticeOfTrialSequence';
import { setCaseDetailPageTabSequence } from './sequences/setCaseDetailPageTabSequence';
import { setCaseDetailPrimaryTabSequence } from './sequences/setCaseDetailPrimaryTabSequence';
import { setCaseTypeToDisplaySequence } from './sequences/setCaseTypeToDisplaySequence';
import { setCurrentPageErrorSequence } from './sequences/setCurrentPageErrorSequence';
import { setCurrentPageIndexSequence } from './sequences/setCurrentPageIndexSequence';
import { setCustomCaseReportFiltersSequence } from './sequences/setCustomCaseReportFiltersSequence';
import { setDocumentForPreviewSequence } from './sequences/setDocumentForPreviewSequence';
import { setDocumentForUploadSequence } from './sequences/setDocumentForUploadSequence';
import { setDocumentUploadModeSequence } from './sequences/setDocumentUploadModeSequence';
import { setForHearingSequence } from './sequences/setForHearingSequence';
import { setIdleStatusActiveSequence } from './sequences/setIdleStatusActiveSequence';
import { setIrsNoticeFalseSequence } from './sequences/setIrsNoticeFalseSequence';
import { setJudgeActivityReportFiltersSequence } from './sequences/setJudgeActivityReportFiltersSequence';
import { setMessageDetailViewerDocumentToDisplaySequence } from './sequences/setMessageDetailViewerDocumentToDisplaySequence';
import { setPDFPageForSigningSequence } from './sequences/setPDFPageForSigningSequence';
import { setPDFSignatureDataSequence } from './sequences/setPDFSignatureDataSequence';
import { setPDFStampDataSequence } from './sequences/setPDFStampDataSequence';
import { setPdfPreviewUrlSequence } from './sequences/setPdfPreviewUrlSequence';
import { setPendingReportSelectedJudgeSequence } from './sequences/Pending/setPendingReportSelectedJudgeSequence';
import { setSelectedAddressOnFormSequence } from './sequences/setSelectedAddressOnFormSequence';
import { setSelectedBatchIndexSequence } from './sequences/setSelectedBatchIndexSequence';
import { setTrialSessionCalendarSequence } from './sequences/setTrialSessionCalendarSequence';
import { setViewerCorrespondenceToDisplaySequence } from './sequences/setViewerCorrespondenceToDisplaySequence';
import { setViewerDocumentToDisplaySequence } from './sequences/setViewerDocumentToDisplaySequence';
import { setViewerDraftDocumentToDisplaySequence } from './sequences/setViewerDraftDocumentToDisplaySequence';
import { showCalculatePenaltiesModalSequence } from './sequences/showCalculatePenaltiesModalSequence';
import { showDocketRecordDetailModalSequence } from './sequences/showDocketRecordDetailModalSequence';
import { showGenerateNoticesProgressSequence } from './sequences/showGenerateNoticesProgressSequence';
import { showMoreClosedCasesSequence } from './sequences/showMoreClosedCasesSequence';
import { showMoreOpenCasesSequence } from './sequences/showMoreOpenCasesSequence';
import { showMoreResultsSequence } from './sequences/showMoreResultsSequence';
import { showPaperServiceProgressSequence } from './sequences/showPaperServiceProgressSequence';
import { showThirtyDayNoticeModalSequence } from './sequences/showThirtyDayNoticeModalSequence';
import { showViewPetitionerCounselModalSequence } from './sequences/showViewPetitionerCounselModalSequence';
import { signOutSequence } from './sequences/signOutSequence';
import { skipSigningOrderSequence } from './sequences/skipSigningOrderSequence';
import { sortTableSequence } from './sequences/sortTableSequence';
import { startRefreshIntervalSequence } from './sequences/startRefreshIntervalSequence';
import { startScanSequence } from './sequences/startScanSequence';
import { strikeDocketEntrySequence } from './sequences/strikeDocketEntrySequence';
import { submitAddConsolidatedCaseSequence } from './sequences/submitAddConsolidatedCaseSequence';
import { submitAddDeficiencyStatisticsSequence } from './sequences/submitAddDeficiencyStatisticsSequence';
import { submitAddOtherStatisticsSequence } from './sequences/submitAddOtherStatisticsSequence';
import { submitAddPetitionerSequence } from './sequences/submitAddPetitionerSequence';
import { submitAddPractitionerDocumentSequence } from './sequences/submitAddPractitionerDocumentSequence';
import { submitAddPractitionerSequence } from './sequences/submitAddPractitionerSequence';
import { submitCaseAdvancedSearchSequence } from './sequences/submitCaseAdvancedSearchSequence';
import { submitCaseAssociationRequestSequence } from './sequences/submitCaseAssociationRequestSequence';
import { submitCaseDocketNumberSearchSequence } from './sequences/submitCaseDocketNumberSearchSequence';
import { submitCaseInventoryReportModalSequence } from './sequences/submitCaseInventoryReportModalSequence';
import { submitCaseSearchForConsolidationSequence } from './sequences/submitCaseSearchForConsolidationSequence';
import { submitCaseSearchSequence } from './sequences/submitCaseSearchSequence';
import { submitChangeLoginAndServiceEmailSequence } from './sequences/submitChangeLoginAndServiceEmailSequence';
import { submitCourtIssuedDocketEntrySequence } from './sequences/submitCourtIssuedDocketEntrySequence';
import { submitCourtIssuedOrderSequence } from './sequences/submitCourtIssuedOrderSequence';
import { submitCreateOrderModalSequence } from './sequences/submitCreateOrderModalSequence';
import { submitEditContactSequence } from './sequences/submitEditContactSequence';
import { submitEditDeficiencyStatisticSequence } from './sequences/submitEditDeficiencyStatisticSequence';
import { submitEditDocketEntryMetaSequence } from './sequences/submitEditDocketEntryMetaSequence';
import { submitEditOrderTitleModalSequence } from './sequences/submitEditOrderTitleModalSequence';
import { submitEditOtherStatisticsSequence } from './sequences/submitEditOtherStatisticsSequence';
import { submitEditPetitionerCounselSequence } from './sequences/submitEditPetitionerCounselSequence';
import { submitEditPetitionerSequence } from './sequences/submitEditPetitionerSequence';
import { submitEditPractitionerDocumentSequence } from './sequences/submitEditPractitionerDocumentSequence';
import { submitEditRespondentCounselSequence } from './sequences/submitEditRespondentCounselSequence';
import { submitExternalDocumentSequence } from './sequences/submitExternalDocumentSequence';
import { submitFilePetitionSequence } from './sequences/submitFilePetitionSequence';
import { submitJudgeActivityReportSequence } from './sequences/JudgeActivityReport/submitJudgeActivityReportSequence';
import { submitLocalLoginSequence } from './sequences/submitLocalLoginSequence';
import { submitLoginSequence } from '@web-client/presenter/sequences/Login/submitLoginSequence';
import { submitOpinionAdvancedSearchSequence } from './sequences/submitOpinionAdvancedSearchSequence';
import { submitOrderAdvancedSearchSequence } from './sequences/submitOrderAdvancedSearchSequence';
import { submitPaperFilingSequence } from './sequences/submitPaperFilingSequence';
import { submitPetitionFromPaperSequence } from './sequences/submitPetitionFromPaperSequence';
import { submitPractitionerBarNumberSearchSequence } from './sequences/submitPractitionerBarNumberSearchSequence';
import { submitPractitionerNameSearchSequence } from './sequences/submitPractitionerNameSearchSequence';
import { submitRemoveConsolidatedCasesSequence } from './sequences/submitRemoveConsolidatedCasesSequence';
import { submitStampMotionSequence } from './sequences/submitStampMotionSequence';
import { submitTrialSessionSequence } from './sequences/submitTrialSessionSequence';
import { submitUpdateAddDocketNumbersToOrderSequence } from './sequences/submitUpdateAddDocketNumbersToOrderSequence';
import { submitUpdateCaseModalSequence } from './sequences/submitUpdateCaseModalSequence';
import { submitUpdatePetitionerInformationFromModalSequence } from './sequences/submitUpdatePetitionerInformationFromModalSequence';
import { submitUpdatePractitionerUserSequence } from './sequences/submitUpdatePractitionerUserSequence';
import { submitUpdateUserContactInformationSequence } from './sequences/submitUpdateUserContactInformationSequence';
import { thirtyDayNoticePaperServiceCompleteSequence } from './sequences/thirtyDayNoticePaperServiceCompleteSequence';
import { toggleAllWorkItemCheckboxChangeSequence } from './sequences/toggleAllWorkItemCheckboxChangeSequence';
import { toggleBetaBarSequence } from './sequences/toggleBetaBarSequence';
import { toggleCaseDifferenceSequence } from './sequences/toggleCaseDifferenceSequence';
import { toggleMenuSequence } from './sequences/toggleMenuSequence';
import { toggleMenuStateSequence } from './sequences/toggleMenuStateSequence';
import { toggleMobileDocketSortSequence } from './sequences/toggleMobileDocketSortSequence';
import { toggleMobileMenuSequence } from './sequences/toggleMobileMenuSequence';
import { toggleUsaBannerDetailsSequence } from './sequences/toggleUsaBannerDetailsSequence';
import { toggleUseContactPrimaryAddressSequence } from './sequences/toggleUseContactPrimaryAddressSequence';
import { toggleUseExistingAddressSequence } from './sequences/toggleUseExistingAddressSequence';
import { toggleWorkingCopySortSequence } from './sequences/toggleWorkingCopySortSequence';
import { unauthorizedErrorSequence } from './sequences/unauthorizedErrorSequence';
import { unblockCaseFromTrialSequence } from './sequences/unblockCaseFromTrialSequence';
import { unidentifiedUserErrorSequence } from './sequences/unidentifiedUserErrorSequence';
import { unprioritizeCaseSequence } from './sequences/unprioritizeCaseSequence';
import { unsealCaseSequence } from './sequences/unsealCaseSequence';
import { unsealDocketEntrySequence } from './sequences/unsealDocketEntrySequence';
import { updateAddDeficiencyFormValueSequence } from './sequences/updateAddDeficiencyFormValueSequence';
import { updateAdvancedOpinionSearchFormValueSequence } from './sequences/updateAdvancedOpinionSearchFormValueSequence';
import { updateAdvancedOrderSearchFormValueSequence } from './sequences/updateAdvancedOrderSearchFormValueSequence';
import { updateAdvancedSearchFormValueSequence } from './sequences/updateAdvancedSearchFormValueSequence';
import { updateBatchDownloadProgressSequence } from './sequences/updateBatchDownloadProgressSequence';
import { updateCalendarNoteSequence } from './sequences/updateCalendarNoteSequence';
import { updateCaseAdvancedSearchByNameFormValueSequence } from './sequences/updateCaseAdvancedSearchByNameFormValueSequence';
import { updateCaseAssociationFormValueSequence } from './sequences/updateCaseAssociationFormValueSequence';
import { updateCaseCheckboxSequence } from './sequences/updateCaseCheckboxSequence';
import { updateCaseDeadlineSequence } from './sequences/updateCaseDeadlineSequence';
import { updateCaseDetailsSequence } from './sequences/updateCaseDetailsSequence';
import { updateCaseNoteSequence } from './sequences/updateCaseNoteSequence';
import { updateCasePartyTypeSequence } from './sequences/updateCasePartyTypeSequence';
import { updateCaseWorksheetSequence } from './sequences/updateCaseWorksheetSequence';
import { updateChambersInCreateMessageModalSequence } from './sequences/updateChambersInCreateMessageModalSequence';
import { updateCourtIssuedDocketEntryFormValueSequence } from './sequences/updateCourtIssuedDocketEntryFormValueSequence';
import { updateCourtIssuedDocketEntryTitleSequence } from '@web-client/presenter/sequences/updateCourtIssuedDocketEntryTitleSequence';
import { updateCreateOrderModalFormValueSequence } from './sequences/updateCreateOrderModalFormValueSequence';
import { updateDateRangeForDeadlinesSequence } from './sequences/updateDateRangeForDeadlinesSequence';
import { updateDocketEntryFormValueSequence } from './sequences/updateDocketEntryFormValueSequence';
import { updateDocketEntryMetaDocumentFormValueSequence } from './sequences/updateDocketEntryMetaDocumentFormValueSequence';
import { updateDocketNumberSearchFormSequence } from './sequences/updateDocketNumberSearchFormSequence';
import { updateFileDocumentWizardFormValueSequence } from './sequences/updateFileDocumentWizardFormValueSequence';
import { updateFormValueAndCaseCaptionSequence } from './sequences/updateFormValueAndCaseCaptionSequence';
import { updateFormValueAndSecondaryContactInfoSequence } from './sequences/updateFormValueAndSecondaryContactInfoSequence';
import { updateFormValueSequence } from './sequences/updateFormValueSequence';
import { updateGenerateNoticesProgressSequence } from './sequences/updateGenerateNoticesProgressSequence';
import { updateHearingNoteSequence } from './sequences/updateHearingNoteSequence';
import { updateJudgesCaseNoteOnCaseDetailSequence } from './sequences/updateJudgesCaseNoteOnCaseDetailSequence';
import { updateMessageModalAttachmentsSequence } from './sequences/updateMessageModalAttachmentsSequence';
import { updateModalFormValueSequence } from './sequences/updateModalFormValueSequence';
import { updateModalValueSequence } from './sequences/updateModalValueSequence';
import { updateOrderForDesignatingPlaceOfTrialSequence } from './sequences/updateOrderForDesignatingPlaceOfTrialSequence';
import { updatePaperServiceProgressSequence } from './sequences/updatePaperServiceProgressSequence';
import { updatePartyViewTabSequence } from './sequences/updatePartyViewTabSequence';
import { updatePetitionPaymentFormValueSequence } from './sequences/updatePetitionPaymentFormValueSequence';
import { updateQcCompleteForTrialSequence } from './sequences/updateQcCompleteForTrialSequence';
import { updateScreenMetadataSequence } from './sequences/updateScreenMetadataSequence';
import { updateSearchTermSequence } from './sequences/updateSearchTermSequence';
import { updateSectionInCreateMessageModalSequence } from './sequences/updateSectionInCreateMessageModalSequence';
import { updateSessionMetadataSequence } from './sequences/updateSessionMetadataSequence';
import { updateStartCaseFormValueSequence } from './sequences/updateStartCaseFormValueSequence';
import { updateStartCaseInternalPartyTypeSequence } from './sequences/updateStartCaseInternalPartyTypeSequence';
import { updateStatisticsFormValueSequence } from './sequences/updateStatisticsFormValueSequence';
import { updateTrialSessionCompleteSequence } from './sequences/updateTrialSessionCompleteSequence';
import { updateTrialSessionFormDataSequence } from './sequences/updateTrialSessionFormDataSequence';
import { updateTrialSessionSequence } from './sequences/updateTrialSessionSequence';
import { updateUserCaseNoteOnWorkingCopySequence } from './sequences/updateUserCaseNoteOnWorkingCopySequence';
import { updateWorkingCopySessionNoteSequence } from './sequences/updateWorkingCopySessionNoteSequence';
import { uploadCorrespondenceDocumentSequence } from './sequences/uploadCorrespondenceDocumentSequence';
import { uploadCourtIssuedDocumentSequence } from './sequences/uploadCourtIssuedDocumentSequence';
import { userContactUpdateCompleteSequence } from './sequences/userContactUpdateCompleteSequence';
import { userContactUpdateErrorSequence } from './sequences/userContactUpdateErrorSequence';
import { userContactUpdateInitialUpdateCompleteSequence } from './sequences/userContactUpdateInitialUpdateCompleteSequence';
import { userContactUpdateProgressSequence } from './sequences/userContactUpdateProgressSequence';
import { validateAddDeficiencyStatisticsSequence } from './sequences/validateAddDeficiencyStatisticsSequence';
import { validateAddIrsPractitionerSequence } from './sequences/CaseAssociation/validateAddIrsPractitionerSequence';
import { validateAddPetitionerSequence } from './sequences/validateAddPetitionerSequence';
import { validateAddPractitionerDocumentSequence } from './sequences/validateAddPractitionerDocumentSequence';
import { validateAddPractitionerSequence } from './sequences/validateAddPractitionerSequence';
import { validateAddPrivatePractitionerSequence } from './sequences/CaseAssociation/validateAddPrivatePractitionerSequence';
import { validateAddToTrialSessionSequence } from './sequences/validateAddToTrialSessionSequence';
import { validateBlockFromTrialSequence } from './sequences/validateBlockFromTrialSequence';
import { validateCaseAdvancedSearchFormSequence } from './sequences/validateCaseAdvancedSearchFormSequence';
import { validateCaseAssociationRequestSequence } from './sequences/validateCaseAssociationRequestSequence';
import { validateCaseDeadlineSequence } from './sequences/validateCaseDeadlineSequence';
import { validateCaseDetailSequence } from './sequences/validateCaseDetailSequence';
import { validateCaseDetailsSequence } from './sequences/validateCaseDetailsSequence';
import { validateCaseDocketNumberSearchFormSequence } from './sequences/validateCaseDocketNumberSearchFormSequence';
import { validateCaseInventoryReportModalSequence } from './sequences/validateCaseInventoryReportModalSequence';
import { validateCaseWorksheetSequence } from '@web-client/presenter/sequences/validateCaseWorksheetSequence';
import { validateChangeLoginAndServiceEmailSequence } from './sequences/validateChangeLoginAndServiceEmailSequence';
import { validateCourtIssuedDocketEntrySequence } from './sequences/validateCourtIssuedDocketEntrySequence';
import { validateCreateMessageInModalSequence } from './sequences/validateCreateMessageInModalSequence';
import { validateDocketEntrySequence } from './sequences/validateDocketEntrySequence';
import { validateDocumentSequence } from './sequences/validateDocumentSequence';
import { validateEditPetitionerCounselSequence } from './sequences/CaseAssociation/validateEditPetitionerCounselSequence';
import { validateEditRespondentCounselSequence } from './sequences/CaseAssociation/validateEditRespondentCounselSequence';
import { validateExternalDocumentInformationSequence } from './sequences/validateExternalDocumentInformationSequence';
import { validateNoteSequence } from './sequences/validateNoteSequence';
import { validateOpinionSearchSequence } from './sequences/validateOpinionSearchSequence';
import { validateOrderSearchSequence } from './sequences/validateOrderSearchSequence';
import { validateOrderWithoutBodySequence } from './sequences/validateOrderWithoutBodySequence';
import { validatePetitionFromPaperSequence } from './sequences/validatePetitionFromPaperSequence';
import { validatePetitionerSequence } from './sequences/validatePetitionerSequence';
import { validatePractitionerSearchByBarNumberFormSequence } from './sequences/validatePractitionerSearchByBarNumberFormSequence';
import { validatePractitionerSearchByNameFormSequence } from './sequences/validatePractitionerSearchByNameFormSequence';
import { validatePrioritizeCaseSequence } from './sequences/validatePrioritizeCaseSequence';
import { validateRemoveFromTrialSessionSequence } from './sequences/validateRemoveFromTrialSessionSequence';
import { validateSelectDocumentTypeSequence } from './sequences/validateSelectDocumentTypeSequence';
import { validateSetForHearingSequence } from './sequences/validateSetForHearingSequence';
import { validateStampSequence } from './sequences/validateStampSequence';
import { validateStartCaseWizardSequence } from './sequences/validateStartCaseWizardSequence';
import { validateTrialSessionHearingNoteSequence } from './sequences/validateTrialSessionHearingNoteSequence';
import { validateTrialSessionNoteSequence } from './sequences/validateTrialSessionNoteSequence';
import { validateTrialSessionPlanningSequence } from './sequences/validateTrialSessionPlanningSequence';
import { validateTrialSessionSequence } from './sequences/validateTrialSessionSequence';
import { validateUpdateCaseModalSequence } from './sequences/validateUpdateCaseModalSequence';
import { validateUpdatePractitionerSequence } from './sequences/validateUpdatePractitionerSequence';
import { validateUploadCorrespondenceDocumentSequence } from './sequences/validateUploadCorrespondenceDocumentSequence';
import { validateUploadCourtIssuedDocumentSequence } from './sequences/validateUploadCourtIssuedDocumentSequence';
import { validateUserContactSequence } from './sequences/validateUserContactSequence';

export const presenterSequences = {
  addCaseToTrialSessionSequence:
    addCaseToTrialSessionSequence as unknown as Function,
  addPenaltyInputSequence: addPenaltyInputSequence as unknown as Function,
  addStatisticToFormSequence: addStatisticToFormSequence as unknown as Function,
  addSupportingDocumentToFormSequence:
    addSupportingDocumentToFormSequence as unknown as Function,
  adminContactUpdateCompleteSequence:
    adminContactUpdateCompleteSequence as unknown as Function,
  adminContactUpdateInitialUpdateCompleteSequence:
    adminContactUpdateInitialUpdateCompleteSequence as unknown as Function,
  adminContactUpdateProgressSequence:
    adminContactUpdateProgressSequence as unknown as Function,
  advancedSearchTabChangeSequence:
    advancedSearchTabChangeSequence as unknown as Function,
  applyStampFormChangeSequence:
    applyStampFormChangeSequence as unknown as Function,
  archiveDraftDocumentModalSequence:
    archiveDraftDocumentModalSequence as unknown as Function,
  archiveDraftDocumentSequence:
    archiveDraftDocumentSequence as unknown as Function,
  assignSelectedWorkItemsSequence:
    assignSelectedWorkItemsSequence as unknown as Function,
  associateIrsPractitionerWithCaseSequence:
    associateIrsPractitionerWithCaseSequence as unknown as Function,
  associatePrivatePractitionerWithCaseSequence:
    associatePrivatePractitionerWithCaseSequence as unknown as Function,
  autoSaveTrialSessionWorkingCopySequence:
    autoSaveTrialSessionWorkingCopySequence as unknown as Function,
  batchDownloadErrorSequence: batchDownloadErrorSequence as unknown as Function,
  batchDownloadReadySequence: batchDownloadReadySequence as unknown as Function,
  batchDownloadTrialSessionSequence:
    batchDownloadTrialSessionSequence as unknown as Function,
  blockCaseFromTrialSequence: blockCaseFromTrialSequence as unknown as Function,
  broadcastIdleStatusActiveSequence:
    broadcastIdleStatusActiveSequence as unknown as Function,
  broadcastLogoutSequence: broadcastLogoutSequence as unknown as Function,
  broadcastStayLoggedInSequence:
    broadcastStayLoggedInSequence as unknown as Function,
  calculatePenaltiesSequence: calculatePenaltiesSequence as unknown as Function,
  canEditContactInformationSequence:
    canEditContactInformationSequence as unknown as Function,
  cancelAddDraftDocumentSequence:
    cancelAddDraftDocumentSequence as unknown as Function,
  cancelAddStatisticSequence: cancelAddStatisticSequence as unknown as Function,
  cancelAndNavigateToCorrespondenceSequence:
    cancelAndNavigateToCorrespondenceSequence as unknown as Function,
  cancelFileUploadSequence: cancelFileUploadSequence as unknown as Function,
  cancelRemovePetitionerSequence:
    cancelRemovePetitionerSequence as unknown as Function,
  caseDetailPrimaryTabChangeSequence:
    caseDetailPrimaryTabChangeSequence as unknown as Function,
  caseInventoryReportLoadMoreSequence:
    caseInventoryReportLoadMoreSequence as unknown as Function,
  cerebralBindSimpleSetStateSequence:
    cerebralBindSimpleSetStateSequence as unknown as Function,
  changePasswordLocalSequence:
    changePasswordLocalSequence as unknown as Function,
  changeTabAndSetViewerDocumentToDisplaySequence:
    changeTabAndSetViewerDocumentToDisplaySequence as unknown as Function,
  checkForNegativeValueSequence:
    checkForNegativeValueSequence as unknown as Function,
  chooseModalWizardStepSequence:
    chooseModalWizardStepSequence as unknown as Function,
  chooseStartCaseWizardStepSequence:
    chooseStartCaseWizardStepSequence as unknown as Function,
  chooseWizardStepSequence: chooseWizardStepSequence as unknown as Function,
  chooseWorkQueueSequence: chooseWorkQueueSequence as unknown as Function,
  clearAdvancedSearchFormSequence:
    clearAdvancedSearchFormSequence as unknown as Function,
  clearAlertSequence: clearAlertSequence as unknown as Function,
  clearDropDownMenuStateSequence:
    clearDropDownMenuStateSequence as unknown as Function,
  clearDueDateSequence: clearDueDateSequence as unknown as Function,
  clearExistingDocumentSequence:
    clearExistingDocumentSequence as unknown as Function,
  clearModalFormSequence: clearModalFormSequence as unknown as Function,
  clearModalSequence: clearModalSequence as unknown as Function,
  clearOpenClosedCasesCurrentPageSequence:
    clearOpenClosedCasesCurrentPageSequence as unknown as Function,
  clearOptionalCustomCaseReportFilterSequence,
  clearOptionalFieldsStampFormSequence:
    clearOptionalFieldsStampFormSequence as unknown as Function,
  clearPdfPreviewUrlSequence: clearPdfPreviewUrlSequence as unknown as Function,
  clearPreferredTrialCitySequence:
    clearPreferredTrialCitySequence as unknown as Function,
  clearSelectedWorkItemsSequence:
    clearSelectedWorkItemsSequence as unknown as Function,
  clearViewerDocumentToDisplaySequence:
    clearViewerDocumentToDisplaySequence as unknown as Function,
  closeModalAndNavigateBackSequence:
    closeModalAndNavigateBackSequence as unknown as Function,
  closeModalAndNavigateSequence:
    closeModalAndNavigateSequence as unknown as Function,
  closeModalAndNavigateToMaintenanceSequence:
    closeModalAndNavigateToMaintenanceSequence as unknown as Function,
  closeModalAndRefetchCase: closeModalAndRefetchCase as unknown as Function,
  closeModalAndReturnToCaseDetailDraftDocumentsSequence:
    closeModalAndReturnToCaseDetailDraftDocumentsSequence as unknown as Function,
  closeModalAndReturnToCaseDetailSequence:
    closeModalAndReturnToCaseDetailSequence as unknown as Function,
  closeModalAndReturnToDashboardSequence:
    closeModalAndReturnToDashboardSequence as unknown as Function,
  closeModalAndReturnToPractitionerDocumentsPageSequence:
    closeModalAndReturnToPractitionerDocumentsPageSequence as unknown as Function,
  closeModalAndReturnToTrialSessionsSequence:
    closeModalAndReturnToTrialSessionsSequence as unknown as Function,
  closeTrialSessionSequence: closeTrialSessionSequence as unknown as Function,
  closeVerifyEmailModalAndNavigateToMyAccountSequence:
    closeVerifyEmailModalAndNavigateToMyAccountSequence as unknown as Function,
  closeVerifyEmailModalAndNavigateToPractitionerDetailSequence:
    closeVerifyEmailModalAndNavigateToPractitionerDetailSequence as unknown as Function,
  completeDocketEntryQCAndSendMessageSequence:
    completeDocketEntryQCAndSendMessageSequence as unknown as Function,
  completeDocketEntryQCSequence:
    completeDocketEntryQCSequence as unknown as Function,
  completeDocumentSelectSequence:
    completeDocumentSelectSequence as unknown as Function,
  completeMessageSequence: completeMessageSequence as unknown as Function,
  completePrintPaperPetitionReceiptSequence:
    completePrintPaperPetitionReceiptSequence as unknown as Function,
  completeStartCaseWizardStepSequence:
    completeStartCaseWizardStepSequence as unknown as Function,
  confirmSignUpLocalSequence: confirmSignUpLocalSequence as unknown as Function,
  confirmStayLoggedInSequence:
    confirmStayLoggedInSequence as unknown as Function,
  confirmWorkItemAlreadyCompleteSequence:
    confirmWorkItemAlreadyCompleteSequence as unknown as Function,
  consolidatedCaseCheckboxAllChangeSequence:
    consolidatedCaseCheckboxAllChangeSequence as unknown as Function,
  contactPrimaryCountryTypeChangeSequence:
    contactPrimaryCountryTypeChangeSequence as unknown as Function,
  convertHtml2PdfSequence: convertHtml2PdfSequence as unknown as Function,
  copyPrimaryContactSequence: copyPrimaryContactSequence as unknown as Function,
  countryTypeUserContactChangeSequence:
    countryTypeUserContactChangeSequence as unknown as Function,
  createCaseDeadlineSequence: createCaseDeadlineSequence as unknown as Function,
  createMessageSequence: createMessageSequence as unknown as Function,
  deleteCalendarNoteSequence: deleteCalendarNoteSequence as unknown as Function,
  deleteCaseDeadlineSequence: deleteCaseDeadlineSequence as unknown as Function,
  deleteCaseNoteSequence: deleteCaseNoteSequence as unknown as Function,
  deleteCorrespondenceDocumentSequence:
    deleteCorrespondenceDocumentSequence as unknown as Function,
  deleteDeficiencyStatisticsSequence:
    deleteDeficiencyStatisticsSequence as unknown as Function,
  deleteJudgesCaseNoteFromCaseDetailSequence:
    deleteJudgesCaseNoteFromCaseDetailSequence as unknown as Function,
  deleteOtherStatisticsSequence:
    deleteOtherStatisticsSequence as unknown as Function,
  deletePractitionerDocumentSequence:
    deletePractitionerDocumentSequence as unknown as Function,
  deleteTrialSessionSequence: deleteTrialSessionSequence as unknown as Function,
  deleteUploadedPdfSequence: deleteUploadedPdfSequence as unknown as Function,
  deleteUserCaseNoteFromWorkingCopySequence:
    deleteUserCaseNoteFromWorkingCopySequence as unknown as Function,
  deleteWorkingCopySessionNoteSequence:
    deleteWorkingCopySessionNoteSequence as unknown as Function,
  disengageAppMaintenanceSequence:
    disengageAppMaintenanceSequence as unknown as Function,
  dismissAddEditCaseWorksheetModalSequence:
    dismissAddEditCaseWorksheetModalSequence as unknown as Function,
  dismissAlertSequence: dismissAlertSequence as unknown as Function,
  dismissCreateMessageModalSequence:
    dismissCreateMessageModalSequence as unknown as Function,
  dismissModalSequence: dismissModalSequence as unknown as Function,
  dismissThirtyDayTrialAlertSequence:
    dismissThirtyDayTrialAlertSequence as unknown as Function,
  editCorrespondenceDocumentSequence:
    editCorrespondenceDocumentSequence as unknown as Function,
  editUploadCourtIssuedDocumentSequence:
    editUploadCourtIssuedDocumentSequence as unknown as Function,
  exportPendingReportSequence:
    exportPendingReportSequence as unknown as Function,
  fetchUserNotificationsSequence:
    fetchUserNotificationsSequence as unknown as Function,
  fileAndServeCourtIssuedDocumentFromDocketEntrySequence:
    fileAndServeCourtIssuedDocumentFromDocketEntrySequence as unknown as Function,
  filterCaseDeadlinesByJudgeSequence:
    filterCaseDeadlinesByJudgeSequence as unknown as Function,
  formCancelToggleCancelSequence:
    formCancelToggleCancelSequence as unknown as Function,
  formatAndUpdateDateFromDatePickerSequence,
  forwardMessageSequence: forwardMessageSequence as unknown as Function,
  generateCaseCaptionSequence:
    generateCaseCaptionSequence as unknown as Function,
  generatePdfFromScanSessionSequence:
    generatePdfFromScanSessionSequence as unknown as Function,
  getBlockedCasesByTrialLocationSequence:
    getBlockedCasesByTrialLocationSequence as unknown as Function,
  getCaseInventoryReportSequence:
    getCaseInventoryReportSequence as unknown as Function,
  getCustomCaseReportSequence,
  getUsersInSectionSequence: getUsersInSectionSequence as unknown as Function,
  goToApplyStampSequence: goToApplyStampSequence as unknown as Function,
  goToCreatePetitionerAccountSequence,
  gotoAccessibilityStatementSequence:
    gotoAccessibilityStatementSequence as unknown as Function,
  gotoAddCourtIssuedDocketEntrySequence:
    gotoAddCourtIssuedDocketEntrySequence as unknown as Function,
  gotoAddDeficiencyStatisticsSequence:
    gotoAddDeficiencyStatisticsSequence as unknown as Function,
  gotoAddOtherStatisticsSequence:
    gotoAddOtherStatisticsSequence as unknown as Function,
  gotoAddPaperFilingSequence: gotoAddPaperFilingSequence as unknown as Function,
  gotoAddPetitionerToCaseSequence:
    gotoAddPetitionerToCaseSequence as unknown as Function,
  gotoAddTrialSessionSequence:
    gotoAddTrialSessionSequence as unknown as Function,
  gotoAdvancedSearchSequence: gotoAdvancedSearchSequence as unknown as Function,
  gotoBeforeStartCaseSequence:
    gotoBeforeStartCaseSequence as unknown as Function,
  gotoBeforeYouFileDocumentSequence:
    gotoBeforeYouFileDocumentSequence as unknown as Function,
  gotoBlockedCasesReportSequence:
    gotoBlockedCasesReportSequence as unknown as Function,
  gotoCaseDeadlineReportSequence:
    gotoCaseDeadlineReportSequence as unknown as Function,
  gotoCaseDetailSequence: gotoCaseDetailSequence as unknown as Function,
  gotoCaseInventoryReportSequence:
    gotoCaseInventoryReportSequence as unknown as Function,
  gotoCaseSearchNoMatchesSequence:
    gotoCaseSearchNoMatchesSequence as unknown as Function,
  gotoChangeLoginAndServiceEmailSequence:
    gotoChangeLoginAndServiceEmailSequence as unknown as Function,
  gotoChangePasswordLocalSequence:
    gotoChangePasswordLocalSequence as unknown as Function,
  gotoCompleteDocketEntryQCSequence:
    gotoCompleteDocketEntryQCSequence as unknown as Function,
  gotoContactEditSequence: gotoContactEditSequence as unknown as Function,
  gotoContactSequence: gotoContactSequence as unknown as Function,
  gotoCreateOrderSequence: gotoCreateOrderSequence as unknown as Function,
  gotoCreatePractitionerUserSequence:
    gotoCreatePractitionerUserSequence as unknown as Function,
  gotoCustomCaseReportSequence:
    gotoCustomCaseReportSequence as unknown as Function,
  gotoDashboardSequence: gotoDashboardSequence as unknown as Function,
  gotoDocketEntryQcSequence: gotoDocketEntryQcSequence as unknown as Function,
  gotoEditCaseDetailsSequence:
    gotoEditCaseDetailsSequence as unknown as Function,
  gotoEditCorrespondenceDocumentSequence:
    gotoEditCorrespondenceDocumentSequence as unknown as Function,
  gotoEditCourtIssuedDocketEntrySequence:
    gotoEditCourtIssuedDocketEntrySequence as unknown as Function,
  gotoEditDeficiencyStatisticSequence:
    gotoEditDeficiencyStatisticSequence as unknown as Function,
  gotoEditDocketEntryMetaSequence:
    gotoEditDocketEntryMetaSequence as unknown as Function,
  gotoEditOrderSequence: gotoEditOrderSequence as unknown as Function,
  gotoEditOtherStatisticsSequence:
    gotoEditOtherStatisticsSequence as unknown as Function,
  gotoEditPaperFilingSequence:
    gotoEditPaperFilingSequence as unknown as Function,
  gotoEditPetitionerCounselSequence:
    gotoEditPetitionerCounselSequence as unknown as Function,
  gotoEditPetitionerInformationInternalSequence:
    gotoEditPetitionerInformationInternalSequence as unknown as Function,
  gotoEditPractitionerUserSequence:
    gotoEditPractitionerUserSequence as unknown as Function,
  gotoEditRespondentCounselSequence:
    gotoEditRespondentCounselSequence as unknown as Function,
  gotoEditTrialSessionSequence:
    gotoEditTrialSessionSequence as unknown as Function,
  gotoEditUploadCourtIssuedDocumentSequence:
    gotoEditUploadCourtIssuedDocumentSequence as unknown as Function,
  gotoFileDocumentSequence: gotoFileDocumentSequence as unknown as Function,
  gotoFilePetitionSuccessSequence:
    gotoFilePetitionSuccessSequence as unknown as Function,
  gotoIdleLogoutSequence: gotoIdleLogoutSequence as unknown as Function,
  gotoJudgeActivityReportSequence:
    gotoJudgeActivityReportSequence as unknown as Function,
  gotoMaintenanceSequence: gotoMaintenanceSequence as unknown as Function,
  gotoMessageDetailSequence: gotoMessageDetailSequence as unknown as Function,
  gotoMessagesSequence: gotoMessagesSequence as unknown as Function,
  gotoMyAccountSequence: gotoMyAccountSequence as unknown as Function,
  gotoPdfPreviewSequence: gotoPdfPreviewSequence as unknown as Function,
  gotoPendingReportSequence: gotoPendingReportSequence as unknown as Function,
  gotoPetitionQcSequence: gotoPetitionQcSequence as unknown as Function,
  gotoPractitionerAddDocumentSequence:
    gotoPractitionerAddDocumentSequence as unknown as Function,
  gotoPractitionerDetailSequence:
    gotoPractitionerDetailSequence as unknown as Function,
  gotoPractitionerDocumentationSequence:
    gotoPractitionerDocumentationSequence as unknown as Function,
  gotoPractitionerEditDocumentSequence:
    gotoPractitionerEditDocumentSequence as unknown as Function,
  gotoPrintPaperServiceSequence:
    gotoPrintPaperServiceSequence as unknown as Function,
  gotoPrintPaperTrialNoticesSequence:
    gotoPrintPaperTrialNoticesSequence as unknown as Function,
  gotoPrintPractitionerCasesSequence:
    gotoPrintPractitionerCasesSequence as unknown as Function,
  gotoPrintableCaseConfirmationSequence:
    gotoPrintableCaseConfirmationSequence as unknown as Function,
  gotoPrintableCaseInventoryReportSequence:
    gotoPrintableCaseInventoryReportSequence as unknown as Function,
  gotoPrintableDocketRecordSequence:
    gotoPrintableDocketRecordSequence as unknown as Function,
  gotoPrintablePendingReportForCaseSequence:
    gotoPrintablePendingReportForCaseSequence as unknown as Function,
  gotoPrintablePendingReportSequence:
    gotoPrintablePendingReportSequence as unknown as Function,
  gotoPrintableTrialSessionWorkingCopySequence:
    gotoPrintableTrialSessionWorkingCopySequence as unknown as Function,
  gotoPrivacySequence: gotoPrivacySequence as unknown as Function,
  gotoRequestAccessSequence: gotoRequestAccessSequence as unknown as Function,
  gotoReviewSavedPetitionSequence:
    gotoReviewSavedPetitionSequence as unknown as Function,
  gotoSignOrderSequence: gotoSignOrderSequence as unknown as Function,
  gotoStartCaseWizardSequence:
    gotoStartCaseWizardSequence as unknown as Function,
  gotoStyleGuideSequence: gotoStyleGuideSequence as unknown as Function,
  gotoTrialSessionDetailSequence:
    gotoTrialSessionDetailSequence as unknown as Function,
  gotoTrialSessionPlanningReportSequence:
    gotoTrialSessionPlanningReportSequence as unknown as Function,
  gotoTrialSessionWorkingCopySequence:
    gotoTrialSessionWorkingCopySequence as unknown as Function,
  gotoTrialSessionsSequence: gotoTrialSessionsSequence as unknown as Function,
  gotoUploadCorrespondenceDocumentSequence:
    gotoUploadCorrespondenceDocumentSequence as unknown as Function,
  gotoUploadCourtIssuedDocumentSequence:
    gotoUploadCourtIssuedDocumentSequence as unknown as Function,
  gotoUserContactEditSequence:
    gotoUserContactEditSequence as unknown as Function,
  gotoVerifyEmailSequence: gotoVerifyEmailSequence as unknown as Function,
  gotoViewAllDocumentsSequence:
    gotoViewAllDocumentsSequence as unknown as Function,
  gotoWorkQueueSequence: gotoWorkQueueSequence as unknown as Function,
  handleIdleLogoutSequence: handleIdleLogoutSequence as unknown as Function,
  leaveCaseForLaterServiceSequence:
    leaveCaseForLaterServiceSequence as unknown as Function,
  loadDefaultDocketViewerDocumentToDisplaySequence:
    loadDefaultDocketViewerDocumentToDisplaySequence as unknown as Function,
  loadDefaultDraftViewerDocumentToDisplaySequence:
    loadDefaultDraftViewerDocumentToDisplaySequence as unknown as Function,
  loadDefaultViewerCorrespondenceSequence:
    loadDefaultViewerCorrespondenceSequence as unknown as Function,
  loadMoreCaseDeadlinesSequence:
    loadMoreCaseDeadlinesSequence as unknown as Function,
  loadMorePendingItemsSequence:
    loadMorePendingItemsSequence as unknown as Function,
  loadPdfSequence: loadPdfSequence as unknown as Function,
  loginWithTokenSequence: loginWithTokenSequence as unknown as Function,
  navigateBackSequence: navigateBackSequence as unknown as Function,
  navigateToCaseDetailFromPaperServiceSequence:
    navigateToCaseDetailFromPaperServiceSequence as unknown as Function,
  navigateToCaseDetailSequence:
    navigateToCaseDetailSequence as unknown as Function,
  navigateToCaseDetailWithDraftDocumentSequence:
    navigateToCaseDetailWithDraftDocumentSequence as unknown as Function,
  navigateToEditOrderSequence:
    navigateToEditOrderSequence as unknown as Function,
  navigateToLoginSequence,
  navigateToPathAndSetRedirectUrlSequence:
    navigateToPathAndSetRedirectUrlSequence as unknown as Function,
  navigateToPathSequence: navigateToPathSequence as unknown as Function,
  navigateToPrintPaperServiceSequence:
    navigateToPrintPaperServiceSequence as unknown as Function,
  navigateToPrintableCaseConfirmationSequence:
    navigateToPrintableCaseConfirmationSequence as unknown as Function,
  notFoundErrorSequence: notFoundErrorSequence as unknown as Function,
  noticeGenerationCompleteSequence:
    noticeGenerationCompleteSequence as unknown as Function,
  onPractitionerInformationTabSelectSequence:
    onPractitionerInformationTabSelectSequence as unknown as Function,
  openAddDocketNumbersModalSequence:
    openAddDocketNumbersModalSequence as unknown as Function,
  openAddEditCalendarNoteModalSequence:
    openAddEditCalendarNoteModalSequence as unknown as Function,
  openAddEditCaseNoteModalSequence:
    openAddEditCaseNoteModalSequence as unknown as Function,
  openAddEditCaseWorksheetModalSequence:
    openAddEditCaseWorksheetModalSequence as unknown as Function,
  openAddEditHearingNoteModalSequence:
    openAddEditHearingNoteModalSequence as unknown as Function,
  openAddEditSessionNoteModalSequence:
    openAddEditSessionNoteModalSequence as unknown as Function,
  openAddEditUserCaseNoteModalFromDetailSequence:
    openAddEditUserCaseNoteModalFromDetailSequence as unknown as Function,
  openAddEditUserCaseNoteModalFromListSequence:
    openAddEditUserCaseNoteModalFromListSequence as unknown as Function,
  openAddIrsPractitionerModalSequence:
    openAddIrsPractitionerModalSequence as unknown as Function,
  openAddPrivatePractitionerModalSequence:
    openAddPrivatePractitionerModalSequence as unknown as Function,
  openAddToTrialModalSequence:
    openAddToTrialModalSequence as unknown as Function,
  openAppMaintenanceModalSequence:
    openAppMaintenanceModalSequence as unknown as Function,
  openBlockFromTrialModalSequence:
    openBlockFromTrialModalSequence as unknown as Function,
  openCancelDraftDocumentModalSequence:
    openCancelDraftDocumentModalSequence as unknown as Function,
  openCaseDifferenceModalSequence:
    openCaseDifferenceModalSequence as unknown as Function,
  openCaseDocumentDownloadUrlSequence:
    openCaseDocumentDownloadUrlSequence as unknown as Function,
  openCaseInNewTabSequence: openCaseInNewTabSequence as unknown as Function,
  openCaseInventoryReportModalSequence:
    openCaseInventoryReportModalSequence as unknown as Function,
  openChangeScannerSourceModalSequence:
    openChangeScannerSourceModalSequence as unknown as Function,
  openCleanModalSequence: openCleanModalSequence as unknown as Function,
  openCompleteAndSendMessageModalSequence:
    openCompleteAndSendMessageModalSequence as unknown as Function,
  openCompleteMessageModalSequence:
    openCompleteMessageModalSequence as unknown as Function,
  openCompleteSelectDocumentTypeModalSequence:
    openCompleteSelectDocumentTypeModalSequence as unknown as Function,
  openConfirmDeleteBatchModalSequence:
    openConfirmDeleteBatchModalSequence as unknown as Function,
  openConfirmDeleteCorrespondenceModalSequence:
    openConfirmDeleteCorrespondenceModalSequence as unknown as Function,
  openConfirmDeleteDeficiencyStatisticsModalSequence:
    openConfirmDeleteDeficiencyStatisticsModalSequence as unknown as Function,
  openConfirmDeleteOtherStatisticsModalSequence:
    openConfirmDeleteOtherStatisticsModalSequence as unknown as Function,
  openConfirmDeletePDFModalSequence:
    openConfirmDeletePDFModalSequence as unknown as Function,
  openConfirmDeleteTrialSessionModalSequence:
    openConfirmDeleteTrialSessionModalSequence as unknown as Function,
  openConfirmEditModalSequence:
    openConfirmEditModalSequence as unknown as Function,
  openConfirmInitiateCourtIssuedFilingServiceModalSequence:
    openConfirmInitiateCourtIssuedFilingServiceModalSequence as unknown as Function,
  openConfirmModalSequence: openConfirmModalSequence as unknown as Function,
  openConfirmPaperServiceModalSequence:
    openConfirmPaperServiceModalSequence as unknown as Function,
  openConfirmRemoveCaseDetailPendingItemModalSequence:
    openConfirmRemoveCaseDetailPendingItemModalSequence as unknown as Function,
  openConfirmRemoveSignatureModalSequence:
    openConfirmRemoveSignatureModalSequence as unknown as Function,
  openConfirmReplacePetitionPdfSequence:
    openConfirmReplacePetitionPdfSequence as unknown as Function,
  openConfirmRescanBatchModalSequence:
    openConfirmRescanBatchModalSequence as unknown as Function,
  openConfirmServeCourtIssuedDocumentSequence:
    openConfirmServeCourtIssuedDocumentSequence as unknown as Function,
  openConfirmServePaperFiledDocumentSequence:
    openConfirmServePaperFiledDocumentSequence as unknown as Function,
  openConfirmServeToIrsModalSequence:
    openConfirmServeToIrsModalSequence as unknown as Function,
  openCreateCaseDeadlineModalSequence:
    openCreateCaseDeadlineModalSequence as unknown as Function,
  openCreateMessageModalSequence:
    openCreateMessageModalSequence as unknown as Function,
  openCreateOrderChooseTypeModalSequence:
    openCreateOrderChooseTypeModalSequence as unknown as Function,
  openDeleteCaseDeadlineModalSequence:
    openDeleteCaseDeadlineModalSequence as unknown as Function,
  openDeleteCaseNoteConfirmModalSequence:
    openDeleteCaseNoteConfirmModalSequence as unknown as Function,
  openDeletePractitionerDocumentConfirmModalSequence:
    openDeletePractitionerDocumentConfirmModalSequence as unknown as Function,
  openDeleteSessionNoteConfirmModalSequence:
    openDeleteSessionNoteConfirmModalSequence as unknown as Function,
  openDeleteUserCaseNoteConfirmModalSequence:
    openDeleteUserCaseNoteConfirmModalSequence as unknown as Function,
  openEditCaseDeadlineModalSequence:
    openEditCaseDeadlineModalSequence as unknown as Function,
  openEditOrderTitleModalSequence:
    openEditOrderTitleModalSequence as unknown as Function,
  openForwardMessageModalSequence:
    openForwardMessageModalSequence as unknown as Function,
  openGainElectronicAccessToCaseModalSequence:
    openGainElectronicAccessToCaseModalSequence as unknown as Function,
  openItemizedPenaltiesModalSequence:
    openItemizedPenaltiesModalSequence as unknown as Function,
  openPdfPreviewModalSequence:
    openPdfPreviewModalSequence as unknown as Function,
  openPractitionerDocumentDownloadUrlSequence:
    openPractitionerDocumentDownloadUrlSequence as unknown as Function,
  openPrintGeneratedPaperServiceSequence:
    openPrintGeneratedPaperServiceSequence as unknown as Function,
  openPrintableTrialSessionWorkingCopyModalSequence:
    openPrintableTrialSessionWorkingCopyModalSequence as unknown as Function,
  openPrioritizeCaseModalSequence:
    openPrioritizeCaseModalSequence as unknown as Function,
  openRemoveFromTrialSessionModalSequence:
    openRemoveFromTrialSessionModalSequence as unknown as Function,
  openRemovePetitionerCounselModalSequence:
    openRemovePetitionerCounselModalSequence as unknown as Function,
  openRemovePetitionerModalSequence:
    openRemovePetitionerModalSequence as unknown as Function,
  openRemoveRespondentCounselModalSequence:
    openRemoveRespondentCounselModalSequence as unknown as Function,
  openReplyToMessageModalSequence:
    openReplyToMessageModalSequence as unknown as Function,
  openSealAddressModalSequence:
    openSealAddressModalSequence as unknown as Function,
  openSealDocketEntryModalSequence:
    openSealDocketEntryModalSequence as unknown as Function,
  openSelectedTrialSessionPaperServicePdfSequence:
    openSelectedTrialSessionPaperServicePdfSequence as unknown as Function,
  openSetCalendarModalSequence:
    openSetCalendarModalSequence as unknown as Function,
  openSetForHearingModalSequence:
    openSetForHearingModalSequence as unknown as Function,
  openStrikeDocketEntryModalSequence:
    openStrikeDocketEntryModalSequence as unknown as Function,
  openTrialSessionPlanningModalSequence:
    openTrialSessionPlanningModalSequence as unknown as Function,
  openUnblockFromTrialModalSequence:
    openUnblockFromTrialModalSequence as unknown as Function,
  openUnprioritizeCaseModalSequence:
    openUnprioritizeCaseModalSequence as unknown as Function,
  openUnsealDocketEntryModalSequence:
    openUnsealDocketEntryModalSequence as unknown as Function,
  openUpdateCaseModalSequence:
    openUpdateCaseModalSequence as unknown as Function,
  paperServiceCompleteSequence:
    paperServiceCompleteSequence as unknown as Function,
  printPaperServiceForTrialCompleteSequence:
    printPaperServiceForTrialCompleteSequence as unknown as Function,
  printTrialCalendarSequence: printTrialCalendarSequence as unknown as Function,
  prioritizeCaseSequence: prioritizeCaseSequence as unknown as Function,
  refreshPdfSequence: refreshPdfSequence as unknown as Function,
  refreshStatisticsSequence: refreshStatisticsSequence as unknown as Function,
  removeBatchSequence: removeBatchSequence as unknown as Function,
  removeCaseDetailPendingItemSequence:
    removeCaseDetailPendingItemSequence as unknown as Function,
  removeCaseFromTrialSequence:
    removeCaseFromTrialSequence as unknown as Function,
  removePetitionForReplacementSequence:
    removePetitionForReplacementSequence as unknown as Function,
  removePetitionerAndUpdateCaptionSequence:
    removePetitionerAndUpdateCaptionSequence as unknown as Function,
  removePetitionerCounselFromCaseSequence:
    removePetitionerCounselFromCaseSequence as unknown as Function,
  removeRespondentCounselFromCaseSequence:
    removeRespondentCounselFromCaseSequence as unknown as Function,
  removeScannedPdfSequence: removeScannedPdfSequence as unknown as Function,
  removeSecondarySupportingDocumentSequence:
    removeSecondarySupportingDocumentSequence as unknown as Function,
  removeSignatureSequence: removeSignatureSequence as unknown as Function,
  removeSupportingDocumentSequence:
    removeSupportingDocumentSequence as unknown as Function,
  replyToMessageSequence: replyToMessageSequence as unknown as Function,
  rescanBatchSequence: rescanBatchSequence as unknown as Function,
  resetCaseMenuSequence: resetCaseMenuSequence as unknown as Function,
  resetHeaderAccordionsSequence:
    resetHeaderAccordionsSequence as unknown as Function,
  resetIdleTimerSequence: resetIdleTimerSequence as unknown as Function,
  retryAsyncRequestSequence: retryAsyncRequestSequence as unknown as Function,
  reviewExternalDocumentInformationSequence:
    reviewExternalDocumentInformationSequence as unknown as Function,
  reviewRequestAccessInformationSequence:
    reviewRequestAccessInformationSequence as unknown as Function,
  runTrialSessionPlanningReportSequence:
    runTrialSessionPlanningReportSequence as unknown as Function,
  saveCourtIssuedDocketEntrySequence:
    saveCourtIssuedDocketEntrySequence as unknown as Function,
  saveDocketEntryForLaterCompleteSequence:
    saveDocketEntryForLaterCompleteSequence as unknown as Function,
  saveDocumentSigningSequence:
    saveDocumentSigningSequence as unknown as Function,
  saveSavedCaseForLaterSequence:
    saveSavedCaseForLaterSequence as unknown as Function,
  scannerStartupSequence: scannerStartupSequence as unknown as Function,
  sealAddressSequence: sealAddressSequence as unknown as Function,
  sealCaseSequence: sealCaseSequence as unknown as Function,
  sealDocketEntrySequence: sealDocketEntrySequence as unknown as Function,
  selectAssigneeSequence: selectAssigneeSequence as unknown as Function,
  selectDateRangeFromCalendarSequence:
    selectDateRangeFromCalendarSequence as unknown as Function,
  selectDocumentForPreviewSequence:
    selectDocumentForPreviewSequence as unknown as Function,
  selectDocumentForScanSequence:
    selectDocumentForScanSequence as unknown as Function,
  selectScannerSequence: selectScannerSequence as unknown as Function,
  selectWorkItemSequence: selectWorkItemSequence as unknown as Function,
  serveCaseToIrsSequence: serveCaseToIrsSequence as unknown as Function,
  serveCourtIssuedDocumentSequence:
    serveCourtIssuedDocumentSequence as unknown as Function,
  serveDocumentCompleteSequence:
    serveDocumentCompleteSequence as unknown as Function,
  serveDocumentErrorSequence: serveDocumentErrorSequence as unknown as Function,
  servePaperFiledDocumentSequence:
    servePaperFiledDocumentSequence as unknown as Function,
  serveThirtyDayNoticeOfTrialSequence:
    serveThirtyDayNoticeOfTrialSequence as unknown as Function,
  setCaseDetailPageTabSequence:
    setCaseDetailPageTabSequence as unknown as Function,
  setCaseDetailPrimaryTabSequence:
    setCaseDetailPrimaryTabSequence as unknown as Function,
  setCaseTypeToDisplaySequence:
    setCaseTypeToDisplaySequence as unknown as Function,
  setCurrentPageIndexSequence:
    setCurrentPageIndexSequence as unknown as Function,
  setCustomCaseReportFiltersSequence,
  setDocumentForPreviewSequence:
    setDocumentForPreviewSequence as unknown as Function,
  setDocumentForUploadSequence:
    setDocumentForUploadSequence as unknown as Function,
  setDocumentUploadModeSequence:
    setDocumentUploadModeSequence as unknown as Function,
  setForHearingSequence: setForHearingSequence as unknown as Function,
  setIdleStatusActiveSequence:
    setIdleStatusActiveSequence as unknown as Function,
  setIrsNoticeFalseSequence: setIrsNoticeFalseSequence as unknown as Function,
  setJudgeActivityReportFiltersSequence,
  setMessageDetailViewerDocumentToDisplaySequence:
    setMessageDetailViewerDocumentToDisplaySequence as unknown as Function,
  setPDFPageForSigningSequence:
    setPDFPageForSigningSequence as unknown as Function,
  setPDFSignatureDataSequence:
    setPDFSignatureDataSequence as unknown as Function,
  setPDFStampDataSequence: setPDFStampDataSequence as unknown as Function,
  setPdfPreviewUrlSequence: setPdfPreviewUrlSequence as unknown as Function,
  setPendingReportSelectedJudgeSequence:
    setPendingReportSelectedJudgeSequence as unknown as Function,
  setSelectedAddressOnFormSequence:
    setSelectedAddressOnFormSequence as unknown as Function,
  setSelectedBatchIndexSequence:
    setSelectedBatchIndexSequence as unknown as Function,
  setTrialSessionCalendarSequence:
    setTrialSessionCalendarSequence as unknown as Function,
  setViewerCorrespondenceToDisplaySequence:
    setViewerCorrespondenceToDisplaySequence as unknown as Function,
  setViewerDocumentToDisplaySequence:
    setViewerDocumentToDisplaySequence as unknown as Function,
  setViewerDraftDocumentToDisplaySequence:
    setViewerDraftDocumentToDisplaySequence as unknown as Function,
  showCalculatePenaltiesModalSequence:
    showCalculatePenaltiesModalSequence as unknown as Function,
  showDocketRecordDetailModalSequence:
    showDocketRecordDetailModalSequence as unknown as Function,
  showGenerateNoticesProgressSequence:
    showGenerateNoticesProgressSequence as unknown as Function,
  showMoreClosedCasesSequence:
    showMoreClosedCasesSequence as unknown as Function,
  showMoreOpenCasesSequence: showMoreOpenCasesSequence as unknown as Function,
  showMoreResultsSequence: showMoreResultsSequence as unknown as Function,
  showPaperServiceProgressSequence:
    showPaperServiceProgressSequence as unknown as Function,
  showThirtyDayNoticeModalSequence:
    showThirtyDayNoticeModalSequence as unknown as Function,
  showViewPetitionerCounselModalSequence:
    showViewPetitionerCounselModalSequence as unknown as Function,
  signOutSequence: signOutSequence as unknown as Function,
  skipSigningOrderSequence: skipSigningOrderSequence as unknown as Function,
  sortTableSequence,
  startRefreshIntervalSequence:
    startRefreshIntervalSequence as unknown as Function,
  startScanSequence: startScanSequence as unknown as Function,
  strikeDocketEntrySequence: strikeDocketEntrySequence as unknown as Function,
  submitAddConsolidatedCaseSequence:
    submitAddConsolidatedCaseSequence as unknown as Function,
  submitAddDeficiencyStatisticsSequence:
    submitAddDeficiencyStatisticsSequence as unknown as Function,
  submitAddOtherStatisticsSequence:
    submitAddOtherStatisticsSequence as unknown as Function,
  submitAddPetitionerSequence:
    submitAddPetitionerSequence as unknown as Function,
  submitAddPractitionerDocumentSequence:
    submitAddPractitionerDocumentSequence as unknown as Function,
  submitAddPractitionerSequence:
    submitAddPractitionerSequence as unknown as Function,
  submitCaseAdvancedSearchSequence:
    submitCaseAdvancedSearchSequence as unknown as Function,
  submitCaseAssociationRequestSequence:
    submitCaseAssociationRequestSequence as unknown as Function,
  submitCaseDocketNumberSearchSequence:
    submitCaseDocketNumberSearchSequence as unknown as Function,
  submitCaseInventoryReportModalSequence:
    submitCaseInventoryReportModalSequence as unknown as Function,
  submitCaseSearchForConsolidationSequence:
    submitCaseSearchForConsolidationSequence as unknown as Function,
  submitCaseSearchSequence: submitCaseSearchSequence as unknown as Function,
  submitChangeLoginAndServiceEmailSequence:
    submitChangeLoginAndServiceEmailSequence as unknown as Function,
  submitCourtIssuedDocketEntrySequence:
    submitCourtIssuedDocketEntrySequence as unknown as Function,
  submitCourtIssuedOrderSequence:
    submitCourtIssuedOrderSequence as unknown as Function,
  submitCreateOrderModalSequence:
    submitCreateOrderModalSequence as unknown as Function,
  submitEditContactSequence: submitEditContactSequence as unknown as Function,
  submitEditDeficiencyStatisticSequence:
    submitEditDeficiencyStatisticSequence as unknown as Function,
  submitEditDocketEntryMetaSequence:
    submitEditDocketEntryMetaSequence as unknown as Function,
  submitEditOrderTitleModalSequence:
    submitEditOrderTitleModalSequence as unknown as Function,
  submitEditOtherStatisticsSequence:
    submitEditOtherStatisticsSequence as unknown as Function,
  submitEditPetitionerCounselSequence:
    submitEditPetitionerCounselSequence as unknown as Function,
  submitEditPetitionerSequence:
    submitEditPetitionerSequence as unknown as Function,
  submitEditPractitionerDocumentSequence:
    submitEditPractitionerDocumentSequence as unknown as Function,
  submitEditRespondentCounselSequence:
    submitEditRespondentCounselSequence as unknown as Function,
  submitExternalDocumentSequence:
    submitExternalDocumentSequence as unknown as Function,
  submitFilePetitionSequence: submitFilePetitionSequence as unknown as Function,
  submitJudgeActivityReportSequence:
    submitJudgeActivityReportSequence as unknown as Function,
  submitLocalLoginSequence: submitLocalLoginSequence as unknown as Function,
  submitLoginSequence,
  submitOpinionAdvancedSearchSequence:
    submitOpinionAdvancedSearchSequence as unknown as Function,
  submitOrderAdvancedSearchSequence:
    submitOrderAdvancedSearchSequence as unknown as Function,
  submitPaperFilingSequence: submitPaperFilingSequence as unknown as Function,
  submitPetitionFromPaperSequence:
    submitPetitionFromPaperSequence as unknown as Function,
  submitPractitionerBarNumberSearchSequence:
    submitPractitionerBarNumberSearchSequence as unknown as Function,
  submitPractitionerNameSearchSequence:
    submitPractitionerNameSearchSequence as unknown as Function,
  submitRemoveConsolidatedCasesSequence:
    submitRemoveConsolidatedCasesSequence as unknown as Function,
  submitStampMotionSequence: submitStampMotionSequence as unknown as Function,
  submitTrialSessionSequence: submitTrialSessionSequence as unknown as Function,
  submitUpdateAddDocketNumbersToOrderSequence:
    submitUpdateAddDocketNumbersToOrderSequence as unknown as Function,
  submitUpdateCaseModalSequence:
    submitUpdateCaseModalSequence as unknown as Function,
  submitUpdatePetitionerInformationFromModalSequence:
    submitUpdatePetitionerInformationFromModalSequence as unknown as Function,
  submitUpdatePractitionerUserSequence:
    submitUpdatePractitionerUserSequence as unknown as Function,
  submitUpdateUserContactInformationSequence:
    submitUpdateUserContactInformationSequence as unknown as Function,
  thirtyDayNoticePaperServiceCompleteSequence:
    thirtyDayNoticePaperServiceCompleteSequence as unknown as Function,
  toggleAllWorkItemCheckboxChangeSequence:
    toggleAllWorkItemCheckboxChangeSequence as unknown as Function,
  toggleBetaBarSequence: toggleBetaBarSequence as unknown as Function,
  toggleCaseDifferenceSequence:
    toggleCaseDifferenceSequence as unknown as Function,
  toggleMenuSequence: toggleMenuSequence as unknown as Function,
  toggleMenuStateSequence: toggleMenuStateSequence as unknown as Function,
  toggleMobileDocketSortSequence:
    toggleMobileDocketSortSequence as unknown as Function,
  toggleMobileMenuSequence: toggleMobileMenuSequence as unknown as Function,
  toggleUsaBannerDetailsSequence:
    toggleUsaBannerDetailsSequence as unknown as Function,
  toggleUseContactPrimaryAddressSequence:
    toggleUseContactPrimaryAddressSequence as unknown as Function,
  toggleUseExistingAddressSequence:
    toggleUseExistingAddressSequence as unknown as Function,
  toggleWorkingCopySortSequence,
  unauthorizedErrorSequence: unauthorizedErrorSequence as unknown as Function,
  unblockCaseFromTrialSequence:
    unblockCaseFromTrialSequence as unknown as Function,
  unidentifiedUserErrorSequence:
    unidentifiedUserErrorSequence as unknown as Function,
  unprioritizeCaseSequence: unprioritizeCaseSequence as unknown as Function,
  unsealCaseSequence: unsealCaseSequence as unknown as Function,
  unsealDocketEntrySequence: unsealDocketEntrySequence as unknown as Function,
  updateAddDeficiencyFormValueSequence:
    updateAddDeficiencyFormValueSequence as unknown as Function,
  updateAdvancedOpinionSearchFormValueSequence:
    updateAdvancedOpinionSearchFormValueSequence as unknown as Function,
  updateAdvancedOrderSearchFormValueSequence:
    updateAdvancedOrderSearchFormValueSequence as unknown as Function,
  updateAdvancedSearchFormValueSequence:
    updateAdvancedSearchFormValueSequence as unknown as Function,
  updateBatchDownloadProgressSequence:
    updateBatchDownloadProgressSequence as unknown as Function,
  updateCalendarNoteSequence: updateCalendarNoteSequence as unknown as Function,
  updateCaseAdvancedSearchByNameFormValueSequence:
    updateCaseAdvancedSearchByNameFormValueSequence as unknown as Function,
  updateCaseAssociationFormValueSequence:
    updateCaseAssociationFormValueSequence as unknown as Function,
  updateCaseCheckboxSequence: updateCaseCheckboxSequence as unknown as Function,
  updateCaseDeadlineSequence: updateCaseDeadlineSequence as unknown as Function,
  updateCaseDetailsSequence: updateCaseDetailsSequence as unknown as Function,
  updateCaseNoteSequence: updateCaseNoteSequence as unknown as Function,
  updateCasePartyTypeSequence:
    updateCasePartyTypeSequence as unknown as Function,
  updateCaseWorksheetSequence:
    updateCaseWorksheetSequence as unknown as Function,
  updateChambersInCreateMessageModalSequence:
    updateChambersInCreateMessageModalSequence as unknown as Function,
  updateCourtIssuedDocketEntryFormValueSequence:
    updateCourtIssuedDocketEntryFormValueSequence as unknown as Function,
  updateCourtIssuedDocketEntryTitleSequence:
    updateCourtIssuedDocketEntryTitleSequence as unknown as Function,
  updateCreateOrderModalFormValueSequence:
    updateCreateOrderModalFormValueSequence as unknown as Function,
  updateDateRangeForDeadlinesSequence:
    updateDateRangeForDeadlinesSequence as unknown as Function,
  updateDocketEntryFormValueSequence:
    updateDocketEntryFormValueSequence as unknown as Function,
  updateDocketEntryMetaDocumentFormValueSequence:
    updateDocketEntryMetaDocumentFormValueSequence as unknown as Function,
  updateDocketNumberSearchFormSequence:
    updateDocketNumberSearchFormSequence as unknown as Function,
  updateFileDocumentWizardFormValueSequence:
    updateFileDocumentWizardFormValueSequence as unknown as Function,
  updateFormValueAndCaseCaptionSequence:
    updateFormValueAndCaseCaptionSequence as unknown as Function,
  updateFormValueAndSecondaryContactInfoSequence:
    updateFormValueAndSecondaryContactInfoSequence as unknown as Function,
  updateFormValueSequence: updateFormValueSequence as unknown as Function,
  updateGenerateNoticesProgressSequence:
    updateGenerateNoticesProgressSequence as unknown as Function,
  updateHearingNoteSequence: updateHearingNoteSequence as unknown as Function,
  updateJudgesCaseNoteOnCaseDetailSequence:
    updateJudgesCaseNoteOnCaseDetailSequence as unknown as Function,
  updateMessageModalAttachmentsSequence:
    updateMessageModalAttachmentsSequence as unknown as Function,
  updateModalFormValueSequence:
    updateModalFormValueSequence as unknown as Function,
  updateModalValueSequence: updateModalValueSequence as unknown as Function,
  updateOrderForDesignatingPlaceOfTrialSequence:
    updateOrderForDesignatingPlaceOfTrialSequence as unknown as Function,
  updatePaperServiceProgressSequence:
    updatePaperServiceProgressSequence as unknown as Function,
  updatePartyViewTabSequence: updatePartyViewTabSequence as unknown as Function,
  updatePetitionPaymentFormValueSequence:
    updatePetitionPaymentFormValueSequence as unknown as Function,
  updateQcCompleteForTrialSequence:
    updateQcCompleteForTrialSequence as unknown as Function,
  updateScreenMetadataSequence:
    updateScreenMetadataSequence as unknown as Function,
  updateSearchTermSequence: updateSearchTermSequence as unknown as Function,
  updateSectionInCreateMessageModalSequence:
    updateSectionInCreateMessageModalSequence as unknown as Function,
  updateSessionMetadataSequence,
  updateStartCaseFormValueSequence:
    updateStartCaseFormValueSequence as unknown as Function,
  updateStartCaseInternalPartyTypeSequence:
    updateStartCaseInternalPartyTypeSequence as unknown as Function,
  updateStatisticsFormValueSequence:
    updateStatisticsFormValueSequence as unknown as Function,
  updateTrialSessionCompleteSequence:
    updateTrialSessionCompleteSequence as unknown as Function,
  updateTrialSessionFormDataSequence:
    updateTrialSessionFormDataSequence as unknown as Function,
  updateTrialSessionSequence: updateTrialSessionSequence as unknown as Function,
  updateUserCaseNoteOnWorkingCopySequence:
    updateUserCaseNoteOnWorkingCopySequence as unknown as Function,
  updateWorkingCopySessionNoteSequence:
    updateWorkingCopySessionNoteSequence as unknown as Function,
  uploadCorrespondenceDocumentSequence:
    uploadCorrespondenceDocumentSequence as unknown as Function,
  uploadCourtIssuedDocumentSequence:
    uploadCourtIssuedDocumentSequence as unknown as Function,
  userContactUpdateCompleteSequence:
    userContactUpdateCompleteSequence as unknown as Function,
  userContactUpdateErrorSequence:
    userContactUpdateErrorSequence as unknown as Function,
  userContactUpdateInitialUpdateCompleteSequence:
    userContactUpdateInitialUpdateCompleteSequence as unknown as Function,
  userContactUpdateProgressSequence:
    userContactUpdateProgressSequence as unknown as Function,
  validateAddDeficiencyStatisticsSequence:
    validateAddDeficiencyStatisticsSequence as unknown as Function,
  validateAddIrsPractitionerSequence:
    validateAddIrsPractitionerSequence as unknown as Function,
  validateAddPetitionerSequence:
    validateAddPetitionerSequence as unknown as Function,
  validateAddPractitionerDocumentSequence:
    validateAddPractitionerDocumentSequence as unknown as Function,
  validateAddPractitionerSequence:
    validateAddPractitionerSequence as unknown as Function,
  validateAddPrivatePractitionerSequence:
    validateAddPrivatePractitionerSequence as unknown as Function,
  validateAddToTrialSessionSequence:
    validateAddToTrialSessionSequence as unknown as Function,
  validateBlockFromTrialSequence:
    validateBlockFromTrialSequence as unknown as Function,
  validateCaseAdvancedSearchFormSequence:
    validateCaseAdvancedSearchFormSequence as unknown as Function,
  validateCaseAssociationRequestSequence:
    validateCaseAssociationRequestSequence as unknown as Function,
  validateCaseDeadlineSequence:
    validateCaseDeadlineSequence as unknown as Function,
  validateCaseDetailSequence: validateCaseDetailSequence as unknown as Function,
  validateCaseDetailsSequence:
    validateCaseDetailsSequence as unknown as Function,
  validateCaseDocketNumberSearchFormSequence:
    validateCaseDocketNumberSearchFormSequence as unknown as Function,
  validateCaseInventoryReportModalSequence:
    validateCaseInventoryReportModalSequence as unknown as Function,
  validateCaseWorksheetSequence:
    validateCaseWorksheetSequence as unknown as Function,
  validateChangeLoginAndServiceEmailSequence:
    validateChangeLoginAndServiceEmailSequence as unknown as Function,
  validateCourtIssuedDocketEntrySequence:
    validateCourtIssuedDocketEntrySequence as unknown as Function,
  validateCreateMessageInModalSequence:
    validateCreateMessageInModalSequence as unknown as Function,
  validateDocketEntrySequence:
    validateDocketEntrySequence as unknown as Function,
  validateDocumentSequence: validateDocumentSequence as unknown as Function,
  validateEditPetitionerCounselSequence:
    validateEditPetitionerCounselSequence as unknown as Function,
  validateEditRespondentCounselSequence:
    validateEditRespondentCounselSequence as unknown as Function,
  validateExternalDocumentInformationSequence:
    validateExternalDocumentInformationSequence as unknown as Function,
  validateNoteSequence: validateNoteSequence as unknown as Function,
  validateOpinionSearchSequence:
    validateOpinionSearchSequence as unknown as Function,
  validateOrderSearchSequence:
    validateOrderSearchSequence as unknown as Function,
  validateOrderWithoutBodySequence:
    validateOrderWithoutBodySequence as unknown as Function,
  validatePetitionFromPaperSequence:
    validatePetitionFromPaperSequence as unknown as Function,
  validatePetitionerSequence: validatePetitionerSequence as unknown as Function,
  validatePractitionerSearchByBarNumberFormSequence:
    validatePractitionerSearchByBarNumberFormSequence as unknown as Function,
  validatePractitionerSearchByNameFormSequence:
    validatePractitionerSearchByNameFormSequence as unknown as Function,
  validatePrioritizeCaseSequence:
    validatePrioritizeCaseSequence as unknown as Function,
  validateRemoveFromTrialSessionSequence:
    validateRemoveFromTrialSessionSequence as unknown as Function,
  validateSelectDocumentTypeSequence:
    validateSelectDocumentTypeSequence as unknown as Function,
  validateSetForHearingSequence:
    validateSetForHearingSequence as unknown as Function,
  validateStampSequence: validateStampSequence as unknown as Function,
  validateStartCaseWizardSequence:
    validateStartCaseWizardSequence as unknown as Function,
  validateTrialSessionHearingNoteSequence:
    validateTrialSessionHearingNoteSequence as unknown as Function,
  validateTrialSessionNoteSequence:
    validateTrialSessionNoteSequence as unknown as Function,
  validateTrialSessionPlanningSequence:
    validateTrialSessionPlanningSequence as unknown as Function,
  validateTrialSessionSequence:
    validateTrialSessionSequence as unknown as Function,
  validateUpdateCaseModalSequence:
    validateUpdateCaseModalSequence as unknown as Function,
  validateUpdatePractitionerSequence:
    validateUpdatePractitionerSequence as unknown as Function,
  validateUploadCorrespondenceDocumentSequence:
    validateUploadCorrespondenceDocumentSequence as unknown as Function,
  validateUploadCourtIssuedDocumentSequence:
    validateUploadCourtIssuedDocumentSequence as unknown as Function,
  validateUserContactSequence:
    validateUserContactSequence as unknown as Function,
};

/**
 * Main Cerebral module
 */
export const presenter = {
  catch: [
    // ORDER MATTERS! Based on inheritance, the first match will be used
    [InvalidRequestError, setCurrentPageErrorSequence], // 418, other unknown 4xx series
    [ServerInvalidResponseError, setCurrentPageErrorSequence], // 501, 503, etc
    [UnauthorizedRequestError, unauthorizedErrorSequence], // 403
    [NotFoundError, notFoundErrorSequence], //404
    [UnidentifiedUserError, unidentifiedUserErrorSequence], //401
    [GatewayTimeoutError, gatewayTimeoutErrorSequence], //504
    [ActionError, setCurrentPageErrorSequence], // generic error handler
  ],
  providers: {},
  sequences: presenterSequences,
  state: initialState,
};

export type Sequences = typeof presenterSequences;

declare global {
  type ActionProps<
    Props = any,
    ApplicationContext = ClientApplicationContext,
  > = {
    applicationContext: ApplicationContext;
    get: <T>(slice: T) => T;
    store: {
      set: (key: any, value: any) => void;
      merge: (key: any, value: any) => void;
      unset: (key: any) => void;
    };
    path: any;
    props: Props;
    router: any;
  };
}
