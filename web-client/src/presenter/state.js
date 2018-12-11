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

    // userId: 'taxpayer',
    // firstName: 'Tax',
    // lastName: 'Payer',
    // token: 'taxpayer',
    // role: 'taxpayer',

    // userId: 'petitionsclerk',
    // firstName: 'Clerk',
    // lastName: 'Kent',
    // token: 'petitionsclerk',
    // role: 'petitionsclerk',

    // userId: 'respondent',
    // firstName: 'Res',
    // lastName: 'Pondent',
    // token: 'respondent',
    // role: 'respondent',
  },
  caseDetail: {},
  cases: [],
  formattedCaseDetail,
  formattedCases,
  formattedSearchParams,
};
