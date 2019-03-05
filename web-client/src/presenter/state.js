import {
  formattedCaseDetail,
  formattedCases,
} from './computeds/formattedCaseDetail';

import alertHelper from './computeds/alertHelper';
import { caseDetailEditContactsHelper } from './computeds/caseDetailEditContactsHelper';
import { caseDetailEditHelper } from './computeds/caseDetailEditHelper';
import caseDetailHelper from './computeds/caseDetailHelper';
import { caseTypeDescriptionHelper } from './computeds/caseTypeDescriptionHelper';
import { contactsHelper } from './computeds/contactsHelper';
import { dashboardPetitionerHelper } from './computeds/dashboardPetitionerHelper';
import { dashboardRespondentHelper } from './computeds/dashboardRespondentHelper';
import documentDetailHelper from './computeds/documentDetailHelper';
import { extractedDocument } from './computeds/extractDocument';
import { extractedPendingMessagesFromCaseDetail } from './computeds/extractPendingMessagesFromCaseDetail';
import { formattedSectionWorkQueue } from './computeds/formattedSectionWorkQueue';
import { formattedWorkQueue } from './computeds/formattedWorkQueue';
import { getTrialCityName } from './computeds/formattedTrialCity';
import startCaseHelper from './computeds/startCaseHelper';
import { trialCitiesHelper } from './computeds/trialCitiesHelper';
import workQueueHelper from './computeds/workQueueHelper';

export default {
  alertHelper,
  assigneeId: null,
  caseDetail: {},
  caseDetailEditContactsHelper,
  caseDetailEditHelper,
  caseDetailErrors: {},
  caseDetailHelper,
  cases: [],
  caseTypeDescriptionHelper,
  caseTypes: [],
  cognitoLoginUrl: null,
  completeForm: {},
  contactsHelper,
  currentPage: 'Loading',
  currentTab: '',
  dashboardPetitionerHelper,
  dashboardRespondentHelper,
  document: {},
  documentDetail: {
    tab: '',
  },
  documentDetailHelper,
  documentId: null,
  extractedDocument,
  extractedPendingMessagesFromCaseDetail,
  filingTypes: [],
  form: {},
  formattedCaseDetail,
  formattedCases,
  formattedSectionWorkQueue,
  formattedWorkQueue,
  getTrialCityName,
  mobileMenu: {
    isVisible: false,
  },

  path: '/',
  paymentInfo: {
    showDetails: false,
  },
  petition: {},
  procedureTypes: [],
  searchTerm: '',
  selectedWorkItems: [],
  showModal: '',
  showValidation: false,
  startCaseHelper,
  submitting: false,
  trialCitiesHelper,
  usaBanner: {
    showDetails: false,
  },
  user: null,
  users: [],
  validationErrors: {},
  workItemActions: {},
  workQueue: [],
  workQueueHelper,
  workQueueToDisplay: { box: 'inbox', queue: 'my' },
};
