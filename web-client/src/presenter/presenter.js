/* eslint-disable max-lines */
import { ActionError } from './errors/ActionError';
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
import { adminContactUpdateErrorSequence } from './sequences/adminContactUpdateErrorSequence';
import { adminContactUpdateInitialUpdateCompleteSequence } from './sequences/adminContactUpdateInitialUpdateCompleteSequence';
import { adminContactUpdateProgressSequence } from './sequences/adminContactUpdateProgressSequence';
import { advancedSearchTabChangeSequence } from './sequences/advancedSearchTabChangeSequence';
import { archiveDraftDocumentModalSequence } from './sequences/archiveDraftDocumentModalSequence';
import { archiveDraftDocumentSequence } from './sequences/archiveDraftDocumentSequence';
import { assignSelectedWorkItemsSequence } from './sequences/assignSelectedWorkItemsSequence';
import { associateIrsPractitionerWithCaseSequence } from './sequences/caseAssociation/associateIrsPractitionerWithCaseSequence';
import { associatePrivatePractitionerWithCaseSequence } from './sequences/caseAssociation/associatePrivatePractitionerWithCaseSequence';
import { autoSaveTrialSessionWorkingCopySequence } from './sequences/autoSaveTrialSessionWorkingCopySequence';
import { batchDownloadErrorSequence } from './sequences/batchDownloadErrorSequence';
import { batchDownloadReadySequence } from './sequences/batchDownloadReadySequence';
import { batchDownloadTrialSessionSequence } from './sequences/batchDownloadTrialSessionSequence';
import { blockCaseFromTrialSequence } from './sequences/blockCaseFromTrialSequence';
import { broadcastIdleStatusActiveSequence } from './sequences/broadcastIdleStatusActiveSequence';
import { broadcastStayLoggedInSequence } from './sequences/broadcastStayLoggedInSequence';
import { calculatePenaltiesForAddSequence } from './sequences/calculatePenaltiesForAddSequence';
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
import { changeTabAndSetViewerDocumentToDisplaySequence } from './sequences/changeTabAndSetViewerDocumentToDisplaySequence';
import { chooseModalWizardStepSequence } from './sequences/chooseModalWizardStepSequence';
import { chooseStartCaseWizardStepSequence } from './sequences/chooseStartCaseWizardStepSequence';
import { chooseWizardStepSequence } from './sequences/chooseWizardStepSequence';
import { chooseWorkQueueSequence } from './sequences/chooseWorkQueueSequence';
import { clearAdvancedSearchFormSequence } from './sequences/clearAdvancedSearchFormSequence';
import { clearAlertSequence } from './sequences/clearAlertSequence';
import { clearDropDownMenuStateSequence } from './sequences/clearDropDownMenuStateSequence';
import { clearExistingDocumentSequence } from './sequences/clearExistingDocumentSequence';
import { clearModalFormSequence } from './sequences/clearModalFormSequence';
import { clearModalSequence } from './sequences/clearModalSequence';
import { clearOpenClosedCasesCurrentPageSequence } from './sequences/clearOpenClosedCasesCurrentPageSequence';
import { clearPdfPreviewUrlSequence } from './sequences/clearPdfPreviewUrlSequence';
import { clearPreferredTrialCitySequence } from './sequences/clearPreferredTrialCitySequence';
import { clearViewerDocumentToDisplaySequence } from './sequences/clearViewerDocumentToDisplaySequence';
import { closeModalAndNavigateBackSequence } from './sequences/closeModalAndNavigateBackSequence';
import { closeModalAndNavigateSequence } from './sequences/closeModalAndNavigateSequence';
import { closeModalAndReturnToCaseDetailDraftDocumentsSequence } from './sequences/closeModalAndReturnToCaseDetailDraftDocumentsSequence';
import { closeModalAndReturnToCaseDetailSequence } from './sequences/closeModalAndReturnToCaseDetailSequence';
import { closeModalAndReturnToDashboardSequence } from './sequences/closeModalAndReturnToDashboardSequence';
import { closeModalAndReturnToTrialSessionsSequence } from './sequences/closeModalAndReturnToTrialSessionsSequence';
import { closeVerifyEmailModalAndNavigateToMyAccountSequence } from './sequences/closeVerifyEmailModalAndNavigateToMyAccountSequence';
import { closeVerifyEmailModalAndNavigateToPractitionerDetailSequence } from './sequences/closeVerifyEmailModalAndNavigateToPractitionerDetailSequence';
import { completeDocketEntryQCAndSendMessageSequence } from './sequences/completeDocketEntryQCAndSendMessageSequence';
import { completeDocketEntryQCSequence } from './sequences/completeDocketEntryQCSequence';
import { completeDocumentSelectSequence } from './sequences/completeDocumentSelectSequence';
import { completeMessageSequence } from './sequences/completeMessageSequence';
import { completePrintPaperPetitionReceiptSequence } from './sequences/completePrintPaperPetitionReceiptSequence';
import { completeStartCaseWizardStepSequence } from './sequences/completeStartCaseWizardStepSequence';
import { confirmStayLoggedInSequence } from './sequences/confirmStayLoggedInSequence';
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
import { deleteTrialSessionSequence } from './sequences/deleteTrialSessionSequence';
import { deleteUploadedPdfSequence } from './sequences/deleteUploadedPdfSequence';
import { deleteUserCaseNoteFromWorkingCopySequence } from './sequences/deleteUserCaseNoteFromWorkingCopySequence';
import { deleteWorkingCopySessionNoteSequence } from './sequences/deleteWorkingCopySessionNoteSequence';
import { dismissAlertSequence } from './sequences/dismissAlertSequence';
import { dismissCreateMessageModalSequence } from './sequences/dismissCreateMessageModalSequence';
import { dismissModalSequence } from './sequences/dismissModalSequence';
import { editCorrespondenceDocumentSequence } from './sequences/editCorrespondenceDocumentSequence';
import { editUploadCourtIssuedDocumentSequence } from './sequences/editUploadCourtIssuedDocumentSequence';
import { fetchUserNotificationsSequence } from './sequences/fetchUserNotificationsSequence';
import { filterCaseDeadlinesByJudgeSequence } from './sequences/filterCaseDeadlinesByJudgeSequence';
import { formCancelToggleCancelSequence } from './sequences/formCancelToggleCancelSequence';
import { forwardMessageSequence } from './sequences/forwardMessageSequence';
import { generateCaseCaptionSequence } from './sequences/generateCaseCaptionSequence';
import { generatePdfFromScanSessionSequence } from './sequences/generatePdfFromScanSessionSequence';
import { getBlockedCasesByTrialLocationSequence } from './sequences/getBlockedCasesByTrialLocationSequence';
import { getCaseInventoryReportSequence } from './sequences/getCaseInventoryReportSequence';
import { getUsersInSectionSequence } from './sequences/getUsersInSectionSequence';
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
import { gotoContactEditSequence } from './sequences/gotoContactEditSequence';
import { gotoContactSequence } from './sequences/gotoContactSequence';
import { gotoCreateOrderSequence } from './sequences/gotoCreateOrderSequence';
import { gotoCreatePractitionerUserSequence } from './sequences/gotoCreatePractitionerUserSequence';
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
import { gotoLoginSequence } from './sequences/gotoLoginSequence';
import { gotoMessageDetailSequence } from './sequences/gotoMessageDetailSequence';
import { gotoMessagesSequence } from './sequences/gotoMessagesSequence';
import { gotoMyAccountSequence } from './sequences/gotoMyAccountSequence';
import { gotoPdfPreviewSequence } from './sequences/gotoPdfPreviewSequence';
import { gotoPendingReportSequence } from './sequences/gotoPendingReportSequence';
import { gotoPetitionQcSequence } from './sequences/gotoPetitionQcSequence';
import { gotoPractitionerDetailSequence } from './sequences/gotoPractitionerDetailSequence';
import { gotoPrintPaperServiceSequence } from './sequences/gotoPrintPaperServiceSequence';
import { gotoPrintPractitionerCasesSequence } from './sequences/gotoPrintPractitionerCasesSequence';
import { gotoPrintableCaseConfirmationSequence } from './sequences/gotoPrintableCaseConfirmationSequence';
import { gotoPrintableCaseInventoryReportSequence } from './sequences/gotoPrintableCaseInventoryReportSequence';
import { gotoPrintableDocketRecordSequence } from './sequences/gotoPrintableDocketRecordSequence';
import { gotoPrintablePendingReportForCaseSequence } from './sequences/gotoPrintablePendingReportForCaseSequence';
import { gotoPrintablePendingReportSequence } from './sequences/gotoPrintablePendingReportSequence';
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
import { leaveCaseForLaterServiceSequence } from './sequences/leaveCaseForLaterServiceSequence';
import { loadDefaultDocketViewerDocumentToDisplaySequence } from './sequences/DocketEntry/loadDefaultDocketViewerDocumentToDisplaySequence';
import { loadDefaultDraftViewerDocumentToDisplaySequence } from './sequences/DocketEntry/loadDefaultDraftViewerDocumentToDisplaySequence';
import { loadDefaultViewerCorrespondenceSequence } from './sequences/loadDefaultViewerCorrespondenceSequence';
import { loadMoreCaseDeadlinesSequence } from './sequences/loadMoreCaseDeadlinesSequence';
import { loadMorePendingItemsSequence } from './sequences/loadMorePendingItemsSequence';
import { loadPdfSequence } from './sequences/PDFPreviewModal/loadPdfSequence';
import { loginWithCodeSequence } from './sequences/loginWithCodeSequence';
import { loginWithTokenSequence } from './sequences/loginWithTokenSequence';
import { navigateBackSequence } from './sequences/navigateBackSequence';
import { navigateToCaseDetailFromPaperServiceSequence } from './sequences/navigateToCaseDetailFromPaperServiceSequence';
import { navigateToCaseDetailSequence } from './sequences/navigateToCaseDetailSequence';
import { navigateToCaseDetailWithDraftDocumentSequence } from './sequences/navigateToCaseDetailWithDraftDocumentSequence';
import { navigateToEditOrderSequence } from './sequences/navigateToEditOrderSequence';
import { navigateToPathSequence } from './sequences/navigateToPathSequence';
import { navigateToPrintPaperServiceSequence } from './sequences/navigateToPrintPaperServiceSequence';
import { navigateToPrintableCaseConfirmationSequence } from './sequences/navigateToPrintableCaseConfirmationSequence';
import { notFoundErrorSequence } from './sequences/notFoundErrorSequence';
import { noticeGenerationCompleteSequence } from './sequences/noticeGenerationCompleteSequence';
import { openAddEditCalendarNoteModalSequence } from './sequences/openAddEditCalendarNoteModalSequence';
import { openAddEditCaseNoteModalSequence } from './sequences/openAddEditCaseNoteModalSequence';
import { openAddEditHearingNoteModalSequence } from './sequences/openAddEditHearingNoteModalSequence';
import { openAddEditSessionNoteModalSequence } from './sequences/openAddEditSessionNoteModalSequence';
import { openAddEditUserCaseNoteModalFromDetailSequence } from './sequences/openAddEditUserCaseNoteModalFromDetailSequence';
import { openAddEditUserCaseNoteModalFromListSequence } from './sequences/openAddEditUserCaseNoteModalFromListSequence';
import { openAddIrsPractitionerModalSequence } from './sequences/openAddIrsPractitionerModalSequence';
import { openAddPrivatePractitionerModalSequence } from './sequences/openAddPrivatePractitionerModalSequence';
import { openAddToTrialModalSequence } from './sequences/openAddToTrialModalSequence';
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
import { openConfirmInitiateServiceModalSequence } from './sequences/openConfirmInitiateServiceModalSequence';
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
import { openDeleteSessionNoteConfirmModalSequence } from './sequences/openDeleteSessionNoteConfirmModalSequence';
import { openDeleteUserCaseNoteConfirmModalSequence } from './sequences/openDeleteUserCaseNoteConfirmModalSequence';
import { openEditCaseDeadlineModalSequence } from './sequences/openEditCaseDeadlineModalSequence';
import { openEditOrderTitleModalSequence } from './sequences/openEditOrderTitleModalSequence';
import { openForwardMessageModalSequence } from './sequences/openForwardMessageModalSequence';
import { openGainElectronicAccessToCaseModalSequence } from './sequences/openGainElectronicAccessToCaseModalSequence';
import { openPdfPreviewModalSequence } from './sequences/openPdfPreviewModalSequence';
import { openPrioritizeCaseModalSequence } from './sequences/openPrioritizeCaseModalSequence';
import { openRemoveFromTrialSessionModalSequence } from './sequences/openRemoveFromTrialSessionModalSequence';
import { openRemovePetitionerCounselModalSequence } from './sequences/openRemovePetitionerCounselModalSequence';
import { openRemovePetitionerModalSequence } from './sequences/openRemovePetitionerModalSequence';
import { openRemoveRespondentCounselModalSequence } from './sequences/openRemoveRespondentCounselModalSequence';
import { openReplyToMessageModalSequence } from './sequences/openReplyToMessageModalSequence';
import { openSealAddressModalSequence } from './sequences/openSealAddressModalSequence';
import { openSetCalendarModalSequence } from './sequences/openSetCalendarModalSequence';
import { openSetForHearingModalSequence } from './sequences/openSetForHearingModalSequence';
import { openStrikeDocketEntryModalSequence } from './sequences/openStrikeDocketEntryModalSequence';
import { openTrialSessionPlanningModalSequence } from './sequences/openTrialSessionPlanningModalSequence';
import { openUnblockFromTrialModalSequence } from './sequences/openUnblockFromTrialModalSequence';
import { openUnprioritizeCaseModalSequence } from './sequences/openUnprioritizeCaseModalSequence';
import { openUpdateCaseModalSequence } from './sequences/openUpdateCaseModalSequence';
import { printTrialCalendarSequence } from './sequences/printTrialCalendarSequence';
import { prioritizeCaseSequence } from './sequences/prioritizeCaseSequence';
import { redirectToLoginSequence } from './sequences/redirectToLoginSequence';
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
import { reviewExternalDocumentInformationSequence } from './sequences/reviewExternalDocumentInformationSequence';
import { reviewRequestAccessInformationSequence } from './sequences/reviewRequestAccessInformationSequence';
import { runTrialSessionPlanningReportSequence } from './sequences/runTrialSessionPlanningReportSequence';
import { saveDocumentSigningSequence } from './sequences/saveDocumentSigningSequence';
import { saveSavedCaseForLaterSequence } from './sequences/saveSavedCaseForLaterSequence';
import { scannerStartupSequence } from './sequences/scannerStartupSequence';
import { sealAddressSequence } from './sequences/sealAddressSequence';
import { sealCaseSequence } from './sequences/sealCaseSequence';
import { selectAssigneeSequence } from './sequences/selectAssigneeSequence';
import { selectDateRangeFromCalendarSequence } from './sequences/selectDateRangeFromCalendarSequence';
import { selectDocumentForPreviewSequence } from './sequences/selectDocumentForPreviewSequence';
import { selectDocumentForScanSequence } from './sequences/selectDocumentForScanSequence';
import { selectScannerSequence } from './sequences/selectScannerSequence';
import { selectWorkItemSequence } from './sequences/selectWorkItemSequence';
import { serveCaseToIrsSequence } from './sequences/serveCaseToIrsSequence';
import { serveCourtIssuedDocumentFromDocketEntrySequence } from './sequences/serveCourtIssuedDocumentFromDocketEntrySequence';
import { serveCourtIssuedDocumentSequence } from './sequences/serveCourtIssuedDocumentSequence';
import { servePaperFiledDocumentSequence } from './sequences/servePaperFiledDocumentSequence';
import { setCaseDetailPageTabSequence } from './sequences/setCaseDetailPageTabSequence';
import { setCaseDetailPrimaryTabSequence } from './sequences/setCaseDetailPrimaryTabSequence';
import { setCaseTypeToDisplaySequence } from './sequences/setCaseTypeToDisplaySequence';
import { setCurrentPageErrorSequence } from './sequences/setCurrentPageErrorSequence';
import { setCurrentPageIndexSequence } from './sequences/setCurrentPageIndexSequence';
import { setDocumentForPreviewSequence } from './sequences/setDocumentForPreviewSequence';
import { setDocumentForUploadSequence } from './sequences/setDocumentForUploadSequence';
import { setDocumentUploadModeSequence } from './sequences/setDocumentUploadModeSequence';
import { setForHearingSequence } from './sequences/setForHearingSequence';
import { setIdleStatusActiveSequence } from './sequences/setIdleStatusActiveSequence';
import { setIdleStatusIdleSequence } from './sequences/setIdleStatusIdleSequence';
import { setIdleTimerRefSequence } from './sequences/setIdleTimerRefSequence';
import { setIrsNoticeFalseSequence } from './sequences/setIrsNoticeFalseSequence';
import { setMessageDetailViewerDocumentToDisplaySequence } from './sequences/setMessageDetailViewerDocumentToDisplaySequence';
import { setPDFPageForSigningSequence } from './sequences/setPDFPageForSigningSequence';
import { setPDFSignatureDataSequence } from './sequences/setPDFSignatureDataSequence';
import { setPdfPreviewUrlSequence } from './sequences/setPdfPreviewUrlSequence';
import { setPendingReportSelectedJudgeSequence } from './sequences/pending/setPendingReportSelectedJudgeSequence';
import { setSelectedAddressOnFormSequence } from './sequences/setSelectedAddressOnFormSequence';
import { setSelectedBatchIndexSequence } from './sequences/setSelectedBatchIndexSequence';
import { setSelectedCasesForConsolidatedCaseDocumentSubmissionSequence } from './sequences/setSelectedCasesForConsolidatedCaseDocumentSubmissionSequence';
import { setTrialSessionCalendarSequence } from './sequences/setTrialSessionCalendarSequence';
import { setViewerCorrespondenceToDisplaySequence } from './sequences/setViewerCorrespondenceToDisplaySequence';
import { setViewerDocumentToDisplaySequence } from './sequences/setViewerDocumentToDisplaySequence';
import { setViewerDraftDocumentToDisplaySequence } from './sequences/setViewerDraftDocumentToDisplaySequence';
import { showCalculatePenaltiesModalSequence } from './sequences/showCalculatePenaltiesModalSequence';
import { showDocketRecordDetailModalSequence } from './sequences/showDocketRecordDetailModalSequence';
import { showMoreClosedCasesSequence } from './sequences/showMoreClosedCasesSequence';
import { showMoreOpenCasesSequence } from './sequences/showMoreOpenCasesSequence';
import { showMoreResultsSequence } from './sequences/showMoreResultsSequence';
import { showViewPetitionerCounselModalSequence } from './sequences/showViewPetitionerCounselModalSequence';
import { signOutSequence } from './sequences/signOutSequence';
import { skipSigningOrderSequence } from './sequences/skipSigningOrderSequence';
import { startScanSequence } from './sequences/startScanSequence';
import { state } from './state';
import { strikeDocketEntrySequence } from './sequences/strikeDocketEntrySequence';
import { submitAddConsolidatedCaseSequence } from './sequences/submitAddConsolidatedCaseSequence';
import { submitAddDeficiencyStatisticsSequence } from './sequences/submitAddDeficiencyStatisticsSequence';
import { submitAddOtherStatisticsSequence } from './sequences/submitAddOtherStatisticsSequence';
import { submitAddPetitionerSequence } from './sequences/submitAddPetitionerSequence';
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
import { submitEditRespondentCounselSequence } from './sequences/submitEditRespondentCounselSequence';
import { submitExternalDocumentSequence } from './sequences/submitExternalDocumentSequence';
import { submitFilePetitionSequence } from './sequences/submitFilePetitionSequence';
import { submitLoginSequence } from './sequences/submitLoginSequence';
import { submitOpinionAdvancedSearchSequence } from './sequences/submitOpinionAdvancedSearchSequence';
import { submitOrderAdvancedSearchSequence } from './sequences/submitOrderAdvancedSearchSequence';
import { submitPaperFilingSequence } from './sequences/submitPaperFilingSequence';
import { submitPetitionFromPaperSequence } from './sequences/submitPetitionFromPaperSequence';
import { submitPractitionerBarNumberSearchSequence } from './sequences/submitPractitionerBarNumberSearchSequence';
import { submitPractitionerNameSearchSequence } from './sequences/submitPractitionerNameSearchSequence';
import { submitRemoveConsolidatedCasesSequence } from './sequences/submitRemoveConsolidatedCasesSequence';
import { submitTrialSessionSequence } from './sequences/submitTrialSessionSequence';
import { submitUpdateCaseModalSequence } from './sequences/submitUpdateCaseModalSequence';
import { submitUpdatePetitionerInformationFromModalSequence } from './sequences/submitUpdatePetitionerInformationFromModalSequence';
import { submitUpdatePractitionerUserSequence } from './sequences/submitUpdatePractitionerUserSequence';
import { submitUpdateUserContactInformationSequence } from './sequences/submitUpdateUserContactInformationSequence';
import { toggleBetaBarSequence } from './sequences/toggleBetaBarSequence';
import { toggleCaseDifferenceSequence } from './sequences/toggleCaseDifferenceSequence';
import { toggleMenuSequence } from './sequences/toggleMenuSequence';
import { toggleMenuStateSequence } from './sequences/toggleMenuStateSequence';
import { toggleMobileDocketSortSequence } from './sequences/toggleMobileDocketSortSequence';
import { toggleMobileMenuSequence } from './sequences/toggleMobileMenuSequence';
import { toggleUsaBannerDetailsSequence } from './sequences/toggleUsaBannerDetailsSequence';
import { toggleUseExistingAddressSequence } from './sequences/toggleUseExistingAddressSequence';
import { toggleWorkingCopySortSequence } from './sequences/toggleWorkingCopySortSequence';
import { unauthorizedErrorSequence } from './sequences/unauthorizedErrorSequence';
import { unblockCaseFromTrialSequence } from './sequences/unblockCaseFromTrialSequence';
import { unidentifiedUserErrorSequence } from './sequences/unidentifiedUserErrorSequence';
import { unprioritizeCaseSequence } from './sequences/unprioritizeCaseSequence';
import { updateAddDeficiencyFormValueSequence } from './sequences/updateAddDeficiencyFormValueSequence';
import { updateAdvancedOpinionSearchFormValueSequence } from './sequences/updateAdvancedOpinionSearchFormValueSequence';
import { updateAdvancedOrderSearchFormValueSequence } from './sequences/updateAdvancedOrderSearchFormValueSequence';
import { updateAdvancedSearchFormValueSequence } from './sequences/updateAdvancedSearchFormValueSequence';
import { updateBatchDownloadProgressSequence } from './sequences/updateBatchDownloadProgressSequence';
import { updateCalendarNoteSequence } from './sequences/updateCalendarNoteSequence';
import { updateCaseAssociationFormValueSequence } from './sequences/updateCaseAssociationFormValueSequence';
import { updateCaseDeadlineSequence } from './sequences/updateCaseDeadlineSequence';
import { updateCaseDetailsSequence } from './sequences/updateCaseDetailsSequence';
import { updateCaseNoteSequence } from './sequences/updateCaseNoteSequence';
import { updateCasePartyTypeSequence } from './sequences/updateCasePartyTypeSequence';
import { updateChambersInCreateMessageModalSequence } from './sequences/updateChambersInCreateMessageModalSequence';
import { updateCourtIssuedDocketEntryFormValueSequence } from './sequences/updateCourtIssuedDocketEntryFormValueSequence';
import { updateCreateOrderModalFormValueSequence } from './sequences/updateCreateOrderModalFormValueSequence';
import { updateDateRangeForDeadlinesSequence } from './sequences/updateDateRangeForDeadlinesSequence';
import { updateDocketEntryFormValueSequence } from './sequences/updateDocketEntryFormValueSequence';
import { updateDocketEntryMetaDocumentFormValueSequence } from './sequences/updateDocketEntryMetaDocumentFormValueSequence';
import { updateDocketNumberSearchFormSequence } from './sequences/updateDocketNumberSearchFormSequence';
import { updateFileDocumentWizardFormValueSequence } from './sequences/updateFileDocumentWizardFormValueSequence';
import { updateFormValueAndCaseCaptionSequence } from './sequences/updateFormValueAndCaseCaptionSequence';
import { updateFormValueAndSecondaryContactInfoSequence } from './sequences/updateFormValueAndSecondaryContactInfoSequence';
import { updateFormValueSequence } from './sequences/updateFormValueSequence';
import { updateHearingNoteSequence } from './sequences/updateHearingNoteSequence';
import { updateJudgesCaseNoteOnCaseDetailSequence } from './sequences/updateJudgesCaseNoteOnCaseDetailSequence';
import { updateMessageModalAttachmentsSequence } from './sequences/updateMessageModalAttachmentsSequence';
import { updateModalFormValueSequence } from './sequences/updateModalFormValueSequence';
import { updateModalValueSequence } from './sequences/updateModalValueSequence';
import { updateOrderForDesignatingPlaceOfTrialSequence } from './sequences/updateOrderForDesignatingPlaceOfTrialSequence';
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
import { validateAddIrsPractitionerSequence } from './sequences/caseAssociation/validateAddIrsPractitionerSequence';
import { validateAddPetitionerSequence } from './sequences/validateAddPetitionerSequence';
import { validateAddPractitionerSequence } from './sequences/validateAddPractitionerSequence';
import { validateAddPrivatePractitionerSequence } from './sequences/caseAssociation/validateAddPrivatePractitionerSequence';
import { validateAddToTrialSessionSequence } from './sequences/validateAddToTrialSessionSequence';
import { validateBlockFromTrialSequence } from './sequences/validateBlockFromTrialSequence';
import { validateCaseAdvancedSearchFormSequence } from './sequences/validateCaseAdvancedSearchFormSequence';
import { validateCaseAssociationRequestSequence } from './sequences/validateCaseAssociationRequestSequence';
import { validateCaseDeadlineSequence } from './sequences/validateCaseDeadlineSequence';
import { validateCaseDetailSequence } from './sequences/validateCaseDetailSequence';
import { validateCaseDetailsSequence } from './sequences/validateCaseDetailsSequence';
import { validateCaseDocketNumberSearchFormSequence } from './sequences/validateCaseDocketNumberSearchFormSequence';
import { validateCaseInventoryReportModalSequence } from './sequences/validateCaseInventoryReportModalSequence';
import { validateChangeLoginAndServiceEmailSequence } from './sequences/validateChangeLoginAndServiceEmailSequence';
import { validateCourtIssuedDocketEntrySequence } from './sequences/validateCourtIssuedDocketEntrySequence';
import { validateCreateMessageInModalSequence } from './sequences/validateCreateMessageInModalSequence';
import { validateDocketEntrySequence } from './sequences/validateDocketEntrySequence';
import { validateDocumentSequence } from './sequences/validateDocumentSequence';
import { validateEditPetitionerCounselSequence } from './sequences/caseAssociation/validateEditPetitionerCounselSequence';
import { validateEditRespondentCounselSequence } from './sequences/caseAssociation/validateEditRespondentCounselSequence';
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
    [ActionError, setCurrentPageErrorSequence], // generic error handler
  ],
  providers: {},
  sequences: {
    addCaseToTrialSessionSequence,
    addPenaltyInputSequence,
    addStatisticToFormSequence,
    addSupportingDocumentToFormSequence,
    adminContactUpdateCompleteSequence,
    adminContactUpdateErrorSequence,
    adminContactUpdateInitialUpdateCompleteSequence,
    adminContactUpdateProgressSequence,
    advancedSearchTabChangeSequence,
    archiveDraftDocumentModalSequence,
    archiveDraftDocumentSequence,
    assignSelectedWorkItemsSequence,
    associateIrsPractitionerWithCaseSequence,
    associatePrivatePractitionerWithCaseSequence,
    autoSaveTrialSessionWorkingCopySequence,
    batchDownloadErrorSequence,
    batchDownloadReadySequence,
    batchDownloadTrialSessionSequence,
    blockCaseFromTrialSequence,
    broadcastIdleStatusActiveSequence,
    broadcastStayLoggedInSequence,
    calculatePenaltiesForAddSequence,
    calculatePenaltiesSequence,
    canEditContactInformationSequence,
    cancelAddDraftDocumentSequence,
    cancelAddStatisticSequence,
    cancelAndNavigateToCorrespondenceSequence,
    cancelFileUploadSequence,
    cancelRemovePetitionerSequence,
    caseDetailPrimaryTabChangeSequence,
    caseInventoryReportLoadMoreSequence,
    cerebralBindSimpleSetStateSequence,
    changeTabAndSetViewerDocumentToDisplaySequence,
    chooseModalWizardStepSequence,
    chooseStartCaseWizardStepSequence,
    chooseWizardStepSequence,
    chooseWorkQueueSequence,
    clearAdvancedSearchFormSequence,
    clearAlertSequence,
    clearDropDownMenuStateSequence,
    clearExistingDocumentSequence,
    clearModalFormSequence,
    clearModalSequence,
    clearOpenClosedCasesCurrentPageSequence,
    clearPdfPreviewUrlSequence,
    clearPreferredTrialCitySequence,
    clearViewerDocumentToDisplaySequence,
    closeModalAndNavigateBackSequence,
    closeModalAndNavigateSequence,
    closeModalAndReturnToCaseDetailDraftDocumentsSequence,
    closeModalAndReturnToCaseDetailSequence,
    closeModalAndReturnToDashboardSequence,
    closeModalAndReturnToTrialSessionsSequence,
    closeVerifyEmailModalAndNavigateToMyAccountSequence,
    closeVerifyEmailModalAndNavigateToPractitionerDetailSequence,
    completeDocketEntryQCAndSendMessageSequence,
    completeDocketEntryQCSequence,
    completeDocumentSelectSequence,
    completeMessageSequence,
    completePrintPaperPetitionReceiptSequence,
    completeStartCaseWizardStepSequence,
    confirmStayLoggedInSequence,
    contactPrimaryCountryTypeChangeSequence,
    convertHtml2PdfSequence,
    copyPrimaryContactSequence,
    countryTypeUserContactChangeSequence,
    createCaseDeadlineSequence,
    createMessageSequence,
    deleteCalendarNoteSequence,
    deleteCaseDeadlineSequence,
    deleteCaseNoteSequence,
    deleteCorrespondenceDocumentSequence,
    deleteDeficiencyStatisticsSequence,
    deleteJudgesCaseNoteFromCaseDetailSequence,
    deleteOtherStatisticsSequence,
    deleteTrialSessionSequence,
    deleteUploadedPdfSequence,
    deleteUserCaseNoteFromWorkingCopySequence,
    deleteWorkingCopySessionNoteSequence,
    dismissAlertSequence,
    dismissCreateMessageModalSequence,
    dismissModalSequence,
    editCorrespondenceDocumentSequence,
    editUploadCourtIssuedDocumentSequence,
    fetchUserNotificationsSequence,
    filterCaseDeadlinesByJudgeSequence,
    formCancelToggleCancelSequence,
    forwardMessageSequence,
    generateCaseCaptionSequence,
    generatePdfFromScanSessionSequence,
    getBlockedCasesByTrialLocationSequence,
    getCaseInventoryReportSequence,
    getUsersInSectionSequence,
    gotoAccessibilityStatementSequence,
    gotoAddCourtIssuedDocketEntrySequence,
    gotoAddDeficiencyStatisticsSequence,
    gotoAddOtherStatisticsSequence,
    gotoAddPaperFilingSequence,
    gotoAddPetitionerToCaseSequence,
    gotoAddTrialSessionSequence,
    gotoAdvancedSearchSequence,
    gotoBeforeStartCaseSequence,
    gotoBeforeYouFileDocumentSequence,
    gotoBlockedCasesReportSequence,
    gotoCaseDeadlineReportSequence,
    gotoCaseDetailSequence,
    gotoCaseInventoryReportSequence,
    gotoCaseSearchNoMatchesSequence,
    gotoChangeLoginAndServiceEmailSequence,
    gotoContactEditSequence,
    gotoContactSequence,
    gotoCreateOrderSequence,
    gotoCreatePractitionerUserSequence,
    gotoDashboardSequence,
    gotoDocketEntryQcSequence,
    gotoEditCaseDetailsSequence,
    gotoEditCorrespondenceDocumentSequence,
    gotoEditCourtIssuedDocketEntrySequence,
    gotoEditDeficiencyStatisticSequence,
    gotoEditDocketEntryMetaSequence,
    gotoEditOrderSequence,
    gotoEditOtherStatisticsSequence,
    gotoEditPaperFilingSequence,
    gotoEditPetitionerCounselSequence,
    gotoEditPetitionerInformationInternalSequence,
    gotoEditPractitionerUserSequence,
    gotoEditRespondentCounselSequence,
    gotoEditTrialSessionSequence,
    gotoEditUploadCourtIssuedDocumentSequence,
    gotoFileDocumentSequence,
    gotoFilePetitionSuccessSequence,
    gotoIdleLogoutSequence,
    gotoLoginSequence,
    gotoMessageDetailSequence,
    gotoMessagesSequence,
    gotoMyAccountSequence,
    gotoPdfPreviewSequence,
    gotoPendingReportSequence,
    gotoPetitionQcSequence,
    gotoPractitionerDetailSequence,
    gotoPrintPaperServiceSequence,
    gotoPrintPractitionerCasesSequence,
    gotoPrintableCaseConfirmationSequence,
    gotoPrintableCaseInventoryReportSequence,
    gotoPrintableDocketRecordSequence,
    gotoPrintablePendingReportForCaseSequence,
    gotoPrintablePendingReportSequence,
    gotoPrivacySequence,
    gotoRequestAccessSequence,
    gotoReviewSavedPetitionSequence,
    gotoSignOrderSequence,
    gotoStartCaseWizardSequence,
    gotoStyleGuideSequence,
    gotoTrialSessionDetailSequence,
    gotoTrialSessionPlanningReportSequence,
    gotoTrialSessionWorkingCopySequence,
    gotoTrialSessionsSequence,
    gotoUploadCorrespondenceDocumentSequence,
    gotoUploadCourtIssuedDocumentSequence,
    gotoUserContactEditSequence,
    gotoVerifyEmailSequence,
    gotoViewAllDocumentsSequence,
    gotoWorkQueueSequence,
    leaveCaseForLaterServiceSequence,
    loadDefaultDocketViewerDocumentToDisplaySequence,
    loadDefaultDraftViewerDocumentToDisplaySequence,
    loadDefaultViewerCorrespondenceSequence,
    loadMoreCaseDeadlinesSequence,
    loadMorePendingItemsSequence,
    loadPdfSequence,
    loginWithCodeSequence,
    loginWithTokenSequence,
    navigateBackSequence,
    navigateToCaseDetailFromPaperServiceSequence,
    navigateToCaseDetailSequence,
    navigateToCaseDetailWithDraftDocumentSequence,
    navigateToEditOrderSequence,
    navigateToPathSequence,
    navigateToPrintPaperServiceSequence,
    navigateToPrintableCaseConfirmationSequence,
    notFoundErrorSequence,
    noticeGenerationCompleteSequence,
    openAddEditCalendarNoteModalSequence,
    openAddEditCaseNoteModalSequence,
    openAddEditHearingNoteModalSequence,
    openAddEditSessionNoteModalSequence,
    openAddEditUserCaseNoteModalFromDetailSequence,
    openAddEditUserCaseNoteModalFromListSequence,
    openAddIrsPractitionerModalSequence,
    openAddPrivatePractitionerModalSequence,
    openAddToTrialModalSequence,
    openBlockFromTrialModalSequence,
    openCancelDraftDocumentModalSequence,
    openCaseDifferenceModalSequence,
    openCaseDocumentDownloadUrlSequence,
    openCaseInNewTabSequence,
    openCaseInventoryReportModalSequence,
    openChangeScannerSourceModalSequence,
    openCleanModalSequence,
    openCompleteAndSendMessageModalSequence,
    openCompleteMessageModalSequence,
    openCompleteSelectDocumentTypeModalSequence,
    openConfirmDeleteBatchModalSequence,
    openConfirmDeleteCorrespondenceModalSequence,
    openConfirmDeleteDeficiencyStatisticsModalSequence,
    openConfirmDeleteOtherStatisticsModalSequence,
    openConfirmDeletePDFModalSequence,
    openConfirmDeleteTrialSessionModalSequence,
    openConfirmEditModalSequence,
    openConfirmInitiateServiceModalSequence,
    openConfirmPaperServiceModalSequence,
    openConfirmRemoveCaseDetailPendingItemModalSequence,
    openConfirmRemoveSignatureModalSequence,
    openConfirmReplacePetitionPdfSequence,
    openConfirmRescanBatchModalSequence,
    openConfirmServeCourtIssuedDocumentSequence,
    openConfirmServePaperFiledDocumentSequence,
    openConfirmServeToIrsModalSequence,
    openCreateCaseDeadlineModalSequence,
    openCreateMessageModalSequence,
    openCreateOrderChooseTypeModalSequence,
    openDeleteCaseDeadlineModalSequence,
    openDeleteCaseNoteConfirmModalSequence,
    openDeleteSessionNoteConfirmModalSequence,
    openDeleteUserCaseNoteConfirmModalSequence,
    openEditCaseDeadlineModalSequence,
    openEditOrderTitleModalSequence,
    openForwardMessageModalSequence,
    openGainElectronicAccessToCaseModalSequence,
    openPdfPreviewModalSequence,
    openPrioritizeCaseModalSequence,
    openRemoveFromTrialSessionModalSequence,
    openRemovePetitionerCounselModalSequence,
    openRemovePetitionerModalSequence,
    openRemoveRespondentCounselModalSequence,
    openReplyToMessageModalSequence,
    openSealAddressModalSequence,
    openSetCalendarModalSequence,
    openSetForHearingModalSequence,
    openStrikeDocketEntryModalSequence,
    openTrialSessionPlanningModalSequence,
    openUnblockFromTrialModalSequence,
    openUnprioritizeCaseModalSequence,
    openUpdateCaseModalSequence,
    printTrialCalendarSequence,
    prioritizeCaseSequence,
    redirectToLoginSequence,
    refreshPdfSequence,
    refreshStatisticsSequence,
    removeBatchSequence,
    removeCaseDetailPendingItemSequence,
    removeCaseFromTrialSequence,
    removePetitionForReplacementSequence,
    removePetitionerAndUpdateCaptionSequence,
    removePetitionerCounselFromCaseSequence,
    removeRespondentCounselFromCaseSequence,
    removeScannedPdfSequence,
    removeSecondarySupportingDocumentSequence,
    removeSignatureSequence,
    removeSupportingDocumentSequence,
    replyToMessageSequence,
    rescanBatchSequence,
    resetCaseMenuSequence,
    resetHeaderAccordionsSequence,
    resetIdleTimerSequence,
    reviewExternalDocumentInformationSequence,
    reviewRequestAccessInformationSequence,
    runTrialSessionPlanningReportSequence,
    saveDocumentSigningSequence,
    saveSavedCaseForLaterSequence,
    scannerStartupSequence,
    sealAddressSequence,
    sealCaseSequence,
    selectAssigneeSequence,
    selectDateRangeFromCalendarSequence,
    selectDocumentForPreviewSequence,
    selectDocumentForScanSequence,
    selectScannerSequence,
    selectWorkItemSequence,
    serveCaseToIrsSequence,
    serveCourtIssuedDocumentFromDocketEntrySequence,
    serveCourtIssuedDocumentSequence,
    servePaperFiledDocumentSequence,
    setCaseDetailPageTabSequence,
    setCaseDetailPrimaryTabSequence,
    setCaseTypeToDisplaySequence,
    setCurrentPageIndexSequence,
    setDocumentForPreviewSequence,
    setDocumentForUploadSequence,
    setDocumentUploadModeSequence,
    setForHearingSequence,
    setIdleStatusActiveSequence,
    setIdleStatusIdleSequence,
    setIdleTimerRefSequence,
    setIrsNoticeFalseSequence,
    setMessageDetailViewerDocumentToDisplaySequence,
    setPDFPageForSigningSequence,
    setPDFSignatureDataSequence,
    setPdfPreviewUrlSequence,
    setPendingReportSelectedJudgeSequence,
    setSelectedAddressOnFormSequence,
    setSelectedBatchIndexSequence,
    setSelectedCasesForConsolidatedCaseDocumentSubmissionSequence,
    setTrialSessionCalendarSequence,
    setViewerCorrespondenceToDisplaySequence,
    setViewerDocumentToDisplaySequence,
    setViewerDraftDocumentToDisplaySequence,
    showCalculatePenaltiesModalSequence,
    showDocketRecordDetailModalSequence,
    showMoreClosedCasesSequence,
    showMoreOpenCasesSequence,
    showMoreResultsSequence,
    showViewPetitionerCounselModalSequence,
    signOutSequence,
    skipSigningOrderSequence,
    startScanSequence,
    strikeDocketEntrySequence,
    submitAddConsolidatedCaseSequence,
    submitAddDeficiencyStatisticsSequence,
    submitAddOtherStatisticsSequence,
    submitAddPetitionerSequence,
    submitAddPractitionerSequence,
    submitCaseAdvancedSearchSequence,
    submitCaseAssociationRequestSequence,
    submitCaseDocketNumberSearchSequence,
    submitCaseInventoryReportModalSequence,
    submitCaseSearchForConsolidationSequence,
    submitCaseSearchSequence,
    submitChangeLoginAndServiceEmailSequence,
    submitCourtIssuedDocketEntrySequence,
    submitCourtIssuedOrderSequence,
    submitCreateOrderModalSequence,
    submitEditContactSequence,
    submitEditDeficiencyStatisticSequence,
    submitEditDocketEntryMetaSequence,
    submitEditOrderTitleModalSequence,
    submitEditOtherStatisticsSequence,
    submitEditPetitionerCounselSequence,
    submitEditPetitionerSequence,
    submitEditRespondentCounselSequence,
    submitExternalDocumentSequence,
    submitFilePetitionSequence,
    submitLoginSequence,
    submitOpinionAdvancedSearchSequence,
    submitOrderAdvancedSearchSequence,
    submitPaperFilingSequence,
    submitPetitionFromPaperSequence,
    submitPractitionerBarNumberSearchSequence,
    submitPractitionerNameSearchSequence,
    submitRemoveConsolidatedCasesSequence,
    submitTrialSessionSequence,
    submitUpdateCaseModalSequence,
    submitUpdatePetitionerInformationFromModalSequence,
    submitUpdatePractitionerUserSequence,
    submitUpdateUserContactInformationSequence,
    toggleBetaBarSequence,
    toggleCaseDifferenceSequence,
    toggleMenuSequence,
    toggleMenuStateSequence,
    toggleMobileDocketSortSequence,
    toggleMobileMenuSequence,
    toggleUsaBannerDetailsSequence,
    toggleUseExistingAddressSequence,
    toggleWorkingCopySortSequence,
    unauthorizedErrorSequence,
    unblockCaseFromTrialSequence,
    unidentifiedUserErrorSequence,
    unprioritizeCaseSequence,
    updateAddDeficiencyFormValueSequence,
    updateAdvancedOpinionSearchFormValueSequence,
    updateAdvancedOrderSearchFormValueSequence,
    updateAdvancedSearchFormValueSequence,
    updateBatchDownloadProgressSequence,
    updateCalendarNoteSequence,
    updateCaseAssociationFormValueSequence,
    updateCaseDeadlineSequence,
    updateCaseDetailsSequence,
    updateCaseNoteSequence,
    updateCasePartyTypeSequence,
    updateChambersInCreateMessageModalSequence,
    updateCourtIssuedDocketEntryFormValueSequence,
    updateCreateOrderModalFormValueSequence,
    updateDateRangeForDeadlinesSequence,
    updateDocketEntryFormValueSequence,
    updateDocketEntryMetaDocumentFormValueSequence,
    updateDocketNumberSearchFormSequence,
    updateFileDocumentWizardFormValueSequence,
    updateFormValueAndCaseCaptionSequence,
    updateFormValueAndSecondaryContactInfoSequence,
    updateFormValueSequence,
    updateHearingNoteSequence,
    updateJudgesCaseNoteOnCaseDetailSequence,
    updateMessageModalAttachmentsSequence,
    updateModalFormValueSequence,
    updateModalValueSequence,
    updateOrderForDesignatingPlaceOfTrialSequence,
    updatePartyViewTabSequence,
    updatePetitionPaymentFormValueSequence,
    updateQcCompleteForTrialSequence,
    updateScreenMetadataSequence,
    updateSearchTermSequence,
    updateSectionInCreateMessageModalSequence,
    updateSessionMetadataSequence,
    updateStartCaseFormValueSequence,
    updateStartCaseInternalPartyTypeSequence,
    updateStatisticsFormValueSequence,
    updateTrialSessionFormDataSequence,
    updateTrialSessionSequence,
    updateUserCaseNoteOnWorkingCopySequence,
    updateWorkingCopySessionNoteSequence,
    uploadCorrespondenceDocumentSequence,
    uploadCourtIssuedDocumentSequence,
    userContactUpdateCompleteSequence,
    userContactUpdateErrorSequence,
    userContactUpdateInitialUpdateCompleteSequence,
    userContactUpdateProgressSequence,
    validateAddDeficiencyStatisticsSequence,
    validateAddIrsPractitionerSequence,
    validateAddPetitionerSequence,
    validateAddPractitionerSequence,
    validateAddPrivatePractitionerSequence,
    validateAddToTrialSessionSequence,
    validateBlockFromTrialSequence,
    validateCaseAdvancedSearchFormSequence,
    validateCaseAssociationRequestSequence,
    validateCaseDeadlineSequence,
    validateCaseDetailSequence,
    validateCaseDetailsSequence,
    validateCaseDocketNumberSearchFormSequence,
    validateCaseInventoryReportModalSequence,
    validateChangeLoginAndServiceEmailSequence,
    validateCourtIssuedDocketEntrySequence,
    validateCreateMessageInModalSequence,
    validateDocketEntrySequence,
    validateDocumentSequence,
    validateEditPetitionerCounselSequence,
    validateEditRespondentCounselSequence,
    validateExternalDocumentInformationSequence,
    validateNoteSequence,
    validateOpinionSearchSequence,
    validateOrderSearchSequence,
    validateOrderWithoutBodySequence,
    validatePetitionFromPaperSequence,
    validatePetitionerSequence,
    validatePractitionerSearchByBarNumberFormSequence,
    validatePractitionerSearchByNameFormSequence,
    validatePrioritizeCaseSequence,
    validateRemoveFromTrialSessionSequence,
    validateSelectDocumentTypeSequence,
    validateSetForHearingSequence,
    validateStartCaseWizardSequence,
    validateTrialSessionHearingNoteSequence,
    validateTrialSessionNoteSequence,
    validateTrialSessionPlanningSequence,
    validateTrialSessionSequence,
    validateUpdateCaseModalSequence,
    validateUpdatePractitionerSequence,
    validateUploadCorrespondenceDocumentSequence,
    validateUploadCourtIssuedDocumentSequence,
    validateUserContactSequence,
  },
  state,
};
