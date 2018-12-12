import gotoCaseDetailSequence from './sequences/gotoCaseDetailSequence';
import gotoDashboardSequence from './sequences/gotoDashboardSequence';
import gotoFilePetitionSequence from './sequences/gotoFilePetitionSequence';
import gotoLogInSequence from './sequences/gotoLogInSequence';
import gotoStyleGuideSequence from './sequences/gotoStyleGuideSequence';
import loginWithTokenSequence from './sequences/loginWithTokenSequence';
import submitDocumentSequence from './sequences/submitDocumentSequence';
import submitFilePetitionSequence from './sequences/submitFilePetitionSequence';
import submitLogInSequence from './sequences/submitLogInSequence';
import submitSearchSequence from './sequences/submitSearchSequence';
import submitToIrsSequence from './sequences/submitToIrsSequence';
import submitUpdateCaseSequence from './sequences/submitUpdateCaseSequence';
import toggleMobileMenuSequence from './sequences/toggleMobileMenuSequence';
import togglePaymentDetailsSequence from './sequences/togglePaymentDetailsSequence';
import toggleUsaBannerDetailsSequence from './sequences/toggleUsaBannerDetailsSequence';
import updateCaseValueSequence from './sequences/updateCaseValueSequence';
import updateCurrentTabSequence from './sequences/updateCurrentTabSequence';
import updateDocumentValueSequence from './sequences/updateDocumentValueSequence';
import updateFormValueSequence from './sequences/updateFormValueSequence';
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
    gotoCaseDetailSequence,
    gotoDashboardSequence,
    gotoFilePetitionSequence,
    gotoLogInSequence,
    gotoStyleGuideSequence,
    loginWithTokenSequence,
    submitDocumentSequence,
    submitFilePetitionSequence,
    submitLogInSequence,
    submitSearchSequence,
    submitToIrsSequence,
    submitUpdateCaseSequence,
    toggleMobileMenuSequence,
    togglePaymentDetailsSequence,
    toggleUsaBannerDetailsSequence,
    updateCaseValueSequence,
    updateCurrentTabSequence,
    updateDocumentValueSequence,
    updateFormValueSequence,
    updatePetitionValueSequence,
    updateSearchTermSequence,
    viewDocumentSequence,
  },
  state,
};
