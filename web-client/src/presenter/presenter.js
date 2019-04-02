import { ActionError } from './errors/ActionError';
import { appendNewYearAmountSequence } from './sequences/appendNewYearAmountSequence';
import { assignSelectedWorkItemsSequence } from './sequences/assignSelectedWorkItemsSequence';
import { autoSaveCaseSequence } from './sequences/autoSaveCaseSequence';
import { cerebralBindSimpleSetStateSequence } from './sequences/cerebralBindSimpleSetStateSequence';
import { chooseWorkQueueSequence } from './sequences/chooseWorkQueueSequence';
import { clearDocumentSequence } from './sequences/clearDocumentSequence';
import { clearPreferredTrialCitySequence } from './sequences/clearPreferredTrialCitySequence';
import { clickServeToIrsSequence } from './sequences/clickServeToIrsSequence';
import { closeDocumentCategoryAccordionSequence } from './sequences/closeDocumentCategoryAccordionSequence';
import { createWorkItemSequence } from './sequences/createWorkItemSequence';
import { dismissAlertSequence } from './sequences/dismissAlertSequence';
import { dismissCaseCaptionModalSequence } from './sequences/dismissCaseCaptionModalSequence';
import { dismissCreateMessageModalSequence } from './sequences/dismissCreateMessageModalSequence';
import { dismissSelectDocumentTypeModalSequence } from './sequences/dismissSelectDocumentTypeModalSequence';
import { dismissModalSequence } from './sequences/dismissModalSequence';
import { editSelectedDocumentSequence } from './sequences/editSelectedDocumentSequence';
import { getUsersInSectionSequence } from './sequences/getUsersInSectionSequence';
import { gotoBeforeStartCaseSequence } from './sequences/gotoBeforeStartCaseSequence';
import { gotoCaseDetailSequence } from './sequences/gotoCaseDetailSequence';
import { gotoDashboardSequence } from './sequences/gotoDashboardSequence';
import { gotoDocumentDetailSequence } from './sequences/gotoDocumentDetailSequence';
import { gotoFileDocumentSequence } from './sequences/gotoFileDocumentSequence';
import { gotoLoginSequence } from './sequences/gotoLoginSequence';
import { gotoStartCaseSequence } from './sequences/gotoStartCaseSequence';
import { gotoStyleGuideSequence } from './sequences/gotoStyleGuideSequence';
import { InvalidRequestError } from './errors/InvalidRequestError';
import { loginWithTokenSequence } from './sequences/loginWithTokenSequence';
import { NotFoundError } from './errors/NotFoundError';
import { notFoundErrorSequence } from './sequences/notFoundErrorSequence';
import { openCaseCaptionModalSequence } from './sequences/openCaseCaptionModalSequence';
import { openCreateMessageModalSequence } from './sequences/openCreateMessageModalSequence';
import { removeYearAmountSequence } from './sequences/removeYearAmountSequence';
import { runBatchProcessSequence } from './sequences/runBatchProcessSequence';
import { selectAssigneeSequence } from './sequences/selectAssigneeSequence';
import { selectWorkItemSequence } from './sequences/selectWorkItemSequence';
import { selectDocumentSequence } from './sequences/selectDocumentSequence';
import { ServerInvalidResponseError } from './errors/ServerInvalidResponseError';
import { setCaseCaptionSequence } from './sequences/setCaseCaptionSequence';
import { setCurrentPageErrorSequence } from './sequences/setCurrentPageErrorSequence';
import { setFocusedWorkItemSequence } from './sequences/setFocusedWorkItemSequence';
import { setIrsNoticeFalseSequence } from './sequences/setIrsNoticeFalseSequence';
import { setModalDialogNameSequence } from './sequences/setModalDialogNameSequence';
import { setWorkItemActionSequence } from './sequences/setWorkItemActionSequence';
import { signOutSequence } from './sequences/signOutSequence';
import { startACaseConfirmCancelSequence } from './sequences/startACaseConfirmCancelSequence';
import { startACaseToggleCancelSequence } from './sequences/startACaseToggleCancelSequence';
import { submitCaseDetailEditSaveSequence } from './sequences/submitCaseDetailEditSaveSequence';
import { submitCompleteSequence } from './sequences/submitCompleteSequence';
import { submitDocumentSequence } from './sequences/submitDocumentSequence';
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
import { UnauthorizedRequestError } from './errors/UnauthorizedRequestError';
import { UnidentifiedUserError } from './errors/UnidentifiedUserError';
import { unidentifiedUserErrorSequence } from './sequences/unidentifiedUserErrorSequence';
import { unsetFormSaveSuccessSequence } from './sequences/unsetFormSaveSuccessSequence';
import { updateCaseDetailSequence } from './sequences/updateCaseDetailSequence';
import { updateCasePartyTypeSequence } from './sequences/updateCasePartyTypeSequence';
import { updateCaseValueByIndexSequence } from './sequences/updateCaseValueByIndexSequence';
import { updateCaseValueSequence } from './sequences/updateCaseValueSequence';
import { updateCompleteFormValueSequence } from './sequences/updateCompleteFormValueSequence';
import { updateCurrentTabSequence } from './sequences/updateCurrentTabSequence';
import { updateDocumentValueSequence } from './sequences/updateDocumentValueSequence';
import { updateFormValueSequence } from './sequences/updateFormValueSequence';
import { updateForwardFormValueSequence } from './sequences/updateForwardFormValueSequence';
import { updateHasIrsNoticeFormValueSequence } from './sequences/updateHasIrsNoticeFormValueSequence';
import { updateMessageValueSequence } from './sequences/updateMessageValueSequence';
import { updatePetitionValueSequence } from './sequences/updatePetitionValueSequence';
import { updateSearchTermSequence } from './sequences/updateSearchTermSequence';
import { updateStartCaseFormValueSequence } from './sequences/updateStartCaseFormValueSequence';
import { validateCaseDetailSequence } from './sequences/validateCaseDetailSequence';
import { validateForwardMessageSequence } from './sequences/validateForwardMessageSequence';
import { validateInitialWorkItemMessageSequence } from './sequences/validateInitialWorkItemMessageSequence';
import { validatePetitionFromPaperSequence } from './sequences/validatePetitionFromPaperSequence';
import { validateStartCaseSequence } from './sequences/validateStartCaseSequence';
import { viewDocumentSequence } from './sequences/viewDocumentSequence';
import { state } from './state';

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
    chooseWorkQueueSequence,
    clearDocumentSequence,
    clearPreferredTrialCitySequence,
    clickServeToIrsSequence,
    closeDocumentCategoryAccordionSequence,
    createWorkItemSequence,
    dismissAlertSequence,
    dismissCaseCaptionModalSequence,
    dismissCreateMessageModalSequence,
    dismissModalSequence,
    dismissSelectDocumentTypeModalSequence,
    editSelectedDocumentSequence,
    getUsersInSectionSequence,
    gotoBeforeStartCaseSequence,
    gotoCaseDetailSequence,
    gotoDashboardSequence,
    gotoDocumentDetailSequence,
    gotoFileDocumentSequence,
    gotoLoginSequence,
    gotoStartCaseSequence,
    gotoStyleGuideSequence,
    loginWithTokenSequence,
    openCaseCaptionModalSequence,
    openCreateMessageModalSequence,
    removeYearAmountSequence,
    runBatchProcessSequence,
    selectAssigneeSequence,
    selectDocumentSequence,
    selectWorkItemSequence,
    setCaseCaptionSequence,
    setFocusedWorkItemSequence,
    setIrsNoticeFalseSequence,
    setModalDialogNameSequence,
    setWorkItemActionSequence,
    signOutSequence,
    startACaseConfirmCancelSequence,
    startACaseToggleCancelSequence,
    submitCaseDetailEditSaveSequence,
    submitCompleteSequence,
    submitDocumentSequence,
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
    updateFormValueSequence,
    updateForwardFormValueSequence,
    updateHasIrsNoticeFormValueSequence,
    updateMessageValueSequence,
    updatePetitionValueSequence,
    updateSearchTermSequence,
    updateStartCaseFormValueSequence,
    validateCaseDetailSequence,
    validateForwardMessageSequence,
    validateInitialWorkItemMessageSequence,
    validatePetitionFromPaperSequence,
    validateStartCaseSequence,
    viewDocumentSequence,
  },
  state,
};
