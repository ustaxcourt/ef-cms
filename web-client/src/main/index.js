import gotoCaseDetail from './sequences/gotoCaseDetail';
import gotoDashboard from './sequences/gotoDashboard';
import gotoFilePetition from './sequences/gotoFilePetition';
import gotoLogIn from './sequences/gotoLogIn';
import gotoStyleGuide from './sequences/gotoStyleGuide';
import submitFilePetition from './sequences/submitFilePetition';
import submitLogIn from './sequences/submitLogIn';
import submitSearch from './sequences/submitSearch';
import submitToIRS from './sequences/submitToIRS';
import submitUpdateCase from './sequences/submitUpdateCase';
import toggleDocumentValidation from './sequences/toggleDocumentValidation';
import togglePaymentDetails from './sequences/togglePaymentDetails';
import toggleMobileMenu from './sequences/toggleMobileMenu';
import toggleUsaBannerDetails from './sequences/toggleUsaBannerDetails';
import updateCaseValue from './sequences/updateCaseValue';
import updateFormValue from './sequences/updateFormValue';
import updatePetitionValue from './sequences/updatePetitionValue';
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
    gotoLogIn,
    gotoStyleGuide,
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
    updateSearchTerm,
  },
  state: {
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
    form: {},
    searchTerm: '',
    user: {
      userId: '',
      // userId: 'taxpayer',
      // firstName: 'taxpayer',
      // lastName: 'taxpayer',
      // token: 'taxpayer',
      // role: 'taxpayer',
    },
    caseDetail: {},
    cases: [],
    formattedCaseDetail,
    formattedCases,
    formattedSearchParams,
  },
};
