import { ActionError } from './errors/ActionError';
import { InvalidRequestError } from './errors/InvalidRequestError';
import { NotFoundError } from './errors/NotFoundError';
import { ServerInvalidResponseError } from './errors/ServerInvalidResponseError';
import { UnauthorizedRequestError } from './errors/UnauthorizedRequestError';
import { UnidentifiedUserError } from './errors/UnidentifiedUserError';
import { addSupportingDocumentToFormSequence } from './sequences/addSupportingDocumentToFormSequence';
import { archiveDraftDocumentModalSequence } from './sequences/archiveDraftDocumentModalSequence';
import { archiveDraftDocumentSequence } from './sequences/archiveDraftDocumentSequence';
import { assignSelectedWorkItemsSequence } from './sequences/assignSelectedWorkItemsSequence';
import { associatePractitionerWithCaseSequence } from './sequences/caseAssociation/associatePractitionerWithCaseSequence';
import { associateRespondentWithCaseSequence } from './sequences/caseAssociation/associateRespondentWithCaseSequence';
import { autoSaveCaseSequence } from './sequences/autoSaveCaseSequence';
import { autoSaveTrialSessionWorkingCopySequence } from './sequences/autoSaveTrialSessionWorkingCopySequence';
import { batchDownloadReadySequence } from './sequences/batchDownloadReadySequence';
import { batchDownloadTrialSessionSequence } from './sequences/batchDownloadTrialSessionSequence';
import { cancelEditPrimaryContactSequence } from './sequences/cancelEditPrimaryContactSequence';
import { cancelFileUploadSequence } from './sequences/cancelFileUploadSequence';
import { cerebralBindSimpleSetStateSequence } from './sequences/cerebralBindSimpleSetStateSequence';
import { chooseModalWizardStepSequence } from './sequences/chooseModalWizardStepSequence';
import { chooseStartCaseWizardStepSequence } from './sequences/chooseStartCaseWizardStepSequence';
import { chooseWizardStepSequence } from './sequences/chooseWizardStepSequence';
import { chooseWorkQueueSequence } from './sequences/chooseWorkQueueSequence';
import { clearAdvancedSearchFormSequence } from './sequences/clearAdvancedSearchFormSequence';
import { clearAlertSequence } from './sequences/clearAlertSequence';
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
import { dismissCaseCaptionModalSequence } from './sequences/dismissCaseCaptionModalSequence';
import { dismissCreateMessageModalSequence } from './sequences/dismissCreateMessageModalSequence';
import { dismissModalSequence } from './sequences/dismissModalSequence';
import { editSelectedDocumentSequence } from './sequences/editSelectedDocumentSequence';
import { editSelectedSecondaryDocumentSequence } from './sequences/editSelectedSecondaryDocumentSequence';
import { fetchUserNotificationsSequence } from './sequences/fetchUserNotificationsSequence';
import { formCancelToggleCancelSequence } from './sequences/formCancelToggleCancelSequence';
import { generatePdfFromScanSessionSequence } from './sequences/generatePdfFromScanSessionSequence';
import { getUsersInSectionSequence } from './sequences/getUsersInSectionSequence';
import { gotoAddDocketEntrySequence } from './sequences/gotoAddDocketEntrySequence';
import { gotoAddTrialSessionSequence } from './sequences/gotoAddTrialSessionSequence';
import { gotoAdvancedSearchSequence } from './sequences/gotoAdvancedSearchSequence';
import { gotoAllCaseDeadlinesSequence } from './sequences/gotoAllCaseDeadlinesSequence';
import { gotoBeforeStartCaseSequence } from './sequences/gotoBeforeStartCaseSequence';
import { gotoBeforeYouFileDocumentSequence } from './sequences/gotoBeforeYouFileDocumentSequence';
import { gotoCaseDetailSequence } from './sequences/gotoCaseDetailSequence';
import { gotoCaseSearchNoMatchesSequence } from './sequences/gotoCaseSearchNoMatchesSequence';
import { gotoCreateOrderSequence } from './sequences/gotoCreateOrderSequence';
import { gotoDashboardSequence } from './sequences/gotoDashboardSequence';
import { gotoDocumentDetailSequence } from './sequences/gotoDocumentDetailSequence';
import { gotoEditDocketEntrySequence } from './sequences/gotoEditDocketEntrySequence';
import { gotoEditOrderSequence } from './sequences/gotoEditOrderSequence';
import { gotoFileDocumentSequence } from './sequences/gotoFileDocumentSequence';
import { gotoIdleLogoutSequence } from './sequences/gotoIdleLogoutSequence';
import { gotoLoginSequence } from './sequences/gotoLoginSequence';
import { gotoMessagesSequence } from './sequences/gotoMessagesSequence';
import { gotoOrdersNeededSequence } from './sequences/gotoOrdersNeededSequence';
import { gotoPrimaryContactEditSequence } from './sequences/gotoPrimaryContactEditSequence';
import { gotoPrintableDocketRecordSequence } from './sequences/gotoPrintableDocketRecordSequence';
import { gotoRequestAccessSequence } from './sequences/gotoRequestAccessSequence';
import { gotoSelectDocumentTypeSequence } from './sequences/gotoSelectDocumentTypeSequence';
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
import { navigateToPathSequence } from './sequences/navigateToPathSequence';
import { navigateToPrintableDocketRecordSequence } from './sequences/navigateToPrintableDocketRecordSequence';
import { notFoundErrorSequence } from './sequences/notFoundErrorSequence';
import { openAddEditCaseNoteModalFromDetailSequence } from './sequences/openAddEditCaseNoteModalFromDetailSequence';
import { openAddEditCaseNoteModalFromListSequence } from './sequences/openAddEditCaseNoteModalFromListSequence';
import { openAddEditSessionNoteModalSequence } from './sequences/openAddEditSessionNoteModalSequence';
import { openAddPractitionerModalSequence } from './sequences/openAddPractitionerModalSequence';
import { openAddRespondentModalSequence } from './sequences/openAddRespondentModalSequence';
import { openCaseCaptionModalSequence } from './sequences/openCaseCaptionModalSequence';
import { openCaseDifferenceModalSequence } from './sequences/openCaseDifferenceModalSequence';
import { openChangeScannerSourceModalSequence } from './sequences/openChangeScannerSourceModalSequence';
import { openCleanModalSequence } from './sequences/openCleanModalSequence';
import { openCompleteSelectDocumentTypeModalSequence } from './sequences/openCompleteSelectDocumentTypeModalSequence';
import { openConfirmDeleteBatchModalSequence } from './sequences/openConfirmDeleteBatchModalSequence';
import { openConfirmDeletePDFModalSequence } from './sequences/openConfirmDeletePDFModalSequence';
import { openConfirmRescanBatchModalSequence } from './sequences/openConfirmRescanBatchModalSequence';
import { openCreateCaseDeadlineModalSequence } from './sequences/openCreateCaseDeadlineModalSequence';
import { openCreateMessageModalSequence } from './sequences/openCreateMessageModalSequence';
import { openCreateOrderChooseTypeModalSequence } from './sequences/openCreateOrderChooseTypeModalSequence';
import { openDeleteCaseDeadlineModalSequence } from './sequences/openDeleteCaseDeadlineModalSequence';
import { openDeleteCaseNoteConfirmModalSequence } from './sequences/openDeleteCaseNoteConfirmModalSequence';
import { openDeleteSessionNoteConfirmModalSequence } from './sequences/openDeleteSessionNoteConfirmModalSequence';
import { openEditCaseDeadlineModalSequence } from './sequences/openEditCaseDeadlineModalSequence';
import { openEditSecondaryContactModalSequence } from './sequences/openEditSecondaryContactModalSequence';
import { openPdfPreviewModalSequence } from './sequences/openPdfPreviewModalSequence';
import { openSelectDocumentWizardOverlaySequence } from './sequences/openSelectDocumentWizardOverlaySequence';
import { openServeConfirmModalDialogSequence } from './sequences/openServeConfirmModalDialogSequence';
import { openSetCalendarModalSequence } from './sequences/openSetCalendarModalSequence';
import { printDocketRecordSequence } from './sequences/printDocketRecordSequence';
import { printFromBrowserSequence } from './sequences/printFromBrowserSequence';
import { printTrialCalendarSequence } from './sequences/printTrialCalendarSequence';
import { redirectToLoginSequence } from './sequences/redirectToLoginSequence';
import { refreshCaseSequence } from './sequences/refreshCaseSequence';
import { removeBatchSequence } from './sequences/removeBatchSequence';
import { removeScannedPdfSequence } from './sequences/removeScannedPdfSequence';
import { removeSecondarySupportingDocumentSequence } from './sequences/removeSecondarySupportingDocumentSequence';
import { removeSupportingDocumentSequence } from './sequences/removeSupportingDocumentSequence';
import { rescanBatchSequence } from './sequences/rescanBatchSequence';
import { resetHeaderAccordionsSequence } from './sequences/resetHeaderAccordionsSequence';
import { reviewExternalDocumentInformationSequence } from './sequences/reviewExternalDocumentInformationSequence';
import { reviewRequestAccessInformationSequence } from './sequences/reviewRequestAccessInformationSequence';
import { runBatchProcessSequence } from './sequences/runBatchProcessSequence';
import { saveDocumentSigningSequence } from './sequences/saveDocumentSigningSequence';
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
import { serveDocumentSequence } from './sequences/serveDocumentSequence';
import { setCanvasForPDFSigningSequence } from './sequences/setCanvasForPDFSigningSequence';
import { setCaseCaptionSequence } from './sequences/setCaseCaptionSequence';
import { setCaseDetailPageTabSequence } from './sequences/setCaseDetailPageTabSequence';
import { setCaseToReadyForTrialSequence } from './sequences/setCaseToReadyForTrialSequence';
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
import { submitAdvancedSearchSequence } from './sequences/submitAdvancedSearchSequence';
import { submitCaseAssociationRequestSequence } from './sequences/submitCaseAssociationRequestSequence';
import { submitCaseDetailEditSaveSequence } from './sequences/submitCaseDetailEditSaveSequence';
import { submitCaseSearchSequence } from './sequences/submitCaseSearchSequence';
import { submitCompleteSequence } from './sequences/submitCompleteSequence';
import { submitCourtIssuedOrderSequence } from './sequences/submitCourtIssuedOrderSequence';
import { submitCreateOrderModalSequence } from './sequences/submitCreateOrderModalSequence';
import { submitDocketEntrySequence } from './sequences/submitDocketEntrySequence';
import { submitEditPrimaryContactSequence } from './sequences/submitEditPrimaryContactSequence';
import { submitEditUserContactSequence } from './sequences/submitEditUserContactSequence';
import { submitExternalDocumentSequence } from './sequences/submitExternalDocumentSequence';
import { submitFilePetitionSequence } from './sequences/submitFilePetitionSequence';
import { submitForwardSequence } from './sequences/submitForwardSequence';
import { submitLoginSequence } from './sequences/submitLoginSequence';
import { submitPetitionFromPaperSequence } from './sequences/submitPetitionFromPaperSequence';
import { submitPetitionToIRSHoldingQueueSequence } from './sequences/submitPetitionToIRSHoldingQueueSequence';
import { submitRecallPetitionFromIRSHoldingQueueSequence } from './sequences/submitRecallPetitionFromIRSHoldingQueueSequence';
import { submitTrialSessionSequence } from './sequences/submitTrialSessionSequence';
import { submitUpdateCaseSequence } from './sequences/submitUpdateCaseSequence';
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
import { unidentifiedUserErrorSequence } from './sequences/unidentifiedUserErrorSequence';
import { unsetFormSaveSuccessSequence } from './sequences/unsetFormSaveSuccessSequence';
import { unsetFormSubmittingSequence } from './sequences/unsetFormSubmittingSequence';
import { unsetWorkQueueIsInternalSequence } from './sequences/unsetWorkQueueIsInternalSequence';
import { updateAdvancedSearchFormValueSequence } from './sequences/updateAdvancedSearchFormValueSequence';
import { updateCaseAssociationFormValueSequence } from './sequences/updateCaseAssociationFormValueSequence';
import { updateCaseDeadlineSequence } from './sequences/updateCaseDeadlineSequence';
import { updateCaseDetailSequence } from './sequences/updateCaseDetailSequence';
import { updateCaseNoteOnCaseDetailSequence } from './sequences/updateCaseNoteOnCaseDetailSequence';
import { updateCaseNoteOnWorkingCopySequence } from './sequences/updateCaseNoteOnWorkingCopySequence';
import { updateCasePartyTypeSequence } from './sequences/updateCasePartyTypeSequence';
import { updateCaseValueByIndexSequence } from './sequences/updateCaseValueByIndexSequence';
import { updateCaseValueSequence } from './sequences/updateCaseValueSequence';
import { updateCaseWorkingCopyNoteSequence } from './sequences/updateCaseWorkingCopyNoteSequence';
import { updateCompleteFormValueSequence } from './sequences/updateCompleteFormValueSequence';
import { updateCreateOrderModalFormValueSequence } from './sequences/updateCreateOrderModalFormValueSequence';
import { updateCurrentTabSequence } from './sequences/updateCurrentTabSequence';
import { updateDocketEntryFormValueSequence } from './sequences/updateDocketEntryFormValueSequence';
import { updateDocumentValueSequence } from './sequences/updateDocumentValueSequence';
import { updateFileDocumentWizardFormValueSequence } from './sequences/updateFileDocumentWizardFormValueSequence';
import { updateFormValueSequence } from './sequences/updateFormValueSequence';
import { updateForwardFormValueSequence } from './sequences/updateForwardFormValueSequence';
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
import { validateCaseAssociationRequestSequence } from './sequences/validateCaseAssociationRequestSequence';
import { validateCaseDeadlineSequence } from './sequences/validateCaseDeadlineSequence';
import { validateCaseDetailSequence } from './sequences/validateCaseDetailSequence';
import { validateContactPrimarySequence } from './sequences/validateContactPrimarySequence';
import { validateDocketEntrySequence } from './sequences/validateDocketEntrySequence';
import { validateExternalDocumentInformationSequence } from './sequences/validateExternalDocumentInformationSequence';
import { validateForwardMessageSequence } from './sequences/validateForwardMessageSequence';
import { validateInitialWorkItemMessageSequence } from './sequences/validateInitialWorkItemMessageSequence';
import { validateNoteSequence } from './sequences/validateNoteSequence';
import { validateOrderWithoutBodySequence } from './sequences/validateOrderWithoutBodySequence';
import { validatePetitionFromPaperSequence } from './sequences/validatePetitionFromPaperSequence';
import { validateSelectDocumentTypeSequence } from './sequences/validateSelectDocumentTypeSequence';
import { validateStartCaseWizardSequence } from './sequences/validateStartCaseWizardSequence';
import { validateTrialSessionSequence } from './sequences/validateTrialSessionSequence';
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
    addSupportingDocumentToFormSequence,
    archiveDraftDocumentModalSequence,
    archiveDraftDocumentSequence,
    assignSelectedWorkItemsSequence,
    associatePractitionerWithCaseSequence,
    associateRespondentWithCaseSequence,
    autoSaveCaseSequence,
    autoSaveTrialSessionWorkingCopySequence,
    batchDownloadReadySequence,
    batchDownloadTrialSessionSequence,
    cancelEditPrimaryContactSequence,
    cancelFileUploadSequence,
    cerebralBindSimpleSetStateSequence,
    chooseModalWizardStepSequence,
    chooseStartCaseWizardStepSequence,
    chooseWizardStepSequence,
    chooseWorkQueueSequence,
    clearAdvancedSearchFormSequence,
    clearAlertSequence,
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
    dismissCaseCaptionModalSequence,
    dismissCreateMessageModalSequence,
    dismissModalSequence,
    editSelectedDocumentSequence,
    editSelectedSecondaryDocumentSequence,
    fetchUserNotificationsSequence,
    formCancelToggleCancelSequence,
    generatePdfFromScanSessionSequence,
    getUsersInSectionSequence,
    gotoAddDocketEntrySequence,
    gotoAddTrialSessionSequence,
    gotoAdvancedSearchSequence,
    gotoAllCaseDeadlinesSequence,
    gotoBeforeStartCaseSequence,
    gotoBeforeYouFileDocumentSequence,
    gotoCaseDetailSequence,
    gotoCaseSearchNoMatchesSequence,
    gotoCreateOrderSequence,
    gotoDashboardSequence,
    gotoDocumentDetailSequence,
    gotoEditDocketEntrySequence,
    gotoEditOrderSequence,
    gotoFileDocumentSequence,
    gotoIdleLogoutSequence,
    gotoLoginSequence,
    gotoMessagesSequence,
    gotoOrdersNeededSequence,
    gotoPrimaryContactEditSequence,
    gotoPrintableDocketRecordSequence,
    gotoRequestAccessSequence,
    gotoSelectDocumentTypeSequence,
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
    navigateToPathSequence,
    navigateToPrintableDocketRecordSequence,
    notFoundErrorSequence,
    openAddEditCaseNoteModalFromDetailSequence,
    openAddEditCaseNoteModalFromListSequence,
    openAddEditSessionNoteModalSequence,
    openAddPractitionerModalSequence,
    openAddRespondentModalSequence,
    openCaseCaptionModalSequence,
    openCaseDifferenceModalSequence,
    openChangeScannerSourceModalSequence,
    openCleanModalSequence,
    openCompleteSelectDocumentTypeModalSequence,
    openConfirmDeleteBatchModalSequence,
    openConfirmDeletePDFModalSequence,
    openConfirmRescanBatchModalSequence,
    openCreateCaseDeadlineModalSequence,
    openCreateMessageModalSequence,
    openCreateOrderChooseTypeModalSequence,
    openDeleteCaseDeadlineModalSequence,
    openDeleteCaseNoteConfirmModalSequence,
    openDeleteSessionNoteConfirmModalSequence,
    openEditCaseDeadlineModalSequence,
    openEditSecondaryContactModalSequence,
    openPdfPreviewModalSequence,
    openSelectDocumentWizardOverlaySequence,
    openServeConfirmModalDialogSequence,
    openSetCalendarModalSequence,
    printDocketRecordSequence,
    printFromBrowserSequence,
    printTrialCalendarSequence,
    redirectToLoginSequence,
    refreshCaseSequence,
    removeBatchSequence,
    removeScannedPdfSequence,
    removeSecondarySupportingDocumentSequence,
    removeSupportingDocumentSequence,
    rescanBatchSequence,
    resetHeaderAccordionsSequence,
    reviewExternalDocumentInformationSequence,
    reviewRequestAccessInformationSequence,
    runBatchProcessSequence,
    saveDocumentSigningSequence,
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
    serveDocumentSequence,
    setCanvasForPDFSigningSequence,
    setCaseCaptionSequence,
    setCaseDetailPageTabSequence,
    setCaseToReadyForTrialSequence,
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
    submitAdvancedSearchSequence,
    submitCaseAssociationRequestSequence,
    submitCaseDetailEditSaveSequence,
    submitCaseSearchSequence,
    submitCompleteSequence,
    submitCourtIssuedOrderSequence,
    submitCreateOrderModalSequence,
    submitDocketEntrySequence,
    submitEditPrimaryContactSequence,
    submitEditUserContactSequence,
    submitExternalDocumentSequence,
    submitFilePetitionSequence,
    submitForwardSequence,
    submitLoginSequence,
    submitPetitionFromPaperSequence,
    submitPetitionToIRSHoldingQueueSequence,
    submitRecallPetitionFromIRSHoldingQueueSequence,
    submitTrialSessionSequence,
    submitUpdateCaseSequence,
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
    unidentifiedUserErrorSequence,
    unsetFormSaveSuccessSequence,
    unsetFormSubmittingSequence,
    unsetWorkQueueIsInternalSequence,
    updateAdvancedSearchFormValueSequence,
    updateCaseAssociationFormValueSequence,
    updateCaseDeadlineSequence,
    updateCaseDetailSequence,
    updateCaseNoteOnCaseDetailSequence,
    updateCaseNoteOnWorkingCopySequence,
    updateCasePartyTypeSequence,
    updateCaseValueByIndexSequence,
    updateCaseValueSequence,
    updateCaseWorkingCopyNoteSequence,
    updateCompleteFormValueSequence,
    updateCreateOrderModalFormValueSequence,
    updateCurrentTabSequence,
    updateDocketEntryFormValueSequence,
    updateDocumentValueSequence,
    updateFileDocumentWizardFormValueSequence,
    updateFormValueSequence,
    updateForwardFormValueSequence,
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
    validateCaseAssociationRequestSequence,
    validateCaseDeadlineSequence,
    validateCaseDetailSequence,
    validateContactPrimarySequence,
    validateDocketEntrySequence,
    validateExternalDocumentInformationSequence,
    validateForwardMessageSequence,
    validateInitialWorkItemMessageSequence,
    validateNoteSequence,
    validateOrderWithoutBodySequence,
    validatePetitionFromPaperSequence,
    validateSelectDocumentTypeSequence,
    validateStartCaseWizardSequence,
    validateTrialSessionSequence,
    validateUserContactSequence,
    viewDocumentSequence,
  },
  state,
};
