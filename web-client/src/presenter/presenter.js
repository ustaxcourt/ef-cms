import { ActionError } from './errors/ActionError';
import { InvalidRequestError } from './errors/InvalidRequestError';
import { NotFoundError } from './errors/NotFoundError';
import { ServerInvalidResponseError } from './errors/ServerInvalidResponseError';
import { UnauthorizedRequestError } from './errors/UnauthorizedRequestError';
import { UnidentifiedUserError } from './errors/UnidentifiedUserError';
import { appendNewYearAmountSequence } from './sequences/appendNewYearAmountSequence';
import { assignSelectedWorkItemsSequence } from './sequences/assignSelectedWorkItemsSequence';
import { autoSaveCaseSequence } from './sequences/autoSaveCaseSequence';
import { cancelFileUploadSequence } from './sequences/cancelFileUploadSequence';
import { cerebralBindSimpleSetStateSequence } from './sequences/cerebralBindSimpleSetStateSequence';
import { chooseWizardStepSequence } from './sequences/chooseWizardStepSequence';
import { chooseWorkQueueSequence } from './sequences/chooseWorkQueueSequence';
import { clearDocumentSequence } from './sequences/clearDocumentSequence';
import { clearPreferredTrialCitySequence } from './sequences/clearPreferredTrialCitySequence';
import { clearWizardDataSequence } from './sequences/clearWizardDataSequence';
import { clickServeToIrsSequence } from './sequences/clickServeToIrsSequence';
import { closeAccountMenuSequence } from './sequences/closeAccountMenuSequence';
import { closeDocumentCategoryAccordionSequence } from './sequences/closeDocumentCategoryAccordionSequence';
import { closeModalAndReturnToCaseDetailSequence } from './sequences/closeModalAndReturnToCaseDetailSequence';
import { closeModalAndReturnToDashboardSequence } from './sequences/closeModalAndReturnToDashboardSequence';
import { closeModalAndReturnToTrialSessionsSequence } from './sequences/closeModalAndReturnToTrialSessionsSequence';
import { completeDocumentSigningSequence } from './sequences/completeDocumentSigningSequence';
import { completeScanSequence } from './sequences/completeScanSequence';
import { confirmStayLoggedInSequence } from './sequences/confirmStayLoggedInSequence';
import { convertHtml2PdfSequence } from './sequences/convertHtml2PdfSequence';
import { createWorkItemSequence } from './sequences/createWorkItemSequence';
import { dismissAlertSequence } from './sequences/dismissAlertSequence';
import { dismissCaseCaptionModalSequence } from './sequences/dismissCaseCaptionModalSequence';
import { dismissCreateMessageModalSequence } from './sequences/dismissCreateMessageModalSequence';
import { dismissModalSequence } from './sequences/dismissModalSequence';
import { editSelectedDocumentSequence } from './sequences/editSelectedDocumentSequence';
import { editSelectedSecondaryDocumentSequence } from './sequences/editSelectedSecondaryDocumentSequence';
import { fetchUserNotificationsSequence } from './sequences/fetchUserNotificationsSequence';
import { formCancelToggleCancelSequence } from './sequences/formCancelToggleCancelSequence';
import { getUsersInSectionSequence } from './sequences/getUsersInSectionSequence';
import { gotoAddDocketEntrySequence } from './sequences/gotoAddDocketEntrySequence';
import { gotoAddTrialSessionSequence } from './sequences/gotoAddTrialSessionSequence';
import { gotoBeforeStartCaseSequence } from './sequences/gotoBeforeStartCaseSequence';
import { gotoCaseDetailSequence } from './sequences/gotoCaseDetailSequence';
import { gotoCreateOrderSequence } from './sequences/gotoCreateOrderSequence';
import { gotoDashboardSequence } from './sequences/gotoDashboardSequence';
import { gotoDocumentDetailSequence } from './sequences/gotoDocumentDetailSequence';
import { gotoFileDocumentSequence } from './sequences/gotoFileDocumentSequence';
import { gotoIdleLogoutSequence } from './sequences/gotoIdleLogoutSequence';
import { gotoLoginSequence } from './sequences/gotoLoginSequence';
import { gotoRequestAccessSequence } from './sequences/gotoRequestAccessSequence';
import { gotoSelectDocumentTypeSequence } from './sequences/gotoSelectDocumentTypeSequence';
import { gotoSignPDFDocumentSequence } from './sequences/gotoSignPDFDocumentSequence';
import { gotoStartCaseSequence } from './sequences/gotoStartCaseSequence';
import { gotoStyleGuideSequence } from './sequences/gotoStyleGuideSequence';
import { gotoTrialSessionDetailSequence } from './sequences/gotoTrialSessionDetailSequence';
import { gotoTrialSessionsSequence } from './sequences/gotoTrialSessionsSequence';
import { loginWithCodeSequence } from './sequences/loginWithCodeSequence';
import { loginWithTokenSequence } from './sequences/loginWithTokenSequence';
import { navigateToPathSequence } from './sequences/navigateToPathSequence';
import { notFoundErrorSequence } from './sequences/notFoundErrorSequence';
import { openCaseCaptionModalSequence } from './sequences/openCaseCaptionModalSequence';
import { openCreateMessageModalSequence } from './sequences/openCreateMessageModalSequence';
import { openCreateOrderChooseTypeModalSequence } from './sequences/openCreateOrderChooseTypeModalSequence';
import { openSetCalendarModalSequence } from './sequences/openSetCalendarModalSequence';
import { redirectToLoginSequence } from './sequences/redirectToLoginSequence';
import { refreshCaseSequence } from './sequences/refreshCaseSequence';
import { refreshSectionInboxCountSequence } from './sequences/refreshSectionInboxCountSequence';
import { removeYearAmountSequence } from './sequences/removeYearAmountSequence';
import { reviewExternalDocumentInformationSequence } from './sequences/reviewExternalDocumentInformationSequence';
import { reviewRequestAccessInformationSequence } from './sequences/reviewRequestAccessInformationSequence';
import { runBatchProcessSequence } from './sequences/runBatchProcessSequence';
import { scannerShutdownSequence } from './sequences/scannerShutdownSequence';
import { scannerStartupSequence } from './sequences/scannerStartupSequence';
import { selectAssigneeSequence } from './sequences/selectAssigneeSequence';
import { selectDocumentSequence } from './sequences/selectDocumentSequence';
import { selectSecondaryDocumentSequence } from './sequences/selectSecondaryDocumentSequence';
import { selectWorkItemSequence } from './sequences/selectWorkItemSequence';
import { setCanvasForPDFSigningSequence } from './sequences/setCanvasForPDFSigningSequence';
import { setCaseCaptionSequence } from './sequences/setCaseCaptionSequence';
import { setCaseToReadyForTrialSequence } from './sequences/setCaseToReadyForTrialSequence';
import { setCurrentPageErrorSequence } from './sequences/setCurrentPageErrorSequence';
import { setDocumentDetailTabSequence } from './sequences/setDocumentDetailTabSequence';
import { setFocusedWorkItemSequence } from './sequences/setFocusedWorkItemSequence';
import { setIdleStatusIdleSequence } from './sequences/setIdleStatusIdleSequence';
import { setIrsNoticeFalseSequence } from './sequences/setIrsNoticeFalseSequence';
import { setModalDialogNameSequence } from './sequences/setModalDialogNameSequence';
import { setPDFPageForSigningSequence } from './sequences/setPDFPageForSigningSequence';
import { setPDFSignatureDataSequence } from './sequences/setPDFSignatureDataSequence';
import { setScannerSourceSequence } from './sequences/setScannerSourceSequence';
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
import { submitCreateOrderModalSequence } from './sequences/submitCreateOrderModalSequence';
import { submitDocketEntrySequence } from './sequences/submitDocketEntrySequence';
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
import { unsetWorkQueueIsInternalSequence } from './sequences/unsetWorkQueueIsInternalSequence';
import { updateCaseAssociationFormValueSequence } from './sequences/updateCaseAssociationFormValueSequence';
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
import { updateHasIrsNoticeFormValueSequence } from './sequences/updateHasIrsNoticeFormValueSequence';
import { updateMessageValueSequence } from './sequences/updateMessageValueSequence';
import { updatePetitionValueSequence } from './sequences/updatePetitionValueSequence';
import { updateScreenMetadataSequence } from './sequences/updateScreenMetadataSequence';
import { updateSearchTermSequence } from './sequences/updateSearchTermSequence';
import { updateSessionMetadataSequence } from './sequences/updateSessionMetadataSequence';
import { updateStartCaseFormValueSequence } from './sequences/updateStartCaseFormValueSequence';
import { updateTrialSessionFormDataSequence } from './sequences/updateTrialSessionFormDataSequence';
import { validateCaseAssociationRequestSequence } from './sequences/validateCaseAssociationRequestSequence';
import { validateCaseDetailSequence } from './sequences/validateCaseDetailSequence';
import { validateDocketEntrySequence } from './sequences/validateDocketEntrySequence';
import { validateExternalDocumentInformationSequence } from './sequences/validateExternalDocumentInformationSequence';
import { validateForwardMessageSequence } from './sequences/validateForwardMessageSequence';
import { validateInitialWorkItemMessageSequence } from './sequences/validateInitialWorkItemMessageSequence';
import { validateOrderWithoutBodySequence } from './sequences/validateOrderWithoutBodySequence';
import { validatePetitionFromPaperSequence } from './sequences/validatePetitionFromPaperSequence';
import { validateSelectDocumentTypeSequence } from './sequences/validateSelectDocumentTypeSequence';
import { validateStartCaseSequence } from './sequences/validateStartCaseSequence';
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
    appendNewYearAmountSequence,
    assignSelectedWorkItemsSequence,
    autoSaveCaseSequence,
    cancelFileUploadSequence,
    cerebralBindSimpleSetStateSequence,
    chooseWizardStepSequence,
    chooseWorkQueueSequence,
    clearDocumentSequence,
    clearPreferredTrialCitySequence,
    clearWizardDataSequence,
    clickServeToIrsSequence,
    closeAccountMenuSequence,
    closeDocumentCategoryAccordionSequence,
    closeModalAndReturnToCaseDetailSequence,
    closeModalAndReturnToDashboardSequence,
    closeModalAndReturnToTrialSessionsSequence,
    completeDocumentSigningSequence,
    completeScanSequence,
    confirmStayLoggedInSequence,
    convertHtml2PdfSequence,
    createWorkItemSequence,
    dismissAlertSequence,
    dismissCaseCaptionModalSequence,
    dismissCreateMessageModalSequence,
    dismissModalSequence,
    editSelectedDocumentSequence,
    editSelectedSecondaryDocumentSequence,
    fetchUserNotificationsSequence,
    formCancelToggleCancelSequence,
    getUsersInSectionSequence,
    gotoAddDocketEntrySequence,
    gotoAddTrialSessionSequence,
    gotoBeforeStartCaseSequence,
    gotoCaseDetailSequence,
    gotoCreateOrderSequence,
    gotoDashboardSequence,
    gotoDocumentDetailSequence,
    gotoFileDocumentSequence,
    gotoIdleLogoutSequence,
    gotoLoginSequence,
    gotoRequestAccessSequence,
    gotoSelectDocumentTypeSequence,
    gotoSignPDFDocumentSequence,
    gotoStartCaseSequence,
    gotoStyleGuideSequence,
    gotoTrialSessionDetailSequence,
    gotoTrialSessionsSequence,
    loginWithCodeSequence,
    loginWithTokenSequence,
    navigateToPathSequence,
    notFoundErrorSequence,
    openCaseCaptionModalSequence,
    openCreateMessageModalSequence,
    openCreateOrderChooseTypeModalSequence,
    openSetCalendarModalSequence,
    redirectToLoginSequence,
    refreshCaseSequence,
    refreshSectionInboxCountSequence,
    removeYearAmountSequence,
    reviewExternalDocumentInformationSequence,
    reviewRequestAccessInformationSequence,
    runBatchProcessSequence,
    scannerShutdownSequence,
    scannerStartupSequence,
    selectAssigneeSequence,
    selectDocumentSequence,
    selectSecondaryDocumentSequence,
    selectWorkItemSequence,
    setCanvasForPDFSigningSequence,
    setCaseCaptionSequence,
    setCaseToReadyForTrialSequence,
    setDocumentDetailTabSequence,
    setFocusedWorkItemSequence,
    setIdleStatusIdleSequence,
    setIrsNoticeFalseSequence,
    setModalDialogNameSequence,
    setPDFPageForSigningSequence,
    setPDFSignatureDataSequence,
    setScannerSourceSequence,
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
    submitCreateOrderModalSequence,
    submitDocketEntrySequence,
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
    unsetWorkQueueIsInternalSequence,
    updateCaseAssociationFormValueSequence,
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
    updateHasIrsNoticeFormValueSequence,
    updateMessageValueSequence,
    updatePetitionValueSequence,
    updateScreenMetadataSequence,
    updateSearchTermSequence,
    updateSessionMetadataSequence,
    updateStartCaseFormValueSequence,
    updateTrialSessionFormDataSequence,
    validateCaseAssociationRequestSequence,
    validateCaseDetailSequence,
    validateDocketEntrySequence,
    validateExternalDocumentInformationSequence,
    validateForwardMessageSequence,
    validateInitialWorkItemMessageSequence,
    validateOrderWithoutBodySequence,
    validatePetitionFromPaperSequence,
    validateSelectDocumentTypeSequence,
    validateStartCaseSequence,
    validateTrialSessionSequence,
    viewDocumentSequence,
  },
  state,
};
