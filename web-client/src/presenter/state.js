import {
  formattedCaseDetail,
  formattedCases,
} from './computeds/formattedCaseDetail';

import { addDocketEntryHelper } from './computeds/addDocketEntryHelper';
import { alertHelper } from './computeds/alertHelper';
import { caseDeadlineReportHelper } from './computeds/caseDeadlineReportHelper';
import { caseDetailEditContactsHelper } from './computeds/caseDetailEditContactsHelper';
import { caseDetailEditHelper } from './computeds/caseDetailEditHelper';
import { caseDetailHelper } from './computeds/caseDetailHelper';
import { caseTypeDescriptionHelper } from './computeds/caseTypeDescriptionHelper';
import { completeDocumentTypeSectionHelper } from './computeds/completeDocumentTypeSectionHelper';
import { contactsHelper } from './computeds/contactsHelper';
import { dashboardExternalHelper } from './computeds/dashboardExternalHelper';
import { documentDetailHelper } from './computeds/documentDetailHelper';
import { documentHelper } from './computeds/documentHelper';
import { documentSigningHelper } from './computeds/documentSigningHelper';
import { extractedDocument } from './computeds/extractDocument';
import { extractedPendingMessagesFromCaseDetail } from './computeds/extractPendingMessagesFromCaseDetail';
import { fileDocumentHelper } from './computeds/fileDocumentHelper';
import { fileUploadStatusHelper } from './computeds/fileUploadStatusHelper';
import { formattedDashboardTrialSessions } from './computeds/formattedDashboardTrialSessions';
import { formattedTrialSessionDetails } from './computeds/formattedTrialSessionDetails';
import { formattedTrialSessions } from './computeds/formattedTrialSessions';
import { formattedWorkQueue } from './computeds/formattedWorkQueue';
import { getTrialCityName } from './computeds/formattedTrialCity';
import { headerHelper } from './computeds/headerHelper';
import { internalTypesHelper } from './computeds/internalTypesHelper';
import { menuHelper } from './computeds/menuHelper';
import { pdfPreviewModalHelper } from './computeds/PDFPreviewModal/pdfPreviewModalHelper';
import { primaryContactEditHelper } from './computeds/primaryContactEditHelper';
import { requestAccessHelper } from './computeds/requestAccessHelper';
import { scanBatchPreviewerHelper } from './computeds/scanBatchPreviewerHelper';
import { scanHelper } from './computeds/scanHelper';
import { selectDocumentSelectHelper } from './computeds/selectDocumentSelectHelper';
import { selectDocumentTypeHelper } from './computeds/selectDocumentTypeHelper';
import { showAppTimeoutModalHelper } from './computeds/showAppTimeoutModalHelper';
import { startCaseHelper } from './computeds/startCaseHelper';
import { startCaseInternalContactsHelper } from './computeds/startCaseInternalContactsHelper';
import { startCaseInternalHelper } from './computeds/startCaseInternalHelper';
import { trialCitiesHelper } from './computeds/trialCitiesHelper';
import { trialSessionHeaderHelper } from './computeds/trialSessionHeaderHelper';
import { trialSessionWorkingCopyHelper } from './computeds/trialSessionWorkingCopyHelper';
import { viewAllDocumentsHelper } from './computeds/viewAllDocumentsHelper';
import { workQueueHelper } from './computeds/workQueueHelper';
import { workQueueSectionHelper } from './computeds/workQueueSectionHelper';

export const state = {
  addDocketEntryHelper,
  alertHelper,
  assigneeId: null,
  batchIndexToRescan: null,
  batches: [],
  betaBar: {
    isVisible: true,
  },
  caseCaption: '',
  caseDeadlineReportHelper,
  caseDetail: {},
  caseDetailEditContactsHelper,
  caseDetailEditHelper,
  caseDetailErrors: {},
  caseDetailHelper,
  caseTypeDescriptionHelper,
  caseTypes: [],
  cases: [],
  cognitoLoginUrl: null,
  completeDocumentTypeSectionHelper,
  completeForm: {},
  contactsHelper,
  currentPage: 'Interstitial',
  currentPageHeader: '',
  currentPageIndex: 0,
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
  documentSelectedForPreview: null,
  documentSelectedForScan: null,
  documentSigningHelper,
  documentUploadMode: 'scan',
  extractedDocument,
  extractedPendingMessagesFromCaseDetail,
  fileDocumentHelper,
  fileUploadStatusHelper,
  filingTypes: [],
  form: {},
  formattedCaseDetail,
  formattedCases,
  formattedDashboardTrialSessions,
  formattedTrialSessionDetails,
  formattedTrialSessions,
  formattedWorkQueue,
  getTrialCityName,
  headerHelper,
  internalTypesHelper,
  isAccountMenuOpen: false,
  menuHelper,
  mobileMenu: {
    isVisible: false,
  },
  modal: {},
  navigation: {},
  notifications: {},
  path: '/',
  paymentInfo: {
    showDetails: false,
  },
  pdfForSigning: {
    documentId: null,
    nameForSigning: '',
    pageNumber: 1,
    pdfjsObj: null,
    signatureApplied: false,
    signatureData: null,
  },
  pdfPreviewModal: {},
  pdfPreviewModalHelper,
  percentComplete: 0,
  petition: {},
  previewPdfFile: null,
  primaryContactEditHelper,
  procedureTypes: [],
  requestAccessHelper,
  scanBatchPreviewerHelper,
  scanHelper,
  scanner: {},
  screenMetadata: {},
  searchTerm: '',
  sectionInboxCount: 0,
  selectDocumentSelectHelper,
  selectDocumentTypeHelper,
  selectedBatchIndex: 0,
  selectedWorkItems: [],
  sessionMetadata: {},
  showAppTimeoutModalHelper,
  showModal: '',
  showValidation: false,
  startCaseHelper,
  startCaseInternalContactsHelper,
  startCaseInternalHelper,
  submitting: false,
  timeRemaining: Number.POSITIVE_INFINITY,
  trialCitiesHelper,
  trialSessionHeaderHelper,
  trialSessionWorkingCopyHelper,
  usaBanner: {
    showDetails: false,
  },
  user: null,
  users: [],
  validationErrors: {},
  viewAllDocumentsHelper,
  workItem: {},
  workItemActions: {},
  workItemMetadata: {},
  workQueue: [],
  workQueueHelper,
  workQueueIsInternal: true,
  workQueueSectionHelper,
  workQueueToDisplay: { box: 'inbox', queue: 'my' },
};
