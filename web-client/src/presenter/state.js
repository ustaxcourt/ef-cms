import {
  formattedCaseDetail,
  formattedCases,
} from './computeds/formattedCaseDetail';
import { formattedSearchParams } from './computeds/formattedSearchParams';

export default {
  path: '/',
  currentPage: 'Loading',
  submitting: false,
  currentTab: '',
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
    role: 'public',

    // userId: 'taxpayer',
    // name: 'Tax Payer',
    // token: 'taxpayer',
    // role: 'taxpayer',

    // userId: 'petitionsclerk',
    // name: 'Clerk Kent',
    // token: 'petitionsclerk',
    // role: 'petitionsclerk',

    // userId: 'respondent',
    // name: 'Res Pondent',
    // token: 'respondent',
    // role: 'respondent',
  },
  caseDetail: {},
  cases: [],
  formattedCaseDetail,
  formattedCases,
  formattedSearchParams,
};
