import {
  formattedCaseDetail,
  formattedCases,
} from './computeds/formattedCaseDetail';

import { contactsHelper } from './computeds/contactsHelper';
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
  showModal: '',
  paymentInfo: {
    showDetails: false,
  },
  assigneeId: null,
  caseDetail: {},
  caseDetailErrors: {},
  cases: [],
  caseTypes: [],
  cognitoLoginUrl: null,
  completeForm: {},
  document: {},
  documentId: null,
  filingTypes: [],
  form: {},
  petition: {},
  procedureTypes: [],
  searchTerm: '',
  selectedWorkItems: [],
  showValidation: false,
  user: null,
  users: [],
  validationErrors: {},
  workItemActions: {},
  workQueue: [],
  workQueueToDisplay: { queue: 'my', box: 'inbox' },

  alertHelper,
  caseDetailHelper,
  contactsHelper,
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
