import {
  formattedCaseDetail,
  formattedCases,
} from './computeds/formattedCaseDetail';

import { addCourtIssuedDocketEntryHelper } from './computeds/addCourtIssuedDocketEntryHelper';
import { addCourtIssuedDocketEntryNonstandardHelper } from './computeds/addCourtIssuedDocketEntryNonstandardHelper';
import { addDocketEntryHelper } from './computeds/addDocketEntryHelper';
import { addEditUserCaseNoteModalHelper } from './computeds/addEditUserCaseNoteModalHelper';
import { addToTrialSessionModalHelper } from './computeds/addToTrialSessionModalHelper';
import { advancedSearchHelper } from './computeds/advancedSearchHelper';
import { alertHelper } from './computeds/alertHelper';
import { batchDownloadHelper } from './computeds/batchDownloadHelper';
import { blockedCasesReportHelper } from './computeds/blockedCasesReportHelper';
import { caseDeadlineReportHelper } from './computeds/caseDeadlineReportHelper';
import { caseDetailEditContactsHelper } from './computeds/caseDetailEditContactsHelper';
import { caseDetailEditHelper } from './computeds/caseDetailEditHelper';
import { caseDetailHeaderHelper } from './computeds/caseDetailHeaderHelper';
import { caseDetailHelper } from './computeds/caseDetailHelper';
import { caseDetailSubnavHelper } from './computeds/caseDetailSubnavHelper';
import { caseInformationHelper } from './computeds/caseInformationHelper';
import { caseInventoryReportHelper } from './computeds/caseInventoryReportHelper';
import { caseTypeDescriptionHelper } from './computeds/caseTypeDescriptionHelper';
import { completeDocumentTypeSectionHelper } from './computeds/completeDocumentTypeSectionHelper';
import { confirmInitiateServiceModalHelper } from './computeds/confirmInitiateServiceModalHelper';
import { contactEditHelper } from './computeds/contactEditHelper';
import { contactsHelper } from './computeds/contactsHelper';
import { createAttorneyUserHelper } from './computeds/createAttorneyUserHelper';
import { createOrderHelper } from './computeds/createOrderHelper';
import { dashboardExternalHelper } from './computeds/dashboardExternalHelper';
import { docketRecordHelper } from './computeds/docketRecordHelper';
import { documentDetailHelper } from './computeds/documentDetailHelper';
import { documentSigningHelper } from './computeds/documentSigningHelper';
import { editDocketEntryHelper } from './computeds/editDocketEntryHelper';
import { editDocketEntryMetaHelper } from './computeds/editDocketEntryMetaHelper';
import { editPetitionerInformationHelper } from './computeds/editPetitionerInformationHelper';
import { extractedDocument } from './computeds/extractDocument';
import { extractedPendingMessagesFromCaseDetail } from './computeds/extractPendingMessagesFromCaseDetail';
import { fileDocumentHelper } from './computeds/fileDocumentHelper';
import { fileUploadStatusHelper } from './computeds/fileUploadStatusHelper';
import { formattedDashboardTrialSessions } from './computeds/formattedDashboardTrialSessions';
import { formattedPendingItems } from './computeds/formattedPendingItems';
import { formattedTrialSessionDetails } from './computeds/formattedTrialSessionDetails';
import { formattedTrialSessions } from './computeds/formattedTrialSessions';
import { formattedWorkQueue } from './computeds/formattedWorkQueue';
import { getTrialCityName } from './computeds/formattedTrialCity';
import { headerHelper } from './computeds/headerHelper';
import { internalTypesHelper } from './computeds/internalTypesHelper';
import { loadingHelper } from './computeds/loadingHelper';
import { menuHelper } from './computeds/menuHelper';
import { orderTypesHelper } from './computeds/orderTypesHelper';
import { pdfPreviewModalHelper } from './computeds/PDFPreviewModal/pdfPreviewModalHelper';
import { pdfSignerHelper } from './computeds/pdfSignerHelper';
import { requestAccessHelper } from './computeds/requestAccessHelper';
import { reviewPetitionFromPaperHelper } from './computeds/reviewPetitionFromPaperHelper';
import { reviewSavedPetitionHelper } from './computeds/reviewSavedPetitionHelper';
import { scanBatchPreviewerHelper } from './computeds/scanBatchPreviewerHelper';
import { scanHelper } from './computeds/scanHelper';
import { selectDocumentSelectHelper } from './computeds/selectDocumentSelectHelper';
import { selectDocumentTypeHelper } from './computeds/selectDocumentTypeHelper';
import { showAppTimeoutModalHelper } from './computeds/showAppTimeoutModalHelper';
import { startCaseHelper } from './computeds/startCaseHelper';
import { startCaseInternalContactsHelper } from './computeds/startCaseInternalContactsHelper';
import { startCaseInternalHelper } from './computeds/startCaseInternalHelper';
import { trialCitiesHelper } from './computeds/trialCitiesHelper';
import { trialSessionDetailsHelper } from './computeds/trialSessionDetailsHelper';
import { trialSessionHeaderHelper } from './computeds/trialSessionHeaderHelper';
import { trialSessionWorkingCopyHelper } from './computeds/trialSessionWorkingCopyHelper';
import { trialSessionsHelper } from './computeds/trialSessionsHelper';
import { trialSessionsSummaryHelper } from './computeds/trialSessionsSummaryHelper';
import { updateCaseModalHelper } from './computeds/updateCaseModalHelper';
import { viewAllDocumentsHelper } from './computeds/viewAllDocumentsHelper';
import { workQueueHelper } from './computeds/workQueueHelper';
import { workQueueSectionHelper } from './computeds/workQueueSectionHelper';

const helpers = {
  addCourtIssuedDocketEntryHelper,
  addCourtIssuedDocketEntryNonstandardHelper,
  addDocketEntryHelper,
  addEditUserCaseNoteModalHelper,
  addToTrialSessionModalHelper,
  advancedSearchHelper,
  alertHelper,
  batchDownloadHelper,
  blockedCasesReportHelper,
  caseDeadlineReportHelper,
  caseDetailEditContactsHelper,
  caseDetailEditHelper,
  caseDetailHeaderHelper,
  caseDetailHelper,
  caseDetailSubnavHelper,
  caseInformationHelper,
  caseInventoryReportHelper,
  caseTypeDescriptionHelper,
  completeDocumentTypeSectionHelper,
  confirmInitiateServiceModalHelper,
  contactEditHelper,
  contactsHelper,
  createAttorneyUserHelper,
  createOrderHelper,
  dashboardExternalHelper,
  docketRecordHelper,
  documentDetailHelper,
  documentSigningHelper,
  editDocketEntryHelper,
  editDocketEntryMetaHelper,
  editPetitionerInformationHelper,
  extractedDocument,
  extractedPendingMessagesFromCaseDetail,
  fileDocumentHelper,
  fileUploadStatusHelper,
  formattedCaseDetail,
  formattedCases,
  formattedDashboardTrialSessions,
  formattedPendingItems,
  formattedTrialSessionDetails,
  formattedTrialSessions,
  formattedWorkQueue,
  getTrialCityName,
  headerHelper,
  internalTypesHelper,
  loadingHelper,
  menuHelper,
  orderTypesHelper,
  pdfPreviewModalHelper,
  pdfSignerHelper,
  requestAccessHelper,
  reviewPetitionFromPaperHelper,
  reviewSavedPetitionHelper,
  scanBatchPreviewerHelper,
  scanHelper,
  selectDocumentSelectHelper,
  selectDocumentTypeHelper,
  showAppTimeoutModalHelper,
  startCaseHelper,
  startCaseInternalContactsHelper,
  startCaseInternalHelper,
  trialCitiesHelper,
  trialSessionDetailsHelper,
  trialSessionHeaderHelper,
  trialSessionWorkingCopyHelper,
  trialSessionsHelper,
  trialSessionsSummaryHelper,
  updateCaseModalHelper,
  viewAllDocumentsHelper,
  workQueueHelper,
  workQueueSectionHelper,
};

export const state = {
  ...helpers,
  advancedSearchForm: {}, // form for advanced search screen, TODO: replace with state.form
  archiveDraftDocument: {
    // used by the delete draft document modal
    caseId: null,
    documentId: null,
    documentTitle: null,
  },
  assigneeId: null, // used for assigning workItems in assignSelectedWorkItemsAction
  batchDownloads: {}, // batch download of PDFs
  caseDetail: {},
  caseDetailErrors: {}, // field level validation errors on update case screen TODO: move to validationErrors
  caseDetailPage: {}, // current tabs for case detail page TODO: move to view metadata
  cases: [],
  cognitoLoginUrl: null,
  commonUI: {
    showBetaBar: true,
    showMobileMenu: false,
    showUsaBannerDetails: false,
  },
  completeForm: {}, // TODO: replace with state.form
  currentPage: 'Interstitial',
  currentTab: '', // TODO: move to view metadata
  docketNumberSearchForm: {}, // needs its own object because it's present when other forms are on screen
  docketRecordIndex: 0,
  document: {},
  documentDetail: {
    tab: '',
  },
  documentId: null,
  documentSelectedForPreview: null,
  documentSelectedForScan: null,
  documentUploadMode: 'scan', // TODO: move inside another object
  fieldOrder: [], // TODO: move to view metadata
  form: {}, // shared object for creating new entities, clear before using
  modal: {},
  navigation: {},
  notifications: {},
  path: '/', // can this be refactored away? Using router.query?
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
  pdfPreviewModal: {}, // how is this different than the modal?
  percentComplete: 0,
  permissions: null,
  previewPdfFile: null,
  procedureTypes: [], // use constants instead
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
  searchMode: 'byName',
  searchTerm: '',
  sectionInboxCount: 0,
  sectionUsers: [],
  selectedWorkItems: [],
  sessionMetadata: {
    docketRecordSort: [],
  },
  showModal: '',
  showValidation: false,
  startCaseInternal: {
    tab: '',
  },
  timeRemaining: Number.POSITIVE_INFINITY,
  trialSessionsTab: {
    group: null,
  },
  user: null,
  users: [],
  validationErrors: {},
  waitingForResponse: false,
  waitingForResponseRequests: 0,
  workItem: {},
  workItemActions: {},
  workItemMetadata: {},
  workQueue: [],
  workQueueToDisplay: { box: 'inbox', queue: 'my', workQueueIsInternal: true },
};
