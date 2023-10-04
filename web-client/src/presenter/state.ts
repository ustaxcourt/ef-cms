import {
  JudgeActivityReportState,
  initialJudgeActivityReportState,
} from './judgeActivityReportState';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { addCourtIssuedDocketEntryHelper } from './computeds/addCourtIssuedDocketEntryHelper';
import { addCourtIssuedDocketEntryNonstandardHelper } from './computeds/addCourtIssuedDocketEntryNonstandardHelper';
import { addDocketEntryHelper } from './computeds/addDocketEntryHelper';
import { addDocketNumbersModalHelper } from './computeds/addDocketNumbersModalHelper';
import { addEditCaseWorksheetModalHelper } from '@web-client/presenter/computeds/CaseWorksheets/addEditCaseWorksheetModalHelper';
import { addToTrialSessionModalHelper } from './computeds/addToTrialSessionModalHelper';
import { addTrialSessionInformationHelper } from './computeds/TrialSession/addTrialSessionInformationHelper';
import { advancedDocumentSearchHelper } from './computeds/AdvancedSearch/advancedDocumentSearchHelper';
import { advancedSearchHelper } from './computeds/AdvancedSearch/advancedSearchHelper';
import { alertHelper } from './computeds/alertHelper';
import { allowExternalConsolidatedGroupFilingHelper } from './computeds/allowExternalConsolidatedGroupFilingHelper';
import { appInstanceManagerHelper } from './computeds/appInstanceManagerHelper';
import { applyStampFormHelper } from './computeds/applyStampFormHelper';
import { batchDownloadHelper } from './computeds/batchDownloadHelper';
import { blockedCasesReportHelper } from './computeds/blockedCasesReportHelper';
import { caseDeadlineReportHelper } from './computeds/caseDeadlineReportHelper';
import { caseDetailEditHelper } from './computeds/caseDetailEditHelper';
import { caseDetailHeaderHelper } from './computeds/caseDetailHeaderHelper';
import { caseDetailHelper } from './computeds/caseDetailHelper';
import { caseDetailPractitionerSearchHelper } from './computeds/caseDetailPractitionerSearchHelper';
import { caseDetailSubnavHelper } from './computeds/caseDetailSubnavHelper';
import { caseInformationHelper } from './computeds/caseInformationHelper';
import { caseInventoryReportHelper } from './computeds/caseInventoryReportHelper';
import { caseSearchBoxHelper } from './computeds/caseSearchBoxHelper';
import { caseSearchByNameHelper } from './computeds/AdvancedSearch/CaseSearchByNameHelper';
import { caseSearchNoMatchesHelper } from './computeds/caseSearchNoMatchesHelper';
import { caseStatusHistoryHelper } from './computeds/caseStatusHistoryHelper';
import { caseTypeDescriptionHelper } from './computeds/caseTypeDescriptionHelper';
import { caseWorksheetsHelper } from '@web-client/presenter/computeds/CaseWorksheets/caseWorksheetsHelper';
import { cloneDeep } from 'lodash';
import { completeDocumentTypeSectionHelper } from './computeds/completeDocumentTypeSectionHelper';
import { confirmInitiateServiceModalHelper } from './computeds/confirmInitiateServiceModalHelper';
import { contactsHelper } from './computeds/contactsHelper';
import { correspondenceViewerHelper } from './computeds/correspondenceViewerHelper';
import { createMessageModalHelper } from './computeds/createMessageModalHelper';
import { createOrderHelper } from './computeds/createOrderHelper';
import { createPractitionerUserHelper } from './computeds/createPractitionerUserHelper';
import { customCaseInventoryReportHelper } from './computeds/customCaseInventoryReportHelper';
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
import { externalConsolidatedCaseGroupHelper } from './computeds/externalConsolidatedCaseGroupHelper';
import { externalUserCasesHelper } from './computeds/Dashboard/externalUserCasesHelper';
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
import { getOrdinalValuesForUploadIteration } from './computeds/selectDocumentTypeHelper';
import { getTrialCityName } from './computeds/formattedTrialCity';
import { headerHelper } from './computeds/headerHelper';
import { initialCustomCaseInventoryReportState } from './customCaseInventoryReportState';
import { initialTrialSessionState } from '@web-client/presenter/state/trialSessionState';
import { initialTrialSessionWorkingCopyState } from '@web-client/presenter/state/trialSessionWorkingCopyState';
import { internalPetitionPartiesHelper } from './computeds/internalPetitionPartiesHelper';
import { internalTypesHelper } from './computeds/internalTypesHelper';
import { judgeActivityReportHelper } from './computeds/JudgeActivityReport/judgeActivityReportHelper';
import { loadingHelper } from './computeds/loadingHelper';
import { menuHelper } from './computeds/menuHelper';
import { messageDocumentHelper } from './computeds/messageDocumentHelper';
import { messageModalHelper } from './computeds/messageModalHelper';
import { messagesHelper } from './computeds/messagesHelper';
import { myAccountHelper } from './computeds/myAccountHelper';
import { noticeStatusHelper } from './computeds/noticeStatusHelper';
import { orderTypesHelper } from './computeds/orderTypesHelper';
import { paperDocketEntryHelper } from './computeds/paperDocketEntryHelper';
import { paperServiceStatusHelper } from './computeds/paperServiceStatusHelper';
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
import { reportMenuHelper } from './computeds/reportMenuHelper';
import { requestAccessHelper } from './computeds/requestAccessHelper';
import { reviewSavedPetitionHelper } from './computeds/reviewSavedPetitionHelper';
import { scanBatchPreviewerHelper } from './computeds/scanBatchPreviewerHelper';
import { scanHelper } from './computeds/scanHelper';
import { sealedCaseDetailHelper } from './computeds/sealedCaseDetailHelper';
import { serveThirtyDayNoticeModalHelper } from './computeds/serveThirtyDayNoticeModalHelper';
import { sessionAssignmentHelper } from './computeds/sessionAssignmentHelper';
import { setForHearingModalHelper } from './computeds/setForHearingModalHelper';
import { showAppTimeoutModalHelper } from './computeds/showAppTimeoutModalHelper';
import { showSortableHeaders } from './computeds/showSortableHeaders';
import { sortableColumnHelper } from './computeds/sortableColumnHelper';
import { startCaseHelper } from './computeds/startCaseHelper';
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

const { ASCENDING, DOCKET_RECORD_FILTER_OPTIONS, IDLE_STATUS } = getConstants();

export const computeds = {
  addCourtIssuedDocketEntryHelper,
  addCourtIssuedDocketEntryNonstandardHelper,
  addDocketEntryHelper,
  addDocketNumbersModalHelper,
  addEditCaseWorksheetModalHelper,
  addToTrialSessionModalHelper,
  addTrialSessionInformationHelper,
  advancedDocumentSearchHelper,
  advancedSearchHelper,
  alertHelper,
  allowExternalConsolidatedGroupFilingHelper,
  appInstanceManagerHelper,
  applyStampFormHelper,
  batchDownloadHelper,
  blockedCasesReportHelper,
  caseDeadlineReportHelper,
  caseDetailEditHelper,
  caseDetailHeaderHelper,
  caseDetailHelper,
  caseDetailPractitionerSearchHelper,
  caseDetailSubnavHelper,
  caseInformationHelper,
  caseInventoryReportHelper,
  caseSearchBoxHelper,
  caseSearchByNameHelper,
  caseSearchNoMatchesHelper,
  caseStatusHistoryHelper,
  caseTypeDescriptionHelper,
  caseWorksheetsHelper,
  completeDocumentTypeSectionHelper,
  confirmInitiateServiceModalHelper,
  contactsHelper,
  correspondenceViewerHelper,
  createMessageModalHelper,
  createOrderHelper,
  createPractitionerUserHelper,
  customCaseInventoryReportHelper,
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
  externalConsolidatedCaseGroupHelper,
  externalUserCasesHelper,
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
  getOrdinalValuesForUploadIteration,
  getTrialCityName,
  headerHelper,
  internalPetitionPartiesHelper,
  internalTypesHelper,
  judgeActivityReportHelper,
  loadingHelper,
  menuHelper,
  messageDocumentHelper,
  messageModalHelper,
  messagesHelper,
  myAccountHelper,
  noticeStatusHelper,
  orderTypesHelper,
  paperDocketEntryHelper,
  paperServiceStatusHelper,
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
  reportMenuHelper,
  requestAccessHelper,
  reviewSavedPetitionHelper,
  scanBatchPreviewerHelper,
  scanHelper,
  sealedCaseDetailHelper,
  serveThirtyDayNoticeModalHelper,
  sessionAssignmentHelper,
  setForHearingModalHelper,
  showAppTimeoutModalHelper,
  showSortableHeaders,
  sortableColumnHelper,
  startCaseHelper,
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
};

export const baseState = {
  advancedSearchForm: {} as any, // form for advanced search screen, TODO: replace with state.form
  advancedSearchTab: 'case',
  allJudges: [],
  archiveDraftDocument: {
    docketEntryId: null,
    // used by the delete draft document modal
    docketNumber: null,
    documentTitle: null,
  },
  assigneeId: null,
  batchDownloads: {},
  caseDeadlineReport: {} as {
    caseDeadlines: RawCaseDeadline[];
    judgeFilter: string;
    totalCount: number;
    page: number;
  },
  caseDetail: {} as RawCase,
  closedCases: [],
  cognitoLoginUrl: null,
  completeForm: {},
  constants: {} as ReturnType<typeof getConstants>,
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
  customCaseInventory: cloneDeep(initialCustomCaseInventoryReportState),
  docketEntryId: null,
  docketRecordIndex: 0,
  draftDocumentViewerDocketEntryId: null,
  fileUploadProgress: {
    // used for the progress bar shown in modal when uploading files
    isUploading: false,
    percentComplete: 0,
    timeRemaining: Number.POSITIVE_INFINITY,
  },
  form: {} as any,
  fromPage: '',
  // shared object for creating new entities, clear before using
  header: {
    searchTerm: '',
    showBetaBar: true, // default state
    showMobileMenu: false,
    showUsaBannerDetails: false,
  },
  health: undefined as any,
  idleLogoutState: {
    logoutAt: undefined,
    state: 'INITIAL' as 'INITIAL' | 'MONITORING' | 'COUNTDOWN',
  },
  idleStatus: IDLE_STATUS.ACTIVE,
  iframeSrc: '',
  individualInProgressCount: 0,
  individualInboxCount: 0,
  isTerminalUser: false,
  judgeActivityReport: cloneDeep(
    initialJudgeActivityReportState,
  ) as JudgeActivityReportState,
  judgeUser: {} as any,
  judges: [] as RawUser[],
  lastIdleAction: undefined,
  legacyAndCurrentJudges: [],
  messagesInboxCount: 0,
  messagesSectionCount: 0,
  modal: {
    docketEntry: undefined,
    pdfPreviewModal: undefined,
    showModal: undefined, // the name of the modal to display
  } as Record<string, string | undefined>,
  navigation: {},
  noticeStatusState: {
    casesProcessed: 0,
    totalCases: 0,
  },
  notifications: {} as {
    qcSectionInboxCount: number;
    qcSectionInProgressCount: number;
    qcIndividualInboxCount: number;
    qcIndividualInProgressCount: number;
    unreadMessageCount?: number;
  },
  openCases: [],
  paperServiceStatusState: {
    pdfsAppended: 0,
    totalPdfs: 0,
  },
  pdfForSigning: {
    docketEntryId: null,
    nameForSigning: '',
    nameForSigningLine2: '',
    pageNumber: 1,
    pdfjsObj: null,
    signatureApplied: false,
    signatureData: null,
    stampApplied: false,
    stampData: null,
  },
  pdfPreviewUrl: '',
  pendingReports: {},
  permissions: null,
  practitionerDetail: {},
  previewPdfFile: null,
  progressIndicator: {
    // used for the spinner that shows when waiting for network responses
    waitingForResponse: false,
    waitingForResponseRequests: 0,
  },
  saveAlertsForNavigation: false,
  scanner: {
    batchIndexToDelete: null,
    batchIndexToRescan: null, // batch index for re-scanning
    batchToDeletePageCount: null,
    batches: [],
    currentPageIndex: 0, // batches from scanning
    isScanning: false,
    selectedBatchIndex: 0,
  },
  screenMetadata: {} as any,
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
  submittedAndCavCases: {
    submittedAndCavCasesByJudge: [] as any,
    // TODO: this should get moved to currentViewMetadata
    worksheets: [] as RawCaseWorksheet[],
  },
  submittedAndCavCasesForJudge: [],
  tableSort: {
    sortField: 'createdAt',
    sortOrder: ASCENDING,
  },
  trialSession: cloneDeep(initialTrialSessionState),
  trialSessionJudge: {
    name: '',
  },
  trialSessionWorkingCopy: cloneDeep(initialTrialSessionWorkingCopyState),
  user: null,
  userContactEditProgress: {},
  users: [],
  validationErrors: {} as Record<string, string>,
  viewerDocumentToDisplay: undefined,
  workItem: {},
  workItemActions: {},
  workItemMetadata: {},
  workQueue: [],
  workQueueToDisplay: { box: 'inbox', queue: 'my' },
  workitemAllCheckbox: false,
};

export const initialState = {
  ...baseState,
  ...computeds,
};

export type ClientState = typeof initialState;
