import {
  formattedCaseDetail,
  formattedCases,
} from './computeds/formattedCaseDetail';

import { extractedDocument } from './computeds/extractDocument';
import { extractedPendingMessagesFromCaseDetail } from './computeds/extractPendingMessagesFromCaseDetail';
import { formattedSectionWorkQueue } from './computeds/formattedSectionWorkQueue';
import { formattedWorkQueue } from './computeds/formattedWorkQueue';
import { getTrialCityName } from './computeds/formattedTrialCity';
import alertHelper from './computeds/alertHelper';
import caseDetailHelper from './computeds/caseDetailHelper';
import documentDetailHelper from './computeds/documentDetailHelper';
import startCaseHelper from './computeds/startCaseHelper';
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
  showModal: false,
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
  caseTypes: [],
  procedureTypes: [],
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
  completeForm: {},
  workItemActions: {},

  alertHelper,
  caseDetailHelper,
  documentDetailHelper,
  extractedDocument,
  extractedPendingMessagesFromCaseDetail,
  formattedCaseDetail,
  formattedCases,
  formattedSectionWorkQueue,
  formattedWorkQueue,
  getTrialCityName,
  startCaseHelper,
  workQueueHelper,
};
