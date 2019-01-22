import assignSelectedWorkItemsSequence from './sequences/assignSelectedWorkItemsSequence';
import clearDocumentSequence from './sequences/clearDocumentSequence';
import getTrialCitiesSequence from './sequences/getTrialCitiesSequence';
import gotoCaseDetailSequence from './sequences/gotoCaseDetailSequence';
import gotoDashboardSequence from './sequences/gotoDashboardSequence';
import gotoDocumentDetailSequence from './sequences/gotoDocumentDetailSequence';
import gotoLogInSequence from './sequences/gotoLogInSequence';
import gotoStartCaseSequence from './sequences/gotoStartCaseSequence';
import gotoStyleGuideSequence from './sequences/gotoStyleGuideSequence';
import loginWithTokenSequence from './sequences/loginWithTokenSequence';
import selectAssigneeSequence from './sequences/selectAssigneeSequence';
import selectWorkItemSequence from './sequences/selectWorkItemSequence';
import setFocusedWorkItemSequence from './sequences/setFocusedWorkItemSequence';
import setWorkItemActionSequence from './sequences/setWorkItemActionSequence';
import startACaseToggleCancelSequence from './sequences/startACaseToggleCancelSequence';
import startACaseConfirmCancelSequence from './sequences/startACaseConfirmCancelSequence';
import submitCompleteSequence from './sequences/submitCompleteSequence';
import submitDocumentSequence from './sequences/submitDocumentSequence';
import submitFilePetitionSequence from './sequences/submitFilePetitionSequence';
import submitForwardSequence from './sequences/submitForwardSequence';
import submitLogInSequence from './sequences/submitLogInSequence';
import submitSearchSequence from './sequences/submitSearchSequence';
import submitToIrsSequence from './sequences/submitToIrsSequence';
import submitUpdateCaseSequence from './sequences/submitUpdateCaseSequence';
import switchWorkQueueSequence from './sequences/switchWorkQueueSequence';
import toggleCaseDifferenceSequence from './sequences/toggleCaseDifferenceSequence';
import toggleMobileMenuSequence from './sequences/toggleMobileMenuSequence';
import togglePaymentDetailsSequence from './sequences/togglePaymentDetailsSequence';
import toggleUsaBannerDetailsSequence from './sequences/toggleUsaBannerDetailsSequence';
import updateCaseValueSequence from './sequences/updateCaseValueSequence';
import updateCompleteFormValueSequence from './sequences/updateCompleteFormValueSequence';
import updateCurrentTabSequence from './sequences/updateCurrentTabSequence';
import updateDocumentValueSequence from './sequences/updateDocumentValueSequence';
import updateFormValueSequence from './sequences/updateFormValueSequence';
import updateForwardFormValueSequence from './sequences/updateForwardFormValueSequence';
import updatePetitionValueSequence from './sequences/updatePetitionValueSequence';
import updateSearchTermSequence from './sequences/updateSearchTermSequence';
import viewDocumentSequence from './sequences/viewDocumentSequence';

import state from './state';

/**
 * Main Cerebral module
 */
export default {
  providers: {},
  sequences: {
    assignSelectedWorkItemsSequence,
    clearDocumentSequence,
    getTrialCitiesSequence,
    gotoCaseDetailSequence,
    gotoDashboardSequence,
    gotoDocumentDetailSequence,
    gotoLogInSequence,
    gotoStartCaseSequence,
    gotoStyleGuideSequence,
    loginWithTokenSequence,
    selectAssigneeSequence,
    selectWorkItemSequence,
    setFocusedWorkItemSequence,
    setWorkItemActionSequence,
    startACaseToggleCancelSequence,
    startACaseConfirmCancelSequence,
    submitCompleteSequence,
    submitDocumentSequence,
    submitFilePetitionSequence,
    submitForwardSequence,
    submitLogInSequence,
    submitSearchSequence,
    submitToIrsSequence,
    submitUpdateCaseSequence,
    switchWorkQueueSequence,
    toggleCaseDifferenceSequence,
    toggleMobileMenuSequence,
    togglePaymentDetailsSequence,
    toggleUsaBannerDetailsSequence,
    updateCaseValueSequence,
    updateCompleteFormValueSequence,
    updateCurrentTabSequence,
    updateDocumentValueSequence,
    updateFormValueSequence,
    updateForwardFormValueSequence,
    updatePetitionValueSequence,
    updateSearchTermSequence,
    viewDocumentSequence,
  },
  state,
};
