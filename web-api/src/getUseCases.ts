/* eslint-disable no-unused-vars */
/* eslint-disable max-lines */
const {
  addCaseToTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/addCaseToTrialSessionInteractor');
const {
  addConsolidatedCaseInteractor,
} = require('../../shared/src/business/useCases/caseConsolidation/addConsolidatedCaseInteractor');
const {
  addCoversheetInteractor,
} = require('../../shared/src/business/useCases/addCoversheetInteractor');
const {
  addDeficiencyStatisticInteractor,
} = require('../../shared/src/business/useCases/caseStatistics/addDeficiencyStatisticInteractor');
const {
  addPaperFilingInteractor,
} = require('../../shared/src/business/useCases/docketEntry/addPaperFilingInteractor');
const {
  addPetitionerToCaseInteractor,
} = require('../../shared/src/business/useCases/addPetitionerToCaseInteractor');
const {
  appendAmendedPetitionFormInteractor,
} = require('../../shared/src/business/useCases/courtIssuedOrder/appendAmendedPetitionFormInteractor');
const {
  archiveCorrespondenceDocumentInteractor,
} = require('../../shared/src/business/useCases/correspondence/archiveCorrespondenceDocumentInteractor');
const {
  archiveDraftDocumentInteractor,
} = require('../../shared/src/business/useCases/archiveDraftDocumentInteractor');
const {
  assignWorkItemsInteractor,
} = require('../../shared/src/business/useCases/workitems/assignWorkItemsInteractor');
const {
  associateIrsPractitionerWithCaseInteractor,
} = require('../../shared/src/business/useCases/manualAssociation/associateIrsPractitionerWithCaseInteractor');
const {
  associatePrivatePractitionerWithCaseInteractor,
} = require('../../shared/src/business/useCases/manualAssociation/associatePrivatePractitionerWithCaseInteractor');
const {
  authenticateUserInteractor,
} = require('../../shared/src/business/useCases/auth/authenticateUserInteractor');
const {
  batchDownloadTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/batchDownloadTrialSessionInteractor');
const {
  blockCaseFromTrialInteractor,
} = require('../../shared/src/business/useCases/blockCaseFromTrialInteractor');
const {
  caseAdvancedSearchInteractor,
} = require('../../shared/src/business/useCases/caseAdvancedSearchInteractor');
const {
  casePublicSearchInteractor,
} = require('../../shared/src/business/useCases/public/casePublicSearchInteractor');
const {
  checkEmailAvailabilityInteractor,
} = require('../../shared/src/business/useCases/users/checkEmailAvailabilityInteractor');
const {
  checkForReadyForTrialCasesInteractor,
} = require('../../shared/src/business/useCases/checkForReadyForTrialCasesInteractor');
const {
  closeTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/closeTrialSessionInteractor');
const {
  completeDocketEntryQCInteractor,
} = require('../../shared/src/business/useCases/editDocketEntry/completeDocketEntryQCInteractor');
const {
  completeMessageInteractor,
} = require('../../shared/src/business/useCases/messages/completeMessageInteractor');
const {
  completeWorkItemInteractor,
} = require('../../shared/src/business/useCases/workitems/completeWorkItemInteractor');
const {
  createCaseDeadlineInteractor,
} = require('../../shared/src/business/useCases/caseDeadline/createCaseDeadlineInteractor');
const {
  createCaseFromPaperInteractor,
} = require('../../shared/src/business/useCases/createCaseFromPaperInteractor');
const {
  createCaseInteractor,
} = require('../../shared/src/business/useCases/createCaseInteractor');
const {
  createCourtIssuedOrderPdfFromHtmlInteractor,
} = require('../../shared/src/business/useCases/courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlInteractor');
const {
  createMessageInteractor,
} = require('../../shared/src/business/useCases/messages/createMessageInteractor');
const {
  createPetitionerAccountInteractor,
} = require('../../shared/src/business/useCases/users/createPetitionerAccountInteractor');
const {
  createPractitionerDocumentInteractor,
} = require('../../shared/src/business/useCases/practitioners/createPractitionerDocumentInteractor');
const {
  createPractitionerUserInteractor,
} = require('../../shared/src/business/useCases/practitioners/createPractitionerUserInteractor');
const {
  createTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/createTrialSessionInteractor');
const {
  createUserInteractor,
} = require('../../shared/src/business/useCases/users/createUserInteractor');
const {
  deleteCaseDeadlineInteractor,
} = require('../../shared/src/business/useCases/caseDeadline/deleteCaseDeadlineInteractor');
const {
  deleteCaseNoteInteractor,
} = require('../../shared/src/business/useCases/caseNote/deleteCaseNoteInteractor');
const {
  deleteCounselFromCaseInteractor,
} = require('../../shared/src/business/useCases/caseAssociation/deleteCounselFromCaseInteractor');
const {
  deleteDeficiencyStatisticInteractor,
} = require('../../shared/src/business/useCases/caseStatistics/deleteDeficiencyStatisticInteractor');
const {
  deletePractitionerDocumentInteractor,
} = require('../../shared/src/business/useCases/practitioners/deletePractitionerDocumentInteractor');
const {
  deleteTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/deleteTrialSessionInteractor');
const {
  deleteUserCaseNoteInteractor,
} = require('../../shared/src/business/useCases/caseNote/deleteUserCaseNoteInteractor');
const {
  editPaperFilingInteractor,
} = require('../../shared/src/business/useCases/docketEntry/editPaperFilingInteractor');
const {
  editPractitionerDocumentInteractor,
} = require('../../shared/src/business/useCases/practitioners/editPractitionerDocumentInteractor');
const {
  fetchPendingItemsInteractor,
} = require('../../shared/src/business/useCases/pendingItems/fetchPendingItemsInteractor');
const {
  fileAndServeCourtIssuedDocumentInteractor,
} = require('../../shared/src/business/useCases/courtIssuedDocument/fileAndServeCourtIssuedDocumentInteractor');
const {
  fileCorrespondenceDocumentInteractor,
} = require('../../shared/src/business/useCases/correspondence/fileCorrespondenceDocumentInteractor');
const {
  fileCourtIssuedDocketEntryInteractor,
} = require('../../shared/src/business/useCases/docketEntry/fileCourtIssuedDocketEntryInteractor');
const {
  fileCourtIssuedOrderInteractor,
} = require('../../shared/src/business/useCases/courtIssuedOrder/fileCourtIssuedOrderInteractor');
const {
  fileExternalDocumentForConsolidatedInteractor,
} = require('../../shared/src/business/useCases/externalDocument/fileExternalDocumentForConsolidatedInteractor');
const {
  fileExternalDocumentInteractor,
} = require('../../shared/src/business/useCases/externalDocument/fileExternalDocumentInteractor');
const {
  forwardMessageInteractor,
} = require('../../shared/src/business/useCases/messages/forwardMessageInteractor');
const {
  generateDocketRecordPdfInteractor,
} = require('../../shared/src/business/useCases/generateDocketRecordPdfInteractor');
const {
  generateDraftStampOrderInteractor,
} = require('../../shared/src/business/useCases/generateDraftStampOrderInteractor');
const {
  generateNoticeOfChangeOfTrialJudgeInteractor,
} = require('../../shared/src/business/useCases/trialSessions/generateNoticeOfChangeOfTrialJudgeInteractor');
const {
  generateNoticeOfChangeToRemoteProceedingInteractor,
} = require('../../shared/src/business/useCases/trialSessions/generateNoticeOfChangeToRemoteProceedingInteractor');
const {
  generateNoticeOfTrialIssuedInteractor,
} = require('../../shared/src/business/useCases/trialSessions/generateNoticeOfTrialIssuedInteractor');
const {
  generateNoticesForCaseTrialSessionCalendarInteractor,
} = require('../../shared/src/business/useCases/trialSessions/generateNoticesForCaseTrialSessionCalendarInteractor');
const {
  generatePdfFromHtmlInteractor,
} = require('../../shared/src/business/useCases/generatePdfFromHtmlInteractor');
const {
  generatePDFFromJPGDataInteractor,
} = require('../../shared/src/business/useCases/generatePDFFromJPGDataInteractor');
const {
  generatePractitionerCaseListPdfInteractor,
} = require('../../shared/src/business/useCases/generatePractitionerCaseListPdfInteractor');
const {
  generatePrintableCaseInventoryReportInteractor,
} = require('../../shared/src/business/useCases/caseInventoryReport/generatePrintableCaseInventoryReportInteractor');
const {
  generatePrintableFilingReceiptInteractor,
} = require('../../shared/src/business/useCases/generatePrintableFilingReceiptInteractor');
const {
  generatePrintablePendingReportInteractor,
} = require('../../shared/src/business/useCases/pendingItems/generatePrintablePendingReportInteractor');
const {
  generatePrintableTrialSessionCopyReportInteractor,
} = require('../../shared/src/business/useCases/trialSessions/generatePrintableTrialSessionCopyReportInteractor');
const {
  generateStandingPretrialOrderForSmallCaseInteractor,
} = require('../../shared/src/business/useCases/trialSessions/generateStandingPretrialOrderForSmallCaseInteractor');
const {
  generateStandingPretrialOrderInteractor,
} = require('../../shared/src/business/useCases/trialSessions/generateStandingPretrialOrderInteractor');
const {
  generateTrialCalendarPdfInteractor,
} = require('../../shared/src/business/useCases/trialSessions/generateTrialCalendarPdfInteractor');
const {
  getBlockedCasesInteractor,
} = require('../../shared/src/business/useCases/getBlockedCasesInteractor');
const {
  getCalendaredCasesForTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/getCalendaredCasesForTrialSessionInteractor');
const {
  getCaseDeadlinesForCaseInteractor,
} = require('../../shared/src/business/useCases/caseDeadline/getCaseDeadlinesForCaseInteractor');
const {
  getCaseDeadlinesInteractor,
} = require('../../shared/src/business/useCases/getCaseDeadlinesInteractor');
const {
  getCaseExistsInteractor,
} = require('../../shared/src/business/useCases/getCaseExistsInteractor');
const {
  getCaseForPublicDocketSearchInteractor,
} = require('../../shared/src/business/useCases/public/getCaseForPublicDocketSearchInteractor');
const {
  getCaseInteractor,
} = require('../../shared/src/business/useCases/getCaseInteractor');
const {
  getCaseInventoryReportInteractor,
} = require('../../shared/src/business/useCases/caseInventoryReport/getCaseInventoryReportInteractor');
const {
  getCasesForUserInteractor,
} = require('../../shared/src/business/useCases/getCasesForUserInteractor');
const {
  getCompletedMessagesForSectionInteractor,
} = require('../../shared/src/business/useCases/messages/getCompletedMessagesForSectionInteractor');
const {
  getCompletedMessagesForUserInteractor,
} = require('../../shared/src/business/useCases/messages/getCompletedMessagesForUserInteractor');
const {
  getConsolidatedCasesByCaseInteractor,
} = require('../../shared/src/business/useCases/getConsolidatedCasesByCaseInteractor');
const {
  getDocumentContentsForDocketEntryInteractor,
} = require('../../shared/src/business/useCases/document/getDocumentContentsForDocketEntryInteractor');
const {
  getDocumentQCInboxForSectionInteractor,
} = require('../../shared/src/business/useCases/workitems/getDocumentQCInboxForSectionInteractor');
const {
  getDocumentQCInboxForUserInteractor,
} = require('../../shared/src/business/useCases/workitems/getDocumentQCInboxForUserInteractor');
const {
  getDocumentQCServedForSectionInteractor,
} = require('../../shared/src/business/useCases/workitems/getDocumentQCServedForSectionInteractor');
const {
  getDocumentQCServedForUserInteractor,
} = require('../../shared/src/business/useCases/workitems/getDocumentQCServedForUserInteractor');
const {
  getDownloadPolicyUrlInteractor,
} = require('../../shared/src/business/useCases/getDownloadPolicyUrlInteractor');
const {
  getEligibleCasesForTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/getEligibleCasesForTrialSessionInteractor');
const {
  getFeatureFlagValueInteractor,
} = require('../../shared/src/business/useCases/featureFlag/getFeatureFlagValueInteractor');
const {
  getHealthCheckInteractor,
} = require('../../shared/src/business/useCases/health/getHealthCheckInteractor');
const {
  getInboxMessagesForSectionInteractor,
} = require('../../shared/src/business/useCases/messages/getInboxMessagesForSectionInteractor');
const {
  getInboxMessagesForUserInteractor,
} = require('../../shared/src/business/useCases/messages/getInboxMessagesForUserInteractor');
const {
  getInternalUsersInteractor,
} = require('../../shared/src/business/useCases/users/getInternalUsersInteractor');
const {
  getIrsPractitionersBySearchKeyInteractor,
} = require('../../shared/src/business/useCases/users/getIrsPractitionersBySearchKeyInteractor');
const {
  getJudgeInSectionInteractor,
} = require('../../shared/src/business/useCases/users/getJudgeInSectionInteractor');
const {
  getJudgesForPublicSearchInteractor,
} = require('../../shared/src/business/useCases/public/getJudgesForPublicSearchInteractor');
const {
  getMaintenanceModeInteractor,
} = require('../../shared/src/business/useCases/getMaintenanceModeInteractor');
const {
  getMessagesForCaseInteractor,
} = require('../../shared/src/business/useCases/messages/getMessagesForCaseInteractor');
const {
  getMessageThreadInteractor,
} = require('../../shared/src/business/useCases/messages/getMessageThreadInteractor');
const {
  getNotificationsInteractor,
} = require('../../shared/src/business/useCases/getNotificationsInteractor');
const {
  getOutboxMessagesForSectionInteractor,
} = require('../../shared/src/business/useCases/messages/getOutboxMessagesForSectionInteractor');
const {
  getOutboxMessagesForUserInteractor,
} = require('../../shared/src/business/useCases/messages/getOutboxMessagesForUserInteractor');
const {
  getPractitionerByBarNumberInteractor,
} = require('../../shared/src/business/useCases/practitioners/getPractitionerByBarNumberInteractor');
const {
  getPractitionerDocumentDownloadUrlInteractor,
} = require('../../shared/src/business/useCases/practitioners/getPractitionerDocumentDownloadUrlInteractor');
const {
  getPractitionerDocumentInteractor,
} = require('../../shared/src/business/useCases/practitioners/getPractitionerDocumentInteractor');
const {
  getPractitionerDocumentsInteractor,
} = require('../../shared/src/business/useCases/practitioners/getPractitionerDocumentsInteractor');
const {
  getPractitionersByNameInteractor,
} = require('../../shared/src/business/useCases/practitioners/getPractitionersByNameInteractor');
const {
  getPrivatePractitionersBySearchKeyInteractor,
} = require('../../shared/src/business/useCases/users/getPrivatePractitionersBySearchKeyInteractor');
const {
  getPublicCaseInteractor,
} = require('../../shared/src/business/useCases/public/getPublicCaseInteractor');
const {
  getPublicDownloadPolicyUrlInteractor,
} = require('../../shared/src/business/useCases/public/getPublicDownloadPolicyUrlInteractor');
const {
  getReconciliationReportInteractor,
} = require('../../shared/src/business/useCases/getReconciliationReportInteractor');
const {
  getStatusOfVirusScanInteractor,
} = require('../../shared/src/business/useCases/document/getStatusOfVirusScanInteractor');
const {
  getTodaysOpinionsInteractor,
} = require('../../shared/src/business/useCases/public/getTodaysOpinionsInteractor');
const {
  getTodaysOrdersInteractor,
} = require('../../shared/src/business/useCases/public/getTodaysOrdersInteractor');
const {
  getTrialSessionDetailsInteractor,
} = require('../../shared/src/business/useCases/trialSessions/getTrialSessionDetailsInteractor');
const {
  getTrialSessionsForJudgeInteractor,
} = require('../../shared/src/business/useCases/trialSessions/getTrialSessionsForJudgeInteractor');
const {
  getTrialSessionsInteractor,
} = require('../../shared/src/business/useCases/trialSessions/getTrialSessionsInteractor');
const {
  getTrialSessionWorkingCopyInteractor,
} = require('../../shared/src/business/useCases/trialSessions/getTrialSessionWorkingCopyInteractor');
const {
  getUploadPolicyInteractor,
} = require('../../shared/src/business/useCases/getUploadPolicyInteractor');
const {
  getUserByIdInteractor,
} = require('../../shared/src/business/useCases/getUserByIdInteractor');
const {
  getUserCaseNoteForCasesInteractor,
} = require('../../shared/src/business/useCases/caseNote/getUserCaseNoteForCasesInteractor');
const {
  getUserCaseNoteInteractor,
} = require('../../shared/src/business/useCases/caseNote/getUserCaseNoteInteractor');
const {
  getUserInteractor,
} = require('../../shared/src/business/useCases/getUserInteractor');
const {
  getUserPendingEmailInteractor,
} = require('../../shared/src/business/useCases/users/getUserPendingEmailInteractor');
const {
  getUserPendingEmailStatusInteractor,
} = require('../../shared/src/business/useCases/users/getUserPendingEmailStatusInteractor');
const {
  getUsersInSectionInteractor,
} = require('../../shared/src/business/useCases/users/getUsersInSectionInteractor');
const {
  getUsersPendingEmailInteractor,
} = require('../../shared/src/business/useCases/users/getUsersPendingEmailInteractor');
const {
  getWorkItemInteractor,
} = require('../../shared/src/business/useCases/workitems/getWorkItemInteractor');
const {
  handleBounceNotificationInteractor,
} = require('../../shared/src/business/useCases/email/handleBounceNotificationInteractor');
const {
  onConnectInteractor,
} = require('../../shared/src/business/useCases/notifications/onConnectInteractor');
const {
  onDisconnectInteractor,
} = require('../../shared/src/business/useCases/notifications/onDisconnectInteractor');
const {
  opinionAdvancedSearchInteractor,
} = require('../../shared/src/business/useCases/opinionAdvancedSearchInteractor');
const {
  opinionPublicSearchInteractor,
} = require('../../shared/src/business/useCases/public/opinionPublicSearchInteractor');
const {
  orderAdvancedSearchInteractor,
} = require('../../shared/src/business/useCases/orderAdvancedSearchInteractor');
const {
  orderPublicSearchInteractor,
} = require('../../shared/src/business/useCases/public/orderPublicSearchInteractor');
const {
  prioritizeCaseInteractor,
} = require('../../shared/src/business/useCases/prioritizeCaseInteractor');
const {
  processStreamRecordsInteractor,
} = require('../../shared/src/business/useCases/processStreamRecordsInteractor');
const {
  refreshAuthTokenInteractor,
} = require('../../shared/src/business/useCases/auth/refreshAuthTokenInteractor');
const {
  removeCaseFromTrialInteractor,
} = require('../../shared/src/business/useCases/trialSessions/removeCaseFromTrialInteractor');
const {
  removeCasePendingItemInteractor,
} = require('../../shared/src/business/useCases/removeCasePendingItemInteractor');
const {
  removeConsolidatedCasesInteractor,
} = require('../../shared/src/business/useCases/caseConsolidation/removeConsolidatedCasesInteractor');
const {
  removePdfFromDocketEntryInteractor,
} = require('../../shared/src/business/useCases/removePdfFromDocketEntryInteractor');
const {
  removePetitionerAndUpdateCaptionInteractor,
} = require('../../shared/src/business/useCases/removePetitionerAndUpdateCaptionInteractor');
const {
  removeSignatureFromDocumentInteractor,
} = require('../../shared/src/business/useCases/removeSignatureFromDocumentInteractor');
const {
  replyToMessageInteractor,
} = require('../../shared/src/business/useCases/messages/replyToMessageInteractor');
const {
  runTrialSessionPlanningReportInteractor,
} = require('../../shared/src/business/useCases/trialSessions/runTrialSessionPlanningReportInteractor');
const {
  saveCalendarNoteInteractor,
} = require('../../shared/src/business/useCases/trialSessions/saveCalendarNoteInteractor');
const {
  saveCaseDetailInternalEditInteractor,
} = require('../../shared/src/business/useCases/saveCaseDetailInternalEditInteractor');
const {
  saveCaseNoteInteractor,
} = require('../../shared/src/business/useCases/caseNote/saveCaseNoteInteractor');
const {
  saveSignedDocumentInteractor,
} = require('../../shared/src/business/useCases/saveSignedDocumentInteractor');
const {
  sealCaseContactAddressInteractor,
} = require('../../shared/src/business/useCases/sealCaseContactAddressInteractor');
const {
  sealCaseInteractor,
} = require('../../shared/src/business/useCases/sealCaseInteractor');
const {
  sealDocketEntryInteractor,
} = require('../../shared/src/business/useCases/docketEntry/sealDocketEntryInteractor');
const {
  sendMaintenanceNotificationsInteractor,
} = require('../../shared/src/business/useCases/maintenance/sendMaintenanceNotificationsInteractor');
const {
  serveCaseToIrsInteractor,
} = require('../../shared/src/business/useCases/serveCaseToIrs/serveCaseToIrsInteractor');
const {
  serveCourtIssuedDocumentInteractor,
} = require('../../shared/src/business/useCases/courtIssuedDocument/serveCourtIssuedDocumentInteractor');
const {
  serveExternallyFiledDocumentInteractor,
} = require('../../shared/src/business/useCases/document/serveExternallyFiledDocumentInteractor');
const {
  setForHearingInteractor,
} = require('../../shared/src/business/useCases/trialSessions/setForHearingInteractor');
const {
  setMessageAsReadInteractor,
} = require('../../shared/src/business/useCases/messages/setMessageAsReadInteractor');
const {
  setNoticesForCalendaredTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/setNoticesForCalendaredTrialSessionInteractor');
const {
  setTrialSessionAsSwingSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/setTrialSessionAsSwingSessionInteractor');
const {
  setTrialSessionCalendarInteractor,
} = require('../../shared/src/business/useCases/trialSessions/setTrialSessionCalendarInteractor');
const {
  setUserEmailFromPendingEmailInteractor,
} = require('../../shared/src/business/useCases/users/setUserEmailFromPendingEmailInteractor');
const {
  setWorkItemAsReadInteractor,
} = require('../../shared/src/business/useCases/workitems/setWorkItemAsReadInteractor');
const {
  strikeDocketEntryInteractor,
} = require('../../shared/src/business/useCases/docketEntry/strikeDocketEntryInteractor');
const {
  submitCaseAssociationRequestInteractor,
} = require('../../shared/src/business/useCases/caseAssociationRequest/submitCaseAssociationRequestInteractor');
const {
  submitPendingCaseAssociationRequestInteractor,
} = require('../../shared/src/business/useCases/caseAssociationRequest/submitPendingCaseAssociationRequestInteractor');
const {
  unblockCaseFromTrialInteractor,
} = require('../../shared/src/business/useCases/unblockCaseFromTrialInteractor');
const {
  unprioritizeCaseInteractor,
} = require('../../shared/src/business/useCases/unprioritizeCaseInteractor');
const {
  unsealCaseInteractor,
} = require('../../shared/src/business/useCases/unsealCaseInteractor');
const {
  unsealDocketEntryInteractor,
} = require('../../shared/src/business/useCases/docketEntry/unsealDocketEntryInteractor');
const {
  updateCaseContextInteractor,
} = require('../../shared/src/business/useCases/updateCaseContextInteractor');
const {
  updateCaseDeadlineInteractor,
} = require('../../shared/src/business/useCases/caseDeadline/updateCaseDeadlineInteractor');
const {
  updateCaseDetailsInteractor,
} = require('../../shared/src/business/useCases/updateCaseDetailsInteractor');
const {
  updateCaseTrialSortTagsInteractor,
} = require('../../shared/src/business/useCases/updateCaseTrialSortTagsInteractor');
const {
  updateContactInteractor,
} = require('../../shared/src/business/useCases/updateContactInteractor');
const {
  updateCorrespondenceDocumentInteractor,
} = require('../../shared/src/business/useCases/correspondence/updateCorrespondenceDocumentInteractor');
const {
  updateCounselOnCaseInteractor,
} = require('../../shared/src/business/useCases/caseAssociation/updateCounselOnCaseInteractor');
const {
  updateCourtIssuedDocketEntryInteractor,
} = require('../../shared/src/business/useCases/docketEntry/updateCourtIssuedDocketEntryInteractor');
const {
  updateCourtIssuedOrderInteractor,
} = require('../../shared/src/business/useCases/courtIssuedOrder/updateCourtIssuedOrderInteractor');
const {
  updateDeficiencyStatisticInteractor,
} = require('../../shared/src/business/useCases/caseStatistics/updateDeficiencyStatisticInteractor');
const {
  updateDocketEntryMetaInteractor,
} = require('../../shared/src/business/useCases/docketEntry/updateDocketEntryMetaInteractor');
const {
  updateOtherStatisticsInteractor,
} = require('../../shared/src/business/useCases/caseStatistics/updateOtherStatisticsInteractor');
const {
  updatePetitionerCasesInteractor,
} = require('../../shared/src/business/useCases/users/updatePetitionerCasesInteractor');
const {
  updatePetitionerInformationInteractor,
} = require('../../shared/src/business/useCases/updatePetitionerInformationInteractor');
const {
  updatePractitionerUserInteractor,
} = require('../../shared/src/business/useCases/practitioners/updatePractitionerUserInteractor');
const {
  updateQcCompleteForTrialInteractor,
} = require('../../shared/src/business/useCases/updateQcCompleteForTrialInteractor');
const {
  updateTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/updateTrialSessionInteractor');
const {
  updateTrialSessionWorkingCopyInteractor,
} = require('../../shared/src/business/useCases/trialSessions/updateTrialSessionWorkingCopyInteractor');
const {
  updateUserCaseNoteInteractor,
} = require('../../shared/src/business/useCases/caseNote/updateUserCaseNoteInteractor');
const {
  updateUserContactInformationInteractor,
} = require('../../shared/src/business/useCases/users/updateUserContactInformationInteractor');
const {
  updateUserPendingEmailInteractor,
} = require('../../shared/src/business/useCases/users/updateUserPendingEmailInteractor');
const {
  validatePdfInteractor,
} = require('../../shared/src/business/useCases/pdf/validatePdfInteractor');
const {
  verifyPendingCaseForUserInteractor,
} = require('../../shared/src/business/useCases/caseAssociationRequest/verifyPendingCaseForUserInteractor');
const {
  verifyUserPendingEmailInteractor,
} = require('../../shared/src/business/useCases/users/verifyUserPendingEmailInteractor');
const {
  virusScanPdfInteractor,
} = require('../../shared/src/business/useCases/pdf/virusScanPdfInteractor');

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
  checkEmailAvailabilityInteractor,
  checkForReadyForTrialCasesInteractor,
  closeTrialSessionInteractor,
  completeDocketEntryQCInteractor,
  completeMessageInteractor,
  completeWorkItemInteractor,
  createCaseDeadlineInteractor,
  createCaseFromPaperInteractor,
  createCaseInteractor,
  createCourtIssuedOrderPdfFromHtmlInteractor,
  createMessageInteractor,
  createPetitionerAccountInteractor,
  createPractitionerDocumentInteractor,
  createPractitionerUserInteractor,
  createTrialSessionInteractor,
  createUserInteractor,
  deleteCaseDeadlineInteractor,
  deleteCaseNoteInteractor,
  deleteCounselFromCaseInteractor,
  deleteDeficiencyStatisticInteractor,
  deletePractitionerDocumentInteractor,
  deleteTrialSessionInteractor,
  deleteUserCaseNoteInteractor,
  editPaperFilingInteractor,
  editPractitionerDocumentInteractor,
  fetchPendingItemsInteractor,
  fileAndServeCourtIssuedDocumentInteractor,
  fileCorrespondenceDocumentInteractor,
  fileCourtIssuedDocketEntryInteractor,
  fileCourtIssuedOrderInteractor,
  fileExternalDocumentForConsolidatedInteractor,
  fileExternalDocumentInteractor,
  forwardMessageInteractor,
  generateDocketRecordPdfInteractor,
  generateDraftStampOrderInteractor,
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
  getBlockedCasesInteractor,
  getCalendaredCasesForTrialSessionInteractor,
  getCaseDeadlinesForCaseInteractor,
  getCaseDeadlinesInteractor,
  getCaseExistsInteractor,
  getCaseForPublicDocketSearchInteractor,
  getCaseInteractor,
  getCaseInventoryReportInteractor,
  getCasesForUserInteractor,
  getCompletedMessagesForSectionInteractor,
  getCompletedMessagesForUserInteractor,
  getConsolidatedCasesByCaseInteractor,
  getDocumentContentsForDocketEntryInteractor,
  getDocumentQCInboxForSectionInteractor,
  getDocumentQCInboxForUserInteractor,
  getDocumentQCServedForSectionInteractor,
  getDocumentQCServedForUserInteractor,
  getDownloadPolicyUrlInteractor,
  getEligibleCasesForTrialSessionInteractor,
  getFeatureFlagValueInteractor,
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
  setForHearingInteractor,
  setMessageAsReadInteractor,
  setNoticesForCalendaredTrialSessionInteractor,
  setTrialSessionAsSwingSessionInteractor,
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
