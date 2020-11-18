/* eslint-disable security/detect-object-injection, security/detect-child-process, spellcheck/spell-checker */
const AWS = require('aws-sdk');
const axios = require('axios');
const barNumberGenerator = require('../../shared/src/persistence/dynamo/users/barNumberGenerator');
const connectionClass = require('http-aws-es');
const docketNumberGenerator = require('../../shared/src/persistence/dynamo/cases/docketNumberGenerator');
const elasticsearch = require('elasticsearch');
const Honeybadger = require('honeybadger');
const pdfLib = require('pdf-lib');
const util = require('util');
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
  addressLabelCoverSheet,
  caseInventoryReport,
  changeOfAddress,
  coverSheet,
  docketRecord,
  noticeOfDocketChange,
  noticeOfReceiptOfPetition,
  noticeOfTrialIssued,
  order,
  pendingReport,
  receiptOfFiling,
  standingPretrialNotice,
  standingPretrialOrder,
  trialCalendar,
  trialSessionPlanningReport,
} = require('../../shared/src/business/utilities/documentGenerators');
const {
  addServedStampToDocument,
} = require('../../shared/src/business/useCases/courtIssuedDocument/addServedStampToDocument');
const {
  addWorkItemToSectionInbox,
} = require('../../shared/src/persistence/dynamo/workitems/addWorkItemToSectionInbox');
const {
  advancedDocumentSearch,
} = require('../../shared/src/persistence/elasticsearch/advancedDocumentSearch');
const {
  appendPaperServiceAddressPageToPdf,
} = require('../../shared/src/business/useCaseHelper/service/appendPaperServiceAddressPageToPdf');
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
  bulkDeleteRecords,
} = require('../../shared/src/persistence/elasticsearch/bulkDeleteRecords');
const {
  bulkIndexRecords,
} = require('../../shared/src/persistence/elasticsearch/bulkIndexRecords');
const {
  CASE_STATUS_TYPES,
  MAX_SEARCH_RESULTS,
  SESSION_STATUS_GROUPS,
} = require('../../shared/src/business/entities/EntityConstants');
const {
  caseAdvancedSearch,
} = require('../../shared/src/persistence/elasticsearch/caseAdvancedSearch');
const {
  caseAdvancedSearchInteractor,
} = require('../../shared/src/business/useCases/caseAdvancedSearchInteractor');
const {
  casePublicSearch: casePublicSearchPersistence,
} = require('../../shared/src/persistence/elasticsearch/casePublicSearch');
const {
  casePublicSearchInteractor,
} = require('../../shared/src/business/useCases/public/casePublicSearchInteractor');
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
  completeMessageInteractor,
} = require('../../shared/src/business/useCases/messages/completeMessageInteractor');
const {
  completeWorkItemInteractor,
} = require('../../shared/src/business/useCases/workitems/completeWorkItemInteractor');
const {
  countPagesInDocument,
} = require('../../shared/src/business/useCaseHelper/countPagesInDocument');
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
  createMessage,
} = require('../../shared/src/persistence/dynamo/messages/createMessage');
const {
  createMessageInteractor,
} = require('../../shared/src/business/useCases/messages/createMessageInteractor');
const {
  createMigratedPetitionerUser,
} = require('../../shared/src/persistence/dynamo/users/createMigratedPetitionerUser');
const {
  createPetitionerAccountInteractor,
} = require('../../shared/src/business/useCases/users/createPetitionerAccountInteractor');
const {
  createPractitionerUser,
} = require('../../shared/src/persistence/dynamo/users/createPractitionerUser');
const {
  createPractitionerUserInteractor,
} = require('../../shared/src/business/useCases/practitioners/createPractitionerUserInteractor');
const {
  createSectionInboxRecord,
} = require('../../shared/src/persistence/dynamo/workitems/createSectionInboxRecord');
const {
  createTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/createTrialSession');
const {
  createTrialSessionAndWorkingCopy,
} = require('../../shared/src/business/useCaseHelper/trialSessions/createTrialSessionAndWorkingCopy');
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
  deleteCaseByDocketNumber,
} = require('../../shared/src/persistence/dynamo/cases/deleteCaseByDocketNumber');
const {
  deleteCaseDeadline,
} = require('../../shared/src/persistence/dynamo/caseDeadlines/deleteCaseDeadline');
const {
  deleteCaseDeadlineInteractor,
} = require('../../shared/src/business/useCases/caseDeadline/deleteCaseDeadlineInteractor');
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
  deleteDeficiencyStatisticInteractor,
} = require('../../shared/src/business/useCases/caseStatistics/deleteDeficiencyStatisticInteractor');
const {
  deleteDocketEntry,
} = require('../../shared/src/persistence/dynamo/documents/deleteDocketEntry');
const {
  deleteDocumentFromS3,
} = require('../../shared/src/persistence/s3/deleteDocumentFromS3');
const {
  deleteRecord,
} = require('../../shared/src/persistence/elasticsearch/deleteRecord');
const {
  deleteSectionOutboxRecord,
} = require('../../shared/src/persistence/dynamo/workitems/deleteSectionOutboxRecord');
const {
  deleteTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/deleteTrialSession');
const {
  deleteTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/deleteTrialSessionInteractor');
const {
  deleteTrialSessionWorkingCopy,
} = require('../../shared/src/persistence/dynamo/trialSessions/deleteTrialSessionWorkingCopy');
const {
  deleteUserCaseNote,
} = require('../../shared/src/persistence/dynamo/userCaseNotes/deleteUserCaseNote');
const {
  deleteUserCaseNoteInteractor,
} = require('../../shared/src/business/useCases/caseNote/deleteUserCaseNoteInteractor');
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
  DocketEntry,
} = require('../../shared/src/business/entities/DocketEntry');
const {
  documentUrlTranslator,
} = require('../../shared/src/business/utilities/documentUrlTranslator');
const {
  fetchPendingItems,
} = require('../../shared/src/business/useCaseHelper/pendingItems/fetchPendingItems');
const {
  fetchPendingItems: fetchPendingItemsPersistence,
} = require('../../shared/src/persistence/elasticsearch/fetchPendingItems');
const {
  fetchPendingItemsByDocketNumber,
} = require('../../shared/src/business/useCaseHelper/pendingItems/fetchPendingItemsByDocketNumber');
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
  fileDocketEntryInteractor,
} = require('../../shared/src/business/useCases/docketEntry/fileDocketEntryInteractor');
const {
  fileExternalDocumentForConsolidatedInteractor,
} = require('../../shared/src/business/useCases/externalDocument/fileExternalDocumentForConsolidatedInteractor');
const {
  fileExternalDocumentInteractor,
} = require('../../shared/src/business/useCases/externalDocument/fileExternalDocumentInteractor');
const {
  filterQcItemsByAssociatedJudge,
} = require('../../shared/src/business/utilities/filterQcItemsByAssociatedJudge');
const {
  filterWorkItemsForUser,
} = require('../../shared/src/business/utilities/filterWorkItemsForUser');
const {
  formatAndSortConsolidatedCases,
} = require('../../shared/src/business/useCaseHelper/consolidatedCases/formatAndSortConsolidatedCases');
const {
  formatJudgeName,
} = require('../../shared/src/business/utilities/getFormattedJudgeName');
const {
  forwardMessageInteractor,
} = require('../../shared/src/business/useCases/messages/forwardMessageInteractor');
const {
  generateCaseInventoryReportPdf,
} = require('../../shared/src/business/useCaseHelper/caseInventoryReport/generateCaseInventoryReportPdf');
const {
  generateDocketRecordPdfInteractor,
} = require('../../shared/src/business/useCases/generateDocketRecordPdfInteractor');
const {
  generateNoticeOfTrialIssuedInteractor,
} = require('../../shared/src/business/useCases/trialSessions/generateNoticeOfTrialIssuedInteractor');
const {
  generateNoticeOfTrialIssuedTemplate,
} = require('../../shared/src/business/utilities/generateHTMLTemplateForPDF/');
const {
  generatePdfFromHtmlInteractor,
} = require('../../shared/src/business/useCases/generatePdfFromHtmlInteractor');
const {
  generatePDFFromJPGDataInteractor,
} = require('../../shared/src/business/useCases/generatePDFFromJPGDataInteractor');
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
  generateStandingPretrialNoticeInteractor,
} = require('../../shared/src/business/useCases/trialSessions/generateStandingPretrialNoticeInteractor');
const {
  generateStandingPretrialOrderInteractor,
} = require('../../shared/src/business/useCases/trialSessions/generateStandingPretrialOrderInteractor');
const {
  generateTrialCalendarPdfInteractor,
} = require('../../shared/src/business/useCases/trialSessions/generateTrialCalendarPdfInteractor');
const {
  getAddressPhoneDiff,
  getDocumentTypeForAddressChange,
} = require('../../shared/src/business/utilities/generateChangeOfAddressTemplate');
const {
  getBlockedCases,
} = require('../../shared/src/persistence/elasticsearch/getBlockedCases');
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
  getCaseByDocketNumber,
} = require('../../shared/src/persistence/dynamo/cases/getCaseByDocketNumber');
const {
  getCaseDeadlinesByDateRange,
} = require('../../shared/src/persistence/elasticsearch/caseDeadlines/getCaseDeadlinesByDateRange');
const {
  getCaseDeadlinesByDocketNumber,
} = require('../../shared/src/persistence/dynamo/caseDeadlines/getCaseDeadlinesByDocketNumber');
const {
  getCaseDeadlinesForCaseInteractor,
} = require('../../shared/src/business/useCases/caseDeadline/getCaseDeadlinesForCaseInteractor');
const {
  getCaseDeadlinesInteractor,
} = require('../../shared/src/business/useCases/getCaseDeadlinesInteractor');
const {
  getCaseForPublicDocketSearchInteractor,
} = require('../../shared/src/business/useCases/public/getCaseForPublicDocketSearchInteractor');
const {
  getCaseInteractor,
} = require('../../shared/src/business/useCases/getCaseInteractor');
const {
  getCaseInventoryReport,
} = require('../../shared/src/persistence/elasticsearch/getCaseInventoryReport');
const {
  getCaseInventoryReportInteractor,
} = require('../../shared/src/business/useCases/caseInventoryReport/getCaseInventoryReportInteractor');
const {
  getCasesByDocketNumbers,
} = require('../../shared/src/persistence/dynamo/cases/getCasesByDocketNumbers');
const {
  getCasesByLeadDocketNumber,
} = require('../../shared/src/persistence/dynamo/cases/getCasesByLeadDocketNumber');
const {
  getCasesByUserId,
} = require('../../shared/src/persistence/elasticsearch/getCasesByUserId');
const {
  getChromiumBrowser,
} = require('../../shared/src/business/utilities/getChromiumBrowser');
const {
  getClientId,
} = require('../../shared/src/persistence/cognito/getClientId');
const {
  getClosedCasesInteractor,
} = require('../../shared/src/business/useCases/getClosedCasesInteractor');
const {
  getCompletedMessagesForSectionInteractor,
} = require('../../shared/src/business/useCases/messages/getCompletedMessagesForSectionInteractor');
const {
  getCompletedMessagesForUserInteractor,
} = require('../../shared/src/business/useCases/messages/getCompletedMessagesForUserInteractor');
const {
  getCompletedSectionInboxMessages,
} = require('../../shared/src/persistence/elasticsearch/messages/getCompletedSectionInboxMessages');
const {
  getCompletedUserInboxMessages,
} = require('../../shared/src/persistence/elasticsearch/messages/getCompletedUserInboxMessages');
const {
  getConsolidatedCasesByCaseInteractor,
} = require('../../shared/src/business/useCases/getConsolidatedCasesByCaseInteractor');
const {
  getConsolidatedCasesForLeadCase,
} = require('../../shared/src/business/useCaseHelper/consolidatedCases/getConsolidatedCasesForLeadCase');
const {
  getDeployTableStatus,
} = require('../../shared/src/persistence/dynamo/getDeployTableStatus');
const {
  getDocketNumbersByUser,
} = require('../../shared/src/persistence/dynamo/cases/getDocketNumbersByUser');
const {
  getDocQcSectionForUser,
  getWorkQueueFilters,
} = require('../../shared/src/business/utilities/getWorkQueueFilters');
const {
  getDocumentQCInboxForSection,
} = require('../../shared/src/persistence/elasticsearch/workitems/getDocumentQCInboxForSection');
const {
  getDocumentQCInboxForSectionInteractor,
} = require('../../shared/src/business/useCases/workitems/getDocumentQCInboxForSectionInteractor');
const {
  getDocumentQCInboxForUser,
} = require('../../shared/src/persistence/elasticsearch/workitems/getDocumentQCInboxForUser');
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
  getFirstSingleCaseRecord,
} = require('../../shared/src/persistence/elasticsearch/getFirstSingleCaseRecord');
const {
  getFormattedCaseDetail,
} = require('../../shared/src/business/utilities/getFormattedCaseDetail');
const {
  getFullCaseByDocketNumber,
} = require('../../shared/src/persistence/dynamo/cases/getFullCaseByDocketNumber');
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
  getIndexedCasesForUser,
} = require('../../shared/src/persistence/elasticsearch/getIndexedCasesForUser');
const {
  getInternalUsers,
} = require('../../shared/src/persistence/dynamo/users/getInternalUsers');
const {
  getInternalUsersInteractor,
} = require('../../shared/src/business/useCases/users/getInternalUsersInteractor');
const {
  getIrsPractitionersBySearchKeyInteractor,
} = require('../../shared/src/business/useCases/users/getIrsPractitionersBySearchKeyInteractor');
const {
  getJudgeForUserChambersInteractor,
} = require('../../shared/src/business/useCases/users/getJudgeForUserChambersInteractor');
const {
  getJudgesForPublicSearchInteractor,
} = require('../../shared/src/business/useCases/public/getJudgesForPublicSearchInteractor');
const {
  getMessagesByDocketNumber,
} = require('../../shared/src/persistence/dynamo/messages/getMessagesByDocketNumber');
const {
  getMessagesForCaseInteractor,
} = require('../../shared/src/business/useCases/messages/getMessagesForCaseInteractor');
const {
  getMessageThreadByParentId,
} = require('../../shared/src/persistence/dynamo/messages/getMessageThreadByParentId');
const {
  getMessageThreadInteractor,
} = require('../../shared/src/business/useCases/messages/getMessageThreadInteractor');
const {
  getNotificationsInteractor,
} = require('../../shared/src/business/useCases/getNotificationsInteractor');
const {
  getOpenConsolidatedCasesInteractor,
} = require('../../shared/src/business/useCases/getOpenConsolidatedCasesInteractor');
const {
  getOutboxMessagesForSectionInteractor,
} = require('../../shared/src/business/useCases/messages/getOutboxMessagesForSectionInteractor');
const {
  getOutboxMessagesForUserInteractor,
} = require('../../shared/src/business/useCases/messages/getOutboxMessagesForUserInteractor');
const {
  getPractitionerByBarNumber,
} = require('../../shared/src/persistence/dynamo/users/getPractitionerByBarNumber');
const {
  getPractitionerByBarNumberInteractor,
} = require('../../shared/src/business/useCases/practitioners/getPractitionerByBarNumberInteractor');
const {
  getPractitionersByName,
} = require('../../shared/src/persistence/elasticsearch/getPractitionersByName');
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
  getPublicDownloadPolicyUrl,
} = require('../../shared/src/persistence/s3/getPublicDownloadPolicyUrl');
const {
  getPublicDownloadPolicyUrlInteractor,
} = require('../../shared/src/business/useCases/public/getPublicDownloadPolicyUrlInteractor');
const {
  getReadyForTrialCases,
} = require('../../shared/src/persistence/elasticsearch/getReadyForTrialCases');
const {
  getSectionInboxMessages,
} = require('../../shared/src/persistence/elasticsearch/messages/getSectionInboxMessages');
const {
  getSectionOutboxMessages,
} = require('../../shared/src/persistence/elasticsearch/messages/getSectionOutboxMessages');
const {
  getSesStatus,
} = require('../../shared/src/persistence/ses/getSesStatus');
const {
  getTableStatus,
} = require('../../shared/src/persistence/dynamo/getTableStatus');
const {
  getTodaysOpinionsInteractor,
} = require('../../shared/src/business/useCases/public/getTodaysOpinionsInteractor');
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
  getUnassociatedLeadCase,
} = require('../../shared/src/business/useCaseHelper/consolidatedCases/getUnassociatedLeadCase');
const {
  getUploadPolicy,
} = require('../../shared/src/persistence/s3/getUploadPolicy');
const {
  getUploadPolicyInteractor,
} = require('../../shared/src/business/useCases/getUploadPolicyInteractor');
const {
  getUserByEmail,
} = require('../../shared/src/persistence/dynamo/users/getUserByEmail');
const {
  getUserById,
} = require('../../shared/src/persistence/dynamo/users/getUserById');
const {
  getUserByIdInteractor,
} = require('../../shared/src/business/useCases/getUserByIdInteractor');
const {
  getUserCaseNote,
} = require('../../shared/src/persistence/dynamo/userCaseNotes/getUserCaseNote');
const {
  getUserCaseNoteForCases,
} = require('../../shared/src/persistence/dynamo/userCaseNotes/getUserCaseNoteForCases');
const {
  getUserCaseNoteForCasesInteractor,
} = require('../../shared/src/business/useCases/caseNote/getUserCaseNoteForCasesInteractor');
const {
  getUserCaseNoteInteractor,
} = require('../../shared/src/business/useCases/caseNote/getUserCaseNoteInteractor');
const {
  getUserInboxMessages,
} = require('../../shared/src/persistence/elasticsearch/messages/getUserInboxMessages');
const {
  getUserInteractor,
} = require('../../shared/src/business/useCases/getUserInteractor');
const {
  getUserOutboxMessages,
} = require('../../shared/src/persistence/elasticsearch/messages/getUserOutboxMessages');
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
  IrsPractitioner,
} = require('../../shared/src/business/entities/IrsPractitioner');
const {
  isAuthorized,
} = require('../../shared/src/authorization/authorizationClientService');
const {
  isFileExists,
} = require('../../shared/src/persistence/s3/isFileExists');
const {
  markMessageThreadRepliedTo,
} = require('../../shared/src/persistence/dynamo/messages/markMessageThreadRepliedTo');
const {
  migrateCaseDeadlineInteractor,
} = require('../../shared/src/business/useCases/migrateCaseDeadlineInteractor');
const {
  migrateCaseInteractor,
} = require('../../shared/src/business/useCases/migrateCaseInteractor');
const {
  migrateTrialSessionInteractor,
} = require('../../shared/src/business/useCases/migrateTrialSessionInteractor');
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
  ORDER_TYPES,
} = require('../../shared/src/business/entities/EntityConstants');
const {
  orderAdvancedSearchInteractor,
} = require('../../shared/src/business/useCases/orderAdvancedSearchInteractor');
const {
  orderPublicSearchInteractor,
} = require('../../shared/src/business/useCases/public/orderPublicSearchInteractor');
const {
  parseAndScrapePdfContents,
} = require('../../shared/src/business/useCaseHelper/pdf/parseAndScrapePdfContents');
const {
  parseLegacyDocumentsInteractor,
} = require('../../shared/src/business/useCases/migration/parseLegacyDocumentsInteractor');
const {
  persistUser,
} = require('../../shared/src/persistence/dynamo/users/persistUser');
const {
  Practitioner,
} = require('../../shared/src/business/entities/Practitioner');
const {
  prioritizeCaseInteractor,
} = require('../../shared/src/business/useCases/prioritizeCaseInteractor');
const {
  PrivatePractitioner,
} = require('../../shared/src/business/entities/PrivatePractitioner');
const {
  processStreamRecordsInteractor,
} = require('../../shared/src/business/useCases/processStreamRecordsInteractor');
const {
  processUserAssociatedCases,
} = require('../../shared/src/business/useCaseHelper/consolidatedCases/processUserAssociatedCases');
const {
  putWorkItemInOutbox,
} = require('../../shared/src/persistence/dynamo/workitems/putWorkItemInOutbox');
const {
  putWorkItemInUsersOutbox,
} = require('../../shared/src/persistence/dynamo/workitems/putWorkItemInUsersOutbox');
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
  removeSignatureFromDocumentInteractor,
} = require('../../shared/src/business/useCases/removeSignatureFromDocumentInteractor');
const {
  replyToMessageInteractor,
} = require('../../shared/src/business/useCases/messages/replyToMessageInteractor');
const {
  runTrialSessionPlanningReportInteractor,
} = require('../../shared/src/business/useCases/trialSessions/runTrialSessionPlanningReportInteractor');
const {
  saveCaseDetailInternalEditInteractor,
} = require('../../shared/src/business/useCases/saveCaseDetailInternalEditInteractor');
const {
  saveCaseNoteInteractor,
} = require('../../shared/src/business/useCases/caseNote/saveCaseNoteInteractor');
const {
  saveDocumentFromLambda,
} = require('../../shared/src/persistence/s3/saveDocumentFromLambda');
const {
  saveFileAndGenerateUrl,
} = require('../../shared/src/business/useCaseHelper/saveFileAndGenerateUrl');
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
  saveWorkItemForDocketEntryInProgress,
} = require('../../shared/src/persistence/dynamo/workitems/saveWorkItemForDocketEntryInProgress');
const {
  saveWorkItemForNonPaper,
} = require('../../shared/src/persistence/dynamo/workitems/saveWorkItemForNonPaper');
const {
  saveWorkItemForPaper,
} = require('../../shared/src/persistence/dynamo/workitems/saveWorkItemForPaper');
const {
  scrapePdfContents,
} = require('../../shared/src/business/utilities/scrapePdfContents');
const {
  sealCaseContactAddressInteractor,
} = require('../../shared/src/business/useCases/sealCaseContactAddressInteractor');
const {
  sealCaseInteractor,
} = require('../../shared/src/business/useCases/sealCaseInteractor');
const {
  sendBulkTemplatedEmail,
} = require('../../shared/src/dispatchers/ses/sendBulkTemplatedEmail');
const {
  sendIrsSuperuserPetitionEmail,
} = require('../../shared/src/business/useCaseHelper/service/sendIrsSuperuserPetitionEmail');
const {
  sendNotificationToUser,
} = require('../../shared/src/notifications/sendNotificationToUser');
const {
  sendServedPartiesEmails,
} = require('../../shared/src/business/useCaseHelper/service/sendServedPartiesEmails');
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
  setMessageAsRead,
} = require('../../shared/src/persistence/dynamo/messages/setMessageAsRead');
const {
  setMessageAsReadInteractor,
} = require('../../shared/src/business/useCases/messages/setMessageAsReadInteractor');
const {
  setNoticesForCalendaredTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/setNoticesForCalendaredTrialSessionInteractor');
const {
  setPriorityOnAllWorkItems,
} = require('../../shared/src/persistence/dynamo/workitems/setPriorityOnAllWorkItems');
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
  updateCase,
} = require('../../shared/src/persistence/dynamo/cases/updateCase');
const {
  updateCaseAutomaticBlock,
} = require('../../shared/src/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock');
const {
  updateCaseContextInteractor,
} = require('../../shared/src/business/useCases/updateCaseContextInteractor');
const {
  updateCaseCorrespondence,
} = require('../../shared/src/persistence/dynamo/correspondence/updateCaseCorrespondence');
const {
  updateCaseDeadlineInteractor,
} = require('../../shared/src/business/useCases/caseDeadline/updateCaseDeadlineInteractor');
const {
  updateCaseTrialSortMappingRecords,
} = require('../../shared/src/persistence/dynamo/cases/updateCaseTrialSortMappingRecords');
const {
  updateCaseTrialSortTagsInteractor,
} = require('../../shared/src/business/useCases/updateCaseTrialSortTagsInteractor');
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
  updateDocketEntry,
} = require('../../shared/src/persistence/dynamo/documents/updateDocketEntry');
const {
  updateDocketEntryInteractor,
} = require('../../shared/src/business/useCases/docketEntry/updateDocketEntryInteractor');
const {
  updateDocketEntryMetaInteractor,
} = require('../../shared/src/business/useCases/docketEntry/updateDocketEntryMetaInteractor');
const {
  updateDocketEntryProcessingStatus,
} = require('../../shared/src/persistence/dynamo/documents/updateDocketEntryProcessingStatus');
const {
  updateHighPriorityCaseTrialSortMappingRecords,
} = require('../../shared/src/persistence/dynamo/cases/updateHighPriorityCaseTrialSortMappingRecords');
const {
  updateInitialFilingDocuments,
} = require('../../shared/src/business/useCaseHelper/initialFilingDocuments/updateInitialFilingDocuments');
const {
  updateMessage,
} = require('../../shared/src/persistence/dynamo/messages/updateMessage');
const {
  updateOtherStatisticsInteractor,
} = require('../../shared/src/business/useCases/caseStatistics/updateOtherStatisticsInteractor');
const {
  updatePetitionDetailsInteractor,
} = require('../../shared/src/business/useCases/updatePetitionDetailsInteractor');
const {
  updatePetitionerInformationInteractor,
} = require('../../shared/src/business/useCases/updatePetitionerInformationInteractor');
const {
  updatePractitionerUser,
} = require('../../shared/src/persistence/dynamo/users/updatePractitionerUser');
const {
  updatePractitionerUserInteractor,
} = require('../../shared/src/business/useCases/practitioners/updatePractitionerUserInteractor');
const {
  updatePrimaryContactInteractor,
} = require('../../shared/src/business/useCases/updatePrimaryContactInteractor');
const {
  updateQcCompleteForTrialInteractor,
} = require('../../shared/src/business/useCases/updateQcCompleteForTrialInteractor');
const {
  updateSecondaryContactInteractor,
} = require('../../shared/src/business/useCases/updateSecondaryContactInteractor');
const {
  updateTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/updateTrialSession');
const {
  updateTrialSessionInteractor,
} = require('../../shared/src/business/useCases/trialSessions/updateTrialSessionInteractor');
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
  updateUserCaseNote,
} = require('../../shared/src/persistence/dynamo/userCaseNotes/updateUserCaseNote');
const {
  updateUserCaseNoteInteractor,
} = require('../../shared/src/business/useCases/caseNote/updateUserCaseNoteInteractor');
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
  userIsAssociated,
} = require('../../shared/src/business/useCases/caseAssociation/userIsAssociatedInteractor');
const {
  validatePdfInteractor,
} = require('../../shared/src/business/useCases/pdf/validatePdfInteractor');
const {
  verifyCaseForUser,
} = require('../../shared/src/persistence/dynamo/cases/verifyCaseForUser');
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
const { createLogger } = require('../../shared/src/utilities/createLogger');
const { exec } = require('child_process');
const { getDocument } = require('../../shared/src/persistence/s3/getDocument');
const { getUniqueId } = require('../../shared/src/sharedAppContext.js');
const { User } = require('../../shared/src/business/entities/User');
const { v4: uuidv4 } = require('uuid');

// increase the timeout for zip uploads to S3
AWS.config.httpOptions.timeout = 300000;

const {
  CognitoIdentityServiceProvider,
  DynamoDB,
  EnvironmentCredentials,
  S3,
  SES,
  SQS,
} = AWS;
const execPromise = util.promisify(exec);

const environment = {
  appEndpoint: process.env.EFCMS_DOMAIN
    ? `app.${process.env.EFCMS_DOMAIN}`
    : 'localhost:1234',
  currentColor: process.env.CURRENT_COLOR || 'green',
  documentsBucketName: process.env.DOCUMENTS_BUCKET_NAME || '',
  dynamoDbEndpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME,
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

const initHoneybadger = () => {
  if (process.env.NODE_ENV === 'production') {
    const apiKey = process.env.CIRCLE_HONEYBADGER_API_KEY;
    if (apiKey) {
      const config = {
        apiKey,
        environment: 'api',
      };
      Honeybadger.configure(config);
      return Honeybadger;
    }
  }
};

const getDocumentClient = ({ useMasterRegion = false } = {}) => {
  const type = useMasterRegion ? 'master' : 'region';
  if (!dynamoClientCache[type]) {
    dynamoClientCache[type] = new DynamoDB.DocumentClient({
      endpoint: useMasterRegion
        ? environment.masterDynamoDbEndpoint
        : environment.dynamoDbEndpoint,
      region: useMasterRegion ? environment.masterRegion : environment.region,
    });
  }
  return dynamoClientCache[type];
};

const getDynamoClient = ({ useMasterRegion = false } = {}) => {
  const type = useMasterRegion ? 'master' : 'region';
  if (!dynamoCache[type]) {
    dynamoCache[type] = new DynamoDB({
      endpoint: useMasterRegion
        ? environment.masterDynamoDbEndpoint
        : environment.dynamoDbEndpoint,
      region: useMasterRegion ? environment.masterRegion : environment.region,
    });
  }
  return dynamoCache[type];
};

let dynamoClientCache = {};
let dynamoCache = {};
let s3Cache;
let sesCache;
let searchClientCache;

const entitiesByName = {
  Case,
  DocketEntry,
  IrsPractitioner,
  Practitioner,
  PrivatePractitioner,
  User,
};

const isValidatedDecorator = persistenceGatewayMethods => {
  /**
   * Decorates the function to verify any entities passed have the isValid flag.
   * Should be used whenever a persistence method might be called by an interactor via lambda
   * when an entity's complete record is being created or updated.
   *
   * @returns {Function} the original methods decorated
   */
  function decorate(method) {
    return function () {
      const argumentsAsArray = Array.prototype.slice.call(arguments);

      argumentsAsArray.forEach(argument => {
        Object.keys(argument).forEach(key => {
          if (
            argument[key] &&
            argument[key].entityName &&
            !argument[key].isValidated
          ) {
            throw new Error(
              `a entity of type ${argument[key].entityName} was not validated before passed to a persistence gateway method`,
            );
          }
        });
      });
      return method.apply(null, argumentsAsArray);
    };
  }

  Object.keys(persistenceGatewayMethods).forEach(key => {
    persistenceGatewayMethods[key] = decorate(persistenceGatewayMethods[key]);
  });
  return persistenceGatewayMethods;
};

const gatewayMethods = {
  ...isValidatedDecorator({
    addWorkItemToSectionInbox,
    associateUserWithCase,
    associateUserWithCasePending,
    bulkDeleteRecords,
    bulkIndexRecords,
    createCase,
    createCaseCatalogRecord,
    createCaseDeadline,
    createCaseTrialSortMappingRecords,
    createMessage,
    createMigratedPetitionerUser,
    createPractitionerUser,
    createSectionInboxRecord,
    createTrialSession,
    createTrialSessionWorkingCopy,
    createUser,
    createUserInboxRecord,
    fetchPendingItems: fetchPendingItemsPersistence,
    getFullCaseByDocketNumber,
    getSesStatus,
    incrementCounter,
    markMessageThreadRepliedTo,
    persistUser,
    putWorkItemInOutbox,
    putWorkItemInUsersOutbox,
    saveDocumentFromLambda,
    saveUserConnection,
    saveWorkItemForDocketClerkFilingExternalDocument,
    saveWorkItemForDocketEntryInProgress,
    saveWorkItemForNonPaper,
    saveWorkItemForPaper,
    setMessageAsRead,
    setPriorityOnAllWorkItems,
    setWorkItemAsRead,
    updateCase,
    updateCaseTrialSortMappingRecords,
    updateDocketEntry,
    updateDocketEntryProcessingStatus,
    updateHighPriorityCaseTrialSortMappingRecords,
    updateMessage,
    updatePractitionerUser,
    updateTrialSession,
    updateTrialSessionWorkingCopy,
    updateUser,
    updateUserCaseNote,
    updateWorkItem,
    updateWorkItemInCase,
  }),
  // methods below are not known to create "entity" records
  advancedDocumentSearch,
  caseAdvancedSearch,
  casePublicSearch: casePublicSearchPersistence,
  deleteCaseByDocketNumber,
  deleteCaseDeadline,
  deleteCaseTrialSortMappingRecords,
  deleteDocketEntry,
  deleteDocumentFromS3,
  deleteRecord,
  deleteSectionOutboxRecord,
  deleteTrialSession,
  deleteTrialSessionWorkingCopy,
  deleteUserCaseNote,
  deleteUserConnection,
  deleteUserFromCase,
  deleteUserOutboxRecord,
  deleteWorkItemFromInbox,
  deleteWorkItemFromSection,
  getBlockedCases,
  getCalendaredCasesForTrialSession,
  getCaseByDocketNumber,
  getCaseDeadlinesByDateRange,
  getCaseDeadlinesByDocketNumber,
  getCaseInventoryReport,
  getCasesByDocketNumbers,
  getCasesByLeadDocketNumber,
  getCasesByUserId,
  getClientId,
  getCompletedSectionInboxMessages,
  getCompletedUserInboxMessages,
  getDeployTableStatus,
  getDocketNumbersByUser,
  getDocument,
  getDocumentQCInboxForSection,
  getDocumentQCInboxForUser,
  getDocumentQCServedForSection,
  getDocumentQCServedForUser,
  getDownloadPolicyUrl,
  getEligibleCasesForTrialCity,
  getEligibleCasesForTrialSession,
  getFirstSingleCaseRecord,
  getIndexedCasesForUser,
  getInternalUsers,
  getMessageThreadByParentId,
  getMessagesByDocketNumber,
  getPractitionerByBarNumber,
  getPractitionersByName,
  getPublicDownloadPolicyUrl,
  getReadyForTrialCases,
  getSectionInboxMessages,
  getSectionOutboxMessages,
  getTableStatus,
  getTrialSessionById,
  getTrialSessionWorkingCopy,
  getTrialSessions,
  getUploadPolicy,
  getUserByEmail,
  getUserById,
  getUserCaseNote,
  getUserCaseNoteForCases,
  getUserInboxMessages,
  getUserOutboxMessages,
  getUsersBySearchKey,
  getUsersInSection,
  getWebSocketConnectionByConnectionId,
  getWebSocketConnectionsByUserId,
  getWorkItemById,
  isFileExists,
  updateCaseCorrespondence,
  verifyCaseForUser,
  verifyPendingCaseForUser,
  zipDocuments,
};

module.exports = (appContextUser, logger = createLogger()) => {
  let user;

  if (appContextUser) {
    user = new User(appContextUser);
  }

  const getCurrentUser = () => {
    return user;
  };

  if (process.env.NODE_ENV === 'production') {
    const authenticated = user && Object.keys(user).length;
    logger.defaultMeta = logger.defaultMeta || {};
    logger.defaultMeta.user = authenticated
      ? user
      : { role: 'unauthenticated' };
  }

  return {
    barNumberGenerator,
    docketNumberGenerator,
    documentUrlTranslator,
    environment,
    getAppEndpoint: () => {
      return environment.appEndpoint;
    },
    getCaseTitle: Case.getCaseTitle,
    getChromiumBrowser,
    getCognito: () => {
      if (environment.stage === 'local') {
        return {
          adminCreateUser: () => ({
            promise: () => ({
              User: {
                Username: uuidv4(),
              },
            }),
          }),
          adminDisableUser: () => ({
            promise: () => {},
          }),
          adminGetUser: ({ Username }) => ({
            promise: () => ({
              Username,
            }),
          }),
          adminUpdateUserAttributes: () => ({
            promise: () => {},
          }),
        };
      } else {
        return new CognitoIdentityServiceProvider({
          region: 'us-east-1',
        });
      }
    },
    getConstants: () => ({
      CASE_INVENTORY_MAX_PAGE_SIZE: 20000, // the Chief Judge will have ~15k records, so setting to 20k to be safe
      MAX_SEARCH_RESULTS,
      OPEN_CASE_STATUSES: Object.values(CASE_STATUS_TYPES).filter(
        status => status !== CASE_STATUS_TYPES.closed,
      ),
      ORDER_TYPES_MAP: ORDER_TYPES,
      PENDING_ITEMS_PAGE_SIZE: 100,
      SESSION_STATUS_GROUPS,
    }),
    getCurrentUser,
    getDispatchers: () => ({
      sendBulkTemplatedEmail,
    }),
    getDocumentClient,
    getDocumentGenerators: () => ({
      addressLabelCoverSheet,
      caseInventoryReport,
      changeOfAddress,
      coverSheet,
      docketRecord,
      noticeOfDocketChange,
      noticeOfReceiptOfPetition,
      noticeOfTrialIssued,
      order,
      pendingReport,
      receiptOfFiling,
      standingPretrialNotice,
      standingPretrialOrder,
      trialCalendar,
      trialSessionPlanningReport,
    }),
    getDocumentsBucketName: () => {
      return environment.documentsBucketName;
    },
    getDynamoClient,
    getEmailClient: () => {
      if (process.env.CI || process.env.DISABLE_EMAILS === 'true') {
        return {
          getSendStatistics: () => {
            // mock this out so the health checks pass on smoketests
            return {
              promise: async () => ({
                SendDataPoints: [
                  {
                    Rejects: 0,
                  },
                ],
              }),
            };
          },
          sendBulkTemplatedEmail: params => {
            return {
              promise: () =>
                Promise.all(
                  params.Destinations.map(Destination => {
                    const address = Destination.Destination.ToAddresses[0];
                    const template = Destination.ReplacementTemplateData;
                    return getDocumentClient()
                      .put({
                        Item: {
                          pk: `email-${address}`,
                          sk: getUniqueId(),
                          template,
                        },
                        TableName: process.env.DYNAMODB_TABLE_NAME,
                      })
                      .promise();
                  }),
                ),
            };
          },
        };
      } else {
        if (!sesCache) {
          sesCache = new SES({
            region: 'us-east-1',
          });
        }
        return sesCache;
      }
    },
    getEntityByName: name => {
      return entitiesByName[name];
    },
    getHttpClient: () => axios,
    getIrsSuperuserEmail: () => process.env.IRS_SUPERUSER_EMAIL,
    getMigrations: () => ({
      migrateCaseDeadlineInteractor,
      migrateCaseInteractor,
      migrateTrialSessionInteractor,
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
        httpOptions: {
          timeout: 900000, // 15 minutes
        },
      });
    },
    getNotificationGateway: () => ({
      sendNotificationToUser,
    }),
    getPdfJs: async () => {
      const pdfjsLib = require('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

      return pdfjsLib;
    },
    getPdfLib: () => {
      return pdfLib;
    },
    getPersistenceGateway: () => {
      return gatewayMethods;
    },
    getPersistencePrivateKeys: () => ['pk', 'sk', 'gsi1pk'],
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
    getQueueService: () => {
      if (environment.stage === 'local') {
        return {
          sendMessage: () => ({ promise: () => {} }),
        };
      } else {
        return new SQS({ apiVersion: '2012-11-05', region: 'us-east-1' });
      }
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
            apiVersion: '7.4',
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
    getTemplateGenerators: () => {
      return {
        generateNoticeOfTrialIssuedTemplate,
      };
    },
    getUniqueId,
    getUseCaseHelpers: () => {
      return {
        addServedStampToDocument,
        appendPaperServiceAddressPageToPdf,
        countPagesInDocument,
        createTrialSessionAndWorkingCopy,
        fetchPendingItems,
        fetchPendingItemsByDocketNumber,
        formatAndSortConsolidatedCases,
        generateCaseInventoryReportPdf,
        getCaseInventoryReport,
        getConsolidatedCasesForLeadCase,
        getUnassociatedLeadCase,
        parseAndScrapePdfContents,
        processUserAssociatedCases,
        saveFileAndGenerateUrl,
        sendIrsSuperuserPetitionEmail,
        sendServedPartiesEmails,
        updateCaseAutomaticBlock,
        updateInitialFilingDocuments,
      };
    },
    getUseCases: () => {
      return {
        addCaseToTrialSessionInteractor,
        addConsolidatedCaseInteractor,
        addCoversheetInteractor,
        addDeficiencyStatisticInteractor,
        archiveCorrespondenceDocumentInteractor,
        archiveDraftDocumentInteractor,
        assignWorkItemsInteractor,
        associateIrsPractitionerWithCaseInteractor,
        associatePrivatePractitionerWithCaseInteractor,
        batchDownloadTrialSessionInteractor,
        blockCaseFromTrialInteractor,
        caseAdvancedSearchInteractor,
        casePublicSearchInteractor,
        checkForReadyForTrialCasesInteractor,
        completeDocketEntryQCInteractor,
        completeMessageInteractor,
        completeWorkItemInteractor,
        createCaseDeadlineInteractor,
        createCaseFromPaperInteractor,
        createCaseInteractor,
        createCourtIssuedOrderPdfFromHtmlInteractor,
        createMessageInteractor,
        createPetitionerAccountInteractor,
        createPractitionerUserInteractor,
        createTrialSessionInteractor,
        createUserInteractor,
        deleteCaseDeadlineInteractor,
        deleteCaseNoteInteractor,
        deleteCounselFromCaseInteractor,
        deleteDeficiencyStatisticInteractor,
        deleteTrialSessionInteractor,
        deleteUserCaseNoteInteractor,
        fetchPendingItemsInteractor,
        fileAndServeCourtIssuedDocumentInteractor,
        fileCorrespondenceDocumentInteractor,
        fileCourtIssuedDocketEntryInteractor,
        fileCourtIssuedOrderInteractor,
        fileDocketEntryInteractor,
        fileExternalDocumentForConsolidatedInteractor,
        fileExternalDocumentInteractor,
        forwardMessageInteractor,
        generateDocketRecordPdfInteractor,
        generateNoticeOfTrialIssuedInteractor,
        generatePDFFromJPGDataInteractor,
        generatePdfFromHtmlInteractor,
        generatePrintableCaseInventoryReportInteractor,
        generatePrintableFilingReceiptInteractor,
        generatePrintablePendingReportInteractor,
        generateStandingPretrialNoticeInteractor,
        generateStandingPretrialOrderInteractor,
        generateTrialCalendarPdfInteractor,
        getBlockedCasesInteractor,
        getCalendaredCasesForTrialSessionInteractor,
        getCaseDeadlinesForCaseInteractor,
        getCaseDeadlinesInteractor,
        getCaseForPublicDocketSearchInteractor,
        getCaseInteractor,
        getCaseInventoryReportInteractor,
        getClosedCasesInteractor,
        getCompletedMessagesForSectionInteractor,
        getCompletedMessagesForUserInteractor,
        getConsolidatedCasesByCaseInteractor,
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
        getJudgeForUserChambersInteractor,
        getJudgesForPublicSearchInteractor,
        getMessageThreadInteractor,
        getMessagesForCaseInteractor,
        getNotificationsInteractor,
        getOpenConsolidatedCasesInteractor,
        getOutboxMessagesForSectionInteractor,
        getOutboxMessagesForUserInteractor,
        getPractitionerByBarNumberInteractor,
        getPractitionersByNameInteractor,
        getPrivatePractitionersBySearchKeyInteractor,
        getPublicCaseInteractor,
        getPublicDownloadPolicyUrlInteractor,
        getTodaysOpinionsInteractor,
        getTrialSessionDetailsInteractor,
        getTrialSessionWorkingCopyInteractor,
        getTrialSessionsInteractor,
        getUploadPolicyInteractor,
        getUserByIdInteractor,
        getUserCaseNoteForCasesInteractor,
        getUserCaseNoteInteractor,
        getUserInteractor,
        getUsersInSectionInteractor,
        getWorkItemInteractor,
        onConnectInteractor,
        onDisconnectInteractor,
        opinionAdvancedSearchInteractor,
        opinionPublicSearchInteractor,
        orderAdvancedSearchInteractor,
        orderPublicSearchInteractor,
        parseLegacyDocumentsInteractor,
        prioritizeCaseInteractor,
        processStreamRecordsInteractor,
        removeCaseFromTrialInteractor,
        removeCasePendingItemInteractor,
        removeConsolidatedCasesInteractor,
        removePdfFromDocketEntryInteractor,
        removeSignatureFromDocumentInteractor,
        replyToMessageInteractor,
        runTrialSessionPlanningReportInteractor,
        saveCaseDetailInternalEditInteractor,
        saveCaseNoteInteractor,
        saveSignedDocumentInteractor,
        sealCaseContactAddressInteractor,
        sealCaseInteractor,
        serveCaseToIrsInteractor,
        serveCourtIssuedDocumentInteractor,
        serveExternallyFiledDocumentInteractor,
        setMessageAsReadInteractor,
        setNoticesForCalendaredTrialSessionInteractor,
        setTrialSessionAsSwingSessionInteractor,
        setTrialSessionCalendarInteractor,
        setWorkItemAsReadInteractor,
        strikeDocketEntryInteractor,
        submitCaseAssociationRequestInteractor,
        submitPendingCaseAssociationRequestInteractor,
        unblockCaseFromTrialInteractor,
        unprioritizeCaseInteractor,
        updateCaseContextInteractor,
        updateCaseDeadlineInteractor,
        updateCaseTrialSortTagsInteractor,
        updateCorrespondenceDocumentInteractor,
        updateCounselOnCaseInteractor,
        updateCourtIssuedDocketEntryInteractor,
        updateCourtIssuedOrderInteractor,
        updateDeficiencyStatisticInteractor,
        updateDocketEntryInteractor,
        updateDocketEntryMetaInteractor,
        updateOtherStatisticsInteractor,
        updatePetitionDetailsInteractor,
        updatePetitionerInformationInteractor,
        updatePractitionerUserInteractor,
        updatePrimaryContactInteractor,
        updateQcCompleteForTrialInteractor,
        updateSecondaryContactInteractor,
        updateTrialSessionInteractor,
        updateTrialSessionWorkingCopyInteractor,
        updateUserCaseNoteInteractor,
        updateUserContactInformationInteractor,
        userIsAssociated,
        validatePdfInteractor,
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
        filterQcItemsByAssociatedJudge,
        filterWorkItemsForUser,
        formatCaseForTrialSession,
        formatDateString,
        formatJudgeName,
        formatNow,
        formattedTrialSessionDetails,
        getAddressPhoneDiff,
        getDocQcSectionForUser,
        getDocumentTypeForAddressChange,
        getFormattedCaseDetail,
        getWorkQueueFilters,
        prepareDateFromString,
        scrapePdfContents,
        setServiceIndicatorsForCase,
      };
    },
    initHoneybadger,
    isAuthorized,
    logger: {
      debug: logger.debug.bind(logger),
      error: logger.error.bind(logger),
      info: logger.info.bind(logger),
    },
    notifyHoneybadger: async (message, context) => {
      const honeybadger = initHoneybadger();

      const notifyAsync = messageForNotification => {
        return new Promise(resolve => {
          honeybadger.notify(messageForNotification, null, null, resolve);
        });
      };

      if (honeybadger) {
        const { role, userId } = getCurrentUser() || {};

        const errorContext = {
          role,
          userId,
        };

        if (context) {
          Object.assign(errorContext, context);
        }

        honeybadger.setContext(errorContext);

        await notifyAsync(message);
      }
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
