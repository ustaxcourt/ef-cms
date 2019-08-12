import { ActionError } from './errors/ActionError';
import { InvalidRequestError } from './errors/InvalidRequestError';
import { NotFoundError } from './errors/NotFoundError';
import { ServerInvalidResponseError } from './errors/ServerInvalidResponseError';
import { UnauthorizedRequestError } from './errors/UnauthorizedRequestError';
import { UnidentifiedUserError } from './errors/UnidentifiedUserError';
import { addSupportingDocumentToFormSequence } from './sequences/addSupportingDocumentToFormSequence';
import { appendNewYearAmountSequence } from './sequences/appendNewYearAmountSequence';
import { assignSelectedWorkItemsSequence } from './sequences/assignSelectedWorkItemsSequence';
import { associatePractitionerWithCaseSequence } from './sequences/caseAssociation/associatePractitionerWithCaseSequence';
import { associateRespondentWithCaseSequence } from './sequences/caseAssociation/associateRespondentWithCaseSequence';
import { autoSaveCaseSequence } from './sequences/autoSaveCaseSequence';
import { cancelEditPrimaryContactSequence } from './sequences/cancelEditPrimaryContactSequence';
import { cancelFileUploadSequence } from './sequences/cancelFileUploadSequence';
import { cerebralBindSimpleSetStateSequence } from './sequences/cerebralBindSimpleSetStateSequence';
import { chooseModalWizardStepSequence } from './sequences/chooseModalWizardStepSequence';
import { chooseStartCaseWizardStepSequence } from './sequences/chooseStartCaseWizardStepSequence';
import { chooseWizardStepSequence } from './sequences/chooseWizardStepSequence';
import { chooseWorkQueueSequence } from './sequences/chooseWorkQueueSequence';
import { clearDocumentSequence } from './sequences/clearDocumentSequence';
import { clearModalSequence } from './sequences/clearModalSequence';
import { clearPdfPreviewUrlSequence } from './sequences/clearPdfPreviewUrlSequence';
import { clearPreferredTrialCitySequence } from './sequences/clearPreferredTrialCitySequence';
import { clearWizardDataSequence } from './sequences/clearWizardDataSequence';
import { clickServeToIrsSequence } from './sequences/clickServeToIrsSequence';
import { closeAccountMenuSequence } from './sequences/closeAccountMenuSequence';
import { closeDocumentCategoryAccordionSequence } from './sequences/closeDocumentCategoryAccordionSequence';
import { closeModalAndReturnToCaseDetailSequence } from './sequences/closeModalAndReturnToCaseDetailSequence';
import { closeModalAndReturnToDashboardSequence } from './sequences/closeModalAndReturnToDashboardSequence';
import { closeModalAndReturnToTrialSessionsSequence } from './sequences/closeModalAndReturnToTrialSessionsSequence';
import { completeDocumentSelectSequence } from './sequences/completeDocumentSelectSequence';
import { completeDocumentSigningSequence } from './sequences/completeDocumentSigningSequence';
import { completeStartCaseWizardStepSequence } from './sequences/completeStartCaseWizardStepSequence';
import { confirmStayLoggedInSequence } from './sequences/confirmStayLoggedInSequence';
import { convertHtml2PdfSequence } from './sequences/convertHtml2PdfSequence';
import { countryTypeChangeSequence } from './sequences/countryTypeChangeSequence';
import { createCaseDeadlineSequence } from './sequences/createCaseDeadlineSequence';
import { createWorkItemSequence } from './sequences/createWorkItemSequence';
import { deleteCaseDeadlineSequence } from './sequences/deleteCaseDeadlineSequence';
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
import { gotoBeforeStartCaseSequence } from './sequences/gotoBeforeStartCaseSequence';
import { gotoBeforeYouFileDocumentSequence } from './sequences/gotoBeforeYouFileDocumentSequence';
import { gotoCaseDetailSequence } from './sequences/gotoCaseDetailSequence';
import { gotoCreateOrderSequence } from './sequences/gotoCreateOrderSequence';
import { gotoDashboardSequence } from './sequences/gotoDashboardSequence';
import { gotoDocumentDetailSequence } from './sequences/gotoDocumentDetailSequence';
import { gotoFileDocumentSequence } from './sequences/gotoFileDocumentSequence';
import { gotoIdleLogoutSequence } from './sequences/gotoIdleLogoutSequence';
import { gotoLoginSequence } from './sequences/gotoLoginSequence';
import { gotoPrimaryContactEditSequence } from './sequences/gotoPrimaryContactEditSequence';
import { gotoRequestAccessSequence } from './sequences/gotoRequestAccessSequence';
import { gotoSelectDocumentTypeSequence } from './sequences/gotoSelectDocumentTypeSequence';
import { gotoSignPDFDocumentSequence } from './sequences/gotoSignPDFDocumentSequence';
import { gotoStartCaseWizardSequence } from './sequences/gotoStartCaseWizardSequence';
import { gotoStyleGuideSequence } from './sequences/gotoStyleGuideSequence';
import { gotoTrialSessionDetailSequence } from './sequences/gotoTrialSessionDetailSequence';
import { gotoTrialSessionWorkingCopySequence } from './sequences/gotoTrialSessionWorkingCopySequence';
import { gotoTrialSessionsSequence } from './sequences/gotoTrialSessionsSequence';
import { gotoViewAllDocumentsSequence } from './sequences/gotoViewAllDocumentsSequence';
import { loadPdfSequence } from './sequences/PDFPreviewModal/loadPdfSequence';
import { loginWithCodeSequence } from './sequences/loginWithCodeSequence';
import { loginWithTokenSequence } from './sequences/loginWithTokenSequence';
import { navigateToPathSequence } from './sequences/navigateToPathSequence';
import { notFoundErrorSequence } from './sequences/notFoundErrorSequence';
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
import { openEditCaseDeadlineModalSequence } from './sequences/openEditCaseDeadlineModalSequence';
import { openEditSecondaryContactModalSequence } from './sequences/openEditSecondaryContactModalSequence';
import { openPdfPreviewModalSequence } from './sequences/openPdfPreviewModalSequence';
import { openSelectDocumentWizardOverlaySequence } from './sequences/openSelectDocumentWizardOverlaySequence';
import { openServeConfirmModalDialogSequence } from './sequences/openServeConfirmModalDialogSequence';
import { openSetCalendarModalSequence } from './sequences/openSetCalendarModalSequence';
import { printDocketRecordSequence } from './sequences/printDocketRecordSequence';
import { redirectToLoginSequence } from './sequences/redirectToLoginSequence';
import { refreshCaseSequence } from './sequences/refreshCaseSequence';
import { removeBatchSequence } from './sequences/removeBatchSequence';
import { removeScannedPdfSequence } from './sequences/removeScannedPdfSequence';
import { removeYearAmountSequence } from './sequences/removeYearAmountSequence';
import { rescanBatchSequence } from './sequences/rescanBatchSequence';
import { reviewExternalDocumentInformationSequence } from './sequences/reviewExternalDocumentInformationSequence';
import { reviewRequestAccessInformationSequence } from './sequences/reviewRequestAccessInformationSequence';
import { runBatchProcessSequence } from './sequences/runBatchProcessSequence';
import { scannerShutdownSequence } from './sequences/scannerShutdownSequence';
import { scannerStartupSequence } from './sequences/scannerStartupSequence';
import { selectAssigneeSequence } from './sequences/selectAssigneeSequence';
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
import { signOutSequence } from './sequences/signOutSequence';
import { startScanSequence } from './sequences/startScanSequence';
import { state } from './state';
import { submitCaseAssociationRequestSequence } from './sequences/submitCaseAssociationRequestSequence';
import { submitCaseDetailEditSaveSequence } from './sequences/submitCaseDetailEditSaveSequence';
import { submitCaseSearchSequence } from './sequences/submitCaseSearchSequence';
import { submitCompleteSequence } from './sequences/submitCompleteSequence';
import { submitCourtIssuedOrderSequence } from './sequences/submitCourtIssuedOrderSequence';
import { submitCreateOrderModalSequence } from './sequences/submitCreateOrderModalSequence';
import { submitDocketEntrySequence } from './sequences/submitDocketEntrySequence';
import { submitEditPrimaryContactSequence } from './sequences/submitEditPrimaryContactSequence';
import { submitExternalDocumentSequence } from './sequences/submitExternalDocumentSequence';
import { submitFilePetitionSequence } from './sequences/submitFilePetitionSequence';
import { submitForwardSequence } from './sequences/submitForwardSequence';
import { submitLoginSequence } from './sequences/submitLoginSequence';
import { submitPetitionFromPaperSequence } from './sequences/submitPetitionFromPaperSequence';
import { submitPetitionToIRSHoldingQueueSequence } from './sequences/submitPetitionToIRSHoldingQueueSequence';
import { submitRecallPetitionFromIRSHoldingQueueSequence } from './sequences/submitRecallPetitionFromIRSHoldingQueueSequence';
import { submitSearchSequence } from './sequences/submitSearchSequence';
import { submitTrialSessionSequence } from './sequences/submitTrialSessionSequence';
import { submitUpdateCaseSequence } from './sequences/submitUpdateCaseSequence';
import { toggleAccountMenuSequence } from './sequences/toggleAccountMenuSequence';
import { toggleBetaBarSequence } from './sequences/toggleBetaBarSequence';
import { toggleCaseDifferenceSequence } from './sequences/toggleCaseDifferenceSequence';
import { toggleDocumentCategoryAccordionSequence } from './sequences/toggleDocumentCategoryAccordionSequence';
import { toggleMobileDocketSortSequence } from './sequences/toggleMobileDocketSortSequence';
import { toggleMobileMenuSequence } from './sequences/toggleMobileMenuSequence';
import { togglePaymentDetailsSequence } from './sequences/togglePaymentDetailsSequence';
import { toggleUsaBannerDetailsSequence } from './sequences/toggleUsaBannerDetailsSequence';
import { unauthorizedErrorSequence } from './sequences/unauthorizedErrorSequence';
import { unidentifiedUserErrorSequence } from './sequences/unidentifiedUserErrorSequence';
import { unsetFormSaveSuccessSequence } from './sequences/unsetFormSaveSuccessSequence';
import { unsetFormSubmittingSequence } from './sequences/unsetFormSubmittingSequence';
import { unsetWorkQueueIsInternalSequence } from './sequences/unsetWorkQueueIsInternalSequence';
import { updateCaseAssociationFormValueSequence } from './sequences/updateCaseAssociationFormValueSequence';
import { updateCaseDeadlineSequence } from './sequences/updateCaseDeadlineSequence';
import { updateCaseDetailSequence } from './sequences/updateCaseDetailSequence';
import { updateCasePartyTypeSequence } from './sequences/updateCasePartyTypeSequence';
import { updateCaseValueByIndexSequence } from './sequences/updateCaseValueByIndexSequence';
import { updateCaseValueSequence } from './sequences/updateCaseValueSequence';
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
import { validateOrderWithoutBodySequence } from './sequences/validateOrderWithoutBodySequence';
import { validatePetitionFromPaperSequence } from './sequences/validatePetitionFromPaperSequence';
import { validateSelectDocumentTypeSequence } from './sequences/validateSelectDocumentTypeSequence';
import { validateStartCaseWizardSequence } from './sequences/validateStartCaseWizardSequence';
import { validateTrialSessionSequence } from './sequences/validateTrialSessionSequence';
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
    appendNewYearAmountSequence,
    assignSelectedWorkItemsSequence,
    associatePractitionerWithCaseSequence,
    associateRespondentWithCaseSequence,
    autoSaveCaseSequence,
    cancelEditPrimaryContactSequence,
    cancelFileUploadSequence,
    cerebralBindSimpleSetStateSequence,
    chooseModalWizardStepSequence,
    chooseStartCaseWizardStepSequence,
    chooseWizardStepSequence,
    chooseWorkQueueSequence,
    clearDocumentSequence,
    clearModalSequence,
    clearPdfPreviewUrlSequence,
    clearPreferredTrialCitySequence,
    clearWizardDataSequence,
    clickServeToIrsSequence,
    closeAccountMenuSequence,
    closeDocumentCategoryAccordionSequence,
    closeModalAndReturnToCaseDetailSequence,
    closeModalAndReturnToDashboardSequence,
    closeModalAndReturnToTrialSessionsSequence,
    completeDocumentSelectSequence,
    completeDocumentSigningSequence,
    completeStartCaseWizardStepSequence,
    confirmStayLoggedInSequence,
    convertHtml2PdfSequence,
    countryTypeChangeSequence,
    createCaseDeadlineSequence,
    createWorkItemSequence,
    deleteCaseDeadlineSequence,
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
    gotoBeforeStartCaseSequence,
    gotoBeforeYouFileDocumentSequence,
    gotoCaseDetailSequence,
    gotoCreateOrderSequence,
    gotoDashboardSequence,
    gotoDocumentDetailSequence,
    gotoFileDocumentSequence,
    gotoIdleLogoutSequence,
    gotoLoginSequence,
    gotoPrimaryContactEditSequence,
    gotoRequestAccessSequence,
    gotoSelectDocumentTypeSequence,
    gotoSignPDFDocumentSequence,
    gotoStartCaseWizardSequence,
    gotoStyleGuideSequence,
    gotoTrialSessionDetailSequence,
    gotoTrialSessionWorkingCopySequence,
    gotoTrialSessionsSequence,
    gotoViewAllDocumentsSequence,
    loadPdfSequence,
    loginWithCodeSequence,
    loginWithTokenSequence,
    navigateToPathSequence,
    notFoundErrorSequence,
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
    openEditCaseDeadlineModalSequence,
    openEditSecondaryContactModalSequence,
    openPdfPreviewModalSequence,
    openSelectDocumentWizardOverlaySequence,
    openServeConfirmModalDialogSequence,
    openSetCalendarModalSequence,
    printDocketRecordSequence,
    redirectToLoginSequence,
    refreshCaseSequence,
    removeBatchSequence,
    removeScannedPdfSequence,
    removeYearAmountSequence,
    rescanBatchSequence,
    reviewExternalDocumentInformationSequence,
    reviewRequestAccessInformationSequence,
    runBatchProcessSequence,
    scannerShutdownSequence,
    scannerStartupSequence,
    selectAssigneeSequence,
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
    signOutSequence,
    startScanSequence,
    submitCaseAssociationRequestSequence,
    submitCaseDetailEditSaveSequence,
    submitCaseSearchSequence,
    submitCompleteSequence,
    submitCourtIssuedOrderSequence,
    submitCreateOrderModalSequence,
    submitDocketEntrySequence,
    submitEditPrimaryContactSequence,
    submitExternalDocumentSequence,
    submitFilePetitionSequence,
    submitForwardSequence,
    submitLoginSequence,
    submitPetitionFromPaperSequence,
    submitPetitionToIRSHoldingQueueSequence,
    submitRecallPetitionFromIRSHoldingQueueSequence,
    submitSearchSequence,
    submitTrialSessionSequence,
    submitUpdateCaseSequence,
    toggleAccountMenuSequence,
    toggleBetaBarSequence,
    toggleCaseDifferenceSequence,
    toggleDocumentCategoryAccordionSequence,
    toggleMobileDocketSortSequence,
    toggleMobileMenuSequence,
    togglePaymentDetailsSequence,
    toggleUsaBannerDetailsSequence,
    unauthorizedErrorSequence,
    unidentifiedUserErrorSequence,
    unsetFormSaveSuccessSequence,
    unsetFormSubmittingSequence,
    unsetWorkQueueIsInternalSequence,
    updateCaseAssociationFormValueSequence,
    updateCaseDeadlineSequence,
    updateCaseDetailSequence,
    updateCasePartyTypeSequence,
    updateCaseValueByIndexSequence,
    updateCaseValueSequence,
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
    validateOrderWithoutBodySequence,
    validatePetitionFromPaperSequence,
    validateSelectDocumentTypeSequence,
    validateStartCaseWizardSequence,
    validateTrialSessionSequence,
    viewDocumentSequence,
  },
  state,
};
