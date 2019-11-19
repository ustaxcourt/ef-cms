/* eslint-disable security/detect-object-injection, security/detect-child-process, spellcheck/spell-checker */
// const AWSXRay = require('aws-xray-sdk');
//
// const AWS =
//   process.env.NODE_ENV === 'production'
//     ? AWSXRay.captureAWS(require('aws-sdk'))
//     : require('aws-sdk');

const AWS = require('aws-sdk');

// ^ must come first --------------------

const connectionClass = require('http-aws-es');
const docketNumberGenerator = require('../../shared/src/persistence/dynamo/cases/docketNumberGenerator');
const elasticsearch = require('elasticsearch');
const util = require('util');
const uuidv4 = require('uuid/v4');
const {
  addCaseToTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/addCaseToTrialSessionInteractor');
const {
  addCoversheetInteractor,
} = require('../../shared/src/business/useCases/addCoversheetInteractor');
const {
  addWorkItemToSectionInbox,
} = require('../../shared/src/persistence/dynamo/workitems/addWorkItemToSectionInbox');
const {
  archiveDraftDocumentInteractor,
} = require('../../shared/src/business/useCases/archiveDraftDocumentInteractor');
const {
  assignWorkItemsInteractor,
} = require('../../shared/src/business/useCases/workitems/assignWorkItemsInteractor');
const {
  associatePractitionerWithCaseInteractor,
} = require('../../shared/src/business/useCases/manualAssociation/associatePractitionerWithCaseInteractor');
const {
  associateRespondentWithCaseInteractor,
} = require('../../shared/src/business/useCases/manualAssociation/associateRespondentWithCaseInteractor');
const {
  associateUserWithCase,
} = require('../../shared/src/persistence/dynamo/cases/associateUserWithCase');
const {
  associateUserWithCasePending,
} = require('../../shared/src/persistence/dynamo/cases/associateUserWithCasePending');
const {
  batchDownloadTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/batchDownloadTrialSessionInteractor');
const {
  blockCaseFromTrialInteractor,
} = require('../../shared/src/business/useCases/blockCaseFromTrialInteractor');
const {
  CaseExternalIncomplete,
} = require('../../shared/src/business/entities/cases/CaseExternalIncomplete');
const {
  CaseInternal,
} = require('../../shared/src/business/entities/cases/CaseInternal');
const {
  CaseSearch,
} = require('../../shared/src/business/entities/cases/CaseSearch');
const {
  caseSearchInteractor,
} = require('../../shared/src/business/useCases/caseSearchInteractor');
const {
  checkForReadyForTrialCasesInteractor,
} = require('../../shared/src/business/useCases/checkForReadyForTrialCasesInteractor');
const {
  compareCasesByDocketNumber,
  formatCase: formatCaseForTrialSession,
  formattedTrialSessionDetails,
} = require('../../shared/src/business/utilities/getFormattedTrialSessionDetails');
const {
  compareISODateStrings,
  compareStrings,
} = require('../../shared/src/business/utilities/sortFunctions');
const {
  completeDocketEntryQCInteractor,
} = require('../../shared/src/business/useCases/editDocketEntry/completeDocketEntryQCInteractor');
const {
  completeWorkItemInteractor,
} = require('../../shared/src/business/useCases/workitems/completeWorkItemInteractor');
const {
  createCase,
} = require('../../shared/src/persistence/dynamo/cases/createCase');
const {
  createCaseCatalogRecord,
} = require('../../shared/src/persistence/dynamo/cases/createCaseCatalogRecord');
const {
  createCaseDeadline,
} = require('../../shared/src/persistence/dynamo/caseDeadlines/createCaseDeadline');
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
  createCaseNote,
} = require('../../shared/src/persistence/dynamo/caseNotes/createCaseNote');
const {
  createCaseNoteInteractor,
} = require('../../shared/src/business/useCases/caseNote/createCaseNoteInteractor');
const {
  createCaseTrialSortMappingRecords,
} = require('../../shared/src/persistence/dynamo/cases/createCaseTrialSortMappingRecords');
const {
  createCourtIssuedOrderPdfFromHtmlInteractor,
} = require('../../shared/src/business/useCases/courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlInteractor');
const {
  createISODateString,
  formatDateString,
  formatNow,
  prepareDateFromString,
} = require('../../shared/src/business/utilities/DateHandler');
const {
  createSectionInboxRecord,
} = require('../../shared/src/persistence/dynamo/workitems/createSectionInboxRecord');
const {
  createTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/createTrialSession');
const {
  createTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/createTrialSessionInteractor');
const {
  createTrialSessionWorkingCopy,
} = require('../../shared/src/persistence/dynamo/trialSessions/createTrialSessionWorkingCopy');
const {
  createUser,
} = require('../../shared/src/persistence/dynamo/users/createUser');
const {
  createUserInboxRecord,
} = require('../../shared/src/persistence/dynamo/workitems/createUserInboxRecord');
const {
  createUserInteractor,
} = require('../../shared/src/business/useCases/users/createUserInteractor');
const {
  createWorkItem,
} = require('../../shared/src/persistence/dynamo/workitems/createWorkItem');
const {
  createWorkItemInteractor,
} = require('../../shared/src/business/useCases/workitems/createWorkItemInteractor');
const {
  deleteCaseDeadline,
} = require('../../shared/src/persistence/dynamo/caseDeadlines/deleteCaseDeadline');
const {
  deleteCaseDeadlineInteractor,
} = require('../../shared/src/business/useCases/caseDeadline/deleteCaseDeadlineInteractor');
const {
  deleteCaseNote,
} = require('../../shared/src/persistence/dynamo/caseNotes/deleteCaseNote');
const {
  deleteCaseNoteInteractor,
} = require('../../shared/src/business/useCases/caseNote/deleteCaseNoteInteractor');
const {
  deleteCaseTrialSortMappingRecords,
} = require('../../shared/src/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords');
const {
  deleteCounselFromCaseInteractor,
} = require('../../shared/src/business/useCases/caseAssociation/deleteCounselFromCaseInteractor');
const {
  deleteDocument,
} = require('../../shared/src/persistence/s3/deleteDocument');
const {
  deleteSectionOutboxRecord,
} = require('../../shared/src/persistence/dynamo/workitems/deleteSectionOutboxRecord');
const {
  deleteUserConnection,
} = require('../../shared/src/persistence/dynamo/notifications/deleteUserConnection');
const {
  deleteUserFromCase,
} = require('../../shared/src/persistence/dynamo/cases/deleteUserFromCase');
const {
  deleteUserOutboxRecord,
} = require('../../shared/src/persistence/dynamo/workitems/deleteUserOutboxRecord');
const {
  deleteWorkItemFromInbox,
} = require('../../shared/src/persistence/dynamo/workitems/deleteWorkItemFromInbox');
const {
  deleteWorkItemFromSection,
} = require('../../shared/src/persistence/dynamo/workitems/deleteWorkItemFromSection');
const {
  fetchPendingItems,
} = require('../../shared/src/business/useCaseHelper/pendingItems/fetchPendingItems');
const {
  fetchPendingItemsInteractor,
} = require('../../shared/src/business/useCases/pendingItems/fetchPendingItemsInteractor');
const {
  fileCourtIssuedDocketEntryInteractor,
} = require('../../shared/src/business/useCases/docketEntry/fileCourtIssuedDocketEntryInteractor');
const {
  fileCourtIssuedOrderInteractor,
} = require('../../shared/src/business/useCases/courtIssuedOrder/fileCourtIssuedOrderInteractor');
const {
  fileDocketEntryInteractor,
} = require('../../shared/src/business/useCases/docketEntry/fileDocketEntryInteractor');
const {
  fileExternalDocumentInteractor,
} = require('../../shared/src/business/useCases/externalDocument/fileExternalDocumentInteractor');
const {
  forwardWorkItemInteractor,
} = require('../../shared/src/business/useCases/workitems/forwardWorkItemInteractor');
const {
  generateCaseConfirmationPdf,
} = require('../../shared/src/business/useCaseHelper/caseConfirmation/generateCaseConfirmationPdf');
const {
  generateChangeOfAddressTemplate,
  generateHTMLTemplateForPDF,
  generatePrintableDocketRecordTemplate,
  generatePrintableFilingReceiptTemplate,
  generateTrialCalendarTemplate,
  generateTrialSessionPlanningReportTemplate,
} = require('../../shared/src/business/utilities/generateHTMLTemplateForPDF');
const {
  generateDocketRecordPdfInteractor,
} = require('../../shared/src/business/useCases/generateDocketRecordPdfInteractor');
const {
  generatePdfFromHtmlInteractor,
} = require('../../shared/src/business/useCases/generatePdfFromHtmlInteractor');
const {
  generatePDFFromJPGDataInteractor,
} = require('../../shared/src/business/useCases/generatePDFFromJPGDataInteractor');
const {
  generatePendingReportPdf,
} = require('../../shared/src/business/useCaseHelper/pendingReport/generatePendingReportPdf');
const {
  generatePrintableFilingReceiptInteractor,
} = require('../../shared/src/business/useCases/generatePrintableFilingReceiptInteractor');
const {
  generatePrintablePendingReportInteractor,
} = require('../../shared/src/business/useCases/pendingItems/generatePrintablePendingReportInteractor');
const {
  generateTrialCalendarPdfInteractor,
} = require('../../shared/src/business/useCases/trialSessions/generateTrialCalendarPdfInteractor');
const {
  getAllCaseDeadlines,
} = require('../../shared/src/persistence/dynamo/caseDeadlines/getAllCaseDeadlines');
const {
  getAllCaseDeadlinesInteractor,
} = require('../../shared/src/business/useCases/caseDeadline/getAllCaseDeadlinesInteractor');
const {
  getAllCatalogCases,
} = require('../../shared/src/persistence/dynamo/cases/getAllCatalogCases');
const {
  getBlockedCasesInteractor,
} = require('../../shared/src/business/useCases/getBlockedCasesInteractor');
const {
  getCalendaredCasesForTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/getCalendaredCasesForTrialSession');
const {
  getCalendaredCasesForTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/getCalendaredCasesForTrialSessionInteractor');
const {
  getCaseByCaseId,
} = require('../../shared/src/persistence/dynamo/cases/getCaseByCaseId');
const {
  getCaseByDocketNumber,
} = require('../../shared/src/persistence/dynamo/cases/getCaseByDocketNumber');
const {
  getCaseDeadlinesByCaseId,
} = require('../../shared/src/persistence/dynamo/caseDeadlines/getCaseDeadlinesByCaseId');
const {
  getCaseDeadlinesForCaseInteractor,
} = require('../../shared/src/business/useCases/caseDeadline/getCaseDeadlinesForCaseInteractor');
const {
  getCaseInteractor,
} = require('../../shared/src/business/useCases/getCaseInteractor');
const {
  getCaseNote,
} = require('../../shared/src/persistence/dynamo/caseNotes/getCaseNote');
const {
  getCaseNoteInteractor,
} = require('../../shared/src/business/useCases/caseNote/getCaseNoteInteractor');
const {
  getCasesByUser,
} = require('../../shared/src/persistence/dynamo/cases/getCasesByUser');
const {
  getCasesByUserInteractor,
} = require('../../shared/src/business/useCases/getCasesByUserInteractor');
const {
  getDocumentQCBatchedForSection,
} = require('../../shared/src/persistence/dynamo/workitems/getDocumentQCBatchedForSection');
const {
  getDocumentQCBatchedForSectionInteractor,
} = require('../../shared/src/business/useCases/workitems/getDocumentQCBatchedForSectionInteractor');
const {
  getDocumentQCBatchedForUser,
} = require('../../shared/src/persistence/dynamo/workitems/getDocumentQCBatchedForUser');
const {
  getDocumentQCBatchedForUserInteractor,
} = require('../../shared/src/business/useCases/workitems/getDocumentQCBatchedForUserInteractor');
const {
  getDocumentQCInboxForSection,
} = require('../../shared/src/persistence/dynamo/workitems/getDocumentQCInboxForSection');
const {
  getDocumentQCInboxForSectionInteractor,
} = require('../../shared/src/business/useCases/workitems/getDocumentQCInboxForSectionInteractor');
const {
  getDocumentQCInboxForUser,
} = require('../../shared/src/persistence/dynamo/workitems/getDocumentQCInboxForUser');
const {
  getDocumentQCInboxForUserInteractor,
} = require('../../shared/src/business/useCases/workitems/getDocumentQCInboxForUserInteractor');
const {
  getDocumentQCServedForSection,
} = require('../../shared/src/persistence/dynamo/workitems/getDocumentQCServedForSection');
const {
  getDocumentQCServedForSectionInteractor,
} = require('../../shared/src/business/useCases/workitems/getDocumentQCServedForSectionInteractor');
const {
  getDocumentQCServedForUser,
} = require('../../shared/src/persistence/dynamo/workitems/getDocumentQCServedForUser');
const {
  getDocumentQCServedForUserInteractor,
} = require('../../shared/src/business/useCases/workitems/getDocumentQCServedForUserInteractor');
const {
  getDocumentTypeForAddressChange,
} = require('../../shared/src/business/utilities/generateChangeOfAddressTemplate');
const {
  getDownloadPolicyUrl,
} = require('../../shared/src/persistence/s3/getDownloadPolicyUrl');
const {
  getDownloadPolicyUrlInteractor,
} = require('../../shared/src/business/useCases/getDownloadPolicyUrlInteractor');
const {
  getEligibleCasesForTrialCity,
} = require('../../shared/src/persistence/dynamo/trialSessions/getEligibleCasesForTrialCity');
const {
  getEligibleCasesForTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/getEligibleCasesForTrialSession');
const {
  getEligibleCasesForTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/getEligibleCasesForTrialSessionInteractor');
const {
  getFormattedCaseDetail,
} = require('../../shared/src/business/utilities/getFormattedCaseDetail');
const {
  getInboxMessagesForSection,
} = require('../../shared/src/persistence/dynamo/workitems/getInboxMessagesForSection');
const {
  getInboxMessagesForSectionInteractor,
} = require('../../shared/src/business/useCases/workitems/getInboxMessagesForSectionInteractor');
const {
  getInboxMessagesForUser,
} = require('../../shared/src/persistence/dynamo/workitems/getInboxMessagesForUser');
const {
  getInboxMessagesForUserInteractor,
} = require('../../shared/src/business/useCases/workitems/getInboxMessagesForUserInteractor');
const {
  getInternalUsers,
} = require('../../shared/src/persistence/dynamo/users/getInternalUsers');
const {
  getInternalUsersInteractor,
} = require('../../shared/src/business/useCases/users/getInternalUsersInteractor');
const {
  getJudgeForUserChambersInteractor,
} = require('../../shared/src/business/useCases/users/getJudgeForUserChambersInteractor');
const {
  getNotificationsInteractor,
} = require('../../shared/src/business/useCases/getNotificationsInteractor');
const {
  getPractitionersBySearchKeyInteractor,
} = require('../../shared/src/business/useCases/users/getPractitionersBySearchKeyInteractor');
const {
  getRespondentsBySearchKeyInteractor,
} = require('../../shared/src/business/useCases/users/getRespondentsBySearchKeyInteractor');
const {
  getSentMessagesForSection,
} = require('../../shared/src/persistence/dynamo/workitems/getSentMessagesForSection');
const {
  getSentMessagesForSectionInteractor,
} = require('../../shared/src/business/useCases/workitems/getSentMessagesForSectionInteractor');
const {
  getSentMessagesForUser,
} = require('../../shared/src/persistence/dynamo/workitems/getSentMessagesForUser');
const {
  getSentMessagesForUserInteractor,
} = require('../../shared/src/business/useCases/workitems/getSentMessagesForUserInteractor');
const {
  getTrialSessionById,
} = require('../../shared/src/persistence/dynamo/trialSessions/getTrialSessionById');
const {
  getTrialSessionDetailsInteractor,
} = require('../../shared/src/business/useCases/trialSessions/getTrialSessionDetailsInteractor');
const {
  getTrialSessions,
} = require('../../shared/src/persistence/dynamo/trialSessions/getTrialSessions');
const {
  getTrialSessionsInteractor,
} = require('../../shared/src/business/useCases/trialSessions/getTrialSessionsInteractor');
const {
  getTrialSessionWorkingCopy,
} = require('../../shared/src/persistence/dynamo/trialSessions/getTrialSessionWorkingCopy');
const {
  getTrialSessionWorkingCopyInteractor,
} = require('../../shared/src/business/useCases/trialSessions/getTrialSessionWorkingCopyInteractor');
const {
  getUploadPolicy,
} = require('../../shared/src/persistence/s3/getUploadPolicy');
const {
  getUploadPolicyInteractor,
} = require('../../shared/src/business/useCases/getUploadPolicyInteractor');
const {
  getUserById,
} = require('../../shared/src/persistence/dynamo/users/getUserById');
const {
  getUserInteractor,
} = require('../../shared/src/business/useCases/getUserInteractor');
const {
  getUsersBySearchKey,
} = require('../../shared/src/persistence/dynamo/users/getUsersBySearchKey');
const {
  getUsersInSection,
} = require('../../shared/src/persistence/dynamo/users/getUsersInSection');
const {
  getUsersInSectionInteractor,
} = require('../../shared/src/business/useCases/users/getUsersInSectionInteractor');
const {
  getWebSocketConnectionByConnectionId,
} = require('../../shared/src/persistence/dynamo/notifications/getWebSocketConnectionByConnectionId');
const {
  getWebSocketConnectionsByUserId,
} = require('../../shared/src/persistence/dynamo/notifications/getWebSocketConnectionsByUserId');
const {
  getWorkItemById,
} = require('../../shared/src/persistence/dynamo/workitems/getWorkItemById');
const {
  getWorkItemInteractor,
} = require('../../shared/src/business/useCases/workitems/getWorkItemInteractor');
const {
  incrementCounter,
} = require('../../shared/src/persistence/dynamo/helpers/incrementCounter');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../shared/src/authorization/authorizationClientService');
const {
  isFileExists,
} = require('../../shared/src/persistence/s3/isFileExists');
const {
  onConnectInteractor,
} = require('../../shared/src/business/useCases/notifications/onConnectInteractor');
const {
  onDisconnectInteractor,
} = require('../../shared/src/business/useCases/notifications/onDisconnectInteractor');
const {
  prioritizeCaseInteractor,
} = require('../../shared/src/business/useCases/prioritizeCaseInteractor');
const {
  processStreamRecordsInteractor,
} = require('../../shared/src/business/useCases/processStreamRecordsInteractor');
const {
  putWorkItemInOutbox,
} = require('../../shared/src/persistence/dynamo/workitems/putWorkItemInOutbox');
const {
  putWorkItemInUsersOutbox,
} = require('../../shared/src/persistence/dynamo/workitems/putWorkItemInUsersOutbox');
const {
  recallPetitionFromIRSHoldingQueueInteractor,
} = require('../../shared/src/business/useCases/recallPetitionFromIRSHoldingQueueInteractor');
const {
  removeCaseFromTrialInteractor,
} = require('../../shared/src/business/useCases/trialSessions/removeCaseFromTrialInteractor');
const {
  runBatchProcessInteractor,
} = require('../../shared/src/business/useCases/runBatchProcessInteractor');
const {
  runTrialSessionPlanningReportInteractor,
} = require('../../shared/src/business/useCases/trialSessions/runTrialSessionPlanningReportInteractor');
const {
  saveCaseDetailInternalEditInteractor,
} = require('../../shared/src/business/useCases/saveCaseDetailInternalEditInteractor');
const {
  saveDocument,
} = require('../../shared/src/persistence/s3/saveDocument');
const {
  saveIntermediateDocketEntryInteractor,
} = require('../../shared/src/business/useCases/editDocketEntry/saveIntermediateDocketEntryInteractor');
const {
  saveSignedDocumentInteractor,
} = require('../../shared/src/business/useCases/saveSignedDocumentInteractor');
const {
  saveUserConnection,
} = require('../../shared/src/persistence/dynamo/notifications/saveUserConnection');
const {
  saveWorkItemForDocketClerkFilingExternalDocument,
} = require('../../shared/src/persistence/dynamo/workitems/saveWorkItemForDocketClerkFilingExternalDocument');
const {
  saveWorkItemForDocketEntryWithoutFile,
} = require('../../shared/src/persistence/dynamo/workitems/saveWorkItemForDocketEntryWithoutFile');
const {
  saveWorkItemForNonPaper,
} = require('../../shared/src/persistence/dynamo/workitems/saveWorkItemForNonPaper');
const {
  saveWorkItemForPaper,
} = require('../../shared/src/persistence/dynamo/workitems/saveWorkItemForPaper');
const {
  sendBulkTemplatedEmail,
} = require('../../shared/src/dispatchers/ses/sendBulkTemplatedEmail');
const {
  sendNotificationToUser,
} = require('../../shared/src/notifications/sendNotificationToUser');
const {
  sendPetitionToIRSHoldingQueueInteractor,
} = require('../../shared/src/business/useCases/sendPetitionToIRSHoldingQueueInteractor');
const {
  serveSignedStipDecisionInteractor,
} = require('../../shared/src/business/useCases/serveSignedStipDecisionInteractor');
const {
  setServiceIndicatorsForCase,
} = require('../../shared/src/business/utilities/setServiceIndicatorsForCase');
const {
  setTrialSessionAsSwingSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/setTrialSessionAsSwingSessionInteractor');
const {
  setTrialSessionCalendarInteractor,
} = require('../../shared/src/business/useCases/trialSessions/setTrialSessionCalendarInteractor');
const {
  setWorkItemAsRead,
} = require('../../shared/src/persistence/dynamo/workitems/setWorkItemAsRead');
const {
  setWorkItemAsReadInteractor,
} = require('../../shared/src/business/useCases/workitems/setWorkItemAsReadInteractor');
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
  updateCase,
} = require('../../shared/src/persistence/dynamo/cases/updateCase');
const {
  updateCaseContextInteractor,
} = require('../../shared/src/business/useCases/updateCaseContextInteractor');
const {
  updateCaseDeadline,
} = require('../../shared/src/persistence/dynamo/caseDeadlines/updateCaseDeadline');
const {
  updateCaseDeadlineInteractor,
} = require('../../shared/src/business/useCases/caseDeadline/updateCaseDeadlineInteractor');
const {
  updateCaseNote,
} = require('../../shared/src/persistence/dynamo/caseNotes/updateCaseNote');
const {
  updateCaseNoteInteractor,
} = require('../../shared/src/business/useCases/caseNote/updateCaseNoteInteractor');
const {
  updateCaseTrialSortMappingRecords,
} = require('../../shared/src/persistence/dynamo/cases/updateCaseTrialSortMappingRecords');
const {
  updateCaseTrialSortTagsInteractor,
} = require('../../shared/src/business/useCases/updateCaseTrialSortTagsInteractor');
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
  updateDocketEntryInteractor,
} = require('../../shared/src/business/useCases/docketEntry/updateDocketEntryInteractor');
const {
  updateDocumentProcessingStatus,
} = require('../../shared/src/persistence/dynamo/documents/updateDocumentProcessingStatus');
const {
  updateHighPriorityCaseTrialSortMappingRecords,
} = require('../../shared/src/persistence/dynamo/cases/updateHighPriorityCaseTrialSortMappingRecords');
const {
  updatePrimaryContactInteractor,
} = require('../../shared/src/business/useCases/updatePrimaryContactInteractor');
const {
  updateTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/updateTrialSession');
const {
  updateTrialSessionWorkingCopy,
} = require('../../shared/src/persistence/dynamo/trialSessions/updateTrialSessionWorkingCopy');
const {
  updateTrialSessionWorkingCopyInteractor,
} = require('../../shared/src/business/useCases/trialSessions/updateTrialSessionWorkingCopyInteractor');
const {
  updateUser,
} = require('../../shared/src/persistence/dynamo/users/updateUser');
const {
  updateUserContactInformationInteractor,
} = require('../../shared/src/business/useCases/users/updateUserContactInformationInteractor');
const {
  updateWorkItem,
} = require('../../shared/src/persistence/dynamo/workitems/updateWorkItem');
const {
  updateWorkItemInCase,
} = require('../../shared/src/persistence/dynamo/cases/updateWorkItemInCase');
const {
  uploadDocument,
} = require('../../shared/src/persistence/s3/uploadDocument');
const {
  userIsAssociated,
} = require('../../shared/src/business/useCases/caseAssociation/userIsAssociatedInteractor');
const {
  validatePdfInteractor,
} = require('../../shared/src/business/useCases/pdf/validatePdfInteractor');
const {
  verifyCaseForUser,
} = require('../../shared/src/persistence/dynamo/cases/verifyCaseForUser');
const {
  verifyCaseForUserInteractor,
} = require('../../shared/src/business/useCases/caseAssociationRequest/verifyCaseForUserInteractor');
const {
  verifyPendingCaseForUser,
} = require('../../shared/src/persistence/dynamo/cases/verifyPendingCaseForUser');
const {
  verifyPendingCaseForUserInteractor,
} = require('../../shared/src/business/useCases/caseAssociationRequest/verifyPendingCaseForUserInteractor');
const {
  virusScanPdfInteractor,
} = require('../../shared/src/business/useCases/pdf/virusScanPdfInteractor');
const {
  zipDocuments,
} = require('../../shared/src/persistence/s3/zipDocuments');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { exec } = require('child_process');
const { Order } = require('../../shared/src/business/entities/orders/Order');
const { User } = require('../../shared/src/business/entities/User');

// increase the timeout for zip uploads to S3
AWS.config.httpOptions.timeout = 300000;

const { DynamoDB, EnvironmentCredentials, S3, SES } = AWS;
const execPromise = util.promisify(exec);

const environment = {
  documentsBucketName: process.env.DOCUMENTS_BUCKET_NAME || '',
  dynamoDbEndpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  elasticsearchEndpoint:
    process.env.ELASTICSEARCH_ENDPOINT || 'http://localhost:9200',
  masterDynamoDbEndpoint:
    process.env.MASTER_DYNAMODB_ENDPOINT || 'dynamodb.us-east-1.amazonaws.com',
  masterRegion: process.env.MASTER_REGION || 'us-east-1',
  region: process.env.AWS_REGION || 'us-east-1',
  s3Endpoint: process.env.S3_ENDPOINT || 'localhost',
  stage: process.env.STAGE || 'local',
  tempDocumentsBucketName: process.env.TEMP_DOCUMENTS_BUCKET_NAME || '',
  wsEndpoint: process.env.WS_ENDPOINT || 'http://localhost:3011',
};

let user;
const getCurrentUser = () => {
  return user;
};
const setCurrentUser = newUser => {
  user = new User(newUser);
};

let dynamoClientCache = {};
let s3Cache;
let sesCache;
let searchClientCache;

module.exports = (appContextUser = {}) => {
  setCurrentUser(appContextUser);

  return {
    docketNumberGenerator,
    environment,
    getCaseCaptionNames: Case.getCaseCaptionNames,
    getChromium: () => {
      // Notice: this require is here to only have the lambdas that need it call it.
      // This dependency is only available on lambdas with the 'puppeteer' layer,
      // which means including it globally causes the other lambdas to fail.
      // This also needs to have the string split to cause parcel to NOT bundle this dependency,
      // which is wanted as bundling would have the dependency to not be searched for
      // and found at the layer level and would cause issues.
      // eslint-disable-next-line security/detect-non-literal-require
      const chromium = require('chrome-' + 'aws-lambda');
      return chromium;
    },
    getConstants: () => ({
      ORDER_TYPES_MAP: Order.ORDER_TYPES,
    }),
    getCurrentUser,
    getDispatchers: () => ({
      sendBulkTemplatedEmail,
    }),
    getDocumentClient: ({ useMasterRegion = false } = {}) => {
      const type = useMasterRegion ? 'master' : 'region';
      if (!dynamoClientCache[type]) {
        dynamoClientCache[type] = new DynamoDB.DocumentClient({
          endpoint: useMasterRegion
            ? environment.masterDynamoDbEndpoint
            : environment.dynamoDbEndpoint,
          region: useMasterRegion
            ? environment.masterRegion
            : environment.region,
        });
      }
      return dynamoClientCache[type];
    },
    getDocumentsBucketName: () => {
      return environment.documentsBucketName;
    },
    getEmailClient: () => {
      if (!sesCache) {
        sesCache = new SES();
      }
      return sesCache;
    },
    getEntityConstructors: () => ({
      Case,
      CaseExternal: CaseExternalIncomplete,
      CaseInternal: CaseInternal,
      CaseSearch,
    }),
    getNodeSass: () => {
      // Notice: this require is here to only have the lambdas that need it call it.
      // This dependency is only available on lambdas with the 'puppeteer' layer,
      // which means including it globally causes the other lambdas to fail.
      // This also needs to have the string split to cause parcel to NOT bundle this dependency,
      // which is wanted as bundling would have the dependency to not be searched for
      // and found at the layer level and would cause issues.
      // eslint-disable-next-line security/detect-non-literal-require
      const nodeSass = require('node-' + 'sass');
      return nodeSass;
    },
    getNotificationClient: ({ endpoint }) => {
      if (endpoint.indexOf('localhost') !== -1) {
        endpoint = 'http://localhost:3011';
      }
      return new AWS.ApiGatewayManagementApi({
        endpoint,
      });
    },
    getNotificationGateway: () => ({
      sendNotificationToUser,
    }),
    getPersistenceGateway: () => {
      return {
        addWorkItemToSectionInbox,
        associateUserWithCase,
        associateUserWithCasePending,
        createCase,
        createCaseCatalogRecord,
        createCaseDeadline,
        createCaseNote,
        createCaseTrialSortMappingRecords,
        createSectionInboxRecord,
        createTrialSession,
        createTrialSessionWorkingCopy,
        createUser,
        createUserInboxRecord,
        createWorkItem,
        deleteCaseDeadline,
        deleteCaseNote,
        deleteCaseTrialSortMappingRecords,
        deleteDocument,
        deleteSectionOutboxRecord,
        deleteUserConnection,
        deleteUserFromCase,
        deleteUserOutboxRecord,
        deleteWorkItemFromInbox,
        deleteWorkItemFromSection,
        getAllCaseDeadlines,
        getAllCatalogCases,
        getCalendaredCasesForTrialSession,
        getCaseByCaseId,
        getCaseByDocketNumber,
        getCaseDeadlinesByCaseId,
        getCaseNote,
        getCasesByUser,
        getDocumentQCBatchedForSection,
        getDocumentQCBatchedForUser,
        getDocumentQCInboxForSection,
        getDocumentQCInboxForUser,
        getDocumentQCServedForSection,
        getDocumentQCServedForUser,
        getDownloadPolicyUrl,
        getEligibleCasesForTrialCity,
        getEligibleCasesForTrialSession,
        getInboxMessagesForSection,
        getInboxMessagesForUser,
        getInternalUsers,
        getSentMessagesForSection,
        getSentMessagesForUser,
        getTrialSessionById,
        getTrialSessionWorkingCopy,
        getTrialSessions,
        getUploadPolicy,
        getUserById,
        getUsersBySearchKey,
        getUsersInSection,
        getWebSocketConnectionByConnectionId,
        getWebSocketConnectionsByUserId,
        getWorkItemById,
        incrementCounter,
        isFileExists,
        putWorkItemInOutbox,
        putWorkItemInUsersOutbox,
        saveDocument,
        saveUserConnection,
        saveWorkItemForDocketClerkFilingExternalDocument,
        saveWorkItemForDocketEntryWithoutFile,
        saveWorkItemForNonPaper,
        saveWorkItemForPaper,
        setWorkItemAsRead,
        updateCase,
        updateCaseDeadline,
        updateCaseNote,
        updateCaseTrialSortMappingRecords,
        updateDocumentProcessingStatus,
        updateHighPriorityCaseTrialSortMappingRecords,
        updateTrialSession,
        updateTrialSessionWorkingCopy,
        updateUser,
        updateWorkItem,
        updateWorkItemInCase,
        uploadDocument,
        verifyCaseForUser,
        verifyPendingCaseForUser,
        zipDocuments,
      };
    },
    getPug: () => {
      // Notice: this require is here to only have the lambdas that need it call it.
      // This dependency is only available on lambdas with the 'puppeteer' layer,
      // which means including it globally causes the other lambdas to fail.
      // This also needs to have the string split to cause parcel to NOT bundle this dependency,
      // which is wanted as bundling would have the dependency to not be searched for
      // and found at the layer level and would cause issues.
      // eslint-disable-next-line security/detect-non-literal-require
      const pug = require('p' + 'ug');
      return pug;
    },
    getSearchClient: () => {
      if (!searchClientCache) {
        if (environment.stage === 'local') {
          searchClientCache = new elasticsearch.Client({
            host: environment.elasticsearchEndpoint,
          });
        } else {
          searchClientCache = new elasticsearch.Client({
            amazonES: {
              credentials: new EnvironmentCredentials('AWS'),
              region: environment.region,
            },
            apiVersion: '7.1',
            awsConfig: new AWS.Config({ region: 'us-east-1' }),
            connectionClass: connectionClass,
            host: environment.elasticsearchEndpoint,
            log: 'warning',
            port: 443,
            protocol: 'https',
          });
        }
      }
      return searchClientCache;
    },
    getStorageClient: () => {
      if (!s3Cache) {
        s3Cache = new S3({
          endpoint: environment.s3Endpoint,
          region: 'us-east-1',
          s3ForcePathStyle: true,
        });
      }
      return s3Cache;
    },
    getTempDocumentsBucketName: () => {
      return environment.tempDocumentsBucketName;
    },
    // TODO: replace external calls to environment
    getTemplateGenerators: () => {
      return {
        generateChangeOfAddressTemplate,
        generateHTMLTemplateForPDF,
        generatePrintableDocketRecordTemplate,
        generatePrintableFilingReceiptTemplate,
        generateTrialCalendarTemplate,
        generateTrialSessionPlanningReportTemplate,
      };
    },
    getUniqueId: () => {
      return uuidv4();
    },
    getUseCaseHelpers: () => {
      return {
        fetchPendingItems,
        generateCaseConfirmationPdf,
        generatePendingReportPdf,
      };
    },
    getUseCases: () => {
      return {
        addCaseToTrialSessionInteractor,
        addCoversheetInteractor,
        archiveDraftDocumentInteractor,
        assignWorkItemsInteractor,
        associatePractitionerWithCaseInteractor,
        associateRespondentWithCaseInteractor,
        batchDownloadTrialSessionInteractor,
        blockCaseFromTrialInteractor,
        caseSearchInteractor,
        checkForReadyForTrialCasesInteractor,
        completeDocketEntryQCInteractor,
        completeWorkItemInteractor,
        createCaseDeadlineInteractor,
        createCaseFromPaperInteractor,
        createCaseInteractor,
        createCaseNoteInteractor,
        createCourtIssuedOrderPdfFromHtmlInteractor,
        createTrialSessionInteractor,
        createUserInteractor,
        createWorkItemInteractor,
        deleteCaseDeadlineInteractor,
        deleteCaseNoteInteractor,
        deleteCounselFromCaseInteractor,
        fetchPendingItemsInteractor,
        fileCourtIssuedDocketEntryInteractor,
        fileCourtIssuedOrderInteractor,
        fileDocketEntryInteractor,
        fileExternalDocumentInteractor,
        forwardWorkItemInteractor,
        generateDocketRecordPdfInteractor,
        generatePDFFromJPGDataInteractor,
        generatePdfFromHtmlInteractor,
        generatePrintableFilingReceiptInteractor,
        generatePrintablePendingReportInteractor,
        generateTrialCalendarPdfInteractor,
        getAllCaseDeadlinesInteractor,
        getBlockedCasesInteractor,
        getCalendaredCasesForTrialSessionInteractor,
        getCaseDeadlinesForCaseInteractor,
        getCaseInteractor,
        getCaseNoteInteractor,
        getCasesByUserInteractor,
        getDocumentQCBatchedForSectionInteractor,
        getDocumentQCBatchedForUserInteractor,
        getDocumentQCInboxForSectionInteractor,
        getDocumentQCInboxForUserInteractor,
        getDocumentQCServedForSectionInteractor,
        getDocumentQCServedForUserInteractor,
        getDownloadPolicyUrlInteractor,
        getEligibleCasesForTrialSessionInteractor,
        getInboxMessagesForSectionInteractor,
        getInboxMessagesForUserInteractor,
        getInternalUsersInteractor,
        getJudgeForUserChambersInteractor,
        getNotificationsInteractor,
        getPractitionersBySearchKeyInteractor,
        getRespondentsBySearchKeyInteractor,
        getSentMessagesForSectionInteractor,
        getSentMessagesForUserInteractor,
        getTrialSessionDetailsInteractor,
        getTrialSessionWorkingCopyInteractor,
        getTrialSessionsInteractor,
        getUploadPolicyInteractor,
        getUserInteractor,
        getUsersInSectionInteractor,
        getWorkItemInteractor,
        onConnectInteractor,
        onDisconnectInteractor,
        prioritizeCaseInteractor,
        processStreamRecordsInteractor,
        recallPetitionFromIRSHoldingQueueInteractor,
        removeCaseFromTrialInteractor,
        runBatchProcessInteractor,
        runTrialSessionPlanningReportInteractor,
        saveCaseDetailInternalEditInteractor,
        saveIntermediateDocketEntryInteractor,
        saveSignedDocumentInteractor,
        sendPetitionToIRSHoldingQueueInteractor,
        serveSignedStipDecisionInteractor,
        setTrialSessionAsSwingSessionInteractor,
        setTrialSessionCalendarInteractor,
        setWorkItemAsReadInteractor,
        submitCaseAssociationRequestInteractor,
        submitPendingCaseAssociationRequestInteractor,
        unblockCaseFromTrialInteractor,
        unprioritizeCaseInteractor,
        updateCaseContextInteractor,
        updateCaseDeadlineInteractor,
        updateCaseNoteInteractor,
        updateCaseTrialSortTagsInteractor,
        updateCounselOnCaseInteractor,
        updateCourtIssuedDocketEntryInteractor,
        updateCourtIssuedOrderInteractor,
        updateDocketEntryInteractor,
        updatePrimaryContactInteractor,
        updateTrialSessionWorkingCopyInteractor,
        updateUserContactInformationInteractor,
        userIsAssociated,
        validatePdfInteractor,
        verifyCaseForUserInteractor,
        verifyPendingCaseForUserInteractor,
        virusScanPdfInteractor: args =>
          process.env.SKIP_VIRUS_SCAN ? null : virusScanPdfInteractor(args),
      };
    },
    getUtilities: () => {
      return {
        compareCasesByDocketNumber,
        compareISODateStrings,
        compareStrings,
        createISODateString,
        formatCaseForTrialSession,
        formatDateString,
        formatNow,
        formattedTrialSessionDetails,
        getDocumentTypeForAddressChange,
        getFormattedCaseDetail,
        prepareDateFromString,
        setServiceIndicatorsForCase,
      };
    },
    isAuthorized,
    isAuthorizedForWorkItems: () =>
      isAuthorized(user, ROLE_PERMISSIONS.WORKITEM),
    logger: {
      error: value => {
        // eslint-disable-next-line no-console
        console.error(JSON.stringify(value));
      },
      info: (key, value) => {
        // eslint-disable-next-line no-console
        console.info(key, JSON.stringify(value));
      },
      time: key => {
        // eslint-disable-next-line no-console
        console.time(key);
      },
      timeEnd: key => {
        // eslint-disable-next-line no-console
        console.timeEnd(key);
      },
    },
    runVirusScan: async ({ filePath }) => {
      return execPromise(
        `clamscan ${
          process.env.CLAMAV_DEF_DIR ? `-d ${process.env.CLAMAV_DEF_DIR}` : ''
        } ${filePath}`,
      );
    },
  };
};
