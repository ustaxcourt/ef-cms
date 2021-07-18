/* eslint-disable max-lines */
const AWS = require('aws-sdk');
const axios = require('axios');
const barNumberGenerator = require('../../shared/src/persistence/dynamo/users/barNumberGenerator');
const connectionClass = require('http-aws-es');
const docketNumberGenerator = require('../../shared/src/persistence/dynamo/cases/docketNumberGenerator');
const elasticsearch = require('elasticsearch');
const pdfLib = require('pdf-lib');
const pug = require('pug');
const sass = require('sass');
const util = require('util');
const {
  addCaseToHearing,
} = require('../../shared/src/persistence/dynamo/trialSessions/addCaseToHearing');
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
  addExistingUserToCase,
} = require('../../shared/src/business/useCaseHelper/caseAssociation/addExistingUserToCase');
const {
  addPaperFilingInteractor,
} = require('../../shared/src/business/useCases/docketEntry/addPaperFilingInteractor');
const {
  addPetitionerToCaseInteractor,
} = require('../../shared/src/business/useCases/addPetitionerToCaseInteractor');
const {
  addressLabelCoverSheet,
} = require('../../shared/src/business/utilities/documentGenerators/addressLabelCoverSheet');
const {
  addServedStampToDocument,
} = require('../../shared/src/business/useCases/courtIssuedDocument/addServedStampToDocument');
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
  calculateISODate,
  createISODateString,
  formatDateString,
  formatNow,
  prepareDateFromString,
} = require('../../shared/src/business/utilities/DateHandler');
const {
  CASE_STATUS_TYPES,
  MAX_SEARCH_CLIENT_RESULTS,
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
  CaseDeadline,
} = require('../../shared/src/business/entities/CaseDeadline');
const {
  caseInventoryReport,
} = require('../../shared/src/business/utilities/documentGenerators/caseInventoryReport');
const {
  casePublicSearch: casePublicSearchPersistence,
} = require('../../shared/src/persistence/elasticsearch/casePublicSearch');
const {
  casePublicSearchInteractor,
} = require('../../shared/src/business/useCases/public/casePublicSearchInteractor');
const {
  changeOfAddress,
} = require('../../shared/src/business/utilities/documentGenerators/changeOfAddress');
const {
  checkEmailAvailabilityInteractor,
} = require('../../shared/src/business/useCases/users/checkEmailAvailabilityInteractor');
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
  Correspondence,
} = require('../../shared/src/business/entities/Correspondence');
const {
  countPagesInDocument,
} = require('../../shared/src/business/useCaseHelper/countPagesInDocument');
const {
  coverSheet,
} = require('../../shared/src/business/utilities/documentGenerators/coverSheet');
const {
  createCase,
} = require('../../shared/src/persistence/dynamo/cases/createCase');
const {
  createCaseAndAssociations,
} = require('../../shared/src/business/useCaseHelper/caseAssociation/createCaseAndAssociations');
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
  createMessage,
} = require('../../shared/src/persistence/dynamo/messages/createMessage');
const {
  createMessageInteractor,
} = require('../../shared/src/business/useCases/messages/createMessageInteractor');
const {
  createNewPetitionerUser,
} = require('../../shared/src/persistence/dynamo/users/createNewPetitionerUser');
const {
  createNewPractitionerUser,
} = require('../../shared/src/persistence/dynamo/users/createNewPractitionerUser');
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
  createUserForContact,
} = require('../../shared/src/business/useCaseHelper/caseAssociation/createUserForContact');
const {
  createUserInteractor,
} = require('../../shared/src/business/useCases/users/createUserInteractor');
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
  deleteKeyCount,
  incrementKeyCount,
  setExpiresAt,
} = require('../../shared/src/persistence/dynamo/helpers/store');
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
  deleteWorkItem,
} = require('../../shared/src/persistence/dynamo/workitems/deleteWorkItem');
const {
  DocketEntry,
} = require('../../shared/src/business/entities/DocketEntry');
const {
  docketRecord,
} = require('../../shared/src/business/utilities/documentGenerators/docketRecord');
const {
  documentUrlTranslator,
} = require('../../shared/src/business/utilities/documentUrlTranslator');
const {
  editPaperFilingInteractor,
} = require('../../shared/src/business/useCases/docketEntry/editPaperFilingInteractor');
const {
  fetchPendingItems,
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
  fileExternalDocumentForConsolidatedInteractor,
} = require('../../shared/src/business/useCases/externalDocument/fileExternalDocumentForConsolidatedInteractor');
const {
  fileExternalDocumentInteractor,
} = require('../../shared/src/business/useCases/externalDocument/fileExternalDocumentInteractor');
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
  generateStandingPretrialOrderForSmallCaseInteractor,
} = require('../../shared/src/business/useCases/trialSessions/generateStandingPretrialOrderForSmallCaseInteractor');
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
  getCaseMetadataWithCounsel,
} = require('../../shared/src/persistence/dynamo/cases/getCaseMetadataWithCounsel');
const {
  getCasesAssociatedWithUser,
  getDocketNumbersByUser,
} = require('../../shared/src/persistence/dynamo/cases/getDocketNumbersByUser');
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
  getCognitoUserIdByEmail,
} = require('../../shared/src/persistence/cognito/getCognitoUserIdByEmail');
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
  getCropBox,
} = require('../../shared/src/business/utilities/getCropBox');
const {
  getDeployTableStatus,
} = require('../../shared/src/persistence/dynamo/getDeployTableStatus');
const {
  getDocQcSectionForUser,
  getWorkQueueFilters,
} = require('../../shared/src/business/utilities/getWorkQueueFilters');
const {
  getDocumentContentsForDocketEntryInteractor,
} = require('../../shared/src/business/useCases/document/getDocumentContentsForDocketEntryInteractor');
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
  getEnvironment,
  getUniqueId,
} = require('../../shared/src/sharedAppContext.js');
const {
  getFirstSingleCaseRecord,
} = require('../../shared/src/persistence/elasticsearch/getFirstSingleCaseRecord');
const {
  getFormattedCaseDetail,
} = require('../../shared/src/business/utilities/getFormattedCaseDetail');
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
  getMessageById,
} = require('../../shared/src/persistence/dynamo/messages/getMessageById');
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
  getReconciliationReport,
} = require('../../shared/src/persistence/elasticsearch/getReconciliationReport');
const {
  getReconciliationReportInteractor,
} = require('../../shared/src/business/useCases/getReconciliationReportInteractor');
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
  getStampBoxCoordinates,
} = require('../../shared/src/business/utilities/getStampBoxCoordinates');
const {
  getTableStatus,
} = require('../../shared/src/persistence/dynamo/getTableStatus');
const {
  getTodaysOpinionsInteractor,
} = require('../../shared/src/business/useCases/public/getTodaysOpinionsInteractor');
const {
  getTodaysOrdersInteractor,
} = require('../../shared/src/business/useCases/public/getTodaysOrdersInteractor');
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
  getUserCaseMappingsByDocketNumber,
} = require('../../shared/src/persistence/dynamo/cases/getUserCaseMappingsByDocketNumber');
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
  getUserPendingEmailInteractor,
} = require('../../shared/src/business/useCases/users/getUserPendingEmailInteractor');
const {
  getUserPendingEmailStatusInteractor,
} = require('../../shared/src/business/useCases/users/getUserPendingEmailStatusInteractor');
const {
  getUsersById,
} = require('../../shared/src/persistence/dynamo/users/getUsersById');
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
  getUsersPendingEmailInteractor,
} = require('../../shared/src/business/useCases/users/getUsersPendingEmailInteractor');
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
  getWorkItemMappingsByDocketNumber,
} = require('../../shared/src/persistence/dynamo/workitems/getWorkItemMappingsByDocketNumber');
const {
  getWorkItemsByWorkItemId,
} = require('../../shared/src/persistence/dynamo/workitems/getWorkItemsByWorkItemId');
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
  isEmailAvailable,
} = require('../../shared/src/persistence/cognito/isEmailAvailable');
const {
  isFileExists,
} = require('../../shared/src/persistence/s3/isFileExists');
const {
  markMessageThreadRepliedTo,
} = require('../../shared/src/persistence/dynamo/messages/markMessageThreadRepliedTo');
const {
  noticeOfDocketChange,
} = require('../../shared/src/business/utilities/documentGenerators/noticeOfDocketChange');
const {
  noticeOfReceiptOfPetition,
} = require('../../shared/src/business/utilities/documentGenerators/noticeOfReceiptOfPetition');
const {
  noticeOfTrialIssued,
} = require('../../shared/src/business/utilities/documentGenerators/noticeOfTrialIssued');
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
  order,
} = require('../../shared/src/business/utilities/documentGenerators/order');
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
  pendingReport,
} = require('../../shared/src/business/utilities/documentGenerators/pendingReport');
const {
  persistUser,
} = require('../../shared/src/persistence/dynamo/users/persistUser');
const {
  Practitioner,
} = require('../../shared/src/business/entities/Practitioner');
const {
  practitionerCaseList,
} = require('../../shared/src/business/utilities/documentGenerators/practitionerCaseList');
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
  receiptOfFiling,
} = require('../../shared/src/business/utilities/documentGenerators/receiptOfFiling');
const {
  removeCaseFromHearing,
} = require('../../shared/src/persistence/dynamo/trialSessions/removeCaseFromHearing');
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
  removeCounselFromRemovedPetitioner,
} = require('../../shared/src/business/useCaseHelper/caseAssociation/removeCounselFromRemovedPetitioner');
const {
  removeCoversheet,
} = require('../../shared/src/business/useCaseHelper/coverSheets/removeCoversheet');
const {
  removeIrsPractitionerOnCase,
  removePrivatePractitionerOnCase,
} = require('../../shared/src/persistence/dynamo/cases/removePractitionerOnCase');
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
  saveWorkItem,
} = require('../../shared/src/persistence/dynamo/workitems/saveWorkItem');
const {
  saveWorkItemForDocketClerkFilingExternalDocument,
} = require('../../shared/src/persistence/dynamo/workitems/saveWorkItemForDocketClerkFilingExternalDocument');
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
  sendEmailVerificationLink,
} = require('../../shared/src/business/useCaseHelper/email/sendEmailVerificationLink');
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
  serveCaseDocument,
} = require('../../shared/src/business/utilities/serveCaseDocument');
const {
  serveCaseToIrsInteractor,
} = require('../../shared/src/business/useCases/serveCaseToIrs/serveCaseToIrsInteractor');
const {
  serveCourtIssuedDocumentInteractor,
} = require('../../shared/src/business/useCases/courtIssuedDocument/serveCourtIssuedDocumentInteractor');
const {
  serveDocumentAndGetPaperServicePdf,
} = require('../../shared/src/business/useCaseHelper/serveDocumentAndGetPaperServicePdf');
const {
  serveExternallyFiledDocumentInteractor,
} = require('../../shared/src/business/useCases/document/serveExternallyFiledDocumentInteractor');
const {
  setForHearingInteractor,
} = require('../../shared/src/business/useCases/trialSessions/setForHearingInteractor');
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
  setupPdfDocument,
} = require('../../shared/src/business/utilities/setupPdfDocument');
const {
  setUserEmailFromPendingEmailInteractor,
} = require('../../shared/src/business/useCases/users/setUserEmailFromPendingEmailInteractor');
const {
  setWorkItemAsReadInteractor,
} = require('../../shared/src/business/useCases/workitems/setWorkItemAsReadInteractor');
const {
  standingPretrialOrder,
} = require('../../shared/src/business/utilities/documentGenerators/standingPretrialOrder');
const {
  standingPretrialOrderForSmallCase,
} = require('../../shared/src/business/utilities/documentGenerators/standingPretrialOrderForSmallCase');
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
  trialCalendar,
} = require('../../shared/src/business/utilities/documentGenerators/trialCalendar');
const {
  TrialSession,
} = require('../../shared/src/business/entities/trialSessions/TrialSession');
const {
  trialSessionPlanningReport,
} = require('../../shared/src/business/utilities/documentGenerators/trialSessionPlanningReport');
const {
  TrialSessionWorkingCopy,
} = require('../../shared/src/business/entities/trialSessions/TrialSessionWorkingCopy');
const {
  unblockCaseFromTrialInteractor,
} = require('../../shared/src/business/useCases/unblockCaseFromTrialInteractor');
const {
  unprioritizeCaseInteractor,
} = require('../../shared/src/business/useCases/unprioritizeCaseInteractor');
const {
  updateAssociatedJudgeOnWorkItems,
} = require('../../shared/src/business/useCaseHelper/workItems/updateAssociatedJudgeOnWorkItems');
const {
  updateCase,
} = require('../../shared/src/persistence/dynamo/cases/updateCase');
const {
  updateCaseAndAssociations,
} = require('../../shared/src/business/useCaseHelper/caseAssociation/updateCaseAndAssociations');
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
  updateCaseDetailsInteractor,
} = require('../../shared/src/business/useCases/updateCaseDetailsInteractor');
const {
  updateCaseHearing,
} = require('../../shared/src/persistence/dynamo/trialSessions/updateCaseHearing');
const {
  updateCaseStatusOnWorkItems,
} = require('../../shared/src/business/useCaseHelper/workItems/updateCaseStatusOnWorkItems');
const {
  updateCaseTitleOnWorkItems,
} = require('../../shared/src/business/useCaseHelper/workItems/updateCaseTitleOnWorkItems');
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
  updateDocketEntry,
} = require('../../shared/src/persistence/dynamo/documents/updateDocketEntry');
const {
  updateDocketEntryMetaInteractor,
} = require('../../shared/src/business/useCases/docketEntry/updateDocketEntryMetaInteractor');
const {
  updateDocketEntryProcessingStatus,
} = require('../../shared/src/persistence/dynamo/documents/updateDocketEntryProcessingStatus');
const {
  updateDocketNumberSuffixOnWorkItems,
} = require('../../shared/src/business/useCaseHelper/workItems/updateDocketNumberSuffixOnWorkItems');
const {
  updateInitialFilingDocuments,
} = require('../../shared/src/business/useCaseHelper/initialFilingDocuments/updateInitialFilingDocuments');
const {
  updateIrsPractitionerOnCase,
  updatePrivatePractitionerOnCase,
} = require('../../shared/src/persistence/dynamo/cases/updatePractitionerOnCase');
const {
  updateMessage,
} = require('../../shared/src/persistence/dynamo/messages/updateMessage');
const {
  updateOtherStatisticsInteractor,
} = require('../../shared/src/business/useCases/caseStatistics/updateOtherStatisticsInteractor');
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
  updateQcCompleteForTrialInteractor,
} = require('../../shared/src/business/useCases/updateQcCompleteForTrialInteractor');
const {
  updateTrialDateOnWorkItems,
} = require('../../shared/src/business/useCaseHelper/workItems/updateTrialDateOnWorkItems');
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
  updateUserCaseMapping,
} = require('../../shared/src/persistence/dynamo/cases/updateUserCaseMapping');
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
  updateUserEmail,
} = require('../../shared/src/persistence/dynamo/users/updateUserEmail');
const {
  updateUserPendingEmailInteractor,
} = require('../../shared/src/business/useCases/users/updateUserPendingEmailInteractor');
const {
  updateUserRecords,
} = require('../../shared/src/persistence/dynamo/users/updateUserRecords');
const {
  updateWorkItem,
} = require('../../shared/src/persistence/dynamo/workitems/updateWorkItem');
const {
  updateWorkItemAssociatedJudge,
} = require('../../shared/src/persistence/dynamo/workitems/updateWorkItemAssociatedJudge');
const {
  updateWorkItemCaseStatus,
} = require('../../shared/src/persistence/dynamo/workitems/updateWorkItemCaseStatus');
const {
  updateWorkItemCaseTitle,
} = require('../../shared/src/persistence/dynamo/workitems/updateWorkItemCaseTitle');
const {
  updateWorkItemDocketNumberSuffix,
} = require('../../shared/src/persistence/dynamo/workitems/updateWorkItemDocketNumberSuffix');
const {
  updateWorkItemInCase,
} = require('../../shared/src/persistence/dynamo/cases/updateWorkItemInCase');
const {
  updateWorkItemTrialDate,
} = require('../../shared/src/persistence/dynamo/workitems/updateWorkItemTrialDate');
const {
  uploadToS3,
} = require('../../shared/src/business/utilities/uploadToS3');
const {
  UserCaseNote,
} = require('../../shared/src/business/entities/notes/UserCaseNote');
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
  verifyUserPendingEmailInteractor,
} = require('../../shared/src/business/useCases/users/verifyUserPendingEmailInteractor');
const {
  virusScanPdfInteractor,
} = require('../../shared/src/business/useCases/pdf/virusScanPdfInteractor');
const {
  zipDocuments,
} = require('../../shared/src/persistence/s3/zipDocuments');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { createLogger } = require('../../shared/src/utilities/createLogger');
const { exec } = require('child_process');
const { fallbackHandler } = require('./fallbackHandler');
const { getDocument } = require('../../shared/src/persistence/s3/getDocument');
const { Message } = require('../../shared/src/business/entities/Message');
const { scan } = require('../../shared/src/persistence/dynamodbClientService');
const { User } = require('../../shared/src/business/entities/User');
const { UserCase } = require('../../shared/src/business/entities/UserCase');
const { v4: uuidv4 } = require('uuid');
const { WorkItem } = require('../../shared/src/business/entities/WorkItem');

// increase the timeout for zip uploads to S3
AWS.config.httpOptions.timeout = 300000;

const {
  CognitoIdentityServiceProvider,
  DynamoDB,
  EnvironmentCredentials,
  S3,
  SES,
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

const getDocumentClient = ({ useMasterRegion = false } = {}) => {
  const type = useMasterRegion ? 'master' : 'region';
  const mainRegion = environment.region;
  const fallbackRegion =
    environment.region === 'us-west-1' ? 'us-east-1' : 'us-west-1';
  const mainRegionEndpoint = environment.dynamoDbEndpoint.includes('localhost')
    ? 'http://localhost:8000'
    : `dynamodb.${mainRegion}.amazonaws.com`;
  const fallbackRegionEndpoint = environment.dynamoDbEndpoint.includes(
    'localhost',
  )
    ? 'http://localhost:8000'
    : `dynamodb.${fallbackRegion}.amazonaws.com`;
  const { masterDynamoDbEndpoint, masterRegion } = environment;

  const config = {
    fallbackRegion,
    fallbackRegionEndpoint,
    mainRegion,
    mainRegionEndpoint,
    masterDynamoDbEndpoint,
    masterRegion,
    useMasterRegion,
  };

  if (!dynamoClientCache[type]) {
    dynamoClientCache[type] = {
      batchGet: fallbackHandler({ key: 'batchGet', ...config }),
      batchWrite: fallbackHandler({ key: 'batchWrite', ...config }),
      delete: fallbackHandler({ key: 'delete', ...config }),
      get: fallbackHandler({ key: 'get', ...config }),
      put: fallbackHandler({ key: 'put', ...config }),
      query: fallbackHandler({ key: 'query', ...config }),
      scan: fallbackHandler({ key: 'scan', ...config }),
      update: fallbackHandler({ key: 'update', ...config }),
    };
  }
  return dynamoClientCache[type];
};

const getDynamoClient = ({ useMasterRegion = false } = {}) => {
  // we don't need fallback logic here because the only method we use is describeTable
  // which is used for actually checking if the table in the same region exists.
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
  CaseDeadline,
  Correspondence,
  DocketEntry,
  IrsPractitioner,
  Message,
  Practitioner,
  PrivatePractitioner,
  TrialSession,
  TrialSessionWorkingCopy,
  User,
  UserCase,
  UserCaseNote,
  WorkItem,
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
    addCaseToHearing,
    associateUserWithCase,
    associateUserWithCasePending,
    bulkDeleteRecords,
    bulkIndexRecords,
    createCase,
    createCaseDeadline,
    createCaseTrialSortMappingRecords,
    createMessage,
    createPractitionerUser,
    createTrialSession,
    createTrialSessionWorkingCopy,
    createUser,
    deleteKeyCount,
    fetchPendingItems,
    getSesStatus,
    incrementCounter,
    incrementKeyCount,
    markMessageThreadRepliedTo,
    persistUser,
    putWorkItemInOutbox,
    putWorkItemInUsersOutbox,
    removeCaseFromHearing,
    saveDocumentFromLambda,
    saveUserConnection,
    saveWorkItem,
    saveWorkItemForDocketClerkFilingExternalDocument,
    setExpiresAt,
    setMessageAsRead,
    setPriorityOnAllWorkItems,
    updateCase,
    updateCaseHearing,
    updateDocketEntry,
    updateDocketEntryProcessingStatus,
    updateIrsPractitionerOnCase,
    updateMessage,
    updatePractitionerUser,
    updatePrivatePractitionerOnCase,
    updateTrialSession,
    updateTrialSessionWorkingCopy,
    updateUser,
    updateUserCaseNote,
    updateUserEmail,
    updateWorkItem,
    updateWorkItemInCase,
  }),
  // methods below are not known to create "entity" records
  advancedDocumentSearch,
  caseAdvancedSearch,
  casePublicSearch: casePublicSearchPersistence,
  createNewPetitionerUser,
  createNewPractitionerUser,
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
  deleteWorkItem,
  getBlockedCases,
  getCalendaredCasesForTrialSession,
  getCaseByDocketNumber,
  getCaseDeadlinesByDateRange,
  getCaseDeadlinesByDocketNumber,
  getCaseInventoryReport,
  getCaseMetadataWithCounsel,
  getCasesAssociatedWithUser,
  getCasesByDocketNumbers,
  getCasesByLeadDocketNumber,
  getCasesByUserId,
  getClientId,
  getCognitoUserIdByEmail,
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
  getMessageById,
  getMessageThreadByParentId,
  getMessagesByDocketNumber,
  getPractitionerByBarNumber,
  getPractitionersByName,
  getPublicDownloadPolicyUrl,
  getReadyForTrialCases,
  getReconciliationReport,
  getSectionInboxMessages,
  getSectionOutboxMessages,
  getTableStatus,
  getTrialSessionById,
  getTrialSessionWorkingCopy,
  getTrialSessions,
  getUploadPolicy,
  getUserByEmail,
  getUserById,
  getUserCaseMappingsByDocketNumber,
  getUserCaseNote,
  getUserCaseNoteForCases,
  getUserInboxMessages,
  getUserOutboxMessages,
  getUsersById,
  getUsersBySearchKey,
  getUsersInSection,
  getWebSocketConnectionsByUserId,
  getWorkItemById,
  getWorkItemMappingsByDocketNumber,
  getWorkItemsByWorkItemId,
  isEmailAvailable,
  isFileExists,
  removeIrsPractitionerOnCase,
  removePrivatePractitionerOnCase,
  updateCaseCorrespondence,
  updateUserCaseMapping,
  updateWorkItemAssociatedJudge,
  updateWorkItemCaseStatus,
  updateWorkItemCaseTitle,
  updateWorkItemDocketNumberSuffix,
  updateWorkItemTrialDate,
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
            promise: async () => {
              // TODO: this scan might become REALLY slow while doing a full integration
              // test run.
              const items = await scan({
                applicationContext: {
                  environment,
                  getDocumentClient,
                },
              });
              const users = items.filter(
                ({ pk, sk }) =>
                  pk.startsWith('user|') && sk.startsWith('user|'),
              );

              const foundUser = users.find(({ email }) => email === Username);

              if (foundUser) {
                return {
                  UserAttributes: [],
                  Username: foundUser.userId,
                };
              } else {
                throw new Error('User does not exist');
              }
            },
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
      CASE_STATUSES: Object.values(CASE_STATUS_TYPES),
      MAX_SEARCH_CLIENT_RESULTS,
      MAX_SEARCH_RESULTS,
      MAX_SES_RETRIES: 6,
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
      practitionerCaseList,
      receiptOfFiling,
      standingPretrialOrder,
      standingPretrialOrderForSmallCase,
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
            // mock this out so the health checks pass on smoke tests
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
          sendBulkTemplatedEmail: () => {
            return {
              promise: async () => {
                return { Status: [] };
              },
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
    getEnvironment,
    getHttpClient: () => axios,
    getIrsSuperuserEmail: () => process.env.IRS_SUPERUSER_EMAIL,
    getNodeSass: () => {
      return sass;
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
      const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
      pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.js';

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
      return pug;
    },
    getScannerResourceUri: () => {
      return (
        process.env.SCANNER_RESOURCE_URI || 'http://localhost:10000/Resources'
      );
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
            connectionClass,
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
        addExistingUserToCase,
        addServedStampToDocument,
        appendPaperServiceAddressPageToPdf,
        countPagesInDocument,
        createCaseAndAssociations,
        createTrialSessionAndWorkingCopy,
        createUserForContact,
        fetchPendingItems,
        fetchPendingItemsByDocketNumber,
        formatAndSortConsolidatedCases,
        generateCaseInventoryReportPdf,
        getCaseInventoryReport,
        getConsolidatedCasesForLeadCase,
        getUnassociatedLeadCase,
        parseAndScrapePdfContents,
        processUserAssociatedCases,
        removeCounselFromRemovedPetitioner,
        removeCoversheet,
        saveFileAndGenerateUrl,
        sendEmailVerificationLink,
        sendIrsSuperuserPetitionEmail,
        sendServedPartiesEmails,
        serveDocumentAndGetPaperServicePdf,
        updateAssociatedJudgeOnWorkItems,
        updateCaseAndAssociations,
        updateCaseAutomaticBlock,
        updateCaseStatusOnWorkItems,
        updateCaseTitleOnWorkItems,
        updateDocketNumberSuffixOnWorkItems,
        updateInitialFilingDocuments,
        updateTrialDateOnWorkItems,
        updateUserRecords,
      };
    },
    getUseCases: () => {
      return {
        addCaseToTrialSessionInteractor,
        addConsolidatedCaseInteractor,
        addCoversheetInteractor,
        addDeficiencyStatisticInteractor,
        addPaperFilingInteractor,
        addPetitionerToCaseInteractor,
        archiveCorrespondenceDocumentInteractor,
        archiveDraftDocumentInteractor,
        assignWorkItemsInteractor,
        associateIrsPractitionerWithCaseInteractor,
        associatePrivatePractitionerWithCaseInteractor,
        batchDownloadTrialSessionInteractor,
        blockCaseFromTrialInteractor,
        caseAdvancedSearchInteractor,
        casePublicSearchInteractor,
        checkEmailAvailabilityInteractor,
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
        editPaperFilingInteractor,
        fetchPendingItemsInteractor,
        fileAndServeCourtIssuedDocumentInteractor,
        fileCorrespondenceDocumentInteractor,
        fileCourtIssuedDocketEntryInteractor,
        fileCourtIssuedOrderInteractor,
        fileExternalDocumentForConsolidatedInteractor,
        fileExternalDocumentInteractor,
        forwardMessageInteractor,
        generateDocketRecordPdfInteractor,
        generateNoticeOfTrialIssuedInteractor,
        generatePDFFromJPGDataInteractor,
        generatePdfFromHtmlInteractor,
        generatePractitionerCaseListPdfInteractor,
        generatePrintableCaseInventoryReportInteractor,
        generatePrintableFilingReceiptInteractor,
        generatePrintablePendingReportInteractor,
        generateStandingPretrialOrderForSmallCaseInteractor,
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
        getReconciliationReportInteractor,
        getTodaysOpinionsInteractor,
        getTodaysOrdersInteractor,
        getTrialSessionDetailsInteractor,
        getTrialSessionWorkingCopyInteractor,
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
        onConnectInteractor,
        onDisconnectInteractor,
        opinionAdvancedSearchInteractor,
        opinionPublicSearchInteractor,
        orderAdvancedSearchInteractor,
        orderPublicSearchInteractor,
        prioritizeCaseInteractor,
        processStreamRecordsInteractor,
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
    },
    getUtilities: () => {
      return {
        calculateISODate,
        compareCasesByDocketNumber,
        compareISODateStrings,
        compareStrings,
        createISODateString,
        filterWorkItemsForUser,
        formatCaseForTrialSession,
        formatDateString,
        formatJudgeName,
        formatNow,
        formattedTrialSessionDetails,
        getAddressPhoneDiff,
        getCropBox,
        getDocQcSectionForUser,
        getDocumentTypeForAddressChange,
        getFormattedCaseDetail,
        getStampBoxCoordinates,
        getWorkQueueFilters,
        isPending: DocketEntry.isPending,
        prepareDateFromString,
        scrapePdfContents,
        serveCaseDocument,
        setServiceIndicatorsForCase,
        setupPdfDocument,
        uploadToS3,
      };
    },
    isAuthorized,
    logger: {
      debug: logger.debug.bind(logger),
      error: logger.error.bind(logger),
      info: logger.info.bind(logger),
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
