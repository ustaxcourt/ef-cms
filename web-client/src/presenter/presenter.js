import { ActionError } from './errors/ActionError';
import { InvalidRequestError } from './errors/InvalidRequestError';
import { NotFoundError } from './errors/NotFoundError';
import { ServerInvalidResponseError } from './errors/ServerInvalidResponseError';
import { UnauthorizedRequestError } from './errors/UnauthorizedRequestError';
import { UnidentifiedUserError } from './errors/UnidentifiedUserError';
import { appendNewYearAmountSequence } from './sequences/appendNewYearAmountSequence';
import { assignSelectedWorkItemsSequence } from './sequences/assignSelectedWorkItemsSequence';
import { autoSaveCaseSequence } from './sequences/autoSaveCaseSequence';
import { cerebralBindSimpleSetStateSequence } from './sequences/cerebralBindSimpleSetStateSequence';
import { chooseWizardStepSequence } from './sequences/chooseWizardStepSequence';
import { chooseWorkQueueSequence } from './sequences/chooseWorkQueueSequence';
import { clearDocumentSequence } from './sequences/clearDocumentSequence';
import { clearPreferredTrialCitySequence } from './sequences/clearPreferredTrialCitySequence';
import { clearWizardDataSequence } from './sequences/clearWizardDataSequence';
import { clickServeToIrsSequence } from './sequences/clickServeToIrsSequence';
import { closeDocumentCategoryAccordionSequence } from './sequences/closeDocumentCategoryAccordionSequence';
import { closeModalAndReturnToDashboardSequence } from './sequences/closeModalAndReturnToDashboardSequence';
import { confirmStayLoggedInSequence } from './sequences/confirmStayLoggedInSequence';
import { createWorkItemSequence } from './sequences/createWorkItemSequence';
import { dismissAlertSequence } from './sequences/dismissAlertSequence';
import { dismissCaseCaptionModalSequence } from './sequences/dismissCaseCaptionModalSequence';
import { dismissCreateMessageModalSequence } from './sequences/dismissCreateMessageModalSequence';
import { dismissModalSequence } from './sequences/dismissModalSequence';
import { editSelectedDocumentSequence } from './sequences/editSelectedDocumentSequence';
import { editSelectedSecondaryDocumentSequence } from './sequences/editSelectedSecondaryDocumentSequence';
import { formCancelToggleCancelSequence } from './sequences/formCancelToggleCancelSequence';
import { getUsersInSectionSequence } from './sequences/getUsersInSectionSequence';
import { gotoBeforeStartCaseSequence } from './sequences/gotoBeforeStartCaseSequence';
import { gotoCaseDetailSequence } from './sequences/gotoCaseDetailSequence';
import { gotoDashboardSequence } from './sequences/gotoDashboardSequence';
import { gotoDocumentDetailMessageSequence } from './sequences/gotoDocumentDetailMessageSequence';
import { gotoDocumentDetailSequence } from './sequences/gotoDocumentDetailSequence';
import { gotoFileDocumentSequence } from './sequences/gotoFileDocumentSequence';
import { gotoIdleLogoutSequence } from './sequences/gotoIdleLogoutSequence';
import { gotoLoginSequence } from './sequences/gotoLoginSequence';
import { gotoRequestAccessSequence } from './sequences/gotoRequestAccessSequence';
import { gotoSelectDocumentTypeSequence } from './sequences/gotoSelectDocumentTypeSequence';
import { gotoStartCaseSequence } from './sequences/gotoStartCaseSequence';
import { gotoStyleGuideSequence } from './sequences/gotoStyleGuideSequence';
import { loginWithCodeSequence } from './sequences/loginWithCodeSequence';
import { loginWithTokenSequence } from './sequences/loginWithTokenSequence';
import { notFoundErrorSequence } from './sequences/notFoundErrorSequence';
import { openCaseCaptionModalSequence } from './sequences/openCaseCaptionModalSequence';
import { openCreateMessageModalSequence } from './sequences/openCreateMessageModalSequence';
import { refreshCaseSequence } from './sequences/refreshCaseSequence';
import { refreshTokenSequence } from './sequences/refreshTokenSequence';
import { removeYearAmountSequence } from './sequences/removeYearAmountSequence';
import { reviewExternalDocumentInformationSequence } from './sequences/reviewExternalDocumentInformationSequence';
import { reviewRequestAccessInformationSequence } from './sequences/reviewRequestAccessInformationSequence';
import { runBatchProcessSequence } from './sequences/runBatchProcessSequence';
import { selectAssigneeSequence } from './sequences/selectAssigneeSequence';
import { selectDocumentSequence } from './sequences/selectDocumentSequence';
import { selectSecondaryDocumentSequence } from './sequences/selectSecondaryDocumentSequence';
import { selectWorkItemSequence } from './sequences/selectWorkItemSequence';
import { setCaseCaptionSequence } from './sequences/setCaseCaptionSequence';
import { setCurrentPageErrorSequence } from './sequences/setCurrentPageErrorSequence';
import { setFocusedWorkItemSequence } from './sequences/setFocusedWorkItemSequence';
import { setIdleStatusIdleSequence } from './sequences/setIdleStatusIdleSequence';
import { setIrsNoticeFalseSequence } from './sequences/setIrsNoticeFalseSequence';
import { setModalDialogNameSequence } from './sequences/setModalDialogNameSequence';
import { setWorkItemActionSequence } from './sequences/setWorkItemActionSequence';
import { showDocketRecordDetailModalSequence } from './sequences/showDocketRecordDetailModalSequence';
import { signOutSequence } from './sequences/signOutSequence';
import { state } from './state';
import { submitCaseAssociationRequestSequence } from './sequences/submitCaseAssociationRequestSequence';
import { submitCaseDetailEditSaveSequence } from './sequences/submitCaseDetailEditSaveSequence';
import { submitCaseSearchSequence } from './sequences/submitCaseSearchSequence';
import { submitCompleteSequence } from './sequences/submitCompleteSequence';
import { submitExternalDocumentSequence } from './sequences/submitExternalDocumentSequence';
import { submitFilePetitionSequence } from './sequences/submitFilePetitionSequence';
import { submitForwardSequence } from './sequences/submitForwardSequence';
import { submitLoginSequence } from './sequences/submitLoginSequence';
import { submitPetitionFromPaperSequence } from './sequences/submitPetitionFromPaperSequence';
import { submitPetitionToIRSHoldingQueueSequence } from './sequences/submitPetitionToIRSHoldingQueueSequence';
import { submitRecallPetitionFromIRSHoldingQueueSequence } from './sequences/submitRecallPetitionFromIRSHoldingQueueSequence';
import { submitSearchSequence } from './sequences/submitSearchSequence';
import { submitUpdateCaseSequence } from './sequences/submitUpdateCaseSequence';
import { toggleCaseDifferenceSequence } from './sequences/toggleCaseDifferenceSequence';
import { toggleDocumentCategoryAccordionSequence } from './sequences/toggleDocumentCategoryAccordionSequence';
import { toggleMobileMenuSequence } from './sequences/toggleMobileMenuSequence';
import { togglePaymentDetailsSequence } from './sequences/togglePaymentDetailsSequence';
import { toggleUsaBannerDetailsSequence } from './sequences/toggleUsaBannerDetailsSequence';
import { unauthorizedErrorSequence } from './sequences/unauthorizedErrorSequence';
import { unidentifiedUserErrorSequence } from './sequences/unidentifiedUserErrorSequence';
import { unsetFormSaveSuccessSequence } from './sequences/unsetFormSaveSuccessSequence';
import { updateCaseDetailSequence } from './sequences/updateCaseDetailSequence';
import { updateCasePartyTypeSequence } from './sequences/updateCasePartyTypeSequence';
import { updateCaseValueByIndexSequence } from './sequences/updateCaseValueByIndexSequence';
import { updateCaseValueSequence } from './sequences/updateCaseValueSequence';
import { updateCompleteFormValueSequence } from './sequences/updateCompleteFormValueSequence';
import { updateCurrentTabSequence } from './sequences/updateCurrentTabSequence';
import { updateDocumentValueSequence } from './sequences/updateDocumentValueSequence';
import { updateFileDocumentWizardFormValueSequence } from './sequences/updateFileDocumentWizardFormValueSequence';
import { updateFormValueSequence } from './sequences/updateFormValueSequence';
import { updateForwardFormValueSequence } from './sequences/updateForwardFormValueSequence';
import { updateHasIrsNoticeFormValueSequence } from './sequences/updateHasIrsNoticeFormValueSequence';
import { updateMessageValueSequence } from './sequences/updateMessageValueSequence';
import { updatePetitionValueSequence } from './sequences/updatePetitionValueSequence';
import { updateSearchTermSequence } from './sequences/updateSearchTermSequence';
import { updateStartCaseFormValueSequence } from './sequences/updateStartCaseFormValueSequence';
import { validateCaseAssociationRequestSequence } from './sequences/validateCaseAssociationRequestSequence';
import { validateCaseDetailSequence } from './sequences/validateCaseDetailSequence';
import { validateExternalDocumentInformationSequence } from './sequences/validateExternalDocumentInformationSequence';
import { validateForwardMessageSequence } from './sequences/validateForwardMessageSequence';
import { validateInitialWorkItemMessageSequence } from './sequences/validateInitialWorkItemMessageSequence';
import { validatePetitionFromPaperSequence } from './sequences/validatePetitionFromPaperSequence';
import { validateSelectDocumentTypeSequence } from './sequences/validateSelectDocumentTypeSequence';
import { validateStartCaseSequence } from './sequences/validateStartCaseSequence';
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
    cerebralBindSimpleSetStateSequence,
    chooseWizardStepSequence,
    chooseWorkQueueSequence,
    clearDocumentSequence,
    clearPreferredTrialCitySequence,
    clearWizardDataSequence,
    clickServeToIrsSequence,
    closeDocumentCategoryAccordionSequence,
    closeModalAndReturnToDashboardSequence,
    confirmStayLoggedInSequence,
    createWorkItemSequence,
    dismissAlertSequence,
    dismissCaseCaptionModalSequence,
    dismissCreateMessageModalSequence,
    dismissModalSequence,
    editSelectedDocumentSequence,
    editSelectedSecondaryDocumentSequence,
    formCancelToggleCancelSequence,
    getUsersInSectionSequence,
    gotoBeforeStartCaseSequence,
    gotoCaseDetailSequence,
    gotoDashboardSequence,
    gotoDocumentDetailMessageSequence,
    gotoDocumentDetailSequence,
    gotoFileDocumentSequence,
    gotoIdleLogoutSequence,
    gotoLoginSequence,
    gotoRequestAccessSequence,
    gotoSelectDocumentTypeSequence,
    gotoStartCaseSequence,
    gotoStyleGuideSequence,
    loginWithCodeSequence,
    loginWithTokenSequence,
    openCaseCaptionModalSequence,
    openCreateMessageModalSequence,
    refreshCaseSequence,
    refreshTokenSequence,
    removeYearAmountSequence,
    reviewExternalDocumentInformationSequence,
    reviewRequestAccessInformationSequence,
    runBatchProcessSequence,
    selectAssigneeSequence,
    selectDocumentSequence,
    selectSecondaryDocumentSequence,
    selectWorkItemSequence,
    setCaseCaptionSequence,
    setFocusedWorkItemSequence,
    setIdleStatusIdleSequence,
    setIrsNoticeFalseSequence,
    setModalDialogNameSequence,
    setWorkItemActionSequence,
    showDocketRecordDetailModalSequence,
    signOutSequence,
    submitCaseAssociationRequestSequence,
    submitCaseDetailEditSaveSequence,
    submitCaseSearchSequence,
    submitCompleteSequence,
    submitExternalDocumentSequence,
    submitFilePetitionSequence,
    submitForwardSequence,
    submitLoginSequence,
    submitPetitionFromPaperSequence,
    submitPetitionToIRSHoldingQueueSequence,
    submitRecallPetitionFromIRSHoldingQueueSequence,
    submitSearchSequence,
    submitUpdateCaseSequence,
    toggleCaseDifferenceSequence,
    toggleDocumentCategoryAccordionSequence,
    toggleMobileMenuSequence,
    togglePaymentDetailsSequence,
    toggleUsaBannerDetailsSequence,
    unauthorizedErrorSequence,
    unidentifiedUserErrorSequence,
    unsetFormSaveSuccessSequence,
    updateCaseDetailSequence,
    updateCasePartyTypeSequence,
    updateCaseValueByIndexSequence,
    updateCaseValueSequence,
    updateCompleteFormValueSequence,
    updateCurrentTabSequence,
    updateDocumentValueSequence,
    updateFileDocumentWizardFormValueSequence,
    updateFormValueSequence,
    updateForwardFormValueSequence,
    updateHasIrsNoticeFormValueSequence,
    updateMessageValueSequence,
    updatePetitionValueSequence,
    updateSearchTermSequence,
    updateStartCaseFormValueSequence,
    validateCaseAssociationRequestSequence,
    validateCaseDetailSequence,
    validateExternalDocumentInformationSequence,
    validateForwardMessageSequence,
    validateInitialWorkItemMessageSequence,
    validatePetitionFromPaperSequence,
    validateSelectDocumentTypeSequence,
    validateStartCaseSequence,
    viewDocumentSequence,
  },
  state,
};
