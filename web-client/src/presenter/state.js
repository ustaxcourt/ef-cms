import {
  formattedCaseDetail,
  formattedCases,
} from './computeds/formattedCaseDetail';

import { extractedPendingMessagesFromCaseDetail } from './computeds/extractPendingMessagesFromCaseDetail';
import { extractedDocument } from './computeds/extractDocument';
import { formattedSectionWorkQueue } from './computeds/formattedSectionWorkQueue';
import { formattedWorkQueue } from './computeds/formattedWorkQueue';
import { showAction } from './computeds/documentDetailHelper';
import caseDetailHelper from './computeds/caseDetailHelper';
import workQueueHelper from './computeds/workQueueHelper';

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
  documentId: null,
  form: {},
  searchTerm: '',
  workQueue: [],
  sectionWorkQueue: [],
  users: [],
  workQueueToDisplay: 'individual',
  assigneeId: null,
  selectedWorkItems: [],
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
  workItemActions: {},
  completeForm: {},
  caseDetailHelper,
  extractedDocument,
  extractedPendingMessagesFromCaseDetail,
  formattedCaseDetail,
  formattedCases,
  formattedSectionWorkQueue,
  formattedWorkQueue,
  workQueueHelper,
  showAction,
};
