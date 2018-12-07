import gotoCaseDetail from './sequences/gotoCaseDetail';
import gotoDashboard from './sequences/gotoDashboard';
import gotoFilePetition from './sequences/gotoFilePetition';
import gotoFileDocument from './sequences/gotoFileDocument';
import gotoLogIn from './sequences/gotoLogIn';
import gotoStyleGuide from './sequences/gotoStyleGuide';
import loginWithToken from './sequences/loginWithToken';
import submitFilePetition from './sequences/submitFilePetition';
import submitDocument from './sequences/submitDocument';
import submitLogIn from './sequences/submitLogIn';
import submitSearch from './sequences/submitSearch';
import submitToIRS from './sequences/submitToIRS';
import submitUpdateCase from './sequences/submitUpdateCase';
import toggleDocumentValidation from './sequences/toggleDocumentValidation';
import togglePaymentDetails from './sequences/togglePaymentDetails';
import viewDocument from './sequences/viewDocument';
import toggleMobileMenu from './sequences/toggleMobileMenu';
import toggleUsaBannerDetails from './sequences/toggleUsaBannerDetails';
import updateCaseValue from './sequences/updateCaseValue';
import updateFormValue from './sequences/updateFormValue';
import updatePetitionValue from './sequences/updatePetitionValue';
import updateDocumentValue from './sequences/updateDocumentValue';
import updateSearchTerm from './sequences/updateSearchTerm';
import { formattedSearchParams } from './computeds/formattedSearchParams';
import {
  formattedCaseDetail,
  formattedCases,
} from './computeds/formattedCaseDetail';

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
  state: {
    path: '/',
    currentPage: 'Loading',
    usaBanner: {
      showDetails: false,
    },
    mobileMenu: {
      isVisible: false,
    },
    paymentInfo: {
      showDetails: false,
    },
    petition: {},
    document: {},
    form: {},
    searchTerm: '',
    user: {
      userId: '',
      // userId: 'taxpayer',
      // firstName: 'taxpayer',
      // lastName: 'taxpayer',
      // token: 'taxpayer',
      // role: 'taxpayer',

      // userId: 'petitionsclerk',
      // firstName: 'petitionsclerk',
      // lastName: 'petitionsclerk',
      // token: 'petitionsclerk',
      // role: 'petitionsclerk',

      // userId: 'irsattorney',
      // firstName: 'irsattorney',
      // lastName: 'irsattorney',
      // token: 'irsattorney',
      // role: 'irsattorney',
    },
    caseDetail: {},
    cases: [],
    formattedCaseDetail,
    formattedCases,
    formattedSearchParams,
  },
};
