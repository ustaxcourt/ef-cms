import { ActionError } from './errors/ActionError';
import { InvalidRequestError } from './errors/InvalidRequestError';
import { NotFoundError } from './errors/NotFoundError';
import { ServerInvalidResponseError } from './errors/ServerInvalidResponseError';
import { UnauthorizedRequestError } from './errors/UnauthorizedRequestError';
import { UnidentifiedUserError } from './errors/UnidentifiedUserError';
import { addCaseToTrialSessionSequence } from './sequences/addCaseToTrialSessionSequence';
import { addSupportingDocumentToFormSequence } from './sequences/addSupportingDocumentToFormSequence';
import { archiveDraftDocumentModalSequence } from './sequences/archiveDraftDocumentModalSequence';
import { archiveDraftDocumentSequence } from './sequences/archiveDraftDocumentSequence';
import { assignSelectedWorkItemsSequence } from './sequences/assignSelectedWorkItemsSequence';
import { associatePractitionerWithCaseSequence } from './sequences/caseAssociation/associatePractitionerWithCaseSequence';
import { associateRespondentWithCaseSequence } from './sequences/caseAssociation/associateRespondentWithCaseSequence';
import { autoSaveTrialSessionWorkingCopySequence } from './sequences/autoSaveTrialSessionWorkingCopySequence';
import { batchDownloadReadySequence } from './sequences/batchDownloadReadySequence';
import { batchDownloadTrialSessionSequence } from './sequences/batchDownloadTrialSessionSequence';
import { blockCaseFromTrialSequence } from './sequences/blockCaseFromTrialSequence';
import { cancelAddDraftDocumentSequence } from './sequences/cancelAddDraftDocumentSequence';
import { cancelEditPrimaryContactSequence } from './sequences/cancelEditPrimaryContactSequence';
import { cancelFileUploadSequence } from './sequences/cancelFileUploadSequence';
import { cerebralBindSimpleSetStateSequence } from './sequences/cerebralBindSimpleSetStateSequence';
import { chooseModalWizardStepSequence } from './sequences/chooseModalWizardStepSequence';
import { chooseStartCaseWizardStepSequence } from './sequences/chooseStartCaseWizardStepSequence';
import { chooseWizardStepSequence } from './sequences/chooseWizardStepSequence';
import { chooseWorkQueueSequence } from './sequences/chooseWorkQueueSequence';
import { clearAdvancedSearchFormSequence } from './sequences/clearAdvancedSearchFormSequence';
import { clearAlertSequence } from './sequences/clearAlertSequence';
import { clearDocketNumberSearchFormSequence } from './sequences/clearDocketNumberSearchFormSequence';
import { clearDocumentSequence } from './sequences/clearDocumentSequence';
import { clearModalFormSequence } from './sequences/clearModalFormSequence';
import { clearModalSequence } from './sequences/clearModalSequence';
import { clearPdfPreviewUrlSequence } from './sequences/clearPdfPreviewUrlSequence';
import { clearPreferredTrialCitySequence } from './sequences/clearPreferredTrialCitySequence';
import { clearWizardDataSequence } from './sequences/clearWizardDataSequence';
import { clickServeToIrsSequence } from './sequences/clickServeToIrsSequence';
import { closeModalAndReturnToCaseDetailSequence } from './sequences/closeModalAndReturnToCaseDetailSequence';
import { closeModalAndReturnToDashboardSequence } from './sequences/closeModalAndReturnToDashboardSequence';
import { closeModalAndReturnToTrialSessionsSequence } from './sequences/closeModalAndReturnToTrialSessionsSequence';
import { completeDocketEntryQCAndSendMessageSequence } from './sequences/completeDocketEntryQCAndSendMessageSequence';
import { completeDocketEntryQCSequence } from './sequences/completeDocketEntryQCSequence';
import { completeDocumentSelectSequence } from './sequences/completeDocumentSelectSequence';
import { completeDocumentSigningSequence } from './sequences/completeDocumentSigningSequence';
import { completeStartCaseWizardStepSequence } from './sequences/completeStartCaseWizardStepSequence';
import { confirmStayLoggedInSequence } from './sequences/confirmStayLoggedInSequence';
import { convertHtml2PdfSequence } from './sequences/convertHtml2PdfSequence';
import { countryTypeChangeSequence } from './sequences/countryTypeChangeSequence';
import { countryTypeUserContactChangeSequence } from './sequences/countryTypeUserContactChangeSequence';
import { createCaseDeadlineSequence } from './sequences/createCaseDeadlineSequence';
import { createWorkItemSequence } from './sequences/createWorkItemSequence';
import { deleteCaseDeadlineSequence } from './sequences/deleteCaseDeadlineSequence';
import { deleteCaseNoteFromCaseDetailSequence } from './sequences/deleteCaseNoteFromCaseDetailSequence';
import { deleteCaseNoteFromWorkingCopySequence } from './sequences/deleteCaseNoteFromWorkingCopySequence';
import { deleteWorkingCopySessionNoteSequence } from './sequences/deleteWorkingCopySessionNoteSequence';
import { dismissAlertSequence } from './sequences/dismissAlertSequence';
import { dismissCreateMessageModalSequence } from './sequences/dismissCreateMessageModalSequence';
import { dismissModalSequence } from './sequences/dismissModalSequence';
import { editSelectedDocumentSequence } from './sequences/editSelectedDocumentSequence';
import { editSelectedSecondaryDocumentSequence } from './sequences/editSelectedSecondaryDocumentSequence';
import { fetchPendingItemsSequence } from './sequences/pending/fetchPendingItemsSequence';
import { fetchUserNotificationsSequence } from './sequences/fetchUserNotificationsSequence';
import { formCancelToggleCancelSequence } from './sequences/formCancelToggleCancelSequence';
import { generatePdfFromScanSessionSequence } from './sequences/generatePdfFromScanSessionSequence';
import { getBlockedCasesByTrialLocationSequence } from './sequences/getBlockedCasesByTrialLocationSequence';
import { getUsersInSectionSequence } from './sequences/getUsersInSectionSequence';
import { gotoAddCourtIssuedDocketEntrySequence } from './sequences/gotoAddCourtIssuedDocketEntrySequence';
import { gotoAddDocketEntrySequence } from './sequences/gotoAddDocketEntrySequence';
import { gotoAddTrialSessionSequence } from './sequences/gotoAddTrialSessionSequence';
import { gotoAdvancedSearchSequence } from './sequences/gotoAdvancedSearchSequence';
import { gotoAllCaseDeadlinesSequence } from './sequences/gotoAllCaseDeadlinesSequence';
import { gotoBeforeStartCaseSequence } from './sequences/gotoBeforeStartCaseSequence';
import { gotoBeforeYouFileDocumentSequence } from './sequences/gotoBeforeYouFileDocumentSequence';
import { gotoBlockedCasesReportSequence } from './sequences/gotoBlockedCasesReportSequence';
import { gotoCaseDetailSequence } from './sequences/gotoCaseDetailSequence';
import { gotoCaseSearchNoMatchesSequence } from './sequences/gotoCaseSearchNoMatchesSequence';
import { gotoCompleteDocketEntrySequence } from './sequences/gotoCompleteDocketEntrySequence';
import { gotoCreateOrderSequence } from './sequences/gotoCreateOrderSequence';
import { gotoDashboardSequence } from './sequences/gotoDashboardSequence';
import { gotoDocumentDetailSequence } from './sequences/gotoDocumentDetailSequence';
import { gotoEditCourtIssuedDocketEntrySequence } from './sequences/gotoEditCourtIssuedDocketEntrySequence';
import { gotoEditDocketEntrySequence } from './sequences/gotoEditDocketEntrySequence';
import { gotoEditOrderSequence } from './sequences/gotoEditOrderSequence';
import { gotoFileDocumentSequence } from './sequences/gotoFileDocumentSequence';
import { gotoIdleLogoutSequence } from './sequences/gotoIdleLogoutSequence';
import { gotoLoginSequence } from './sequences/gotoLoginSequence';
import { gotoMessagesSequence } from './sequences/gotoMessagesSequence';
import { gotoOrdersNeededSequence } from './sequences/gotoOrdersNeededSequence';
import { gotoPendingReportSequence } from './sequences/gotoPendingReportSequence';
import { gotoPrimaryContactEditSequence } from './sequences/gotoPrimaryContactEditSequence';
import { gotoPrintableCaseConfirmationSequence } from './sequences/gotoPrintableCaseConfirmationSequence';
import { gotoPrintableDocketRecordSequence } from './sequences/gotoPrintableDocketRecordSequence';
import { gotoPrintablePendingReportSequence } from './sequences/gotoPrintablePendingReportSequence';
import { gotoRequestAccessSequence } from './sequences/gotoRequestAccessSequence';
import { gotoSelectDocumentTypeSequence } from './sequences/gotoSelectDocumentTypeSequence';
import { gotoSignOrderSequence } from './sequences/gotoSignOrderSequence';
import { gotoSignPDFDocumentSequence } from './sequences/gotoSignPDFDocumentSequence';
import { gotoStartCaseWizardSequence } from './sequences/gotoStartCaseWizardSequence';
import { gotoStyleGuideSequence } from './sequences/gotoStyleGuideSequence';
import { gotoTrialSessionDetailSequence } from './sequences/gotoTrialSessionDetailSequence';
import { gotoTrialSessionWorkingCopySequence } from './sequences/gotoTrialSessionWorkingCopySequence';
import { gotoTrialSessionsSequence } from './sequences/gotoTrialSessionsSequence';
import { gotoUserContactEditSequence } from './sequences/gotoUserContactEditSequence';
import { gotoViewAllDocumentsSequence } from './sequences/gotoViewAllDocumentsSequence';
import { loadOriginalProposedStipulatedDecisionSequence } from './sequences/loadOriginalProposedStipulatedDecisionSequence';
import { loadPdfSequence } from './sequences/PDFPreviewModal/loadPdfSequence';
import { loginWithCodeSequence } from './sequences/loginWithCodeSequence';
import { loginWithTokenSequence } from './sequences/loginWithTokenSequence';
import { navigateBackSequence } from './sequences/navigateBackSequence';
import { navigateToCaseDetailSequence } from './sequences/navigateToCaseDetailSequence';
import { navigateToEditOrderSequence } from './sequences/navigateToEditOrderSequence';
import { navigateToPathSequence } from './sequences/navigateToPathSequence';
import { navigateToPrintableCaseConfirmationSequence } from './sequences/navigateToPrintableCaseConfirmationSequence';
import { navigateToPrintableDocketRecordSequence } from './sequences/navigateToPrintableDocketRecordSequence';
import { notFoundErrorSequence } from './sequences/notFoundErrorSequence';
import { openAddEditCaseNoteModalFromDetailSequence } from './sequences/openAddEditCaseNoteModalFromDetailSequence';
import { openAddEditCaseNoteModalFromListSequence } from './sequences/openAddEditCaseNoteModalFromListSequence';
import { openAddEditSessionNoteModalSequence } from './sequences/openAddEditSessionNoteModalSequence';
import { openAddPractitionerModalSequence } from './sequences/openAddPractitionerModalSequence';
import { openAddRespondentModalSequence } from './sequences/openAddRespondentModalSequence';
import { openAddToTrialModalSequence } from './sequences/openAddToTrialModalSequence';
import { openBlockFromTrialModalSequence } from './sequences/openBlockFromTrialModalSequence';
import { openCancelDraftDocumentModalSequence } from './sequences/openCancelDraftDocumentModalSequence';
import { openCaseDifferenceModalSequence } from './sequences/openCaseDifferenceModalSequence';
import { openChangeScannerSourceModalSequence } from './sequences/openChangeScannerSourceModalSequence';
import { openCleanModalSequence } from './sequences/openCleanModalSequence';
import { openCompleteSelectDocumentTypeModalSequence } from './sequences/openCompleteSelectDocumentTypeModalSequence';
import { openConfirmDeleteBatchModalSequence } from './sequences/openConfirmDeleteBatchModalSequence';
import { openConfirmDeletePDFModalSequence } from './sequences/openConfirmDeletePDFModalSequence';
import { openConfirmEditModalSequence } from './sequences/openConfirmEditModalSequence';
import { openConfirmInitiateServiceModalSequence } from './sequences/openConfirmInitiateServiceModalSequence';
import { openConfirmRemoveCaseDetailPendingItemModalSequence } from './sequences/openConfirmRemoveCaseDetailPendingItemModalSequence';
import { openConfirmRescanBatchModalSequence } from './sequences/openConfirmRescanBatchModalSequence';
import { openCreateCaseDeadlineModalSequence } from './sequences/openCreateCaseDeadlineModalSequence';
import { openCreateMessageAlongsideDocketRecordQCModalSequence } from './sequences/openCreateMessageAlongsideDocketRecordQCModalSequence';
import { openCreateMessageModalSequence } from './sequences/openCreateMessageModalSequence';
import { openCreateOrderChooseTypeModalSequence } from './sequences/openCreateOrderChooseTypeModalSequence';
import { openDeleteCaseDeadlineModalSequence } from './sequences/openDeleteCaseDeadlineModalSequence';
import { openDeleteCaseNoteConfirmModalSequence } from './sequences/openDeleteCaseNoteConfirmModalSequence';
import { openDeleteSessionNoteConfirmModalSequence } from './sequences/openDeleteSessionNoteConfirmModalSequence';
import { openEditCaseDeadlineModalSequence } from './sequences/openEditCaseDeadlineModalSequence';
import { openEditPractitionersModalSequence } from './sequences/openEditPractitionersModalSequence';
import { openEditRespondentsModalSequence } from './sequences/openEditRespondentsModalSequence';
import { openEditSecondaryContactModalSequence } from './sequences/openEditSecondaryContactModalSequence';
import { openPdfPreviewModalSequence } from './sequences/openPdfPreviewModalSequence';
import { openPrioritizeCaseModalSequence } from './sequences/openPrioritizeCaseModalSequence';
import { openRemoveFromTrialSessionModalSequence } from './sequences/openRemoveFromTrialSessionModalSequence';
import { openSelectDocumentWizardOverlaySequence } from './sequences/openSelectDocumentWizardOverlaySequence';
import { openSetCalendarModalSequence } from './sequences/openSetCalendarModalSequence';
import { openTrialSessionPlanningModalSequence } from './sequences/openTrialSessionPlanningModalSequence';
import { openUnblockFromTrialModalSequence } from './sequences/openUnblockFromTrialModalSequence';
import { openUnprioritizeCaseModalSequence } from './sequences/openUnprioritizeCaseModalSequence';
import { openUpdateCaseModalSequence } from './sequences/openUpdateCaseModalSequence';
import { printDocketRecordSequence } from './sequences/printDocketRecordSequence';
import { printFromBrowserSequence } from './sequences/printFromBrowserSequence';
import { printTrialCalendarSequence } from './sequences/printTrialCalendarSequence';
import { prioritizeCaseSequence } from './sequences/prioritizeCaseSequence';
import { redirectToLoginSequence } from './sequences/redirectToLoginSequence';
import { refreshCaseSequence } from './sequences/refreshCaseSequence';
import { removeBatchSequence } from './sequences/removeBatchSequence';
import { removeCaseDetailPendingItemSequence } from './sequences/removeCaseDetailPendingItemSequence';
import { removeCaseFromTrialSequence } from './sequences/removeCaseFromTrialSequence';
import { removeScannedPdfSequence } from './sequences/removeScannedPdfSequence';
import { removeSecondarySupportingDocumentSequence } from './sequences/removeSecondarySupportingDocumentSequence';
import { removeSignatureFromOrderSequence } from './sequences/removeSignatureFromOrderSequence';
import { removeSupportingDocumentSequence } from './sequences/removeSupportingDocumentSequence';
import { rescanBatchSequence } from './sequences/rescanBatchSequence';
import { resetHeaderAccordionsSequence } from './sequences/resetHeaderAccordionsSequence';
import { reviewExternalDocumentInformationSequence } from './sequences/reviewExternalDocumentInformationSequence';
import { reviewRequestAccessInformationSequence } from './sequences/reviewRequestAccessInformationSequence';
import { runBatchProcessSequence } from './sequences/runBatchProcessSequence';
import { runTrialSessionPlanningReportSequence } from './sequences/runTrialSessionPlanningReportSequence';
import { saveDocumentSigningSequence } from './sequences/saveDocumentSigningSequence';
import { saveIntermediateDocketEntrySequence } from './sequences/saveIntermediateDocketEntrySequence';
import { scannerShutdownSequence } from './sequences/scannerShutdownSequence';
import { scannerStartupSequence } from './sequences/scannerStartupSequence';
import { selectAssigneeSequence } from './sequences/selectAssigneeSequence';
import { selectDateRangeFromCalendarSequence } from './sequences/selectDateRangeFromCalendarSequence';
import { selectDocumentForPreviewSequence } from './sequences/selectDocumentForPreviewSequence';
import { selectDocumentForScanSequence } from './sequences/selectDocumentForScanSequence';
import { selectDocumentSequence } from './sequences/selectDocumentSequence';
import { selectScannerSequence } from './sequences/selectScannerSequence';
import { selectSecondaryDocumentSequence } from './sequences/selectSecondaryDocumentSequence';
import { selectWorkItemSequence } from './sequences/selectWorkItemSequence';
import { serveCourtIssuedDocumentSequence } from './sequences/serveCourtIssuedDocumentSequence';
import { setCanvasForPDFSigningSequence } from './sequences/setCanvasForPDFSigningSequence';
import { setCaseDetailPageTabSequence } from './sequences/setCaseDetailPageTabSequence';
import { setCurrentPageErrorSequence } from './sequences/setCurrentPageErrorSequence';
import { setCurrentPageIndexSequence } from './sequences/setCurrentPageIndexSequence';
import { setDocumentDetailTabSequence } from './sequences/setDocumentDetailTabSequence';
import { setDocumentForUploadSequence } from './sequences/setDocumentForUploadSequence';
import { setDocumentUploadModeSequence } from './sequences/setDocumentUploadModeSequence';
import { setFieldOrderSequence } from './sequences/setFieldOrderSequence';
import { setFocusedWorkItemSequence } from './sequences/setFocusedWorkItemSequence';
import { setFormSubmittingSequence } from './sequences/setFormSubmittingSequence';
import { setIdleStatusIdleSequence } from './sequences/setIdleStatusIdleSequence';
import { setIrsNoticeFalseSequence } from './sequences/setIrsNoticeFalseSequence';
import { setModalDialogNameSequence } from './sequences/setModalDialogNameSequence';
import { setPDFPageForSigningSequence } from './sequences/setPDFPageForSigningSequence';
import { setPDFSignatureDataSequence } from './sequences/setPDFSignatureDataSequence';
import { setPageSequence } from './sequences/PDFPreviewModal/setPageSequence';
import { setPdfPreviewUrlSequence } from './sequences/setPdfPreviewUrlSequence';
import { setScannerSourceSequence } from './sequences/setScannerSourceSequence';
import { setSelectedBatchIndexSequence } from './sequences/setSelectedBatchIndexSequence';
import { setTrialSessionCalendarSequence } from './sequences/setTrialSessionCalendarSequence';
import { setWorkItemActionSequence } from './sequences/setWorkItemActionSequence';
import { setWorkQueueIsInternalSequence } from './sequences/setWorkQueueIsInternalSequence';
import { showDocketRecordDetailModalSequence } from './sequences/showDocketRecordDetailModalSequence';
import { showMoreResultsSequence } from './sequences/showMoreResultsSequence';
import { signOutSequence } from './sequences/signOutSequence';
import { startScanSequence } from './sequences/startScanSequence';
import { state } from './state';
import { submitCaseAdvancedSearchSequence } from './sequences/submitCaseAdvancedSearchSequence';
import { submitCaseAssociationRequestSequence } from './sequences/submitCaseAssociationRequestSequence';
import { submitCaseDetailEditSaveSequence } from './sequences/submitCaseDetailEditSaveSequence';
import { submitCaseDocketNumberSearchSequence } from './sequences/submitCaseDocketNumberSearchSequence';
import { submitCaseSearchSequence } from './sequences/submitCaseSearchSequence';
import { submitCompleteSequence } from './sequences/submitCompleteSequence';
import { submitCourtIssuedDocketEntrySequence } from './sequences/submitCourtIssuedDocketEntrySequence';
import { submitCourtIssuedOrderSequence } from './sequences/submitCourtIssuedOrderSequence';
import { submitCreateOrderModalSequence } from './sequences/submitCreateOrderModalSequence';
import { submitDocketEntrySequence } from './sequences/submitDocketEntrySequence';
import { submitEditPractitionersModalSequence } from './sequences/submitEditPractitionersModalSequence';
import { submitEditPrimaryContactSequence } from './sequences/submitEditPrimaryContactSequence';
import { submitEditRespondentsModalSequence } from './sequences/submitEditRespondentsModalSequence';
import { submitExternalDocumentSequence } from './sequences/submitExternalDocumentSequence';
import { submitFilePetitionSequence } from './sequences/submitFilePetitionSequence';
import { submitForwardSequence } from './sequences/submitForwardSequence';
import { submitLoginSequence } from './sequences/submitLoginSequence';
import { submitPetitionFromPaperSequence } from './sequences/submitPetitionFromPaperSequence';
import { submitPetitionToIRSHoldingQueueSequence } from './sequences/submitPetitionToIRSHoldingQueueSequence';
import { submitRecallPetitionFromIRSHoldingQueueSequence } from './sequences/submitRecallPetitionFromIRSHoldingQueueSequence';
import { submitTrialSessionSequence } from './sequences/submitTrialSessionSequence';
import { submitUpdateCaseModalSequence } from './sequences/submitUpdateCaseModalSequence';
import { submitUpdateUserContactInformationSequence } from './sequences/submitUpdateUserContactInformationSequence';
import { toggleBetaBarSequence } from './sequences/toggleBetaBarSequence';
import { toggleCaseDifferenceSequence } from './sequences/toggleCaseDifferenceSequence';
import { toggleMenuSequence } from './sequences/toggleMenuSequence';
import { toggleMobileDocketSortSequence } from './sequences/toggleMobileDocketSortSequence';
import { toggleMobileMenuSequence } from './sequences/toggleMobileMenuSequence';
import { togglePaymentDetailsSequence } from './sequences/togglePaymentDetailsSequence';
import { toggleReportsMenuSequence } from './sequences/toggleReportsMenuSequence';
import { toggleUsaBannerDetailsSequence } from './sequences/toggleUsaBannerDetailsSequence';
import { toggleWorkingCopySortSequence } from './sequences/toggleWorkingCopySortSequence';
import { unauthorizedErrorSequence } from './sequences/unauthorizedErrorSequence';
import { unblockCaseFromTrialSequence } from './sequences/unblockCaseFromTrialSequence';
import { unidentifiedUserErrorSequence } from './sequences/unidentifiedUserErrorSequence';
import { unprioritizeCaseSequence } from './sequences/unprioritizeCaseSequence';
import { unsetFormSaveSuccessSequence } from './sequences/unsetFormSaveSuccessSequence';
import { unsetFormSubmittingSequence } from './sequences/unsetFormSubmittingSequence';
import { unsetWorkQueueIsInternalSequence } from './sequences/unsetWorkQueueIsInternalSequence';
import { updateAdvancedSearchFormValueSequence } from './sequences/updateAdvancedSearchFormValueSequence';
import { updateBatchDownloadProgressSequence } from './sequences/updateBatchDownloadProgressSequence';
import { updateCaseAssociationFormValueSequence } from './sequences/updateCaseAssociationFormValueSequence';
import { updateCaseDeadlineSequence } from './sequences/updateCaseDeadlineSequence';
import { updateCaseNoteOnCaseDetailSequence } from './sequences/updateCaseNoteOnCaseDetailSequence';
import { updateCaseNoteOnWorkingCopySequence } from './sequences/updateCaseNoteOnWorkingCopySequence';
import { updateCasePartyTypeSequence } from './sequences/updateCasePartyTypeSequence';
import { updateCaseValueByIndexSequence } from './sequences/updateCaseValueByIndexSequence';
import { updateCaseValueSequence } from './sequences/updateCaseValueSequence';
import { updateCaseWorkingCopyNoteSequence } from './sequences/updateCaseWorkingCopyNoteSequence';
import { updateCompleteFormValueSequence } from './sequences/updateCompleteFormValueSequence';
import { updateCourtIssuedDocketEntryFormValueSequence } from './sequences/updateCourtIssuedDocketEntryFormValueSequence';
import { updateCreateOrderModalFormValueSequence } from './sequences/updateCreateOrderModalFormValueSequence';
import { updateCurrentTabSequence } from './sequences/updateCurrentTabSequence';
import { updateDocketEntryFormValueSequence } from './sequences/updateDocketEntryFormValueSequence';
import { updateDocketNumberSearchFormSequence } from './sequences/updateDocketNumberSearchFormSequence';
import { updateDocumentValueSequence } from './sequences/updateDocumentValueSequence';
import { updateFileDocumentWizardFormValueSequence } from './sequences/updateFileDocumentWizardFormValueSequence';
import { updateFormValueSequence } from './sequences/updateFormValueSequence';
import { updateForwardFormValueSequence } from './sequences/updateForwardFormValueSequence';
import { updateMessageValueInModalSequence } from './sequences/updateMessageValueInModalSequence';
import { updateMessageValueSequence } from './sequences/updateMessageValueSequence';
import { updateModalValueSequence } from './sequences/updateModalValueSequence';
import { updatePetitionValueSequence } from './sequences/updatePetitionValueSequence';
import { updateScreenMetadataSequence } from './sequences/updateScreenMetadataSequence';
import { updateSearchTermSequence } from './sequences/updateSearchTermSequence';
import { updateSessionMetadataSequence } from './sequences/updateSessionMetadataSequence';
import { updateStartCaseFormValueSequence } from './sequences/updateStartCaseFormValueSequence';
import { updateStartCaseInternalPartyTypeSequence } from './sequences/updateStartCaseInternalPartyTypeSequence';
import { updateTrialSessionFormDataSequence } from './sequences/updateTrialSessionFormDataSequence';
import { updateUserContactValueSequence } from './sequences/updateUserContactValueSequence';
import { updateWorkingCopySessionNoteSequence } from './sequences/updateWorkingCopySessionNoteSequence';
import { validateAddPractitionerSequence } from './sequences/caseAssociation/validateAddPractitionerSequence';
import { validateAddRespondentSequence } from './sequences/caseAssociation/validateAddRespondentSequence';
import { validateAddToTrialSessionSequence } from './sequences/validateAddToTrialSessionSequence';
import { validateBlockFromTrialSequence } from './sequences/validateBlockFromTrialSequence';
import { validateCaseAssociationRequestSequence } from './sequences/validateCaseAssociationRequestSequence';
import { validateCaseDeadlineSequence } from './sequences/validateCaseDeadlineSequence';
import { validateCaseDetailSequence } from './sequences/validateCaseDetailSequence';
import { validateCourtIssuedDocketEntrySequence } from './sequences/validateCourtIssuedDocketEntrySequence';
import { validateDocketEntrySequence } from './sequences/validateDocketEntrySequence';
import { validateEditPractitionersSequence } from './sequences/caseAssociation/validateEditPractitionersSequence';
import { validateExternalDocumentInformationSequence } from './sequences/validateExternalDocumentInformationSequence';
import { validateForwardMessageSequence } from './sequences/validateForwardMessageSequence';
import { validateInitialWorkItemMessageInModalSequence } from './sequences/validateInitialWorkItemMessageInModalSequence';
import { validateInitialWorkItemMessageSequence } from './sequences/validateInitialWorkItemMessageSequence';
import { validateNoteSequence } from './sequences/validateNoteSequence';
import { validateOrderWithoutBodySequence } from './sequences/validateOrderWithoutBodySequence';
import { validatePetitionFromPaperSequence } from './sequences/validatePetitionFromPaperSequence';
import { validatePrimaryContactSequence } from './sequences/validatePrimaryContactSequence';
import { validatePrioritizeCaseSequence } from './sequences/validatePrioritizeCaseSequence';
import { validateRemoveFromTrialSessionSequence } from './sequences/validateRemoveFromTrialSessionSequence';
import { validateSelectDocumentTypeSequence } from './sequences/validateSelectDocumentTypeSequence';
import { validateStartCaseWizardSequence } from './sequences/validateStartCaseWizardSequence';
import { validateTrialSessionPlanningSequence } from './sequences/validateTrialSessionPlanningSequence';
import { validateTrialSessionSequence } from './sequences/validateTrialSessionSequence';
import { validateUpdateCaseModalSequence } from './sequences/validateUpdateCaseModalSequence';
import { validateUserContactSequence } from './sequences/validateUserContactSequence';
import { viewDocumentSequence } from './sequences/viewDocumentSequence';

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
    addSupportingDocumentToFormSequence,
    archiveDraftDocumentModalSequence,
    archiveDraftDocumentSequence,
    assignSelectedWorkItemsSequence,
    associatePractitionerWithCaseSequence,
    associateRespondentWithCaseSequence,
    autoSaveTrialSessionWorkingCopySequence,
    batchDownloadReadySequence,
    batchDownloadTrialSessionSequence,
    blockCaseFromTrialSequence,
    cancelAddDraftDocumentSequence,
    cancelEditPrimaryContactSequence,
    cancelFileUploadSequence,
    cerebralBindSimpleSetStateSequence,
    chooseModalWizardStepSequence,
    chooseStartCaseWizardStepSequence,
    chooseWizardStepSequence,
    chooseWorkQueueSequence,
    clearAdvancedSearchFormSequence,
    clearAlertSequence,
    clearDocketNumberSearchFormSequence,
    clearDocumentSequence,
    clearModalFormSequence,
    clearModalSequence,
    clearPdfPreviewUrlSequence,
    clearPreferredTrialCitySequence,
    clearWizardDataSequence,
    clickServeToIrsSequence,
    closeModalAndReturnToCaseDetailSequence,
    closeModalAndReturnToDashboardSequence,
    closeModalAndReturnToTrialSessionsSequence,
    completeDocketEntryQCAndSendMessageSequence,
    completeDocketEntryQCSequence,
    completeDocumentSelectSequence,
    completeDocumentSigningSequence,
    completeStartCaseWizardStepSequence,
    confirmStayLoggedInSequence,
    convertHtml2PdfSequence,
    countryTypeChangeSequence,
    countryTypeUserContactChangeSequence,
    createCaseDeadlineSequence,
    createWorkItemSequence,
    deleteCaseDeadlineSequence,
    deleteCaseNoteFromCaseDetailSequence,
    deleteCaseNoteFromWorkingCopySequence,
    deleteWorkingCopySessionNoteSequence,
    dismissAlertSequence,
    dismissCreateMessageModalSequence,
    dismissModalSequence,
    editSelectedDocumentSequence,
    editSelectedSecondaryDocumentSequence,
    fetchPendingItemsSequence,
    fetchUserNotificationsSequence,
    formCancelToggleCancelSequence,
    generatePdfFromScanSessionSequence,
    getBlockedCasesByTrialLocationSequence,
    getUsersInSectionSequence,
    gotoAddCourtIssuedDocketEntrySequence,
    gotoAddDocketEntrySequence,
    gotoAddTrialSessionSequence,
    gotoAdvancedSearchSequence,
    gotoAllCaseDeadlinesSequence,
    gotoBeforeStartCaseSequence,
    gotoBeforeYouFileDocumentSequence,
    gotoBlockedCasesReportSequence,
    gotoCaseDetailSequence,
    gotoCaseSearchNoMatchesSequence,
    gotoCompleteDocketEntrySequence,
    gotoCreateOrderSequence,
    gotoDashboardSequence,
    gotoDocumentDetailSequence,
    gotoEditCourtIssuedDocketEntrySequence,
    gotoEditDocketEntrySequence,
    gotoEditOrderSequence,
    gotoFileDocumentSequence,
    gotoIdleLogoutSequence,
    gotoLoginSequence,
    gotoMessagesSequence,
    gotoOrdersNeededSequence,
    gotoPendingReportSequence,
    gotoPrimaryContactEditSequence,
    gotoPrintableCaseConfirmationSequence,
    gotoPrintableDocketRecordSequence,
    gotoPrintablePendingReportSequence,
    gotoRequestAccessSequence,
    gotoSelectDocumentTypeSequence,
    gotoSignOrderSequence,
    gotoSignPDFDocumentSequence,
    gotoStartCaseWizardSequence,
    gotoStyleGuideSequence,
    gotoTrialSessionDetailSequence,
    gotoTrialSessionWorkingCopySequence,
    gotoTrialSessionsSequence,
    gotoUserContactEditSequence,
    gotoViewAllDocumentsSequence,
    loadOriginalProposedStipulatedDecisionSequence,
    loadPdfSequence,
    loginWithCodeSequence,
    loginWithTokenSequence,
    navigateBackSequence,
    navigateToCaseDetailSequence,
    navigateToEditOrderSequence,
    navigateToPathSequence,
    navigateToPrintableCaseConfirmationSequence,
    navigateToPrintableDocketRecordSequence,
    notFoundErrorSequence,
    openAddEditCaseNoteModalFromDetailSequence,
    openAddEditCaseNoteModalFromListSequence,
    openAddEditSessionNoteModalSequence,
    openAddPractitionerModalSequence,
    openAddRespondentModalSequence,
    openAddToTrialModalSequence,
    openBlockFromTrialModalSequence,
    openCancelDraftDocumentModalSequence,
    openCaseDifferenceModalSequence,
    openChangeScannerSourceModalSequence,
    openCleanModalSequence,
    openCompleteSelectDocumentTypeModalSequence,
    openConfirmDeleteBatchModalSequence,
    openConfirmDeletePDFModalSequence,
    openConfirmEditModalSequence,
    openConfirmInitiateServiceModalSequence,
    openConfirmRemoveCaseDetailPendingItemModalSequence,
    openConfirmRescanBatchModalSequence,
    openCreateCaseDeadlineModalSequence,
    openCreateMessageAlongsideDocketRecordQCModalSequence,
    openCreateMessageModalSequence,
    openCreateOrderChooseTypeModalSequence,
    openDeleteCaseDeadlineModalSequence,
    openDeleteCaseNoteConfirmModalSequence,
    openDeleteSessionNoteConfirmModalSequence,
    openEditCaseDeadlineModalSequence,
    openEditPractitionersModalSequence,
    openEditRespondentsModalSequence,
    openEditSecondaryContactModalSequence,
    openPdfPreviewModalSequence,
    openPrioritizeCaseModalSequence,
    openRemoveFromTrialSessionModalSequence,
    openSelectDocumentWizardOverlaySequence,
    openSetCalendarModalSequence,
    openTrialSessionPlanningModalSequence,
    openUnblockFromTrialModalSequence,
    openUnprioritizeCaseModalSequence,
    openUpdateCaseModalSequence,
    printDocketRecordSequence,
    printFromBrowserSequence,
    printTrialCalendarSequence,
    prioritizeCaseSequence,
    redirectToLoginSequence,
    refreshCaseSequence,
    removeBatchSequence,
    removeCaseDetailPendingItemSequence,
    removeCaseFromTrialSequence,
    removeScannedPdfSequence,
    removeSecondarySupportingDocumentSequence,
    removeSignatureFromOrderSequence,
    removeSupportingDocumentSequence,
    rescanBatchSequence,
    resetHeaderAccordionsSequence,
    reviewExternalDocumentInformationSequence,
    reviewRequestAccessInformationSequence,
    runBatchProcessSequence,
    runTrialSessionPlanningReportSequence,
    saveDocumentSigningSequence,
    saveIntermediateDocketEntrySequence,
    scannerShutdownSequence,
    scannerStartupSequence,
    selectAssigneeSequence,
    selectDateRangeFromCalendarSequence,
    selectDocumentForPreviewSequence,
    selectDocumentForScanSequence,
    selectDocumentSequence,
    selectScannerSequence,
    selectSecondaryDocumentSequence,
    selectWorkItemSequence,
    serveCourtIssuedDocumentSequence,
    setCanvasForPDFSigningSequence,
    setCaseDetailPageTabSequence,
    setCurrentPageIndexSequence,
    setDocumentDetailTabSequence,
    setDocumentForUploadSequence,
    setDocumentUploadModeSequence,
    setFieldOrderSequence,
    setFocusedWorkItemSequence,
    setFormSubmittingSequence,
    setIdleStatusIdleSequence,
    setIrsNoticeFalseSequence,
    setModalDialogNameSequence,
    setPDFPageForSigningSequence,
    setPDFSignatureDataSequence,
    setPageSequence,
    setPdfPreviewUrlSequence,
    setScannerSourceSequence,
    setSelectedBatchIndexSequence,
    setTrialSessionCalendarSequence,
    setWorkItemActionSequence,
    setWorkQueueIsInternalSequence,
    showDocketRecordDetailModalSequence,
    showMoreResultsSequence,
    signOutSequence,
    startScanSequence,
    submitCaseAdvancedSearchSequence,
    submitCaseAssociationRequestSequence,
    submitCaseDetailEditSaveSequence,
    submitCaseDocketNumberSearchSequence,
    submitCaseSearchSequence,
    submitCompleteSequence,
    submitCourtIssuedDocketEntrySequence,
    submitCourtIssuedOrderSequence,
    submitCreateOrderModalSequence,
    submitDocketEntrySequence,
    submitEditPractitionersModalSequence,
    submitEditPrimaryContactSequence,
    submitEditRespondentsModalSequence,
    submitExternalDocumentSequence,
    submitFilePetitionSequence,
    submitForwardSequence,
    submitLoginSequence,
    submitPetitionFromPaperSequence,
    submitPetitionToIRSHoldingQueueSequence,
    submitRecallPetitionFromIRSHoldingQueueSequence,
    submitTrialSessionSequence,
    submitUpdateCaseModalSequence,
    submitUpdateUserContactInformationSequence,
    toggleBetaBarSequence,
    toggleCaseDifferenceSequence,
    toggleMenuSequence,
    toggleMobileDocketSortSequence,
    toggleMobileMenuSequence,
    togglePaymentDetailsSequence,
    toggleReportsMenuSequence,
    toggleUsaBannerDetailsSequence,
    toggleWorkingCopySortSequence,
    unauthorizedErrorSequence,
    unblockCaseFromTrialSequence,
    unidentifiedUserErrorSequence,
    unprioritizeCaseSequence,
    unsetFormSaveSuccessSequence,
    unsetFormSubmittingSequence,
    unsetWorkQueueIsInternalSequence,
    updateAdvancedSearchFormValueSequence,
    updateBatchDownloadProgressSequence,
    updateCaseAssociationFormValueSequence,
    updateCaseDeadlineSequence,
    updateCaseNoteOnCaseDetailSequence,

    updateCaseNoteOnWorkingCopySequence,
    updateCasePartyTypeSequence,
    updateCaseValueByIndexSequence,
    updateCaseValueSequence,
    updateCaseWorkingCopyNoteSequence,
    updateCompleteFormValueSequence,
    updateCourtIssuedDocketEntryFormValueSequence,
    updateCreateOrderModalFormValueSequence,
    updateCurrentTabSequence,
    updateDocketEntryFormValueSequence,
    updateDocketNumberSearchFormSequence,
    updateDocumentValueSequence,
    updateFileDocumentWizardFormValueSequence,
    updateFormValueSequence,
    updateForwardFormValueSequence,
    updateMessageValueInModalSequence,
    updateMessageValueSequence,
    updateModalValueSequence,
    updatePetitionValueSequence,
    updateScreenMetadataSequence,
    updateSearchTermSequence,
    updateSessionMetadataSequence,
    updateStartCaseFormValueSequence,
    updateStartCaseInternalPartyTypeSequence,
    updateTrialSessionFormDataSequence,
    updateUserContactValueSequence,
    updateWorkingCopySessionNoteSequence,
    validateAddPractitionerSequence,
    validateAddRespondentSequence,
    validateAddToTrialSessionSequence,
    validateBlockFromTrialSequence,
    validateCaseAssociationRequestSequence,
    validateCaseDeadlineSequence,
    validateCaseDetailSequence,
    validateCourtIssuedDocketEntrySequence,
    validateDocketEntrySequence,
    validateEditPractitionersSequence,
    validateExternalDocumentInformationSequence,
    validateForwardMessageSequence,
    validateInitialWorkItemMessageInModalSequence,
    validateInitialWorkItemMessageSequence,
    validateNoteSequence,
    validateOrderWithoutBodySequence,
    validatePetitionFromPaperSequence,
    validatePrimaryContactSequence,
    validatePrioritizeCaseSequence,
    validateRemoveFromTrialSessionSequence,
    validateSelectDocumentTypeSequence,
    validateStartCaseWizardSequence,
    validateTrialSessionPlanningSequence,
    validateTrialSessionSequence,
    validateUpdateCaseModalSequence,
    validateUserContactSequence,
    viewDocumentSequence,
  },
  state,
};
