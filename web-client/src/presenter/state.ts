import { addCourtIssuedDocketEntryHelper } from './computeds/addCourtIssuedDocketEntryHelper';
import { addCourtIssuedDocketEntryNonstandardHelper } from './computeds/addCourtIssuedDocketEntryNonstandardHelper';
import { addDocketEntryHelper } from './computeds/addDocketEntryHelper';
import { addDocketNumbersModalHelper } from './computeds/addDocketNumbersModalHelper';
import { addToTrialSessionModalHelper } from './computeds/addToTrialSessionModalHelper';
import { addTrialSessionInformationHelper } from './computeds/TrialSession/addTrialSessionInformationHelper';
import { advancedDocumentSearchHelper } from './computeds/AdvancedSearch/advancedDocumentSearchHelper';
import { advancedSearchHelper } from './computeds/AdvancedSearch/advancedSearchHelper';
import { alertHelper } from './computeds/alertHelper';
import { appInstanceManagerHelper } from './computeds/appInstanceManagerHelper';
import { applyStampFormHelper } from './computeds/applyStampFormHelper';
import { batchDownloadHelper } from './computeds/batchDownloadHelper';
import { blockedCasesReportHelper } from './computeds/blockedCasesReportHelper';
import { caseDeadlineReportHelper } from './computeds/caseDeadlineReportHelper';
import { caseDetailEditContactsHelper } from './computeds/caseDetailEditContactsHelper';
import { caseDetailEditHelper } from './computeds/caseDetailEditHelper';
import { caseDetailHeaderHelper } from './computeds/caseDetailHeaderHelper';
import { caseDetailHelper } from './computeds/caseDetailHelper';
import { caseDetailPractitionerSearchHelper } from './computeds/caseDetailPractitionerSearchHelper';
import { caseDetailSubnavHelper } from './computeds/caseDetailSubnavHelper';
import { caseInformationHelper } from './computeds/caseInformationHelper';
import { caseInventoryReportHelper } from './computeds/caseInventoryReportHelper';
import { caseSearchBoxHelper } from './computeds/caseSearchBoxHelper';
import { caseSearchNoMatchesHelper } from './computeds/caseSearchNoMatchesHelper';
import { caseTypeDescriptionHelper } from './computeds/caseTypeDescriptionHelper';
import { completeDocumentTypeSectionHelper } from './computeds/completeDocumentTypeSectionHelper';
import { confirmInitiateCourtIssuedFilingServiceModalHelper } from './computeds/confirmInitiateCourtIssuedFilingServiceModalHelper';
import { confirmInitiatePaperFilingServiceModalHelper } from './computeds/confirmInitiatePaperFilingServiceModalHelper';
import { contactsHelper } from './computeds/contactsHelper';
import { correspondenceViewerHelper } from './computeds/correspondenceViewerHelper';
import { createMessageModalHelper } from './computeds/createMessageModalHelper';
import { createOrderHelper } from './computeds/createOrderHelper';
import { createPractitionerUserHelper } from './computeds/createPractitionerUserHelper';
import { dashboardExternalHelper } from './computeds/dashboardExternalHelper';
import { docketEntryQcHelper } from './computeds/docketEntryQcHelper';
import { docketRecordHelper } from './computeds/docketRecordHelper';
import { documentSigningHelper } from './computeds/documentSigningHelper';
import { documentViewerHelper } from './computeds/documentViewerHelper';
import { documentViewerLinksHelper } from './computeds/documentViewerLinksHelper';
import { draftDocumentViewerHelper } from './computeds/draftDocumentViewerHelper';
import { editDocketEntryMetaHelper } from './computeds/editDocketEntryMetaHelper';
import { editPetitionerInformationHelper } from './computeds/editPetitionerInformationHelper';
import { editStatisticFormHelper } from './computeds/editStatisticFormHelper';
import { externalUserCasesHelper } from './computeds/Dashboard/externalUserCasesHelper';
import { featureFlagHelper } from './computeds/FeatureFlags/featureFlagHelper';
import { fileDocumentHelper } from './computeds/fileDocumentHelper';
import { fileUploadStatusHelper } from './computeds/fileUploadStatusHelper';
import { filingPartiesFormHelper } from './computeds/filingPartiesFormHelper';
import { formattedCaseDeadlines } from './computeds/formattedCaseDeadlines';
import {
  formattedCaseDetail,
  formattedClosedCases,
  formattedOpenCases,
} from './computeds/formattedCaseDetail';
import { formattedCaseMessages } from './computeds/formattedCaseMessages';
import { formattedDashboardTrialSessions } from './computeds/formattedDashboardTrialSessions';
import { formattedDocketEntries } from './computeds/formattedDocketEntries';
import { formattedDocument } from './computeds/formattedDocument';
import { formattedEligibleCasesHelper } from './computeds/formattedEligibleCasesHelper';
import { formattedMessageDetail } from './computeds/formattedMessageDetail';
import { formattedMessages } from './computeds/formattedMessages';
import { formattedPendingItems } from './computeds/formattedPendingItems';
import { formattedTrialSessionDetails } from './computeds/formattedTrialSessionDetails';
import { formattedTrialSessions } from './computeds/formattedTrialSessions';
import { formattedWorkQueue } from './computeds/formattedWorkQueue';
import { getConstants } from '../getConstants';
import { getTrialCityName } from './computeds/formattedTrialCity';
import { headerHelper } from './computeds/headerHelper';
import { internalTypesHelper } from './computeds/internalTypesHelper';
import { loadingHelper } from './computeds/loadingHelper';
import { menuHelper } from './computeds/menuHelper';
import { messageDocumentHelper } from './computeds/messageDocumentHelper';
import { messageModalHelper } from './computeds/messageModalHelper';
import { messagesHelper } from './computeds/messagesHelper';
import { myAccountHelper } from './computeds/myAccountHelper';
import { orderTypesHelper } from './computeds/orderTypesHelper';
import { paperDocketEntryHelper } from './computeds/paperDocketEntryHelper';
import { partiesInformationHelper } from './computeds/partiesInformationHelper';
import { pdfPreviewModalHelper } from './computeds/PDFPreviewModal/pdfPreviewModalHelper';
import { pdfSignerHelper } from './computeds/pdfSignerHelper';
import { pendingReportListHelper } from './computeds/pendingReportListHelper';
import { petitionQcHelper } from './computeds/petitionQcHelper';
import { practitionerDetailHelper } from './computeds/practitionerDetailHelper';
import { practitionerDocumentationFormHelper } from './computeds/practitionerDocumentationFormHelper';
import { practitionerDocumentationHelper } from './computeds/practitionerDocumentationHelper';
import { practitionerInformationHelper } from './computeds/practitionerInformationHelper';
import { practitionerSearchFormHelper } from './computeds/practitionerSearchFormHelper';
import { printPaperServiceHelper } from './computeds/printPaperServiceHelper';
import { recentMessagesHelper } from './computeds/recentMessagesHelper';
import { removeFromTrialSessionModalHelper } from './computeds/removeFromTrialSessionModalHelper';
import { requestAccessHelper } from './computeds/requestAccessHelper';
import { reviewSavedPetitionHelper } from './computeds/reviewSavedPetitionHelper';
import { scanBatchPreviewerHelper } from './computeds/scanBatchPreviewerHelper';
import { scanHelper } from './computeds/scanHelper';
import { sealedCaseDetailHelper } from './computeds/sealedCaseDetailHelper';
import { sessionAssignmentHelper } from './computeds/sessionAssignmentHelper';
import { setForHearingModalHelper } from './computeds/setForHearingModalHelper';
import { showAppTimeoutModalHelper } from './computeds/showAppTimeoutModalHelper';
import { showSortableHeaders } from './computeds/showSortableHeaders';
import { sortableColumnHelper } from './computeds/sortableColumnHelper';
import { startCaseHelper } from './computeds/startCaseHelper';
import { startCaseInternalContactsHelper } from './computeds/startCaseInternalContactsHelper';
import { startCaseInternalHelper } from './computeds/startCaseInternalHelper';
import { statisticsFormHelper } from './computeds/statisticsFormHelper';
import { statisticsHelper } from './computeds/statisticsHelper';
import { templateHelper } from './computeds/templateHelper';
import { trialCitiesHelper } from './computeds/trialCitiesHelper';
import { trialSessionDetailsHelper } from './computeds/trialSessionDetailsHelper';
import { trialSessionHeaderHelper } from './computeds/trialSessionHeaderHelper';
import { trialSessionWorkingCopyHelper } from './computeds/trialSessionWorkingCopyHelper';
import { trialSessionsHelper } from './computeds/trialSessionsHelper';
import { trialSessionsSummaryHelper } from './computeds/trialSessionsSummaryHelper';
import { updateCaseModalHelper } from './computeds/updateCaseModalHelper';
import { userContactEditHelper } from './computeds/userContactEditHelper';
import { userContactEditProgressHelper } from './computeds/userContactEditProgressHelper';
import { viewAllDocumentsHelper } from './computeds/viewAllDocumentsHelper';
import { viewCounselHelper } from './computeds/viewCounselHelper';
import { workQueueHelper } from './computeds/workQueueHelper';
import { workQueueSectionHelper } from './computeds/workQueueSectionHelper';

const { ASCENDING, DOCKET_RECORD_FILTER_OPTIONS, IDLE_STATUS } = getConstants();

const helpers = {
  addCourtIssuedDocketEntryHelper,
  addCourtIssuedDocketEntryNonstandardHelper,
  addDocketEntryHelper,
  addDocketNumbersModalHelper,
  addToTrialSessionModalHelper,
  addTrialSessionInformationHelper,
  advancedDocumentSearchHelper,
  advancedSearchHelper,
  alertHelper,
  appInstanceManagerHelper,
  applyStampFormHelper,
  batchDownloadHelper,
  blockedCasesReportHelper,
  caseDeadlineReportHelper,
  caseDetailEditContactsHelper,
  caseDetailEditHelper,
  caseDetailHeaderHelper,
  caseDetailHelper,
  caseDetailPractitionerSearchHelper,
  caseDetailSubnavHelper,
  caseInformationHelper,
  caseInventoryReportHelper,
  caseSearchBoxHelper,
  caseSearchNoMatchesHelper,
  caseTypeDescriptionHelper,
  completeDocumentTypeSectionHelper,
  confirmInitiateCourtIssuedFilingServiceModalHelper,
  confirmInitiatePaperFilingServiceModalHelper,
  contactsHelper,
  correspondenceViewerHelper,
  createMessageModalHelper,
  createOrderHelper,
  createPractitionerUserHelper,
  dashboardExternalHelper,
  docketEntryQcHelper,
  docketRecordHelper,
  documentSigningHelper,
  documentViewerHelper,
  documentViewerLinksHelper,
  draftDocumentViewerHelper,
  editDocketEntryMetaHelper,
  editPetitionerInformationHelper,
  editStatisticFormHelper,
  externalUserCasesHelper,
  featureFlagHelper,
  fileDocumentHelper,
  fileUploadStatusHelper,
  filingPartiesFormHelper,
  formattedCaseDeadlines,
  formattedCaseDetail,
  formattedCaseMessages,
  formattedClosedCases,
  formattedDashboardTrialSessions,
  formattedDocketEntries,
  formattedDocument,
  formattedEligibleCasesHelper,
  formattedMessageDetail,
  formattedMessages,
  formattedOpenCases,
  formattedPendingItems,
  formattedTrialSessionDetails,
  formattedTrialSessions,
  formattedWorkQueue,
  getTrialCityName,
  headerHelper,
  internalTypesHelper,
  loadingHelper,
  menuHelper,
  messageDocumentHelper,
  messageModalHelper,
  messagesHelper,
  myAccountHelper,
  orderTypesHelper,
  paperDocketEntryHelper,
  partiesInformationHelper,
  pdfPreviewModalHelper,
  pdfSignerHelper,
  pendingReportListHelper,
  petitionQcHelper,
  practitionerDetailHelper,
  practitionerDocumentationFormHelper,
  practitionerDocumentationHelper,
  practitionerInformationHelper,
  practitionerSearchFormHelper,
  printPaperServiceHelper,
  recentMessagesHelper,
  removeFromTrialSessionModalHelper,
  requestAccessHelper,
  reviewSavedPetitionHelper,
  scanBatchPreviewerHelper,
  scanHelper,
  sealedCaseDetailHelper,
  sessionAssignmentHelper,
  setForHearingModalHelper,
  showAppTimeoutModalHelper,
  showSortableHeaders,
  sortableColumnHelper,
  startCaseHelper,
  startCaseInternalContactsHelper,
  startCaseInternalHelper,
  statisticsFormHelper,
  statisticsHelper,
  templateHelper,
  trialCitiesHelper,
  trialSessionDetailsHelper,
  trialSessionHeaderHelper,
  trialSessionWorkingCopyHelper,
  trialSessionsHelper,
  trialSessionsSummaryHelper,
  updateCaseModalHelper,
  userContactEditHelper,
  userContactEditProgressHelper,
  viewAllDocumentsHelper,
  viewCounselHelper,
  workQueueHelper,
  workQueueSectionHelper,
};

export const baseState = {
  advancedSearchForm: {}, // form for advanced search screen, TODO: replace with state.form
  advancedSearchTab: 'case',
  allJudges: [],
  archiveDraftDocument: {
    docketEntryId: null,
    // used by the delete draft document modal
    docketNumber: null,
    documentTitle: null,
  },
  assigneeId: null, // used for assigning workItems in assignSelectedWorkItemsAction
  batchDownloads: {}, // batch download of PDFs
  caseDeadlineReport: {},
  caseDetail: {},
  closedCases: [],
  cognitoLoginUrl: null,
  completeForm: {},
  // TODO: replace with state.form
  currentJudges: [],
  currentPage: 'Interstitial',
  currentViewMetadata: {
    caseDetail: {
      caseDetailInternalTabs: {
        caseInformation: false,
        correspondence: false,
        docketRecord: false,
        drafts: false,
        messages: false,
        notes: false,
        trackedItems: false,
      },
    },
    documentDetail: {
      tab: '',
    },
    documentSelectedForScan: null,
    documentUploadMode: 'scan',
    messageId: '',
    startCaseInternal: {
      tab: '',
    },
    tab: '',
    trialSessions: {
      tab: null,
    },
  },
  // needs its own object because it's present when other forms are on screen
  docketEntryId: null,
  docketRecordIndex: 0,
  draftDocumentViewerDocketEntryId: null,
  fileUploadProgress: {
    // used for the progress bar shown in modal when uploading files
    isUploading: false,
    percentComplete: 0,
    timeRemaining: Number.POSITIVE_INFINITY,
  },
  form: {},
  // shared object for creating new entities, clear before using
  header: {
    searchTerm: '',
    showBetaBar: true, // default state
    showMobileMenu: false,
    showUsaBannerDetails: false,
  },
  idleStatus: IDLE_STATUS.ACTIVE,
  idleTimerRef: null,
  individualInProgressCount: 0,
  individualInboxCount: 0,
  judges: [],
  legacyAndCurrentJudges: [],
  messagesInboxCount: 0,
  messagesSectionCount: 0,
  modal: {
    pdfPreviewModal: undefined,
    showModal: undefined, // the name of the modal to display
  },
  navigation: {},
  notifications: {},
  openCases: [],
  pdfForSigning: {
    docketEntryId: null,
    nameForSigning: '',
    pageNumber: 1,
    pdfjsObj: null,
    signatureApplied: false,
    signatureData: null,
    stampApplied: false,
    stampData: null,
  },
  pendingReports: {},
  permissions: null,
  practitionerDetail: {},
  previewPdfFile: null,
  progressIndicator: {
    // used for the spinner that shows when waiting for network responses
    waitingForResponse: false,
    waitingForResponseRequests: 0,
  },
  scanner: {
    batchIndexToDelete: null,
    batchIndexToRescan: null, // batch index for re-scanning
    batchToDeletePageCount: null,
    batches: [],
    currentPageIndex: 0, // batches from scanning
    isScanning: false,
    selectedBatchIndex: 0,
  },
  screenMetadata: {},
  sectionInProgressCount: 0,
  sectionInboxCount: 0,
  sectionUsers: [],
  selectedWorkItems: [],
  sessionMetadata: {
    docketRecordFilter: DOCKET_RECORD_FILTER_OPTIONS.allDocuments,
    docketRecordSort: [],
    todaysOrdersSort: [],
  },
  showValidation: false,
  tableSort: {
    sortField: 'createdAt',
    sortOrder: ASCENDING,
  },
  trialSessionJudge: {
    name: '',
  },
  user: null,
  // used for progress indicator when updating contact information for all of a user's cases
  userContactEditProgress: {},
  users: [],
  validationErrors: {},
  workItem: {},
  workItemActions: {},
  workItemMetadata: {},
  workQueue: [],
  workQueueToDisplay: { box: 'inbox', queue: 'my' },
};

export const state = {
  ...helpers,
  ...baseState,
};
