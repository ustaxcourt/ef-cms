/* eslint-disable no-unused-vars */
/* eslint-disable max-lines */
import { addCaseToTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/addCaseToTrialSessionInteractor';
import { addConsolidatedCaseInteractor } from '../../shared/src/business/useCases/caseConsolidation/addConsolidatedCaseInteractor';
import { addCoversheetInteractor } from '../../shared/src/business/useCases/addCoversheetInteractor';
import { addDeficiencyStatisticInteractor } from '../../shared/src/business/useCases/caseStatistics/addDeficiencyStatisticInteractor';
import { addPaperFilingInteractor } from '../../shared/src/business/useCases/docketEntry/addPaperFilingInteractor';
import { addPetitionerToCaseInteractor } from '../../shared/src/business/useCases/addPetitionerToCaseInteractor';
import { appendAmendedPetitionFormInteractor } from '../../shared/src/business/useCases/courtIssuedOrder/appendAmendedPetitionFormInteractor';
import { archiveCorrespondenceDocumentInteractor } from '../../shared/src/business/useCases/correspondence/archiveCorrespondenceDocumentInteractor';
import { archiveDraftDocumentInteractor } from '../../shared/src/business/useCases/archiveDraftDocumentInteractor';
import { assignWorkItemsInteractor } from '../../shared/src/business/useCases/workitems/assignWorkItemsInteractor';
import { associateIrsPractitionerWithCaseInteractor } from '../../shared/src/business/useCases/manualAssociation/associateIrsPractitionerWithCaseInteractor';
import { associatePrivatePractitionerWithCaseInteractor } from '../../shared/src/business/useCases/manualAssociation/associatePrivatePractitionerWithCaseInteractor';
import { authenticateUserInteractor } from '../../shared/src/business/useCases/auth/authenticateUserInteractor';
import { batchDownloadTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/batchDownloadTrialSessionInteractor';
import { blockCaseFromTrialInteractor } from '../../shared/src/business/useCases/blockCaseFromTrialInteractor';
import { caseAdvancedSearchInteractor } from '../../shared/src/business/useCases/caseAdvancedSearchInteractor';
import { casePublicSearchInteractor } from '../../shared/src/business/useCases/public/casePublicSearchInteractor';
import { changePasswordLocalInteractor } from '../../shared/src/business/useCases/auth/changePasswordLocalInteractor';
import { checkEmailAvailabilityInteractor } from '../../shared/src/business/useCases/users/checkEmailAvailabilityInteractor';
import { checkForReadyForTrialCasesInteractor } from '../../shared/src/business/useCases/checkForReadyForTrialCasesInteractor';
import { closeTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/closeTrialSessionInteractor';
import { cognitoResendVerificationLinkInteractor } from '@shared/business/useCases/public/cognitoResendVerificationLinkInteractor';
import { completeDocketEntryQCInteractor } from '../../shared/src/business/useCases/editDocketEntry/completeDocketEntryQCInteractor';
import { completeMessageInteractor } from '../../shared/src/business/useCases/messages/completeMessageInteractor';
import { completeWorkItemInteractor } from '../../shared/src/business/useCases/workitems/completeWorkItemInteractor';
import { confirmSignUpLocalInteractor } from '../../shared/src/business/useCases/auth/confirmSignUpLocalInteractor';
import { createCaseDeadlineInteractor } from '../../shared/src/business/useCases/caseDeadline/createCaseDeadlineInteractor';
import { createCaseFromPaperInteractor } from '../../shared/src/business/useCases/createCaseFromPaperInteractor';
import { createCaseInteractor } from '../../shared/src/business/useCases/createCaseInteractor';
import { createCourtIssuedOrderPdfFromHtmlInteractor } from '../../shared/src/business/useCases/courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlInteractor';
import { createMessageInteractor } from '../../shared/src/business/useCases/messages/createMessageInteractor';
import { createPetitionerAccountInteractor } from '../../shared/src/business/useCases/users/createPetitionerAccountInteractor';
import { createPractitionerDocumentInteractor } from '../../shared/src/business/useCases/practitioners/createPractitionerDocumentInteractor';
import { createPractitionerUserInteractor } from '../../shared/src/business/useCases/practitioners/createPractitionerUserInteractor';
import { createTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/createTrialSessionInteractor';
import { createUserCognitoInteractor } from '../../shared/src/business/useCases/users/createUserCognitoInteractor';
import { createUserInteractor } from '../../shared/src/business/useCases/users/createUserInteractor';
import { deleteCaseDeadlineInteractor } from '../../shared/src/business/useCases/caseDeadline/deleteCaseDeadlineInteractor';
import { deleteCaseNoteInteractor } from '../../shared/src/business/useCases/caseNote/deleteCaseNoteInteractor';
import { deleteCounselFromCaseInteractor } from '../../shared/src/business/useCases/caseAssociation/deleteCounselFromCaseInteractor';
import { deleteDeficiencyStatisticInteractor } from '../../shared/src/business/useCases/caseStatistics/deleteDeficiencyStatisticInteractor';
import { deletePractitionerDocumentInteractor } from '../../shared/src/business/useCases/practitioners/deletePractitionerDocumentInteractor';
import { deleteTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/deleteTrialSessionInteractor';
import { deleteUserCaseNoteInteractor } from '../../shared/src/business/useCases/caseNote/deleteUserCaseNoteInteractor';
import { dismissNOTTReminderForTrialInteractor } from '../../shared/src/business/useCases/trialSessions/dismissNOTTReminderForTrialInteractor';
import { editPaperFilingInteractor } from '../../shared/src/business/useCases/docketEntry/editPaperFilingInteractor';
import { editPractitionerDocumentInteractor } from '../../shared/src/business/useCases/practitioners/editPractitionerDocumentInteractor';
import { fetchPendingItemsInteractor } from '../../shared/src/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { fileAndServeCourtIssuedDocumentInteractor } from '../../shared/src/business/useCases/courtIssuedDocument/fileAndServeCourtIssuedDocumentInteractor';
import { fileCorrespondenceDocumentInteractor } from '../../shared/src/business/useCases/correspondence/fileCorrespondenceDocumentInteractor';
import { fileCourtIssuedDocketEntryInteractor } from '../../shared/src/business/useCases/docketEntry/fileCourtIssuedDocketEntryInteractor';
import { fileCourtIssuedOrderInteractor } from '../../shared/src/business/useCases/courtIssuedOrder/fileCourtIssuedOrderInteractor';
import { fileExternalDocumentInteractor } from '../../shared/src/business/useCases/externalDocument/fileExternalDocumentInteractor';
import { forwardMessageInteractor } from '../../shared/src/business/useCases/messages/forwardMessageInteractor';
import { generateDocketRecordPdfInteractor } from '../../shared/src/business/useCases/generateDocketRecordPdfInteractor';
import { generateDraftStampOrderInteractor } from '../../shared/src/business/useCases/generateDraftStampOrderInteractor';
import { generateEntryOfAppearancePdfInteractor } from '../../shared/src/business/useCases/caseAssociationRequest/generateEntryOfAppearancePdfInteractor';
import { generateNoticeOfChangeOfTrialJudgeInteractor } from '../../shared/src/business/useCases/trialSessions/generateNoticeOfChangeOfTrialJudgeInteractor';
import { generateNoticeOfChangeToRemoteProceedingInteractor } from '../../shared/src/business/useCases/trialSessions/generateNoticeOfChangeToRemoteProceedingInteractor';
import { generateNoticeOfTrialIssuedInteractor } from '../../shared/src/business/useCases/trialSessions/generateNoticeOfTrialIssuedInteractor';
import { generateNoticesForCaseTrialSessionCalendarInteractor } from '../../shared/src/business/useCases/trialSessions/generateNoticesForCaseTrialSessionCalendarInteractor';
import { generatePDFFromJPGDataInteractor } from '../../shared/src/business/useCases/generatePDFFromJPGDataInteractor';
import { generatePdfFromHtmlInteractor } from '../../shared/src/business/useCases/generatePdfFromHtmlInteractor';
import { generatePractitionerCaseListPdfInteractor } from '../../shared/src/business/useCases/generatePractitionerCaseListPdfInteractor';
import { generatePrintableCaseInventoryReportInteractor } from './business/useCases/caseInventoryReport/generatePrintableCaseInventoryReportInteractor';
import { generatePrintableFilingReceiptInteractor } from '../../shared/src/business/useCases/generatePrintableFilingReceiptInteractor';
import { generatePrintablePendingReportInteractor } from '../../shared/src/business/useCases/pendingItems/generatePrintablePendingReportInteractor';
import { generatePrintableTrialSessionCopyReportInteractor } from '../../shared/src/business/useCases/trialSessions/generatePrintableTrialSessionCopyReportInteractor';
import { generateStandingPretrialOrderForSmallCaseInteractor } from '../../shared/src/business/useCases/trialSessions/generateStandingPretrialOrderForSmallCaseInteractor';
import { generateStandingPretrialOrderInteractor } from '../../shared/src/business/useCases/trialSessions/generateStandingPretrialOrderInteractor';
import { generateTrialCalendarPdfInteractor } from '../../shared/src/business/useCases/trialSessions/generateTrialCalendarPdfInteractor';
import { generateTrialSessionPaperServicePdfInteractor } from '../../shared/src/business/useCases/trialSessions/generateTrialSessionPaperServicePdfInteractor';
import { getAllFeatureFlagsInteractor } from '../../shared/src/business/useCases/featureFlag/getAllFeatureFlagsInteractor';
import { getBlockedCasesInteractor } from '../../shared/src/business/useCases/getBlockedCasesInteractor';
import { getCachedHealthCheckInteractor } from '../../shared/src/business/useCases/health/getCachedHealthCheckInteractor';
import { getCalendaredCasesForTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/getCalendaredCasesForTrialSessionInteractor';
import { getCaseDeadlinesForCaseInteractor } from '../../shared/src/business/useCases/caseDeadline/getCaseDeadlinesForCaseInteractor';
import { getCaseDeadlinesInteractor } from '../../shared/src/business/useCases/getCaseDeadlinesInteractor';
import { getCaseExistsInteractor } from '../../shared/src/business/useCases/getCaseExistsInteractor';
import { getCaseForPublicDocketSearchInteractor } from '../../shared/src/business/useCases/public/getCaseForPublicDocketSearchInteractor';
import { getCaseInteractor } from '../../shared/src/business/useCases/getCaseInteractor';
import { getCaseInventoryReportInteractor } from './business/useCases/caseInventoryReport/getCaseInventoryReportInteractor';
import { getCaseWorksheetsByJudgeInteractor } from '../../shared/src/business/useCases/judgeActivityReport/getCaseWorksheetsByJudgeInteractor';
import { getCasesClosedByJudgeInteractor } from '../../shared/src/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';
import { getCasesForUserInteractor } from '../../shared/src/business/useCases/getCasesForUserInteractor';
import { getCompletedMessagesForSectionInteractor } from '../../shared/src/business/useCases/messages/getCompletedMessagesForSectionInteractor';
import { getCompletedMessagesForUserInteractor } from '../../shared/src/business/useCases/messages/getCompletedMessagesForUserInteractor';
import { getCountOfCaseDocumentsFiledByJudgesInteractor } from '@shared/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { getCustomCaseReportInteractor } from './business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import { getDocumentContentsForDocketEntryInteractor } from '../../shared/src/business/useCases/document/getDocumentContentsForDocketEntryInteractor';
import { getDocumentQCInboxForSectionInteractor } from '../../shared/src/business/useCases/workitems/getDocumentQCInboxForSectionInteractor';
import { getDocumentQCInboxForUserInteractor } from '../../shared/src/business/useCases/workitems/getDocumentQCInboxForUserInteractor';
import { getDocumentQCServedForSectionInteractor } from '../../shared/src/business/useCases/workitems/getDocumentQCServedForSectionInteractor';
import { getDocumentQCServedForUserInteractor } from '../../shared/src/business/useCases/workitems/getDocumentQCServedForUserInteractor';
import { getDownloadPolicyUrlInteractor } from '../../shared/src/business/useCases/getDownloadPolicyUrlInteractor';
import { getEligibleCasesForTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/getEligibleCasesForTrialSessionInteractor';
import { getHealthCheckInteractor } from '../../shared/src/business/useCases/health/getHealthCheckInteractor';
import { getInboxMessagesForSectionInteractor } from '../../shared/src/business/useCases/messages/getInboxMessagesForSectionInteractor';
import { getInboxMessagesForUserInteractor } from '../../shared/src/business/useCases/messages/getInboxMessagesForUserInteractor';
import { getInternalUsersInteractor } from '../../shared/src/business/useCases/users/getInternalUsersInteractor';
import { getIrsPractitionersBySearchKeyInteractor } from '../../shared/src/business/useCases/users/getIrsPractitionersBySearchKeyInteractor';
import { getJudgeInSectionInteractor } from '../../shared/src/business/useCases/users/getJudgeInSectionInteractor';
import { getJudgesForPublicSearchInteractor } from '../../shared/src/business/useCases/public/getJudgesForPublicSearchInteractor';
import { getMaintenanceModeInteractor } from '../../shared/src/business/useCases/getMaintenanceModeInteractor';
import { getMessageThreadInteractor } from '../../shared/src/business/useCases/messages/getMessageThreadInteractor';
import { getMessagesForCaseInteractor } from '../../shared/src/business/useCases/messages/getMessagesForCaseInteractor';
import { getNotificationsInteractor } from '../../shared/src/business/useCases/getNotificationsInteractor';
import { getOutboxMessagesForSectionInteractor } from '../../shared/src/business/useCases/messages/getOutboxMessagesForSectionInteractor';
import { getOutboxMessagesForUserInteractor } from '../../shared/src/business/useCases/messages/getOutboxMessagesForUserInteractor';
import { getPaperServicePdfUrlInteractor } from '@shared/business/useCases/getPaperServicePdfUrlInteractor';
import { getPractitionerByBarNumberInteractor } from '../../shared/src/business/useCases/practitioners/getPractitionerByBarNumberInteractor';
import { getPractitionerDocumentDownloadUrlInteractor } from '../../shared/src/business/useCases/practitioners/getPractitionerDocumentDownloadUrlInteractor';
import { getPractitionerDocumentInteractor } from '../../shared/src/business/useCases/practitioners/getPractitionerDocumentInteractor';
import { getPractitionerDocumentsInteractor } from '../../shared/src/business/useCases/practitioners/getPractitionerDocumentsInteractor';
import { getPractitionersByNameInteractor } from '../../shared/src/business/useCases/practitioners/getPractitionersByNameInteractor';
import { getPrivatePractitionersBySearchKeyInteractor } from '../../shared/src/business/useCases/users/getPrivatePractitionersBySearchKeyInteractor';
import { getPublicCaseInteractor } from '../../shared/src/business/useCases/public/getPublicCaseInteractor';
import { getPublicDownloadPolicyUrlInteractor } from '../../shared/src/business/useCases/public/getPublicDownloadPolicyUrlInteractor';
import { getReconciliationReportInteractor } from '../../shared/src/business/useCases/getReconciliationReportInteractor';
import { getStatusOfVirusScanInteractor } from '../../shared/src/business/useCases/document/getStatusOfVirusScanInteractor';
import { getTodaysOpinionsInteractor } from '../../shared/src/business/useCases/public/getTodaysOpinionsInteractor';
import { getTodaysOrdersInteractor } from '../../shared/src/business/useCases/public/getTodaysOrdersInteractor';
import { getTrialSessionDetailsInteractor } from '../../shared/src/business/useCases/trialSessions/getTrialSessionDetailsInteractor';
import { getTrialSessionWorkingCopyInteractor } from '../../shared/src/business/useCases/trialSessions/getTrialSessionWorkingCopyInteractor';
import { getTrialSessionsForJudgeActivityReportInteractor } from '../../shared/src/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';
import { getTrialSessionsForJudgeInteractor } from '../../shared/src/business/useCases/trialSessions/getTrialSessionsForJudgeInteractor';
import { getTrialSessionsInteractor } from '../../shared/src/business/useCases/trialSessions/getTrialSessionsInteractor';
import { getUploadPolicyInteractor } from '../../shared/src/business/useCases/getUploadPolicyInteractor';
import { getUserByIdInteractor } from '../../shared/src/business/useCases/getUserByIdInteractor';
import { getUserCaseNoteForCasesInteractor } from '../../shared/src/business/useCases/caseNote/getUserCaseNoteForCasesInteractor';
import { getUserCaseNoteInteractor } from '../../shared/src/business/useCases/caseNote/getUserCaseNoteInteractor';
import { getUserInteractor } from '../../shared/src/business/useCases/getUserInteractor';
import { getUserPendingEmailInteractor } from '../../shared/src/business/useCases/users/getUserPendingEmailInteractor';
import { getUserPendingEmailStatusInteractor } from '../../shared/src/business/useCases/users/getUserPendingEmailStatusInteractor';
import { getUsersInSectionInteractor } from '../../shared/src/business/useCases/users/getUsersInSectionInteractor';
import { getUsersPendingEmailInteractor } from '../../shared/src/business/useCases/users/getUsersPendingEmailInteractor';
import { getWorkItemInteractor } from '../../shared/src/business/useCases/workitems/getWorkItemInteractor';
import { handleBounceNotificationInteractor } from '../../shared/src/business/useCases/email/handleBounceNotificationInteractor';
import { onConnectInteractor } from '../../shared/src/business/useCases/notifications/onConnectInteractor';
import { onDisconnectInteractor } from '../../shared/src/business/useCases/notifications/onDisconnectInteractor';
import { opinionAdvancedSearchInteractor } from '../../shared/src/business/useCases/opinionAdvancedSearchInteractor';
import { opinionPublicSearchInteractor } from '../../shared/src/business/useCases/public/opinionPublicSearchInteractor';
import { orderAdvancedSearchInteractor } from '../../shared/src/business/useCases/orderAdvancedSearchInteractor';
import { orderPublicSearchInteractor } from '../../shared/src/business/useCases/public/orderPublicSearchInteractor';
import { prioritizeCaseInteractor } from '../../shared/src/business/useCases/prioritizeCaseInteractor';
import { processStreamRecordsInteractor } from '../../shared/src/business/useCases/processStreamRecordsInteractor';
import { refreshAuthTokenInteractor } from '../../shared/src/business/useCases/auth/refreshAuthTokenInteractor';
import { removeCaseFromTrialInteractor } from '../../shared/src/business/useCases/trialSessions/removeCaseFromTrialInteractor';
import { removeCasePendingItemInteractor } from '../../shared/src/business/useCases/removeCasePendingItemInteractor';
import { removeConsolidatedCasesInteractor } from '../../shared/src/business/useCases/caseConsolidation/removeConsolidatedCasesInteractor';
import { removePdfFromDocketEntryInteractor } from '../../shared/src/business/useCases/removePdfFromDocketEntryInteractor';
import { removePetitionerAndUpdateCaptionInteractor } from '../../shared/src/business/useCases/removePetitionerAndUpdateCaptionInteractor';
import { removeSignatureFromDocumentInteractor } from '../../shared/src/business/useCases/removeSignatureFromDocumentInteractor';
import { replyToMessageInteractor } from '../../shared/src/business/useCases/messages/replyToMessageInteractor';
import { runTrialSessionPlanningReportInteractor } from '../../shared/src/business/useCases/trialSessions/runTrialSessionPlanningReportInteractor';
import { saveCalendarNoteInteractor } from '../../shared/src/business/useCases/trialSessions/saveCalendarNoteInteractor';
import { saveCaseDetailInternalEditInteractor } from '../../shared/src/business/useCases/saveCaseDetailInternalEditInteractor';
import { saveCaseNoteInteractor } from '../../shared/src/business/useCases/caseNote/saveCaseNoteInteractor';
import { saveSignedDocumentInteractor } from '../../shared/src/business/useCases/saveSignedDocumentInteractor';
import { sealCaseContactAddressInteractor } from '../../shared/src/business/useCases/sealCaseContactAddressInteractor';
import { sealCaseInteractor } from '../../shared/src/business/useCases/sealCaseInteractor';
import { sealDocketEntryInteractor } from '../../shared/src/business/useCases/docketEntry/sealDocketEntryInteractor';
import { sendMaintenanceNotificationsInteractor } from '../../shared/src/business/useCases/maintenance/sendMaintenanceNotificationsInteractor';
import { serveCaseToIrsInteractor } from '../../shared/src/business/useCases/serveCaseToIrs/serveCaseToIrsInteractor';
import { serveCourtIssuedDocumentInteractor } from '../../shared/src/business/useCases/courtIssuedDocument/serveCourtIssuedDocumentInteractor';
import { serveExternallyFiledDocumentInteractor } from '../../shared/src/business/useCases/document/serveExternallyFiledDocumentInteractor';
import { serveThirtyDayNoticeInteractor } from '../../shared/src/business/useCases/trialSessions/serveThirtyDayNoticeInteractor';
import { setForHearingInteractor } from '../../shared/src/business/useCases/trialSessions/setForHearingInteractor';
import { setHealthCheckCacheInteractor } from '../../shared/src/business/useCases/health/setHealthCheckCacheInteractor';
import { setMessageAsReadInteractor } from '../../shared/src/business/useCases/messages/setMessageAsReadInteractor';
import { setNoticesForCalendaredTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/setNoticesForCalendaredTrialSessionInteractor';
import { setTrialSessionCalendarInteractor } from '../../shared/src/business/useCases/trialSessions/setTrialSessionCalendarInteractor';
import { setUserEmailFromPendingEmailInteractor } from '../../shared/src/business/useCases/users/setUserEmailFromPendingEmailInteractor';
import { setWorkItemAsReadInteractor } from '../../shared/src/business/useCases/workitems/setWorkItemAsReadInteractor';
import { strikeDocketEntryInteractor } from '../../shared/src/business/useCases/docketEntry/strikeDocketEntryInteractor';
import { submitCaseAssociationRequestInteractor } from '../../shared/src/business/useCases/caseAssociationRequest/submitCaseAssociationRequestInteractor';
import { submitPendingCaseAssociationRequestInteractor } from '../../shared/src/business/useCases/caseAssociationRequest/submitPendingCaseAssociationRequestInteractor';
import { unblockCaseFromTrialInteractor } from '../../shared/src/business/useCases/unblockCaseFromTrialInteractor';
import { unprioritizeCaseInteractor } from '../../shared/src/business/useCases/unprioritizeCaseInteractor';
import { unsealCaseInteractor } from '../../shared/src/business/useCases/unsealCaseInteractor';
import { unsealDocketEntryInteractor } from '../../shared/src/business/useCases/docketEntry/unsealDocketEntryInteractor';
import { updateCaseContextInteractor } from '../../shared/src/business/useCases/updateCaseContextInteractor';
import { updateCaseDeadlineInteractor } from '../../shared/src/business/useCases/caseDeadline/updateCaseDeadlineInteractor';
import { updateCaseDetailsInteractor } from '../../shared/src/business/useCases/updateCaseDetailsInteractor';
import { updateCaseTrialSortTagsInteractor } from '../../shared/src/business/useCases/updateCaseTrialSortTagsInteractor';
import { updateCaseWorksheetInteractor } from '../../shared/src/business/useCases/caseWorksheet/updateCaseWorksheetInteractor';
import { updateContactInteractor } from '../../shared/src/business/useCases/updateContactInteractor';
import { updateCorrespondenceDocumentInteractor } from '../../shared/src/business/useCases/correspondence/updateCorrespondenceDocumentInteractor';
import { updateCounselOnCaseInteractor } from '../../shared/src/business/useCases/caseAssociation/updateCounselOnCaseInteractor';
import { updateCourtIssuedDocketEntryInteractor } from '../../shared/src/business/useCases/docketEntry/updateCourtIssuedDocketEntryInteractor';
import { updateCourtIssuedOrderInteractor } from '../../shared/src/business/useCases/courtIssuedOrder/updateCourtIssuedOrderInteractor';
import { updateDeficiencyStatisticInteractor } from '../../shared/src/business/useCases/caseStatistics/updateDeficiencyStatisticInteractor';
import { updateDocketEntryMetaInteractor } from '../../shared/src/business/useCases/docketEntry/updateDocketEntryMetaInteractor';
import { updateOtherStatisticsInteractor } from '../../shared/src/business/useCases/caseStatistics/updateOtherStatisticsInteractor';
import { updatePetitionerCasesInteractor } from '../../shared/src/business/useCases/users/updatePetitionerCasesInteractor';
import { updatePetitionerInformationInteractor } from '../../shared/src/business/useCases/updatePetitionerInformationInteractor';
import { updatePractitionerUserInteractor } from '../../shared/src/business/useCases/practitioners/updatePractitionerUserInteractor';
import { updateQcCompleteForTrialInteractor } from '../../shared/src/business/useCases/updateQcCompleteForTrialInteractor';
import { updateTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/updateTrialSessionInteractor';
import { updateTrialSessionWorkingCopyInteractor } from '../../shared/src/business/useCases/trialSessions/updateTrialSessionWorkingCopyInteractor';
import { updateUserCaseNoteInteractor } from '../../shared/src/business/useCases/caseNote/updateUserCaseNoteInteractor';
import { updateUserContactInformationInteractor } from '../../shared/src/business/useCases/users/updateUserContactInformationInteractor';
import { updateUserPendingEmailInteractor } from '../../shared/src/business/useCases/users/updateUserPendingEmailInteractor';
import { validatePdfInteractor } from '../../shared/src/business/useCases/pdf/validatePdfInteractor';
import { verifyPendingCaseForUserInteractor } from '../../shared/src/business/useCases/caseAssociationRequest/verifyPendingCaseForUserInteractor';
import { verifyUserPendingEmailInteractor } from '../../shared/src/business/useCases/users/verifyUserPendingEmailInteractor';
import { virusScanPdfInteractor } from '../../shared/src/business/useCases/pdf/virusScanPdfInteractor';

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
  authenticateUserInteractor,
  batchDownloadTrialSessionInteractor,
  blockCaseFromTrialInteractor,
  caseAdvancedSearchInteractor,
  casePublicSearchInteractor,
  changePasswordLocalInteractor,
  checkEmailAvailabilityInteractor,
  checkForReadyForTrialCasesInteractor,
  closeTrialSessionInteractor,
  cognitoResendVerificationLinkInteractor,
  completeDocketEntryQCInteractor,
  completeMessageInteractor,
  completeWorkItemInteractor,
  confirmSignUpLocalInteractor,
  createCaseDeadlineInteractor,
  createCaseFromPaperInteractor,
  createCaseInteractor,
  createCourtIssuedOrderPdfFromHtmlInteractor,
  createMessageInteractor,
  createPetitionerAccountInteractor,
  createPractitionerDocumentInteractor,
  createPractitionerUserInteractor,
  createTrialSessionInteractor,
  createUserCognitoInteractor,
  createUserInteractor,
  deleteCaseDeadlineInteractor,
  deleteCaseNoteInteractor,
  deleteCounselFromCaseInteractor,
  deleteDeficiencyStatisticInteractor,
  deletePractitionerDocumentInteractor,
  deleteTrialSessionInteractor,
  deleteUserCaseNoteInteractor,
  dismissNOTTReminderForTrialInteractor,
  editPaperFilingInteractor,
  editPractitionerDocumentInteractor,
  fetchPendingItemsInteractor,
  fileAndServeCourtIssuedDocumentInteractor,
  fileCorrespondenceDocumentInteractor,
  fileCourtIssuedDocketEntryInteractor,
  fileCourtIssuedOrderInteractor,
  fileExternalDocumentInteractor,
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
  getPractitionerByBarNumberInteractor,
  getPractitionerDocumentDownloadUrlInteractor,
  getPractitionerDocumentInteractor,
  getPractitionerDocumentsInteractor,
  getPractitionersByNameInteractor,
  getPrivatePractitionersBySearchKeyInteractor,
  getPublicCaseInteractor,
  getPublicDownloadPolicyUrlInteractor,
  getReconciliationReportInteractor,
  getStatusOfVirusScanInteractor,
  getTodaysOpinionsInteractor,
  getTodaysOrdersInteractor,
  getTrialSessionDetailsInteractor,
  getTrialSessionWorkingCopyInteractor,
  getTrialSessionsForJudgeActivityReportInteractor,
  getTrialSessionsForJudgeInteractor,
  getTrialSessionsInteractor,
  getUploadPolicyInteractor,
  getUserByIdInteractor,
  getUserCaseNoteForCasesInteractor,
  getUserCaseNoteInteractor,
  getUserInteractor,
  getUserPendingEmailInteractor,
  getUserPendingEmailStatusInteractor,
  getUsersInSectionInteractor,
  getUsersPendingEmailInteractor,
  getWorkItemInteractor,
  handleBounceNotificationInteractor,
  onConnectInteractor,
  onDisconnectInteractor,
  opinionAdvancedSearchInteractor,
  opinionPublicSearchInteractor,
  orderAdvancedSearchInteractor,
  orderPublicSearchInteractor,
  prioritizeCaseInteractor,
  processStreamRecordsInteractor,
  refreshAuthTokenInteractor,
  removeCaseFromTrialInteractor,
  removeCasePendingItemInteractor,
  removeConsolidatedCasesInteractor,
  removePdfFromDocketEntryInteractor,
  removePetitionerAndUpdateCaptionInteractor,
  removeSignatureFromDocumentInteractor,
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
  setUserEmailFromPendingEmailInteractor,
  setWorkItemAsReadInteractor,
  strikeDocketEntryInteractor,
  submitCaseAssociationRequestInteractor,
  submitPendingCaseAssociationRequestInteractor,
  unblockCaseFromTrialInteractor,
  unprioritizeCaseInteractor,
  unsealCaseInteractor,
  unsealDocketEntryInteractor,
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
  updateOtherStatisticsInteractor,
  updatePetitionerCasesInteractor,
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
  virusScanPdfInteractor: (applicationContext, args) =>
    process.env.SKIP_VIRUS_SCAN
      ? null
      : virusScanPdfInteractor(applicationContext, args),
};

export const getUseCases = () => useCases;

type _IGetUseCases = typeof getUseCases;

declare global {
  interface IGetUseCases extends _IGetUseCases {}
}
