/* eslint-disable max-lines */
import { Contact } from '@shared/business/useCases/generatePetitionPdfInteractor';
import { EligibleCase } from '@shared/business/entities/cases/EligibleCase';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { FormattedCaseInventoryReportEntry } from '@shared/business/utilities/getFormattedCaseDetail';
import { FormattedPendingMotionWithWorksheet } from '@web-api/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { GetCasesByStatusAndByJudgeResponse } from '@web-api/business/useCases/judgeActivityReport/getCaseWorksheetsByJudgeInteractor';
import { IrsNoticeForm } from '@web-client/business/entities/startCase/IrsNoticeForm';
import { JudgeActivityReportState } from '@web-client/ustc-ui/Utils/types';
import { JudgeChambersInfo } from '@web-client/presenter/actions/getJudgesChambersAction';
import {
  PRACTICE_TYPE,
  SERVICE_INDICATOR_TYPES,
  STATE_KEYS,
} from '@shared/business/entities/EntityConstants';
import {
  PreviousTerm,
  TrialLocationData,
} from '@shared/business/utilities/trialSessionPlanningReport/trialSessionPlanningReportDataTypes';
import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';
import { RawMessage } from '@shared/business/entities/Message';
import { RawUser, UserContact } from '@shared/business/entities/User';
import { TAssociatedCase } from '@shared/business/useCases/getCasesForUserInteractor';
import { RecentFiling } from '@shared/business/useCases/getRecentFilingsForUserInteractor';
import { TrialSessionLocationInfo } from '@shared/business/entities/trialSessions/TrialSession';
import { TroubleshootingLinkInfo } from '@web-client/presenter/sequences/showFileUploadErrorModalSequence';
import { addCourtIssuedDocketEntryHelper } from './computeds/addCourtIssuedDocketEntryHelper';
import { addCourtIssuedDocketEntryNonstandardHelper } from './computeds/addCourtIssuedDocketEntryNonstandardHelper';
import { addDocketEntryHelper } from './computeds/addDocketEntryHelper';
import { addDocketNumbersModalHelper } from './computeds/addDocketNumbersModalHelper';
import { addEditCaseWorksheetModalHelper } from '@web-client/presenter/computeds/CaseWorksheets/addEditCaseWorksheetModalHelper';
import { addEditDocketEntryWorksheetModalHelper } from '@web-client/presenter/computeds/PendingMotions/addEditDocketEntryWorksheetModalHelper';
import { addToTrialSessionModalHelper } from './computeds/addToTrialSessionModalHelper';
import { addTrialSessionInformationHelper } from './computeds/TrialSession/addTrialSessionInformationHelper';
import { advancedDocumentSearchHelper } from './computeds/AdvancedSearch/advancedDocumentSearchHelper';
import { advancedSearchHelper } from './computeds/AdvancedSearch/advancedSearchHelper';
import { alertHelper } from './computeds/alertHelper';
import { appInstanceManagerHelper } from './computeds/appInstanceManagerHelper';
import { applyStampFormHelper } from './computeds/applyStampFormHelper';
import { batchDownloadHelper } from './computeds/batchDownloadHelper';
import { blockedCasesReportHelper } from './computeds/blockedCasesReportHelper';
import { caseAssociationRequestHelper } from './computeds/caseAssociationRequestHelper';
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
import { changePasswordHelper } from '@web-client/presenter/computeds/Login/changePasswordHelper';
import { cloneDeep } from 'lodash';
import { completeDocumentTypeSectionHelper } from './computeds/completeDocumentTypeSectionHelper';
import { confirmInitiateServiceModalHelper } from './computeds/confirmInitiateServiceModalHelper';
import { contactsHelper } from './computeds/contactsHelper';
import { correspondenceViewerHelper } from './computeds/correspondenceViewerHelper';
import { createAccountHelper } from '@web-client/presenter/computeds/CreatePetitionerAccount/createAccountHelper';
import { createMessageModalHelper } from './computeds/createMessageModalHelper';
import { createOrderHelper } from './computeds/createOrderHelper';
import { createPractitionerUserHelper } from './computeds/createPractitionerUserHelper';
import { customCaseReportHelper } from './computeds/customCaseReportHelper';
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
import { emptyUserState } from '@web-client/presenter/state/userState';
import { externalConsolidatedCaseGroupHelper } from './computeds/externalConsolidatedCaseGroupHelper';
import { externalUserCasesHelper } from './computeds/Dashboard/externalUserCasesHelper';
import { fileAutoGeneratedDocumentReviewHelper } from './computeds/fileAutoGeneratedDocumentReviewHelper';
import { fileDocumentHelper } from './computeds/fileDocumentHelper';
import { filePetitionHelper } from '@web-client/presenter/computeds/filePetitionHelper';
import { fileUploadStatusHelper } from './computeds/fileUploadStatusHelper';
import { filingPartiesFormHelper } from './computeds/filingPartiesFormHelper';
import { formattedCaseDeadlines } from './computeds/formattedCaseDeadlines';
import {
  formattedCaseDetail,
  formattedClosedCases,
  formattedOpenCases,
} from './computeds/formattedCaseDetail';
import { formattedCaseMessages } from './computeds/formattedCaseMessages';
import { formattedClerkOfCourtDashboardTrialSessions } from './computeds/formattedClerkOfCourtDashboardTrialSessions';
import { formattedDashboardTrialSessions } from './computeds/formattedDashboardTrialSessions';
import { formattedDocketEntries } from './computeds/formattedDocketEntries';
import { formattedDocument } from './computeds/formattedDocument';
import { formattedEligibleCasesHelper } from './computeds/formattedEligibleCasesHelper';
import { formattedMessageDetail } from './computeds/formattedMessageDetail';
import { formattedMessages } from './computeds/formattedMessages';
import { formattedTrialSessionDetails } from './computeds/formattedTrialSessionDetails';
import { formattedWorkQueue } from './computeds/formattedWorkQueue';
import { getAllIrsPractitionersForSelectHelper } from '@web-client/presenter/computeds/TrialSession/getAllIrsPractitionersForSelectHelper';
import { getConstants } from '../getConstants';
import { getOrdinalValuesForUploadIteration } from './computeds/selectDocumentTypeHelper';
import { headerHelper } from './computeds/headerHelper';
import { initialBlockedCaseReportFilter } from '@web-client/presenter/state/blockedCasesReportState';
import { initialCustomCaseReportState } from './customCaseReportState';
import { initialMinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import { initialPendingReportsState } from '@web-client/presenter/state/pendingReportState';
import { initialTrialSessionPageState } from '@web-client/presenter/state/trialSessionsPageState';
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
import { messagesIndividualInboxHelper } from './computeds/messagesIndividualInboxHelper';
import { motionOrderResponseFormHelper } from './computeds/motionOrderResponseFormHelper';
import { myAccountHelper } from './computeds/myAccountHelper';
import { noticeOfWithdrawalHelper } from './computeds/noticeOfWithdrawalHelper';
import { newMinuteSheetModalHelper } from './computeds/newMinuteSheetModalHelper';
import { noticeStatusHelper } from './computeds/noticeStatusHelper';
import { orderTypesHelper } from './computeds/orderTypesHelper';
import { paperDocketEntryHelper } from './computeds/paperDocketEntryHelper';
import { paperServiceStatusHelper } from './computeds/paperServiceStatusHelper';
import { partiesInformationHelper } from './computeds/partiesInformationHelper';
import { pdfPreviewModalHelper } from './computeds/PDFPreviewModal/pdfPreviewModalHelper';
import { pdfSignerHelper } from './computeds/pdfSignerHelper';
import { pendingMotionsHelper } from '@web-client/presenter/computeds/PendingMotions/pendingMotionsHelper';
import { pendingReportHelper } from './computeds/pendingReportHelper';
import { pendingReportListHelper } from './computeds/pendingReportListHelper';
import { petitionQcHelper } from './computeds/petitionQcHelper';
import { practitionerDetailHelper } from './computeds/practitionerDetailHelper';
import { practitionerDocumentationFormHelper } from './computeds/practitionerDocumentationFormHelper';
import { practitionerDocumentationHelper } from './computeds/practitionerDocumentationHelper';
import { practitionerInformationHelper } from './computeds/practitionerInformationHelper';
import { practitionerSearchFormHelper } from './computeds/practitionerSearchFormHelper';
import { practitionerSearchHelper } from './computeds/AdvancedSearch/practitionerSearchHelper';
import { printPaperServiceHelper } from './computeds/printPaperServiceHelper';
import { recentMessagesHelper } from './computeds/recentMessagesHelper';
import { recentFilingsHelper } from './computeds/recentFilingsHelper';
import { removeFromTrialSessionModalHelper } from './computeds/removeFromTrialSessionModalHelper';
import { reportMenuHelper } from './computeds/reportMenuHelper';
import { reviewSavedPetitionHelper } from './computeds/reviewSavedPetitionHelper';
import { scanBatchPreviewerHelper } from './computeds/scanBatchPreviewerHelper';
import { scanHelper } from './computeds/scanHelper';
import { sealedCaseDetailHelper } from './computeds/sealedCaseDetailHelper';
import { selectCriteriaHelper } from '@web-client/presenter/computeds/selectCriteriaHelper';
import { serveThirtyDayNoticeModalHelper } from './computeds/serveThirtyDayNoticeModalHelper';
import { sessionAssignmentHelper } from './computeds/sessionAssignmentHelper';
import { setForHearingModalHelper } from './computeds/setForHearingModalHelper';
import { startCaseInternalHelper } from './computeds/startCaseInternalHelper';
import { statisticsFormHelper } from './computeds/statisticsFormHelper';
import { statisticsHelper } from './computeds/statisticsHelper';
import { statusReportOrderHelper } from './computeds/statusReportOrderHelper';
import { templateHelper } from './computeds/templateHelper';
import { termBuilderHelper } from './computeds/termBuilderHelper';
import { trialCitiesHelper } from './computeds/trialCitiesHelper';
import { trialLocationHelper } from '@web-client/presenter/computeds/trialLocationHelper';
import { trialSessionDetailsHelper } from './computeds/trialSessionDetailsHelper';
import { trialSessionHeaderHelper } from './computeds/trialSessionHeaderHelper';
import { trialSessionMinutesFormOptionsHelper } from './computeds/TrialSessionMinutes/trialSessionMinutesFormOptionsHelper';
import { trialSessionPlanningReportViewHelper } from '@web-client/presenter/computeds/trialSessionPlanningReportViewHelper';
import { trialSessionWorkingCopyHelper } from './computeds/trialSessionWorkingCopyHelper';
import { trialSessionsHelper } from './computeds/trialSessionsHelper';
import { trialSessionsSummaryHelper } from './computeds/trialSessionsSummaryHelper';
import { updateCaseModalHelper } from './computeds/updateCaseModalHelper';
import { userContactEditHelper } from './computeds/userContactEditHelper';
import { userContactEditProgressHelper } from './computeds/userContactEditProgressHelper';
import { viewCounselHelper } from './computeds/viewCounselHelper';
import { workQueueHelper } from './computeds/workQueueHelper';
import { BlockedCaseData } from '@web-api/persistence/postgres/cases/reports/getBlockedCasesForTrialLocation';
import { RawGenerateSuggestedTermForm } from '@shared/business/entities/trialSessions/GenerateSuggestedTermForm';
import { RawWorkItemWithCaseAndDocketEntryInfo } from '@web-api/persistence/postgres/workitems/schema';

const { ASCENDING, DOCKET_RECORD_FILTER_OPTIONS } = getConstants();

export const computeds = {
  addCourtIssuedDocketEntryHelper:
    addCourtIssuedDocketEntryHelper as unknown as ReturnType<
      typeof addCourtIssuedDocketEntryHelper
    >,
  addCourtIssuedDocketEntryNonstandardHelper:
    addCourtIssuedDocketEntryNonstandardHelper as unknown as ReturnType<
      typeof addCourtIssuedDocketEntryNonstandardHelper
    >,
  addDocketEntryHelper: addDocketEntryHelper as unknown as ReturnType<
    typeof addDocketEntryHelper
  >,
  addDocketNumbersModalHelper:
    addDocketNumbersModalHelper as unknown as ReturnType<
      typeof addDocketNumbersModalHelper
    >,
  addEditCaseWorksheetModalHelper:
    addEditCaseWorksheetModalHelper as unknown as ReturnType<
      typeof addEditCaseWorksheetModalHelper
    >,
  addEditDocketEntryWorksheetModalHelper:
    addEditDocketEntryWorksheetModalHelper as unknown as ReturnType<
      typeof addEditDocketEntryWorksheetModalHelper
    >,
  addToTrialSessionModalHelper:
    addToTrialSessionModalHelper as unknown as ReturnType<
      typeof addToTrialSessionModalHelper
    >,
  addTrialSessionInformationHelper:
    addTrialSessionInformationHelper as unknown as ReturnType<
      typeof addTrialSessionInformationHelper
    >,
  advancedDocumentSearchHelper:
    advancedDocumentSearchHelper as unknown as ReturnType<
      typeof advancedDocumentSearchHelper
    >,
  advancedSearchHelper: advancedSearchHelper as unknown as ReturnType<
    typeof advancedSearchHelper
  >,
  alertHelper: alertHelper as unknown as ReturnType<typeof alertHelper>,
  appInstanceManagerHelper: appInstanceManagerHelper as unknown as ReturnType<
    typeof appInstanceManagerHelper
  >,
  applyStampFormHelper: applyStampFormHelper as unknown as ReturnType<
    typeof applyStampFormHelper
  >,
  batchDownloadHelper: batchDownloadHelper as unknown as ReturnType<
    typeof batchDownloadHelper
  >,
  blockedCasesReportHelper: blockedCasesReportHelper as unknown as ReturnType<
    typeof blockedCasesReportHelper
  >,
  caseAssociationRequestHelper:
    caseAssociationRequestHelper as unknown as ReturnType<
      typeof caseAssociationRequestHelper
    >,
  caseDeadlineReportHelper: caseDeadlineReportHelper as unknown as ReturnType<
    typeof caseDeadlineReportHelper
  >,
  caseDetailEditHelper: caseDetailEditHelper as unknown as ReturnType<
    typeof caseDetailEditHelper
  >,
  caseDetailHeaderHelper: caseDetailHeaderHelper as unknown as ReturnType<
    typeof caseDetailHeaderHelper
  >,
  caseDetailHelper: caseDetailHelper as unknown as ReturnType<
    typeof caseDetailHelper
  >,
  caseDetailPractitionerSearchHelper:
    caseDetailPractitionerSearchHelper as unknown as ReturnType<
      typeof caseDetailPractitionerSearchHelper
    >,
  caseDetailSubnavHelper: caseDetailSubnavHelper as unknown as ReturnType<
    typeof caseDetailSubnavHelper
  >,
  caseInformationHelper: caseInformationHelper as unknown as ReturnType<
    typeof caseInformationHelper
  >,
  caseInventoryReportHelper: caseInventoryReportHelper as unknown as ReturnType<
    typeof caseInventoryReportHelper
  >,
  caseSearchBoxHelper: caseSearchBoxHelper as unknown as ReturnType<
    typeof caseSearchBoxHelper
  >,
  caseSearchByNameHelper: caseSearchByNameHelper as unknown as ReturnType<
    typeof caseSearchByNameHelper
  >,
  caseSearchNoMatchesHelper: caseSearchNoMatchesHelper as unknown as ReturnType<
    typeof caseSearchNoMatchesHelper
  >,
  caseStatusHistoryHelper: caseStatusHistoryHelper as unknown as ReturnType<
    typeof caseStatusHistoryHelper
  >,
  caseTypeDescriptionHelper: caseTypeDescriptionHelper as unknown as ReturnType<
    typeof caseTypeDescriptionHelper
  >,
  caseWorksheetsHelper: caseWorksheetsHelper as unknown as ReturnType<
    typeof caseWorksheetsHelper
  >,
  changePasswordHelper: changePasswordHelper as unknown as ReturnType<
    typeof changePasswordHelper
  >,
  completeDocumentTypeSectionHelper:
    completeDocumentTypeSectionHelper as unknown as ReturnType<
      typeof completeDocumentTypeSectionHelper
    >,
  confirmInitiateServiceModalHelper:
    confirmInitiateServiceModalHelper as unknown as ReturnType<
      typeof confirmInitiateServiceModalHelper
    >,
  contactsHelper: contactsHelper as unknown as ReturnType<
    typeof contactsHelper
  >,
  correspondenceViewerHelper:
    correspondenceViewerHelper as unknown as ReturnType<
      typeof correspondenceViewerHelper
    >,
  createAccountHelper: createAccountHelper as unknown as ReturnType<
    typeof createAccountHelper
  >,
  createMessageModalHelper: createMessageModalHelper as unknown as ReturnType<
    typeof createMessageModalHelper
  >,
  createOrderHelper: createOrderHelper as unknown as ReturnType<
    typeof createOrderHelper
  >,
  createPractitionerUserHelper:
    createPractitionerUserHelper as unknown as ReturnType<
      typeof createPractitionerUserHelper
    >,
  customCaseReportHelper: customCaseReportHelper as unknown as ReturnType<
    typeof customCaseReportHelper
  >,
  dashboardExternalHelper: dashboardExternalHelper as unknown as ReturnType<
    typeof dashboardExternalHelper
  >,
  docketEntryQcHelper: docketEntryQcHelper as unknown as ReturnType<
    typeof docketEntryQcHelper
  >,
  docketRecordHelper: docketRecordHelper as unknown as ReturnType<
    typeof docketRecordHelper
  >,
  documentSigningHelper: documentSigningHelper as unknown as ReturnType<
    typeof documentSigningHelper
  >,
  documentViewerHelper: documentViewerHelper as unknown as ReturnType<
    typeof documentViewerHelper
  >,
  documentViewerLinksHelper: documentViewerLinksHelper as unknown as ReturnType<
    typeof documentViewerLinksHelper
  >,
  draftDocumentViewerHelper: draftDocumentViewerHelper as unknown as ReturnType<
    typeof draftDocumentViewerHelper
  >,
  editDocketEntryMetaHelper: editDocketEntryMetaHelper as unknown as ReturnType<
    typeof editDocketEntryMetaHelper
  >,
  editPetitionerInformationHelper:
    editPetitionerInformationHelper as unknown as ReturnType<
      typeof editPetitionerInformationHelper
    >,
  editStatisticFormHelper: editStatisticFormHelper as unknown as ReturnType<
    typeof editStatisticFormHelper
  >,
  externalConsolidatedCaseGroupHelper:
    externalConsolidatedCaseGroupHelper as unknown as ReturnType<
      typeof externalConsolidatedCaseGroupHelper
    >,
  externalUserCasesHelper: externalUserCasesHelper as unknown as ReturnType<
    typeof externalUserCasesHelper
  >,
  fileAutoGeneratedDocumentReviewHelper:
    fileAutoGeneratedDocumentReviewHelper as unknown as ReturnType<
      typeof fileAutoGeneratedDocumentReviewHelper
    >,
  fileDocumentHelper: fileDocumentHelper as unknown as ReturnType<
    typeof fileDocumentHelper
  >,
  filePetitionHelper: filePetitionHelper as unknown as ReturnType<
    typeof filePetitionHelper
  >,
  fileUploadStatusHelper: fileUploadStatusHelper as unknown as ReturnType<
    typeof fileUploadStatusHelper
  >,
  filingPartiesFormHelper: filingPartiesFormHelper as unknown as ReturnType<
    typeof filingPartiesFormHelper
  >,
  formattedCaseDeadlines: formattedCaseDeadlines as unknown as ReturnType<
    typeof formattedCaseDeadlines
  >,
  formattedCaseDetail: formattedCaseDetail as unknown as ReturnType<
    typeof formattedCaseDetail
  >,
  formattedCaseMessages: formattedCaseMessages as unknown as ReturnType<
    typeof formattedCaseMessages
  >,
  formattedClerkOfCourtDashboardTrialSessions:
    formattedClerkOfCourtDashboardTrialSessions as unknown as ReturnType<
      typeof formattedClerkOfCourtDashboardTrialSessions
    >,
  formattedClosedCases: formattedClosedCases as unknown as ReturnType<
    typeof formattedClosedCases
  >,
  formattedDashboardTrialSessions:
    formattedDashboardTrialSessions as unknown as ReturnType<
      typeof formattedDashboardTrialSessions
    >,
  formattedDocketEntries: formattedDocketEntries as unknown as ReturnType<
    typeof formattedDocketEntries
  >,
  formattedDocument: formattedDocument as unknown as ReturnType<
    typeof formattedDocument
  >,
  formattedEligibleCasesHelper:
    formattedEligibleCasesHelper as unknown as ReturnType<
      typeof formattedEligibleCasesHelper
    >,
  formattedMessageDetail: formattedMessageDetail as unknown as ReturnType<
    typeof formattedMessageDetail
  >,
  formattedMessages: formattedMessages as unknown as ReturnType<
    typeof formattedMessages
  >,
  formattedOpenCases: formattedOpenCases as unknown as ReturnType<
    typeof formattedOpenCases
  >,
  formattedTrialSessionDetails:
    formattedTrialSessionDetails as unknown as ReturnType<
      typeof formattedTrialSessionDetails
    >,
  formattedWorkQueue: formattedWorkQueue as unknown as ReturnType<
    typeof formattedWorkQueue
  >,
  getAllIrsPractitionersForSelectHelper:
    getAllIrsPractitionersForSelectHelper as unknown as ReturnType<
      typeof getAllIrsPractitionersForSelectHelper
    >,
  getOrdinalValuesForUploadIteration:
    getOrdinalValuesForUploadIteration as unknown as ReturnType<
      typeof getOrdinalValuesForUploadIteration
    >,
  headerHelper: headerHelper as unknown as ReturnType<typeof headerHelper>,
  internalPetitionPartiesHelper:
    internalPetitionPartiesHelper as unknown as ReturnType<
      typeof internalPetitionPartiesHelper
    >,
  internalTypesHelper: internalTypesHelper as unknown as ReturnType<
    typeof internalTypesHelper
  >,
  judgeActivityReportHelper: judgeActivityReportHelper as unknown as ReturnType<
    typeof judgeActivityReportHelper
  >,
  loadingHelper: loadingHelper as unknown as ReturnType<typeof loadingHelper>,
  menuHelper: menuHelper as unknown as ReturnType<typeof menuHelper>,
  messageDocumentHelper: messageDocumentHelper as unknown as ReturnType<
    typeof messageDocumentHelper
  >,
  messageModalHelper: messageModalHelper as unknown as ReturnType<
    typeof messageModalHelper
  >,
  messagesHelper: messagesHelper as unknown as ReturnType<
    typeof messagesHelper
  >,
  messagesIndividualInboxHelper:
    messagesIndividualInboxHelper as unknown as ReturnType<
      typeof messagesIndividualInboxHelper
    >,
  motionOrderResponseFormHelper:
    motionOrderResponseFormHelper as unknown as ReturnType<
      typeof motionOrderResponseFormHelper
    >,
  myAccountHelper: myAccountHelper as unknown as ReturnType<
    typeof myAccountHelper
  >,
  newMinuteSheetModalHelper: newMinuteSheetModalHelper as unknown as ReturnType<
    typeof newMinuteSheetModalHelper
  >,
  noticeOfWithdrawalHelper: noticeOfWithdrawalHelper as unknown as ReturnType<
    typeof noticeOfWithdrawalHelper
  >,
  noticeStatusHelper: noticeStatusHelper as unknown as ReturnType<
    typeof noticeStatusHelper
  >,
  orderTypesHelper: orderTypesHelper as unknown as ReturnType<
    typeof orderTypesHelper
  >,
  paperDocketEntryHelper: paperDocketEntryHelper as unknown as ReturnType<
    typeof paperDocketEntryHelper
  >,
  paperServiceStatusHelper: paperServiceStatusHelper as unknown as ReturnType<
    typeof paperServiceStatusHelper
  >,
  partiesInformationHelper: partiesInformationHelper as unknown as ReturnType<
    typeof partiesInformationHelper
  >,
  pdfPreviewModalHelper: pdfPreviewModalHelper as unknown as ReturnType<
    typeof pdfPreviewModalHelper
  >,
  pdfSignerHelper: pdfSignerHelper as unknown as ReturnType<
    typeof pdfSignerHelper
  >,
  pendingMotionsHelper: pendingMotionsHelper as unknown as ReturnType<
    typeof pendingMotionsHelper
  >,
  pendingReportHelper: pendingReportHelper as unknown as ReturnType<
    typeof pendingReportHelper
  >,
  pendingReportListHelper: pendingReportListHelper as unknown as ReturnType<
    typeof pendingReportListHelper
  >,
  petitionQcHelper: petitionQcHelper as unknown as ReturnType<
    typeof petitionQcHelper
  >,
  practitionerDetailHelper: practitionerDetailHelper as unknown as ReturnType<
    typeof practitionerDetailHelper
  >,
  practitionerDocumentationFormHelper:
    practitionerDocumentationFormHelper as unknown as ReturnType<
      typeof practitionerDocumentationFormHelper
    >,
  practitionerDocumentationHelper:
    practitionerDocumentationHelper as unknown as ReturnType<
      typeof practitionerDocumentationHelper
    >,
  practitionerInformationHelper:
    practitionerInformationHelper as unknown as ReturnType<
      typeof practitionerInformationHelper
    >,
  practitionerSearchFormHelper:
    practitionerSearchFormHelper as unknown as ReturnType<
      typeof practitionerSearchFormHelper
    >,
  practitionerSearchHelper: practitionerSearchHelper as unknown as ReturnType<
    typeof practitionerSearchHelper
  >,
  printPaperServiceHelper: printPaperServiceHelper as unknown as ReturnType<
    typeof printPaperServiceHelper
  >,
  recentMessagesHelper: recentMessagesHelper as unknown as ReturnType<
    typeof recentMessagesHelper
  >,
  recentFilingsHelper: recentFilingsHelper as unknown as ReturnType<
    typeof recentFilingsHelper
  >,
  removeFromTrialSessionModalHelper:
    removeFromTrialSessionModalHelper as unknown as ReturnType<
      typeof removeFromTrialSessionModalHelper
    >,
  reportMenuHelper: reportMenuHelper as unknown as ReturnType<
    typeof reportMenuHelper
  >,
  reviewSavedPetitionHelper: reviewSavedPetitionHelper as unknown as ReturnType<
    typeof reviewSavedPetitionHelper
  >,
  scanBatchPreviewerHelper: scanBatchPreviewerHelper as unknown as ReturnType<
    typeof scanBatchPreviewerHelper
  >,
  scanHelper: scanHelper as unknown as ReturnType<typeof scanHelper>,
  sealedCaseDetailHelper: sealedCaseDetailHelper as unknown as ReturnType<
    typeof sealedCaseDetailHelper
  >,
  selectCriteriaHelper: selectCriteriaHelper as unknown as ReturnType<
    typeof selectCriteriaHelper
  >,
  serveThirtyDayNoticeModalHelper:
    serveThirtyDayNoticeModalHelper as unknown as ReturnType<
      typeof serveThirtyDayNoticeModalHelper
    >,
  sessionAssignmentHelper: sessionAssignmentHelper as unknown as ReturnType<
    typeof sessionAssignmentHelper
  >,
  setForHearingModalHelper: setForHearingModalHelper as unknown as ReturnType<
    typeof setForHearingModalHelper
  >,
  startCaseInternalHelper: startCaseInternalHelper as unknown as ReturnType<
    typeof startCaseInternalHelper
  >,
  statisticsFormHelper: statisticsFormHelper as unknown as ReturnType<
    typeof statisticsFormHelper
  >,
  statisticsHelper: statisticsHelper as unknown as ReturnType<
    typeof statisticsHelper
  >,
  statusReportOrderHelper: statusReportOrderHelper as unknown as ReturnType<
    typeof statusReportOrderHelper
  >,
  templateHelper: templateHelper as unknown as ReturnType<
    typeof templateHelper
  >,
  termBuilderHelper: termBuilderHelper as unknown as ReturnType<
    typeof termBuilderHelper
  >,
  trialCitiesHelper: trialCitiesHelper as unknown as ReturnType<
    typeof trialCitiesHelper
  >,
  trialLocationHelper: trialLocationHelper as unknown as ReturnType<
    typeof trialLocationHelper
  >,
  trialSessionDetailsHelper: trialSessionDetailsHelper as unknown as ReturnType<
    typeof trialSessionDetailsHelper
  >,
  trialSessionHeaderHelper: trialSessionHeaderHelper as unknown as ReturnType<
    typeof trialSessionHeaderHelper
  >,
  trialSessionMinutesFormOptionsHelper:
    trialSessionMinutesFormOptionsHelper as unknown as ReturnType<
      typeof trialSessionMinutesFormOptionsHelper
    >,
  trialSessionPlanningReportViewHelper:
    trialSessionPlanningReportViewHelper as unknown as ReturnType<
      typeof trialSessionPlanningReportViewHelper
    >,
  trialSessionWorkingCopyHelper:
    trialSessionWorkingCopyHelper as unknown as ReturnType<
      typeof trialSessionWorkingCopyHelper
    >,
  trialSessionsHelper: trialSessionsHelper as unknown as ReturnType<
    typeof trialSessionsHelper
  >,
  trialSessionsSummaryHelper:
    trialSessionsSummaryHelper as unknown as ReturnType<
      typeof trialSessionsSummaryHelper
    >,
  updateCaseModalHelper: updateCaseModalHelper as unknown as ReturnType<
    typeof updateCaseModalHelper
  >,
  userContactEditHelper: userContactEditHelper as unknown as ReturnType<
    typeof userContactEditHelper
  >,
  userContactEditProgressHelper:
    userContactEditProgressHelper as unknown as ReturnType<
      typeof userContactEditProgressHelper
    >,
  viewCounselHelper: viewCounselHelper as unknown as ReturnType<
    typeof viewCounselHelper
  >,
  workQueueHelper: workQueueHelper as unknown as ReturnType<
    typeof workQueueHelper
  >,
};

export const baseState = {
  [STATE_KEYS.DOCKET_RECORD_TABLE_SORT]: {} as {
    sortField: string;
    sortOrder: 'asc' | 'desc';
  },
  [STATE_KEYS.TERM_BUILDER_INFORMATION]: undefined as
    | RawGenerateSuggestedTermForm
    | undefined,
  [STATE_KEYS.PENDING_REPORT_TABLE_SORT]: {} as {
    sortField: string;
    sortOrder: 'asc' | 'desc';
  },
  [STATE_KEYS.CONSOLIDATED_CASE_DEADLINES]: [] as {
    docketNumber: string;
    caseCaption: string;
  }[],
  advancedSearchForm: {} as any,
  // form for advanced search screen, TODO: replace with state.form
  advancedSearchTab: 'case',
  alertError: undefined,
  alertInfo: undefined,
  alertSuccess: undefined as AlertSuccess | undefined,
  alertWarning: undefined,
  allJudges: [],
  archiveDraftDocument: {
    docketEntryId: null,
    // used by the delete draft document modal
    docketNumber: null,
    documentTitle: null,
  },
  assigneeId: null,
  assigneeName: undefined as unknown as string,
  authentication: {
    form: {
      code: '',
      confirmPassword: '',
      email: '',
      password: '',
    },
    tempPassword: '',
  },
  batchDownloadUrl: '',
  batchDownloads: {} as {
    allowRetry?: boolean;
    zipInProgress?: boolean;
    totalFiles?: number;
    fileCount?: number;
    title?: string;
  },
  blockedCaseReportFilter: cloneDeep(initialBlockedCaseReportFilter),
  blockedCases: [] as BlockedCaseData[],
  caseDeadlineReport: {} as {
    caseDeadlinesForCurrentPage: (RawCaseDeadline & {
      caseCaption: string;
      docketNumber: string;
      docketNumberSuffix: string;
      docketNumberWithSuffix: string;
      leadDocketNumber: string;
    })[];
    caseDeadlinesTotalCount: 0;
    judgeIdFilter: string;
  },
  caseDeadlines: [] as RawCaseDeadline[],
  caseDetail: {} as RawCase & { messages?: RawMessage[] },
  caseInventoryReportData: {
    foundCasesForCurrentPage: [] as FormattedCaseInventoryReportEntry[],
    foundCasesTotalCount: 0,
  },
  clientConnectionId: '',
  clientNeedsToRefresh: false,
  closedCases: [] as TAssociatedCase[],
  closedCasesCurrentPage: undefined as number | undefined,
  cognito: {} as any,
  contactToSeal: undefined as (Contact & { contactId: string }) | undefined,
  coldCaseReport: {
    entries: [],
  },
  completeForm: {},
  confirmationText: undefined as unknown as
    | string
    | {
        penalties?: Record<string, string>;
        statistics?: Record<string, any>;
        irsDeficiencyAmount?: string;
        determinationDeficiencyAmount?: string;
      }
    | undefined,
  constants: {} as ReturnType<typeof getConstants>,
  correspondenceId: undefined as string | undefined,
  createOrderAddedDocketNumbers: undefined as unknown as string[],
  createOrderSelectedCases: [] as any[],
  createOrderTab: 'generate' as 'generate' | 'edit',
  currentJudges: [],
  currentPage: 'Loading',
  caseCurrentPaginationPage: 0,
  orderCurrentPaginationPage: 0,
  opinionCurrentPaginationPage: 0,
  opinionDocumentTypes: [] as string[],
  trialSessionLocationChangeModalInfo: {
    currentTrialSessionLocation: undefined as
      | TrialSessionLocationInfo
      | undefined,
    updatedTrialSessionLocation: undefined as
      | TrialSessionLocationInfo
      | undefined,
  },
  trialSessionStartDateChangeModalInfo: {
    currentTrialSessionStartDate: undefined as string | undefined,
    updatedTrialSessionStartDate: undefined as string | undefined,
  },
  trialSessionChangeModalState: {
    persist: false as boolean | undefined,
  },
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
      frozen: undefined as boolean | undefined,
      primaryTab: undefined as string | undefined,
      caseInformationTab: undefined as string | undefined,
      showEditPetition: false as boolean | undefined,
      showEditCase: false as boolean | undefined,
      inProgressTab: undefined as string | undefined,
      docketRecordTab: undefined as string | undefined,
      partyViewTab: undefined as string | undefined,
      messagesTab: undefined as string | undefined,
      trackedItemsTab: undefined as string | undefined,
      draftsTab: undefined as string | undefined,
      correspondenceTab: undefined as string | undefined,
      notesTab: undefined as string | undefined,
    },
    documentSelectedForPreview: undefined as string | undefined,
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
  customCaseReport: cloneDeep(initialCustomCaseReportState),
  docketEntryId: '',
  docketRecordIndex: 0,
  documentToEdit: {} as any,
  documentId: undefined as string | undefined,
  documentsSelectedForDownload: [] as { docketEntryId: string }[],
  editDocketEntryMetaTab: 'documentInfo' as 'documentInfo' | 'documentType',
  caseSearchSort: {
    sortColumn: undefined as string | undefined,
    sortDirection: undefined as 'asc' | 'desc' | undefined,
  },
  orderDocumentSearchSort: {
    sortColumn: 'formattedFiledDate',
    sortDirection: 'desc' as 'asc' | 'desc',
  },
  opinionDocumentSearchSort: {
    sortColumn: 'formattedFiledDate',
    sortDirection: 'desc' as 'asc' | 'desc',
  },
  draftDocumentViewerDocketEntryId: null,
  editDocumentEntryPoint: 'CaseDetail' as 'CaseDetail' | 'DocumentDetail',
  featureFlags: undefined as unknown as { [key: string]: string },
  fileUploadProgress: {
    isHavingSystemIssues: false,
    isUploading: false,
    percentComplete: 0,
    timeRemaining: Number.POSITIVE_INFINITY,
    noThrottle: false as boolean | undefined,
  },
  form: {} as any,
  fromPage: '',
  isPublic: false,
  // shared object for creating new entities, clear before using
  header: {
    searchTerm: '',
    showBetaBar: true, // default state
    showMobileMenu: false,
    showUsaBannerDetails: false,
  },
  health: undefined as any,
  iframeSrc: '',
  individualInProgressCount: 0,
  individualInboxCount: 0,
  irsNoticeUploadFormInfo: [] as CreateCaseIrsForm[],
  irsPractitioners: [] as RawUser[],
  isTerminalUser: false,
  isCreatingOrder: false,
  isEditingDocketEntry: false,
  isUpdatingWithFile: false,
  isExpanded: false as boolean | undefined,
  judgeActivityReport: {
    judgeActivityReportData: {},
  } as JudgeActivityReportState,
  judgeUser: {} as any,
  judges: [] as RawUser[],
  judgesChambers: [] as JudgeChambersInfo[],
  judgesNote: {} as { notes: string },
  legacyAndCurrentJudges: [] as RawUser[],
  login: {} as any,
  logoutType: '',
  maintenanceMode: false,
  messageBoxToDisplay: {
    box: undefined,
    queue: undefined,
    section: undefined,
  },
  messages: [] as RawMessage[],
  messagesInboxCount: 0,
  messageDetail: undefined as unknown as RawMessage[],
  messagesPage: {
    completionSuccess: false,
    messagesCompletedAt: '',
    messagesCompletedBy: '',
    selectedMessages: new Map() as Map<string, string>,
  },
  messageCacheKey: undefined as unknown as string,
  messagesSectionCount: 0,
  minuteSheetForm: cloneDeep(initialMinuteSheetFormState),
  minuteSheetFormSnapshot: '',
  isUnscheduledMinuteSheet: false,
  messageViewerDocumentToDisplay: undefined as unknown as ViewerDocument,
  modal: {
    calendarNotes: undefined as string | undefined,
    contactSupportMessage: undefined as string | undefined, // the "contact support" message sans email address
    docketEntry: undefined,
    form: {} as Record<string, any>,
    message: undefined as string | undefined, // the message to show
    pdfPreviewModal: undefined,
    showModal: undefined as string | undefined, // the name of the modal to display
    title: undefined as string | undefined,
    trialSessionId: undefined as string | undefined,
    troubleshootingInfo: undefined as TroubleshootingLinkInfo | undefined, // steps for troubleshooting
    penalties: undefined as unknown[] | undefined,
  } as Record<string, any>,
  navigation: {
    caseDetailMenu: '',
    openMenu: '',
  },
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
  openCases: [] as TAssociatedCase[],
  openCasesCurrentPage: undefined as number | undefined,
  openClosedCases: {
    caseType: undefined as string | undefined,
  },
  paperServiceStatusState: {
    pdfsAppended: 0,
    totalPdfs: 0,
  },
  parentMessageId: undefined,
  pdfForSigning: {
    docketEntryId: null,
    nameForSigning: '',
    nameForSigningLine2: '',
    pageNumber: 1,
    pdfjsObj: null as PDFDocumentProxy | null,
    signatureApplied: false,
    signatureData: null as { scale: number; x: number; y: number } | null,
    stampApplied: false,
    stampData: null,
    isPdfAlreadySigned: false as boolean | undefined,
    isPdfAlreadyStamped: false as boolean | undefined,
  },
  pdfGeneratedUrl: '',
  pdfPreviewUrl: '',
  pendingMotions: {
    docketEntries: [] as FormattedPendingMotionWithWorksheet[],
  },
  pendingReports: cloneDeep(initialPendingReportsState),
  permissions: {} as Record<string, boolean>,
  petitionFormatted: {
    applicationForWaiverOfFilingFeeFile: undefined,
    attachmentToPetitionFile: undefined,
    caseCaptionExtension: undefined,
    caseTitle: undefined,
    caseType: undefined,
    contactCounsel: undefined,
    contactPrimary: undefined as Contact | undefined,
    contactSecondary: undefined as Contact | undefined,
    corporateDisclosureFile: undefined,
    corporateDisclosureFileUrl: undefined,
    hasIrsNotice: undefined,
    irsNoticeFileUrl: undefined,
    irsNotices: undefined as
      | (IrsNoticeForm & { irsNoticeFileUrl?: string })[]
      | undefined,
    noticeIssuedDate: undefined as string | undefined,
    partyType: undefined,
    petitionFacts: [''],
    petitionFile: undefined,
    petitionFileId: undefined,
    petitionFileUrl: undefined,
    petitionReasons: [''],
    petitionRedactionAcknowledgement: false,
    petitionType: undefined,
    preferredTrialCity: undefined,
    primaryDocumentFile: undefined,
    procedureType: undefined,
    requestForPlaceOfTrialFile: undefined,
    stinFile: undefined,
    stinFileUrl: undefined,
    taxYear: undefined,
  },
  practitionerDetail: {} as PractitionerDetail,
  practitionerDocuments: undefined as unknown[] | undefined,
  printablePreview: 'trialCalendar' as 'trialCalendar' | 'publicSessionCopy',
  previewPdfFile: null,
  progressIndicator: {
    // used for the spinner that shows when waiting for network responses
    waitingForResponse: false,
    waitingForResponseRequests: 0,
    waitText: undefined as string | undefined,
  },
  redirectUrl: undefined as string | undefined,
  refreshTokenInterval: undefined as unknown as NodeJS.Timeout,
  saveAlertsForNavigation: false,
  scanner: {
    batchIndexToDelete: null,
    batchIndexToRescan: null, // batch index for re-scanning
    batchToDeletePageCount: null,
    batches: {} as Record<
      string,
      Array<{
        index: number;
        pages: any[];
        scanMode?: string;
        scanModeLabel?: string;
      }>
    >,
    currentPageIndex: 0, // batches from scanning
    isScanning: false,
    scanMode: undefined,
    scannerSourceName: undefined,
    scannerSourceIndex: undefined,
    selectedBatchIndex: 0,
    dynamScriptClass: null,
    initiateScriptLoaded: false,
    configScriptLoaded: false,
    sources: [] as string[],
  },
  screenMetadata: {} as any,
  searchResults: {} as any,
  sectionInProgressCount: 0,
  sectionInboxCount: 0,
  sectionUsers: [],
  selectedWorkItems: [] as { workItemId: string }[],
  sessionMetadata: {
    docketRecordFilter: DOCKET_RECORD_FILTER_OPTIONS.allDocuments,
    docketRecordSort: [],
    todaysOrdersSort: [],
  },
  setSelectedConsolidatedCasesToMultiDocketOn: false,
  showConfirmPassword: false,
  showPassword: false,
  showValidation: false,
  showingAdditionalPetitioners: false,
  statusReportOrder: {
    docketNumbersToDisplay: [],
    statusReportFilingDate: '',
    statusReportIndex: 1,
  },
  stepIndicatorInfo: { currentStep: 0, steps: ['no steps defined yet'] },
  submittedAndCavCases: {
    submittedAndCavCasesByJudge: [] as GetCasesByStatusAndByJudgeResponse[],
  },
  tableSort: {
    sortField: 'createdAt',
    sortOrder: ASCENDING as 'asc' | 'desc',
  },
  tabName: undefined as string | undefined,
  testUsers: [] as RawUser[],
  todaysDate: '',
  token: '',
  trialLocationPage: {
    blockedCases: [] as RawCase[],
    blockedCasesPage: 0,
    currentTab: 'eligibleCases',
    eligibleCases: [] as EligibleCase[],
    eligibleCasesPage: 0,
    location: '',
  },
  trialSession: cloneDeep(initialTrialSessionState),
  trialSessionDetailsTab: {} as { caseList: any[]; calendaredCaseList: any[] },
  trialSessionJudge: {
    name: '',
  },
  trialSessionPlanningReportData: {} as {
    trialTerm: string;
    trialYear: string;
    previousTerms: PreviousTerm[];
    trialLocationData: TrialLocationData[];
  },
  trialSessionWorkingCopy: cloneDeep(initialTrialSessionWorkingCopyState),
  trialSessions: [] as any[],
  // Sometimes trialSessions, sometimes TrialSessionInfoDTO, sometimes ad-hoc trial sessions
  trialSessionsPage: cloneDeep(initialTrialSessionPageState),
  lastCreatedTrialSessionId: undefined as unknown as string,
  user: cloneDeep(emptyUserState),
  userContactEditProgress: {} as {
    inProgress?: boolean;
    totalCases?: number;
    completedCases?: number;
  },
  users: [] as RawUser[],
  trialClerks: [] as RawUser[],
  validationErrors: {} as Record<string, any>,
  viewerCorrespondenceToDisplay: null as {
    correspondenceId: string;
    documentTitle?: string;
    filedBy?: string;
  } | null,
  viewerDocumentToDisplay: undefined as unknown as ViewerDocument,
  viewerDraftDocumentToDisplay: undefined as unknown as ViewerDocument,
  wizardStep: undefined as string | undefined,
  workItem: {},
  workItemId: undefined as string | undefined,
  workItemActions: {},
  workItemMetadata: {},
  workQueue: [] as RawWorkItemWithCaseAndDocketEntryInfo[],
  workQueueToDisplay: { box: 'inbox', queue: 'my', section: '' },
  workitemAllCheckbox: false,
  recentFilings: [] as RecentFiling[],
  recentFilingsTableSort: {
    sortField: 'filedDate',
    sortOrder: 'desc' as 'asc' | 'desc',
  },
  caseListTableSort: {
    sortField: 'filedDate',
    sortOrder: 'desc' as 'asc' | 'desc',
  },
};

export const initialState = {
  ...baseState,
  ...computeds,
};

export type ClientState = typeof initialState;

export type CreateCaseIrsForm = {
  key: string;
  todayDate: string;
  file?: File;
  size?: number;
  caseType?: string;
  noticeIssuedDate?: string;
  taxYear?: string;
  irsNoticeFileUrl?: string;
  cityAndStateIssuingOffice?: string;
};

export type ViewerDocument = {
  docketEntryId: string;
  documentId?: string;
  documentTitle?: string; // Should this be required?
  documentType?: string;
  eventCode?: string;
  filingDate?: string;
  index?: number;
};

export type AlertSuccess = { message: string; overwritable?: boolean };

export type PracticeType = (typeof PRACTICE_TYPE)[keyof typeof PRACTICE_TYPE];
export type ServiceIndicatorType =
  (typeof SERVICE_INDICATOR_TYPES)[keyof typeof SERVICE_INDICATOR_TYPES];

export type PractitionerDetail = {
  admissionsDate: string;
  admissionsStatus: string;
  barNumber: string;
  name: string;
  practiceType: PracticeType;
  serviceIndicator?: ServiceIndicatorType;
  userId: string;
  birthYear?: number;
  originalBarState?: string;
  practitionerType?: string;
  middleName?: string;
  contact?: Partial<UserContact>;
  openCaseInfo?: PractitionerAllCasesInfo; // Only for internal users
  closedCaseInfo?: PractitionerAllCasesInfo; // Only for internal users
  email?: string;
  pendingEmail?: string;
  additionalPhone?: string;
  firmName?: string;
  hasElectronicAccess?: boolean;
};

export type PractitionerAllCasesInfo = {
  allCases: PractitionerCaseDetail[];
  currentPage: number;
};

export type PractitionerCaseDetail = {
  docketNumber: string;
  docketNumberWithSuffix: string;
  caseTitle: string;
  inConsolidatedGroup: boolean;
  isLeadCase: boolean;
  isSealed: boolean;
  status: string;
  sealedToTooltip?: string;
  consolidatedIconTooltipText?: string;
};
