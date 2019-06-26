import {
  formattedCaseDetail,
  formattedCases,
} from './computeds/formattedCaseDetail';

import { accountMenuHelper } from './computeds/accountMenuHelper';
import { addDocketEntryHelper } from './computeds/addDocketEntryHelper';
import { alertHelper } from './computeds/alertHelper';
import { caseDetailEditContactsHelper } from './computeds/caseDetailEditContactsHelper';
import { caseDetailEditHelper } from './computeds/caseDetailEditHelper';
import { caseDetailHelper } from './computeds/caseDetailHelper';
import { caseTypeDescriptionHelper } from './computeds/caseTypeDescriptionHelper';
import { contactsHelper } from './computeds/contactsHelper';
import { createOrderHelper } from './computeds/createOrderHelper';
import { dashboardExternalHelper } from './computeds/dashboardExternalHelper';
import { documentDetailHelper } from './computeds/documentDetailHelper';
import { documentHelper } from './computeds/documentHelper';
import { extractedDocument } from './computeds/extractDocument';
import { extractedPendingMessagesFromCaseDetail } from './computeds/extractPendingMessagesFromCaseDetail';
import { fileDocumentHelper } from './computeds/fileDocumentHelper';
import { fileUploadStatusHelper } from './computeds/fileUploadStatusHelper';
import { formattedTrialSessionDetails } from './computeds/formattedTrialSessionDetails';
import { formattedTrialSessions } from './computeds/formattedTrialSessions';
import { formattedWorkQueue } from './computeds/formattedWorkQueue';
import { getTrialCityName } from './computeds/formattedTrialCity';
import { headerHelper } from './computeds/headerHelper';
import { internalTypesHelper } from './computeds/internalTypesHelper';
import { requestAccessHelper } from './computeds/requestAccessHelper';
import { scanHelper } from './computeds/scanHelper';
import { selectDocumentTypeHelper } from './computeds/selectDocumentTypeHelper';
import { showAppTimeoutModalHelper } from './computeds/showAppTimeoutModalHelper';
import { startCaseHelper } from './computeds/startCaseHelper';
import { trialCitiesHelper } from './computeds/trialCitiesHelper';
import { workQueueHelper } from './computeds/workQueueHelper';
import { workQueueSectionHelper } from './computeds/workQueueSectionHelper';

export const state = {
  accountMenuHelper,
  addDocketEntryHelper,
  alertHelper,
  assigneeId: null,
  betaBar: {
    isVisible: true,
  },
  caseCaption: '',
  caseDetail: {},
  caseDetailEditContactsHelper,
  caseDetailEditHelper,
  caseDetailErrors: {},
  caseDetailHelper,
  caseTypeDescriptionHelper,
  caseTypes: [],
  cases: [],
  cognitoLoginUrl: null,
  completeForm: {},
  contactsHelper,
  createOrderHelper,
  currentPage: 'Interstitial',
  currentPageHeader: '',
  currentTab: '',
  dashboardExternalHelper,
  docketRecordIndex: 0,
  document: {},
  documentDetail: {
    tab: '',
  },
  documentDetailHelper,
  documentHelper,
  documentId: null,
  extractedDocument,
  extractedPendingMessagesFromCaseDetail,
  fileDocumentHelper,
  fileUploadStatusHelper,
  filingTypes: [],
  form: {},
  formattedCaseDetail,
  formattedCases,
  formattedTrialSessionDetails,
  formattedTrialSessions,
  formattedWorkQueue,
  getTrialCityName,
  headerHelper,
  internalTypesHelper,
  isAccountMenuOpen: false,
  mobileMenu: {
    isVisible: false,
  },
  modal: {},
  notifications: {},
  path: '/',
  paymentInfo: {
    showDetails: false,
  },
  percentComplete: 0,
  petition: {},
  procedureTypes: [],
  requestAccessHelper,
  scanHelper,
  scanner: {},
  screenMetadata: {},
  searchTerm: '',
  sectionInboxCount: 0,
  selectDocumentTypeHelper,
  selectedWorkItems: [],
  sessionMetadata: {},
  showAppTimeoutModalHelper,
  showModal: '',
  showValidation: false,
  startCaseHelper,
  submitting: false,
  timeRemaining: Number.POSITIVE_INFINITY,
  trialCitiesHelper,
  usaBanner: {
    showDetails: false,
  },
  user: null,
  users: [],
  validationErrors: {},
  workItem: {},
  workItemActions: {},
  workItemMetadata: {},
  workQueue: [],
  workQueueHelper,
  workQueueIsInternal: true,
  workQueueSectionHelper,
  workQueueToDisplay: { box: 'inbox', queue: 'my' },
};
