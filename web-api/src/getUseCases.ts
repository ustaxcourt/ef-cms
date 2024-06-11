/* eslint-disable no-unused-vars */
/* eslint-disable max-lines */
import { addCaseToTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/addCaseToTrialSessionInteractor';
import { addConsolidatedCaseInteractor } from './business/useCases/caseConsolidation/addConsolidatedCaseInteractor';
import { addCoversheetInteractor } from '../../shared/src/business/useCases/addCoversheetInteractor';
import { addDeficiencyStatisticInteractor } from './business/useCases/caseStatistics/addDeficiencyStatisticInteractor';
import { addPaperFilingInteractor } from './business/useCases/docketEntry/addPaperFilingInteractor';
import { addPetitionerToCaseInteractor } from '../../shared/src/business/useCases/addPetitionerToCaseInteractor';
import { appendAmendedPetitionFormInteractor } from './business/useCases/courtIssuedOrder/appendAmendedPetitionFormInteractor';
import { archiveCorrespondenceDocumentInteractor } from './business/useCases/correspondence/archiveCorrespondenceDocumentInteractor';
import { archiveDraftDocumentInteractor } from '../../shared/src/business/useCases/archiveDraftDocumentInteractor';
import { assignWorkItemsInteractor } from '../../shared/src/business/useCases/workitems/assignWorkItemsInteractor';
import { associateIrsPractitionerWithCaseInteractor } from './business/useCases/manualAssociation/associateIrsPractitionerWithCaseInteractor';
import { associatePrivatePractitionerWithCaseInteractor } from './business/useCases/manualAssociation/associatePrivatePractitionerWithCaseInteractor';
import { batchDownloadDocketEntriesInteractor } from '@web-api/business/useCases/document/batchDownloadDocketEntriesInteractor';
import { batchDownloadTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/batchDownloadTrialSessionInteractor';
import { blockCaseFromTrialInteractor } from '../../shared/src/business/useCases/blockCaseFromTrialInteractor';
import { caseAdvancedSearchInteractor } from '../../shared/src/business/useCases/caseAdvancedSearchInteractor';
import { casePublicSearchInteractor } from '../../shared/src/business/useCases/public/casePublicSearchInteractor';
import { changePasswordInteractor } from '@web-api/business/useCases/auth/changePasswordInteractor';
import { checkEmailAvailabilityInteractor } from './business/useCases/user/checkEmailAvailabilityInteractor';
import { checkForReadyForTrialCasesInteractor } from '../../shared/src/business/useCases/checkForReadyForTrialCasesInteractor';
import { closeTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/closeTrialSessionInteractor';
import { completeDocketEntryQCInteractor } from './business/useCases/docketEntry/completeDocketEntryQCInteractor';
import { completeMessageInteractor } from './business/useCases/messages/completeMessageInteractor';
import { completeWorkItemInteractor } from '../../shared/src/business/useCases/workitems/completeWorkItemInteractor';
import { confirmSignUpInteractor } from './business/useCases/auth/confirmSignUpInteractor';
import { createCaseDeadlineInteractor } from './business/useCases/caseDeadline/createCaseDeadlineInteractor';
import { createCaseFromPaperInteractor } from '../../shared/src/business/useCases/createCaseFromPaperInteractor';
import { createCaseInteractor } from '../../shared/src/business/useCases/createCaseInteractor';
import { createCourtIssuedOrderPdfFromHtmlInteractor } from './business/useCases/courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlInteractor';
import { createCsvCustomCaseReportFileInteractor } from '@web-api/business/useCases/customCaseReport/createCsvCustomCaseReportFileInteractor';
import { createMessageInteractor } from './business/useCases/messages/createMessageInteractor';
import { createPractitionerDocumentInteractor } from '../../shared/src/business/useCases/practitioners/createPractitionerDocumentInteractor';
import { createPractitionerUserInteractor } from './business/useCases/practitioner/createPractitionerUserInteractor';
import { createTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/createTrialSessionInteractor';
import { deleteCaseDeadlineInteractor } from './business/useCases/caseDeadline/deleteCaseDeadlineInteractor';
import { deleteCaseNoteInteractor } from './business/useCases/caseNote/deleteCaseNoteInteractor';
import { deleteCounselFromCaseInteractor } from './business/useCases/caseAssociation/deleteCounselFromCaseInteractor';
import { deleteDeficiencyStatisticInteractor } from './business/useCases/caseStatistics/deleteDeficiencyStatisticInteractor';
import { deleteDocketEntryWorksheetInteractor } from '@shared/business/useCases/pendingMotion/deleteDocketEntryWorksheetInteractor';
import { deletePractitionerDocumentInteractor } from '../../shared/src/business/useCases/practitioners/deletePractitionerDocumentInteractor';
import { deleteTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/deleteTrialSessionInteractor';
import { deleteUserCaseNoteInteractor } from './business/useCases/caseNote/deleteUserCaseNoteInteractor';
import { dismissNOTTReminderForTrialInteractor } from '../../shared/src/business/useCases/trialSessions/dismissNOTTReminderForTrialInteractor';
import { editPaperFilingInteractor } from './business/useCases/docketEntry/editPaperFilingInteractor';
import { editPractitionerDocumentInteractor } from '../../shared/src/business/useCases/practitioners/editPractitionerDocumentInteractor';
import { exportPendingReportInteractor } from '@web-api/business/useCases/pendingItems/exportPendingReportInteractor';
import { fetchPendingItemsInteractor } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { fileAndServeCourtIssuedDocumentInteractor } from './business/useCases/courtIssuedDocument/fileAndServeCourtIssuedDocumentInteractor';
import { fileCorrespondenceDocumentInteractor } from './business/useCases/correspondence/fileCorrespondenceDocumentInteractor';
import { fileCourtIssuedDocketEntryInteractor } from './business/useCases/docketEntry/fileCourtIssuedDocketEntryInteractor';
import { fileCourtIssuedOrderInteractor } from './business/useCases/courtIssuedOrder/fileCourtIssuedOrderInteractor';
import { fileExternalDocumentInteractor } from '@web-api/business/useCases/externalDocument/fileExternalDocumentInteractor';
import { forgotPasswordInteractor } from '@web-api/business/useCases/auth/forgotPasswordInteractor';
import { forwardMessageInteractor } from './business/useCases/messages/forwardMessageInteractor';
import { generateDocketRecordPdfInteractor } from '../../shared/src/business/useCases/generateDocketRecordPdfInteractor';
import { generateDraftStampOrderInteractor } from '../../shared/src/business/useCases/generateDraftStampOrderInteractor';
import { generateEntryOfAppearancePdfInteractor } from './business/useCases/caseAssociationRequest/generateEntryOfAppearancePdfInteractor';
import { generateNoticeOfChangeOfTrialJudgeInteractor } from '../../shared/src/business/useCases/trialSessions/generateNoticeOfChangeOfTrialJudgeInteractor';
import { generateNoticeOfChangeToRemoteProceedingInteractor } from '../../shared/src/business/useCases/trialSessions/generateNoticeOfChangeToRemoteProceedingInteractor';
import { generateNoticeOfTrialIssuedInteractor } from '../../shared/src/business/useCases/trialSessions/generateNoticeOfTrialIssuedInteractor';
import { generateNoticesForCaseTrialSessionCalendarInteractor } from '../../shared/src/business/useCases/trialSessions/generateNoticesForCaseTrialSessionCalendarInteractor';
import { generatePDFFromJPGDataInteractor } from '../../shared/src/business/useCases/generatePDFFromJPGDataInteractor';
import { generatePdfFromHtmlInteractor } from '../../shared/src/business/useCases/generatePdfFromHtmlInteractor';
import { generatePractitionerCaseListPdfInteractor } from '../../shared/src/business/useCases/generatePractitionerCaseListPdfInteractor';
import { generatePrintableCaseInventoryReportInteractor } from './business/useCases/caseInventoryReport/generatePrintableCaseInventoryReportInteractor';
import { generatePrintableFilingReceiptInteractor } from '../../shared/src/business/useCases/generatePrintableFilingReceiptInteractor';
import { generatePrintablePendingReportInteractor } from './business/useCases/pendingItems/generatePrintablePendingReportInteractor';
import { generatePrintableTrialSessionCopyReportInteractor } from '../../shared/src/business/useCases/trialSessions/generatePrintableTrialSessionCopyReportInteractor';
import { generateStandingPretrialOrderForSmallCaseInteractor } from '../../shared/src/business/useCases/trialSessions/generateStandingPretrialOrderForSmallCaseInteractor';
import { generateStandingPretrialOrderInteractor } from '../../shared/src/business/useCases/trialSessions/generateStandingPretrialOrderInteractor';
import { generateTrialCalendarPdfInteractor } from '../../shared/src/business/useCases/trialSessions/generateTrialCalendarPdfInteractor';
import { generateTrialSessionPaperServicePdfInteractor } from '../../shared/src/business/useCases/trialSessions/generateTrialSessionPaperServicePdfInteractor';
import { getAllFeatureFlagsInteractor } from './business/useCases/featureFlag/getAllFeatureFlagsInteractor';
import { getAllUsersByRoleInteractor } from '@shared/business/useCases/getAllUsersByRoleInteractor';
import { getBlockedCasesInteractor } from '../../shared/src/business/useCases/getBlockedCasesInteractor';
import { getCachedHealthCheckInteractor } from '@web-api/business/useCases/health/getCachedHealthCheckInteractor';
import { getCalendaredCasesForTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/getCalendaredCasesForTrialSessionInteractor';
import { getCaseDeadlinesForCaseInteractor } from './business/useCases/caseDeadline/getCaseDeadlinesForCaseInteractor';
import { getCaseDeadlinesInteractor } from '../../shared/src/business/useCases/getCaseDeadlinesInteractor';
import { getCaseExistsInteractor } from '../../shared/src/business/useCases/getCaseExistsInteractor';
import { getCaseForPublicDocketSearchInteractor } from '../../shared/src/business/useCases/public/getCaseForPublicDocketSearchInteractor';
import { getCaseInteractor } from '../../shared/src/business/useCases/getCaseInteractor';
import { getCaseInventoryReportInteractor } from './business/useCases/caseInventoryReport/getCaseInventoryReportInteractor';
import { getCaseWorksheetsByJudgeInteractor } from './business/useCases/judgeActivityReport/getCaseWorksheetsByJudgeInteractor';
import { getCasesClosedByJudgeInteractor } from './business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';
import { getCasesForUserInteractor } from '../../shared/src/business/useCases/getCasesForUserInteractor';
import { getCompletedMessagesForSectionInteractor } from './business/useCases/messages/getCompletedMessagesForSectionInteractor';
import { getCompletedMessagesForUserInteractor } from './business/useCases/messages/getCompletedMessagesForUserInteractor';
import { getCountOfCaseDocumentsFiledByJudgesInteractor } from '@web-api/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { getCustomCaseReportInteractor } from './business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import { getDocumentContentsForDocketEntryInteractor } from './business/useCases/document/getDocumentContentsForDocketEntryInteractor';
import { getDocumentQCInboxForSectionInteractor } from '../../shared/src/business/useCases/workitems/getDocumentQCInboxForSectionInteractor';
import { getDocumentQCInboxForUserInteractor } from '../../shared/src/business/useCases/workitems/getDocumentQCInboxForUserInteractor';
import { getDocumentQCServedForSectionInteractor } from '../../shared/src/business/useCases/workitems/getDocumentQCServedForSectionInteractor';
import { getDocumentQCServedForUserInteractor } from '../../shared/src/business/useCases/workitems/getDocumentQCServedForUserInteractor';
import { getDownloadPolicyUrlInteractor } from '../../shared/src/business/useCases/getDownloadPolicyUrlInteractor';
import { getEligibleCasesForTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/getEligibleCasesForTrialSessionInteractor';
import { getHealthCheckInteractor } from './business/useCases/health/getHealthCheckInteractor';
import { getInboxMessagesForSectionInteractor } from './business/useCases/messages/getInboxMessagesForSectionInteractor';
import { getInboxMessagesForUserInteractor } from './business/useCases/messages/getInboxMessagesForUserInteractor';
import { getInternalUsersInteractor } from '../../shared/src/business/useCases/users/getInternalUsersInteractor';
import { getIrsPractitionersBySearchKeyInteractor } from '../../shared/src/business/useCases/users/getIrsPractitionersBySearchKeyInteractor';
import { getJudgeInSectionInteractor } from '../../shared/src/business/useCases/users/getJudgeInSectionInteractor';
import { getJudgesForPublicSearchInteractor } from '../../shared/src/business/useCases/public/getJudgesForPublicSearchInteractor';
import { getMaintenanceModeInteractor } from '../../shared/src/business/useCases/getMaintenanceModeInteractor';
import { getMessageThreadInteractor } from './business/useCases/messages/getMessageThreadInteractor';
import { getMessagesForCaseInteractor } from './business/useCases/messages/getMessagesForCaseInteractor';
import { getNotificationsInteractor } from '../../shared/src/business/useCases/getNotificationsInteractor';
import { getOutboxMessagesForSectionInteractor } from './business/useCases/messages/getOutboxMessagesForSectionInteractor';
import { getOutboxMessagesForUserInteractor } from './business/useCases/messages/getOutboxMessagesForUserInteractor';
import { getPaperServicePdfUrlInteractor } from '@shared/business/useCases/getPaperServicePdfUrlInteractor';
import { getPendingMotionDocketEntriesForCurrentJudgeInteractor } from '@shared/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { getPractitionerByBarNumberInteractor } from '../../shared/src/business/useCases/practitioners/getPractitionerByBarNumberInteractor';
import { getPractitionerDocumentDownloadUrlInteractor } from '../../shared/src/business/useCases/practitioners/getPractitionerDocumentDownloadUrlInteractor';
import { getPractitionerDocumentInteractor } from '../../shared/src/business/useCases/practitioners/getPractitionerDocumentInteractor';
import { getPractitionerDocumentsInteractor } from '../../shared/src/business/useCases/practitioners/getPractitionerDocumentsInteractor';
import { getPractitionersByNameInteractor } from './business/useCases/practitioner/getPractitionersByNameInteractor';
import { getPrivatePractitionersBySearchKeyInteractor } from '../../shared/src/business/useCases/users/getPrivatePractitionersBySearchKeyInteractor';
import { getPublicCaseInteractor } from './business/useCases/public/getPublicCaseInteractor';
import { getPublicDownloadPolicyUrlInteractor } from './business/useCases/public/getPublicDownloadPolicyUrlInteractor';
import { getReconciliationReportInteractor } from '../../shared/src/business/useCases/getReconciliationReportInteractor';
import { getTodaysOpinionsInteractor } from '../../shared/src/business/useCases/public/getTodaysOpinionsInteractor';
import { getTodaysOrdersInteractor } from '../../shared/src/business/useCases/public/getTodaysOrdersInteractor';
import { getTrialSessionDetailsInteractor } from '../../shared/src/business/useCases/trialSessions/getTrialSessionDetailsInteractor';
import { getTrialSessionWorkingCopyInteractor } from '../../shared/src/business/useCases/trialSessions/getTrialSessionWorkingCopyInteractor';
import { getTrialSessionsForJudgeActivityReportInteractor } from './business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';
import { getTrialSessionsForJudgeInteractor } from '../../shared/src/business/useCases/trialSessions/getTrialSessionsForJudgeInteractor';
import { getTrialSessionsInteractor } from '../../shared/src/business/useCases/trialSessions/getTrialSessionsInteractor';
import { getUploadPolicyInteractor } from '../../shared/src/business/useCases/getUploadPolicyInteractor';
import { getUserCaseNoteForCasesInteractor } from './business/useCases/caseNote/getUserCaseNoteForCasesInteractor';
import { getUserCaseNoteInteractor } from './business/useCases/caseNote/getUserCaseNoteInteractor';
import { getUserInteractor } from '../../shared/src/business/useCases/getUserInteractor';
import { getUserPendingEmailInteractor } from '../../shared/src/business/useCases/users/getUserPendingEmailInteractor';
import { getUserPendingEmailStatusInteractor } from '../../shared/src/business/useCases/users/getUserPendingEmailStatusInteractor';
import { getUsersInSectionInteractor } from '../../shared/src/business/useCases/users/getUsersInSectionInteractor';
import { getUsersPendingEmailInteractor } from '../../shared/src/business/useCases/users/getUsersPendingEmailInteractor';
import { getWorkItemInteractor } from '../../shared/src/business/useCases/workitems/getWorkItemInteractor';
import { handleBounceNotificationInteractor } from './business/useCases/email/handleBounceNotificationInteractor';
import { logOldLoginAttemptInteractor } from '@web-api/business/useCases/logOldLoginAttemptInteractor';
import { loginInteractor } from '@web-api/business/useCases/auth/loginInteractor';
import { onConnectInteractor } from './business/useCases/notifications/onConnectInteractor';
import { onDisconnectInteractor } from './business/useCases/notifications/onDisconnectInteractor';
import { opinionAdvancedSearchInteractor } from '../../shared/src/business/useCases/opinionAdvancedSearchInteractor';
import { opinionPublicSearchInteractor } from '../../shared/src/business/useCases/public/opinionPublicSearchInteractor';
import { orderAdvancedSearchInteractor } from '../../shared/src/business/useCases/orderAdvancedSearchInteractor';
import { orderPublicSearchInteractor } from '../../shared/src/business/useCases/public/orderPublicSearchInteractor';
import { prioritizeCaseInteractor } from '../../shared/src/business/useCases/prioritizeCaseInteractor';
import { processStreamRecordsInteractor } from '../../shared/src/business/useCases/processStreamRecordsInteractor';
import { queueUpdateAssociatedCasesWorker } from './business/useCases/user/queueUpdateAssociatedCasesWorker';
import { removeCaseFromTrialInteractor } from '../../shared/src/business/useCases/trialSessions/removeCaseFromTrialInteractor';
import { removeCasePendingItemInteractor } from '../../shared/src/business/useCases/removeCasePendingItemInteractor';
import { removeConsolidatedCasesInteractor } from './business/useCases/caseConsolidation/removeConsolidatedCasesInteractor';
import { removePdfFromDocketEntryInteractor } from '../../shared/src/business/useCases/removePdfFromDocketEntryInteractor';
import { removePetitionerAndUpdateCaptionInteractor } from '../../shared/src/business/useCases/removePetitionerAndUpdateCaptionInteractor';
import { removeSignatureFromDocumentInteractor } from '../../shared/src/business/useCases/removeSignatureFromDocumentInteractor';
import { renewIdTokenInteractor } from './business/useCases/auth/renewIdTokenInteractor';
import { replyToMessageInteractor } from './business/useCases/messages/replyToMessageInteractor';
import { runTrialSessionPlanningReportInteractor } from '../../shared/src/business/useCases/trialSessions/runTrialSessionPlanningReportInteractor';
import { saveCalendarNoteInteractor } from '../../shared/src/business/useCases/trialSessions/saveCalendarNoteInteractor';
import { saveCaseDetailInternalEditInteractor } from '../../shared/src/business/useCases/saveCaseDetailInternalEditInteractor';
import { saveCaseNoteInteractor } from './business/useCases/caseNote/saveCaseNoteInteractor';
import { saveSignedDocumentInteractor } from '../../shared/src/business/useCases/saveSignedDocumentInteractor';
import { sealCaseContactAddressInteractor } from '../../shared/src/business/useCases/sealCaseContactAddressInteractor';
import { sealCaseInteractor } from '../../shared/src/business/useCases/sealCaseInteractor';
import { sealDocketEntryInteractor } from './business/useCases/docketEntry/sealDocketEntryInteractor';
import { sendMaintenanceNotificationsInteractor } from './business/useCases/maintenance/sendMaintenanceNotificationsInteractor';
import { serveCaseToIrsInteractor } from '../../shared/src/business/useCases/serveCaseToIrs/serveCaseToIrsInteractor';
import { serveCourtIssuedDocumentInteractor } from './business/useCases/courtIssuedDocument/serveCourtIssuedDocumentInteractor';
import { serveExternallyFiledDocumentInteractor } from './business/useCases/document/serveExternallyFiledDocumentInteractor';
import { serveThirtyDayNoticeInteractor } from '../../shared/src/business/useCases/trialSessions/serveThirtyDayNoticeInteractor';
import { setForHearingInteractor } from '../../shared/src/business/useCases/trialSessions/setForHearingInteractor';
import { setHealthCheckCacheInteractor } from '@web-api/business/useCases/health/setHealthCheckCacheInteractor';
import { setMessageAsReadInteractor } from './business/useCases/messages/setMessageAsReadInteractor';
import { setNoticesForCalendaredTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/setNoticesForCalendaredTrialSessionInteractor';
import { setTrialSessionCalendarInteractor } from '../../shared/src/business/useCases/trialSessions/setTrialSessionCalendarInteractor';
import { setWorkItemAsReadInteractor } from '../../shared/src/business/useCases/workitems/setWorkItemAsReadInteractor';
import { signUpUserInteractor } from './business/useCases/auth/signUpUserInteractor';
import { startPollingForResultsInteractor } from '@web-api/business/useCases/polling/startPollingForResultsInteractor';
import { strikeDocketEntryInteractor } from './business/useCases/docketEntry/strikeDocketEntryInteractor';
import { submitCaseAssociationRequestInteractor } from './business/useCases/caseAssociationRequest/submitCaseAssociationRequestInteractor';
import { submitPendingCaseAssociationRequestInteractor } from './business/useCases/caseAssociationRequest/submitPendingCaseAssociationRequestInteractor';
import { unblockCaseFromTrialInteractor } from '../../shared/src/business/useCases/unblockCaseFromTrialInteractor';
import { unprioritizeCaseInteractor } from '../../shared/src/business/useCases/unprioritizeCaseInteractor';
import { unsealCaseInteractor } from '../../shared/src/business/useCases/unsealCaseInteractor';
import { unsealDocketEntryInteractor } from './business/useCases/docketEntry/unsealDocketEntryInteractor';
import { updateAssociatedCaseWorker } from './business/useCases/user/updateAssociatedCaseWorker';
import { updateCaseContextInteractor } from '../../shared/src/business/useCases/updateCaseContextInteractor';
import { updateCaseDeadlineInteractor } from './business/useCases/caseDeadline/updateCaseDeadlineInteractor';
import { updateCaseDetailsInteractor } from '../../shared/src/business/useCases/updateCaseDetailsInteractor';
import { updateCaseTrialSortTagsInteractor } from '../../shared/src/business/useCases/updateCaseTrialSortTagsInteractor';
import { updateCaseWorksheetInteractor } from './business/useCases/caseWorksheet/updateCaseWorksheetInteractor';
import { updateContactInteractor } from '../../shared/src/business/useCases/updateContactInteractor';
import { updateCorrespondenceDocumentInteractor } from './business/useCases/correspondence/updateCorrespondenceDocumentInteractor';
import { updateCounselOnCaseInteractor } from './business/useCases/caseAssociation/updateCounselOnCaseInteractor';
import { updateCourtIssuedDocketEntryInteractor } from './business/useCases/docketEntry/updateCourtIssuedDocketEntryInteractor';
import { updateCourtIssuedOrderInteractor } from './business/useCases/courtIssuedOrder/updateCourtIssuedOrderInteractor';
import { updateDeficiencyStatisticInteractor } from './business/useCases/caseStatistics/updateDeficiencyStatisticInteractor';
import { updateDocketEntryMetaInteractor } from './business/useCases/docketEntry/updateDocketEntryMetaInteractor';
import { updateDocketEntryWorksheetInteractor } from '@shared/business/useCases/pendingMotion/updateDocketEntryWorksheetInteractor';
import { updateOtherStatisticsInteractor } from './business/useCases/caseStatistics/updateOtherStatisticsInteractor';
import { updatePetitionerInformationInteractor } from './business/useCases/user/updatePetitionerInformationInteractor';
import { updatePractitionerUserInteractor } from './business/useCases/practitioner/updatePractitionerUserInteractor';
import { updateQcCompleteForTrialInteractor } from '../../shared/src/business/useCases/updateQcCompleteForTrialInteractor';
import { updateTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/updateTrialSessionInteractor';
import { updateTrialSessionWorkingCopyInteractor } from '../../shared/src/business/useCases/trialSessions/updateTrialSessionWorkingCopyInteractor';
import { updateUserCaseNoteInteractor } from './business/useCases/caseNote/updateUserCaseNoteInteractor';
import { updateUserContactInformationInteractor } from '../../shared/src/business/useCases/users/updateUserContactInformationInteractor';
import { updateUserPendingEmailInteractor } from '../../shared/src/business/useCases/users/updateUserPendingEmailInteractor';
import { validatePdfInteractor } from '../../shared/src/business/useCases/pdf/validatePdfInteractor';
import { verifyPendingCaseForUserInteractor } from './business/useCases/caseAssociationRequest/verifyPendingCaseForUserInteractor';
import { verifyUserPendingEmailInteractor } from './business/useCases/user/verifyUserPendingEmailInteractor';

const useCases = {
  addCaseToTrialSessionInteractor,
  addConsolidatedCaseInteractor,
  addCoversheetInteractor,
  addDeficiencyStatisticInteractor,
  addPaperFilingInteractor,
  addPetitionerToCaseInteractor,
  appendAmendedPetitionFormInteractor,
  archiveCorrespondenceDocumentInteractor,
  archiveDraftDocumentInteractor,
  assignWorkItemsInteractor,
  associateIrsPractitionerWithCaseInteractor,
  associatePrivatePractitionerWithCaseInteractor,
  batchDownloadDocketEntriesInteractor,
  batchDownloadTrialSessionInteractor,
  blockCaseFromTrialInteractor,
  caseAdvancedSearchInteractor,
  casePublicSearchInteractor,
  changePasswordInteractor,
  checkEmailAvailabilityInteractor,
  checkForReadyForTrialCasesInteractor,
  closeTrialSessionInteractor,
  completeDocketEntryQCInteractor,
  completeMessageInteractor,
  completeWorkItemInteractor,
  confirmSignUpInteractor,
  createCaseDeadlineInteractor,
  createCaseFromPaperInteractor,
  createCaseInteractor,
  createCourtIssuedOrderPdfFromHtmlInteractor,
  createCsvCustomCaseReportFileInteractor,
  createMessageInteractor,
  createPractitionerDocumentInteractor,
  createPractitionerUserInteractor,
  createTrialSessionInteractor,
  deleteCaseDeadlineInteractor,
  deleteCaseNoteInteractor,
  deleteCounselFromCaseInteractor,
  deleteDeficiencyStatisticInteractor,
  deleteDocketEntryWorksheetInteractor,
  deletePractitionerDocumentInteractor,
  deleteTrialSessionInteractor,
  deleteUserCaseNoteInteractor,
  dismissNOTTReminderForTrialInteractor,
  editPaperFilingInteractor,
  editPractitionerDocumentInteractor,
  exportPendingReportInteractor,
  fetchPendingItemsInteractor,
  fileAndServeCourtIssuedDocumentInteractor,
  fileCorrespondenceDocumentInteractor,
  fileCourtIssuedDocketEntryInteractor,
  fileCourtIssuedOrderInteractor,
  fileExternalDocumentInteractor,
  forgotPasswordInteractor,
  forwardMessageInteractor,
  generateDocketRecordPdfInteractor,
  generateDraftStampOrderInteractor,
  generateEntryOfAppearancePdfInteractor,
  generateNoticeOfChangeOfTrialJudgeInteractor,
  generateNoticeOfChangeToRemoteProceedingInteractor,
  generateNoticeOfTrialIssuedInteractor,
  generateNoticesForCaseTrialSessionCalendarInteractor,
  generatePDFFromJPGDataInteractor,
  generatePdfFromHtmlInteractor,
  generatePractitionerCaseListPdfInteractor,
  generatePrintableCaseInventoryReportInteractor,
  generatePrintableFilingReceiptInteractor,
  generatePrintablePendingReportInteractor,
  generatePrintableTrialSessionCopyReportInteractor,
  generateStandingPretrialOrderForSmallCaseInteractor,
  generateStandingPretrialOrderInteractor,
  generateTrialCalendarPdfInteractor,
  generateTrialSessionPaperServicePdfInteractor,
  getAllFeatureFlagsInteractor,
  getAllUsersByRoleInteractor,
  getBlockedCasesInteractor,
  getCachedHealthCheckInteractor,
  getCalendaredCasesForTrialSessionInteractor,
  getCaseDeadlinesForCaseInteractor,
  getCaseDeadlinesInteractor,
  getCaseExistsInteractor,
  getCaseForPublicDocketSearchInteractor,
  getCaseInteractor,
  getCaseInventoryReportInteractor,
  getCaseWorksheetsByJudgeInteractor,
  getCasesClosedByJudgeInteractor,
  getCasesForUserInteractor,
  getCompletedMessagesForSectionInteractor,
  getCompletedMessagesForUserInteractor,
  getCountOfCaseDocumentsFiledByJudgesInteractor,
  getCustomCaseReportInteractor,
  getDocumentContentsForDocketEntryInteractor,
  getDocumentQCInboxForSectionInteractor,
  getDocumentQCInboxForUserInteractor,
  getDocumentQCServedForSectionInteractor,
  getDocumentQCServedForUserInteractor,
  getDownloadPolicyUrlInteractor,
  getEligibleCasesForTrialSessionInteractor,
  getHealthCheckInteractor,
  getInboxMessagesForSectionInteractor,
  getInboxMessagesForUserInteractor,
  getInternalUsersInteractor,
  getIrsPractitionersBySearchKeyInteractor,
  getJudgeInSectionInteractor,
  getJudgesForPublicSearchInteractor,
  getMaintenanceModeInteractor,
  getMessageThreadInteractor,
  getMessagesForCaseInteractor,
  getNotificationsInteractor,
  getOutboxMessagesForSectionInteractor,
  getOutboxMessagesForUserInteractor,
  getPaperServicePdfUrlInteractor,
  getPendingMotionDocketEntriesForCurrentJudgeInteractor,
  getPractitionerByBarNumberInteractor,
  getPractitionerDocumentDownloadUrlInteractor,
  getPractitionerDocumentInteractor,
  getPractitionerDocumentsInteractor,
  getPractitionersByNameInteractor,
  getPrivatePractitionersBySearchKeyInteractor,
  getPublicCaseInteractor,
  getPublicDownloadPolicyUrlInteractor,
  getReconciliationReportInteractor,
  getTodaysOpinionsInteractor,
  getTodaysOrdersInteractor,
  getTrialSessionDetailsInteractor,
  getTrialSessionWorkingCopyInteractor,
  getTrialSessionsForJudgeActivityReportInteractor,
  getTrialSessionsForJudgeInteractor,
  getTrialSessionsInteractor,
  getUploadPolicyInteractor,
  getUserCaseNoteForCasesInteractor,
  getUserCaseNoteInteractor,
  getUserInteractor,
  getUserPendingEmailInteractor,
  getUserPendingEmailStatusInteractor,
  getUsersInSectionInteractor,
  getUsersPendingEmailInteractor,
  getWorkItemInteractor,
  handleBounceNotificationInteractor,
  logOldLoginAttemptInteractor,
  loginInteractor,
  onConnectInteractor,
  onDisconnectInteractor,
  opinionAdvancedSearchInteractor,
  opinionPublicSearchInteractor,
  orderAdvancedSearchInteractor,
  orderPublicSearchInteractor,
  prioritizeCaseInteractor,
  processStreamRecordsInteractor,
  queueUpdateAssociatedCasesWorker,
  removeCaseFromTrialInteractor,
  removeCasePendingItemInteractor,
  removeConsolidatedCasesInteractor,
  removePdfFromDocketEntryInteractor,
  removePetitionerAndUpdateCaptionInteractor,
  removeSignatureFromDocumentInteractor,
  renewIdTokenInteractor,
  replyToMessageInteractor,
  runTrialSessionPlanningReportInteractor,
  saveCalendarNoteInteractor,
  saveCaseDetailInternalEditInteractor,
  saveCaseNoteInteractor,
  saveSignedDocumentInteractor,
  sealCaseContactAddressInteractor,
  sealCaseInteractor,
  sealDocketEntryInteractor,
  sendMaintenanceNotificationsInteractor,
  serveCaseToIrsInteractor,
  serveCourtIssuedDocumentInteractor,
  serveExternallyFiledDocumentInteractor,
  serveThirtyDayNoticeInteractor,
  setForHearingInteractor,
  setHealthCheckCacheInteractor,
  setMessageAsReadInteractor,
  setNoticesForCalendaredTrialSessionInteractor,
  setTrialSessionCalendarInteractor,
  setWorkItemAsReadInteractor,
  signUpUserInteractor,
  startPollingForResultsInteractor,
  strikeDocketEntryInteractor,
  submitCaseAssociationRequestInteractor,
  submitPendingCaseAssociationRequestInteractor,
  unblockCaseFromTrialInteractor,
  unprioritizeCaseInteractor,
  unsealCaseInteractor,
  unsealDocketEntryInteractor,
  updateAssociatedCaseWorker,
  updateCaseContextInteractor,
  updateCaseDeadlineInteractor,
  updateCaseDetailsInteractor,
  updateCaseTrialSortTagsInteractor,
  updateCaseWorksheetInteractor,
  updateContactInteractor,
  updateCorrespondenceDocumentInteractor,
  updateCounselOnCaseInteractor,
  updateCourtIssuedDocketEntryInteractor,
  updateCourtIssuedOrderInteractor,
  updateDeficiencyStatisticInteractor,
  updateDocketEntryMetaInteractor,
  updateDocketEntryWorksheetInteractor,
  updateOtherStatisticsInteractor,
  updatePetitionerInformationInteractor,
  updatePractitionerUserInteractor,
  updateQcCompleteForTrialInteractor,
  updateTrialSessionInteractor,
  updateTrialSessionWorkingCopyInteractor,
  updateUserCaseNoteInteractor,
  updateUserContactInformationInteractor,
  updateUserPendingEmailInteractor,
  validatePdfInteractor,
  verifyPendingCaseForUserInteractor,
  verifyUserPendingEmailInteractor,
};

export const getUseCases = () => useCases;

type _IGetUseCases = typeof getUseCases;

declare global {
  interface IGetUseCases extends _IGetUseCases {}
}
