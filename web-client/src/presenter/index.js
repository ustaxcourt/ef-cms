import appendNewYearAmountSequence from './sequences/appendNewYearAmountSequence';
import assignSelectedWorkItemsSequence from './sequences/assignSelectedWorkItemsSequence';
import autoSaveCaseSequence from './sequences/autoSaveCaseSequence';
import chooseWorkQueueSequence from './sequences/chooseWorkQueueSequence';
import clearDocumentSequence from './sequences/clearDocumentSequence';
import clickServeToIrsSequence from './sequences/clickServeToIrsSequence';
import dismissAlertSequence from './sequences/dismissAlertSequence';
import dismissModalSequence from './sequences/dismissModalSequence';
import getTrialCitiesSequence from './sequences/getTrialCitiesSequence';
import gotoBeforeStartCaseSequence from './sequences/gotoBeforeStartCaseSequence';
import gotoCaseDetailSequence from './sequences/gotoCaseDetailSequence';
import gotoDashboardSequence from './sequences/gotoDashboardSequence';
import gotoDocumentDetailSequence from './sequences/gotoDocumentDetailSequence';
import gotoLogInSequence from './sequences/gotoLogInSequence';
import gotoStartCaseSequence from './sequences/gotoStartCaseSequence';
import gotoStyleGuideSequence from './sequences/gotoStyleGuideSequence';
import loginWithTokenSequence from './sequences/loginWithTokenSequence';
import removeYearAmountSequence from './sequences/removeYearAmountSequence';
import selectAssigneeSequence from './sequences/selectAssigneeSequence';
import selectWorkItemSequence from './sequences/selectWorkItemSequence';
import setCurrentPageErrorSequence from './sequences/setCurrentPageErrorSequence';
import setFocusedWorkItemSequence from './sequences/setFocusedWorkItemSequence';
import setModalDialogNameSequence from './sequences/setModalDialogNameSequence';
import setWorkItemActionSequence from './sequences/setWorkItemActionSequence';
import startACaseConfirmCancelSequence from './sequences/startACaseConfirmCancelSequence';
import startACaseToggleCancelSequence from './sequences/startACaseToggleCancelSequence';
import submitCaseDetailEditSaveSequence from './sequences/submitCaseDetailEditSaveSequence';
import submitCompleteSequence from './sequences/submitCompleteSequence';
import submitDocumentSequence from './sequences/submitDocumentSequence';
import submitFilePetitionSequence from './sequences/submitFilePetitionSequence';
import submitForwardSequence from './sequences/submitForwardSequence';
import submitLogInSequence from './sequences/submitLogInSequence';
import submitPetitionToIRSHoldingQueueSequence from './sequences/submitPetitionToIRSHoldingQueueSequence';
import submitRecallPetitionFromIRSHoldingQueueSequence from './sequences/submitRecallPetitionFromIRSHoldingQueueSequence';
import submitSearchSequence from './sequences/submitSearchSequence';
import submitUpdateCaseSequence from './sequences/submitUpdateCaseSequence';
import toggleCaseDifferenceSequence from './sequences/toggleCaseDifferenceSequence';
import toggleMobileMenuSequence from './sequences/toggleMobileMenuSequence';
import togglePaymentDetailsSequence from './sequences/togglePaymentDetailsSequence';
import toggleUsaBannerDetailsSequence from './sequences/toggleUsaBannerDetailsSequence';
import unauthorizedErrorSequence from './sequences/unauthorizedErrorSequence';
import unidentifiedUserErrorSequence from './sequences/unidentifiedUserErrorSequence';
import unsetFormSaveSuccessSequence from './sequences/unsetFormSaveSuccessSequence';
import updateCaseValueByIndexSequence from './sequences/updateCaseValueByIndexSequence';
import updateCaseValueSequence from './sequences/updateCaseValueSequence';
import updateCompleteFormValueSequence from './sequences/updateCompleteFormValueSequence';
import updateCurrentTabSequence from './sequences/updateCurrentTabSequence';
import updateDocumentValueSequence from './sequences/updateDocumentValueSequence';
import updateFormValueSequence from './sequences/updateFormValueSequence';
import updateForwardFormValueSequence from './sequences/updateForwardFormValueSequence';
import updatePetitionValueSequence from './sequences/updatePetitionValueSequence';
import updateSearchTermSequence from './sequences/updateSearchTermSequence';
import validateCaseDetailSequence from './sequences/validateCaseDetailSequence';
import viewDocumentSequence from './sequences/viewDocumentSequence';

import { ActionError } from './errors/ActionError';
import { InvalidRequestError } from './errors/InvalidRequestError';
import { ServerInvalidResponseError } from './errors/ServerInvalidResponseError';
import { UnauthorizedRequestError } from './errors/UnauthorizedRequestError';
import { UnidentifiedUserError } from './errors/UnidentifiedUserError';

import state from './state';

/**
 * Main Cerebral module
 */
export default {
  providers: {},
  sequences: {
    appendNewYearAmountSequence,
    assignSelectedWorkItemsSequence,
    autoSaveCaseSequence,
    chooseWorkQueueSequence,
    clearDocumentSequence,
    clickServeToIrsSequence,
    dismissAlertSequence,
    dismissModalSequence,
    getTrialCitiesSequence,
    gotoBeforeStartCaseSequence,
    gotoCaseDetailSequence,
    gotoDashboardSequence,
    gotoDocumentDetailSequence,
    gotoLogInSequence,
    gotoStartCaseSequence,
    gotoStyleGuideSequence,
    loginWithTokenSequence,
    removeYearAmountSequence,
    selectAssigneeSequence,
    selectWorkItemSequence,
    setFocusedWorkItemSequence,
    setModalDialogNameSequence,
    setWorkItemActionSequence,
    startACaseConfirmCancelSequence,
    startACaseToggleCancelSequence,
    submitCaseDetailEditSaveSequence,
    submitCompleteSequence,
    submitDocumentSequence,
    submitFilePetitionSequence,
    submitForwardSequence,
    submitLogInSequence,
    submitPetitionToIRSHoldingQueueSequence,
    submitRecallPetitionFromIRSHoldingQueueSequence,
    submitSearchSequence,
    submitUpdateCaseSequence,
    toggleCaseDifferenceSequence,
    toggleMobileMenuSequence,
    togglePaymentDetailsSequence,
    toggleUsaBannerDetailsSequence,
    unauthorizedErrorSequence,
    unidentifiedUserErrorSequence,
    unsetFormSaveSuccessSequence,
    updateCaseValueByIndexSequence,
    updateCaseValueSequence,
    updateCompleteFormValueSequence,
    updateCurrentTabSequence,
    updateDocumentValueSequence,
    updateFormValueSequence,
    updateForwardFormValueSequence,
    updatePetitionValueSequence,
    updateSearchTermSequence,
    validateCaseDetailSequence,
    viewDocumentSequence,
  },
  state,
  catch: [
    // ORDER MATTERS! Based on inheritance, the first match will be used
    [InvalidRequestError, setCurrentPageErrorSequence], // 418, other unknown 4xx series
    [ServerInvalidResponseError, setCurrentPageErrorSequence], // 501, 503, etc
    [UnauthorizedRequestError, unauthorizedErrorSequence], // 403, 404
    [UnidentifiedUserError, unidentifiedUserErrorSequence], //401
    [ActionError, setCurrentPageErrorSequence], // generic error handler
  ],
};
