import {
  formattedCaseDetail,
  formattedCases,
} from './computeds/formattedCaseDetail';

import caseDetailHelper from './computeds/caseDetailHelper';

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
  workQueue: [
    {
      docketNumber: '00101-18',
      receivedDate: '12/15/2018 9:33am',
      sentBy: 'Susie Smith',
      message: 'This is a message',
      documentType: 'Stipulated Decision',
      trialDate: 'n/a',
    },
    {
      docketNumber: '00101-18',
      receivedDate: '12/15/2018 9:33am',
      sentBy: 'Susie Smith',
      message: 'This is a message',
      documentType: 'Stipulated Decision',
      trialDate: 'n/a',
    },
  ],
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

    // userId: 'docketclerk',
    // name: 'Docket Clerk',
    // token: 'docketclerk',
    // role: 'docketclerk',

    // userId: 'seniorattorney',
    // name: 'Señor Attorney',
    // token: 'seniorattorney',
    // role: 'seniorattorney',
  },
  caseDetail: {},
  cases: [],
  caseDetailHelper,
  formattedCaseDetail,
  formattedCases,
};
