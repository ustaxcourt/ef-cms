import { addCourtIssuedDocketEntryHelper } from './computeds/addCourtIssuedDocketEntryHelper';
import { addCourtIssuedDocketEntryNonstandardHelper } from './computeds/addCourtIssuedDocketEntryNonstandardHelper';
import { addDocketEntryHelper } from './computeds/addDocketEntryHelper';
import { addToTrialSessionModalHelper } from './computeds/addToTrialSessionModalHelper';
import { advancedDocumentSearchHelper } from './computeds/AdvancedSearch/advancedDocumentSearchHelper';
import { advancedSearchHelper } from './computeds/AdvancedSearch/advancedSearchHelper';
import { alertHelper } from './computeds/alertHelper';
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
import { caseTypeDescriptionHelper } from './computeds/caseTypeDescriptionHelper';
import { completeDocumentTypeSectionHelper } from './computeds/completeDocumentTypeSectionHelper';
import { confirmInitiateServiceModalHelper } from './computeds/confirmInitiateServiceModalHelper';
import { contactEditHelper } from './computeds/contactEditHelper';
import { contactsHelper } from './computeds/contactsHelper';
import { correspondenceViewerHelper } from './computeds/correspondenceViewerHelper';
import { createOrderHelper } from './computeds/createOrderHelper';
import { createPractitionerUserHelper } from './computeds/createPractitionerUserHelper';
import { dashboardExternalHelper } from './computeds/dashboardExternalHelper';
import { docketRecordHelper } from './computeds/docketRecordHelper';
import { documentSigningHelper } from './computeds/documentSigningHelper';
import { documentViewerHelper } from './computeds/documentViewerHelper';
import { draftDocumentViewerHelper } from './computeds/draftDocumentViewerHelper';
import { editDocketEntryHelper } from './computeds/editDocketEntryHelper';
import { editDocketEntryMetaHelper } from './computeds/editDocketEntryMetaHelper';
import { editPetitionerInformationHelper } from './computeds/editPetitionerInformationHelper';
import { editStatisticFormHelper } from './computeds/editStatisticFormHelper';
import { externalUserCasesHelper } from './computeds/Dashboard/externalUserCasesHelper';
import { fileDocumentHelper } from './computeds/fileDocumentHelper';
import { fileUploadStatusHelper } from './computeds/fileUploadStatusHelper';
import { filingPartiesFormHelper } from './computeds/filingPartiesFormHelper';
import {
  formattedCaseDetail,
  formattedClosedCases,
  formattedOpenCases,
} from './computeds/formattedCaseDetail';
import { formattedCaseMessages } from './computeds/formattedCaseMessages';
import { formattedDashboardTrialSessions } from './computeds/formattedDashboardTrialSessions';
import { formattedDocument } from './computeds/formattedDocument';
import { formattedMessageDetail } from './computeds/formattedMessageDetail';
import { formattedMessages } from './computeds/formattedMessages';
import { formattedPendingItems } from './computeds/formattedPendingItems';
import { formattedTrialSessionDetails } from './computeds/formattedTrialSessionDetails';
import { formattedTrialSessions } from './computeds/formattedTrialSessions';
import { formattedWorkQueue } from './computeds/formattedWorkQueue';
import { getTrialCityName } from './computeds/formattedTrialCity';
import { headerHelper } from './computeds/headerHelper';
import { internalTypesHelper } from './computeds/internalTypesHelper';
import { loadingHelper } from './computeds/loadingHelper';
import { menuHelper } from './computeds/menuHelper';
import { messageDocumentHelper } from './computeds/messageDocumentHelper';
import { messageModalHelper } from './computeds/messageModalHelper';
import { messagesHelper } from './computeds/messagesHelper';
import { orderTypesHelper } from './computeds/orderTypesHelper';
import { paperDocketEntryHelper } from './computeds/paperDocketEntryHelper';
import { pdfPreviewModalHelper } from './computeds/PDFPreviewModal/pdfPreviewModalHelper';
import { pdfSignerHelper } from './computeds/pdfSignerHelper';
import { petitionQcHelper } from './computeds/petitionQcHelper';
import { practitionerDetailHelper } from './computeds/practitionerDetailHelper';
import { practitionerSearchFormHelper } from './computeds/practitionerSearchFormHelper';
import { printPaperServiceHelper } from './computeds/printPaperServiceHelper';
import { recentMessagesHelper } from './computeds/recentMessagesHelper';
import { requestAccessHelper } from './computeds/requestAccessHelper';
import { reviewSavedPetitionHelper } from './computeds/reviewSavedPetitionHelper';
import { scanBatchPreviewerHelper } from './computeds/scanBatchPreviewerHelper';
import { scanHelper } from './computeds/scanHelper';
import { selectDocumentTypeHelper } from './computeds/selectDocumentTypeHelper';
import { showAppTimeoutModalHelper } from './computeds/showAppTimeoutModalHelper';
import { startCaseHelper } from './computeds/startCaseHelper';
import { startCaseInternalContactsHelper } from './computeds/startCaseInternalContactsHelper';
import { startCaseInternalHelper } from './computeds/startCaseInternalHelper';
import { statisticsFormHelper } from './computeds/statisticsFormHelper';
import { statisticsHelper } from './computeds/statisticsHelper';
import { trialCitiesHelper } from './computeds/trialCitiesHelper';
import { trialSessionDetailsHelper } from './computeds/trialSessionDetailsHelper';
import { trialSessionHeaderHelper } from './computeds/trialSessionHeaderHelper';
import { trialSessionWorkingCopyHelper } from './computeds/trialSessionWorkingCopyHelper';
import { trialSessionsHelper } from './computeds/trialSessionsHelper';
import { trialSessionsSummaryHelper } from './computeds/trialSessionsSummaryHelper';
import { updateCaseModalHelper } from './computeds/updateCaseModalHelper';
import { userContactEditProgressHelper } from './computeds/userContactEditProgressHelper';
import { viewAllDocumentsHelper } from './computeds/viewAllDocumentsHelper';
import { workQueueHelper } from './computeds/workQueueHelper';
import { workQueueSectionHelper } from './computeds/workQueueSectionHelper';

const helpers = {
  addCourtIssuedDocketEntryHelper,
  addCourtIssuedDocketEntryNonstandardHelper,
  addDocketEntryHelper,
  addToTrialSessionModalHelper,
  advancedDocumentSearchHelper,
  advancedSearchHelper,
  alertHelper,
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
  caseTypeDescriptionHelper,
  completeDocumentTypeSectionHelper,
  confirmInitiateServiceModalHelper,
  contactEditHelper,
  contactsHelper,
  correspondenceViewerHelper,
  createOrderHelper,
  createPractitionerUserHelper,
  dashboardExternalHelper,
  docketRecordHelper,
  documentSigningHelper,
  documentViewerHelper,
  draftDocumentViewerHelper,
  editDocketEntryHelper,
  editDocketEntryMetaHelper,
  editPetitionerInformationHelper,
  editStatisticFormHelper,
  externalUserCasesHelper,
  fileDocumentHelper,
  fileUploadStatusHelper,
  filingPartiesFormHelper,
  formattedCaseDetail,
  formattedCaseMessages,
  formattedClosedCases,
  formattedDashboardTrialSessions,
  formattedDocument,
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
  orderTypesHelper,
  paperDocketEntryHelper,
  pdfPreviewModalHelper,
  pdfSignerHelper,
  petitionQcHelper,
  practitionerDetailHelper,
  practitionerSearchFormHelper,
  printPaperServiceHelper,
  recentMessagesHelper,
  requestAccessHelper,
  reviewSavedPetitionHelper,
  scanBatchPreviewerHelper,
  scanHelper,
  selectDocumentTypeHelper,
  showAppTimeoutModalHelper,
  startCaseHelper,
  startCaseInternalContactsHelper,
  startCaseInternalHelper,
  statisticsFormHelper,
  statisticsHelper,
  trialCitiesHelper,
  trialSessionDetailsHelper,
  trialSessionHeaderHelper,
  trialSessionWorkingCopyHelper,
  trialSessionsHelper,
  trialSessionsSummaryHelper,
  updateCaseModalHelper,
  userContactEditProgressHelper,
  viewAllDocumentsHelper,
  workQueueHelper,
  workQueueSectionHelper,
};

export const baseState = {
  advancedSearchForm: {}, // form for advanced search screen, TODO: replace with state.form
  archiveDraftDocument: {
    docketEntryId: null,
    // used by the delete draft document modal
    docketNumber: null,
    documentTitle: null,
  },
  assigneeId: null, // used for assigning workItems in assignSelectedWorkItemsAction
  batchDownloads: {}, // batch download of PDFs
  caseDetail: {},
  closedCases: [],
  cognitoLoginUrl: null,
  completeForm: {},
  // TODO: replace with state.form
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
    showBetaBar: true,
    showMobileMenu: false,
    showUsaBannerDetails: false,
  },
  individualInProgressCount: 0,
  individualInboxCount: 0,
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
  },
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
    docketRecordSort: [],
  },
  showValidation: false,
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
