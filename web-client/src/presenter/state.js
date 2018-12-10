import {
  formattedCaseDetail,
  formattedCases,
} from './computeds/formattedCaseDetail';
import { formattedSearchParams } from './computeds/formattedSearchParams';

export default {
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

    // userId: 'respondent',
    // firstName: 'respondent',
    // lastName: 'respondent',
    // token: 'respondent',
    // role: 'respondent',
  },
  caseDetail: {},
  cases: [],
  formattedCaseDetail,
  formattedCases,
  formattedSearchParams,
};
