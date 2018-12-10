import gotoCaseDetail from './sequences/gotoCaseDetail';
import gotoDashboard from './sequences/gotoDashboard';
import gotoFileDocument from './sequences/gotoFileDocument';
import gotoFilePetition from './sequences/gotoFilePetition';
import gotoLogIn from './sequences/gotoLogIn';
import gotoStyleGuide from './sequences/gotoStyleGuide';
import loginWithToken from './sequences/loginWithToken';
import submitDocument from './sequences/submitDocument';
import submitFilePetition from './sequences/submitFilePetition';
import submitLogIn from './sequences/submitLogIn';
import submitSearch from './sequences/submitSearch';
import submitToIRS from './sequences/submitToIRS';
import submitUpdateCase from './sequences/submitUpdateCase';
import toggleDocumentValidation from './sequences/toggleDocumentValidation';
import toggleMobileMenu from './sequences/toggleMobileMenu';
import togglePaymentDetails from './sequences/togglePaymentDetails';
import toggleUsaBannerDetails from './sequences/toggleUsaBannerDetails';
import updateCaseValue from './sequences/updateCaseValue';
import updateDocumentValue from './sequences/updateDocumentValue';
import updateFormValue from './sequences/updateFormValue';
import updatePetitionValue from './sequences/updatePetitionValue';
import updateSearchTerm from './sequences/updateSearchTerm';
import viewDocument from './sequences/viewDocument';

import state from './state';

/**
 * Main Cerebral module
 */
export default {
  providers: {},
  sequences: {
    gotoCaseDetail,
    gotoDashboard,
    gotoFilePetition,
    gotoFileDocument,
    gotoLogIn,
    gotoStyleGuide,
    loginWithToken,
    submitDocument,
    submitFilePetition,
    submitLogIn,
    submitSearch,
    submitToIRS,
    submitUpdateCase,
    toggleDocumentValidation,
    togglePaymentDetails,
    toggleMobileMenu,
    toggleUsaBannerDetails,
    updateCaseValue,
    updateFormValue,
    updatePetitionValue,
    updateDocumentValue,
    updateSearchTerm,
    viewDocument,
  },
  state,
};
