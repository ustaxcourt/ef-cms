/* eslint-disable security/detect-object-injection, security/detect-child-process */
// const AWSXRay = require('aws-xray-sdk');
//
// const AWS =
//   process.env.NODE_ENV === 'production'
//     ? AWSXRay.captureAWS(require('aws-sdk'))
//     : require('aws-sdk');

const AWS = require('aws-sdk');

// ^ must come first --------------------

const docketNumberGenerator = require('../../shared/src/persistence/dynamo/cases/docketNumberGenerator');
const irsGateway = require('../../shared/src/external/irsGateway');
const util = require('util');
const uuidv4 = require('uuid/v4');
const {
  addCoversheetInteractor,
} = require('../../shared/src/business/useCases/addCoversheetInteractor');
const {
  addWorkItemToSectionInbox,
} = require('../../shared/src/persistence/dynamo/workitems/addWorkItemToSectionInbox');
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
const { Case } = require('../../shared/src/business/entities/cases/Case');
const {
  CaseExternalIncomplete,
} = require('../../shared/src/business/entities/cases/CaseExternalIncomplete');
const {
  CaseInternal,
} = require('../../shared/src/business/entities/cases/CaseInternal');
const {
  caseSearchInteractor,
} = require('../../shared/src/business/useCases/caseSearchInteractor');
const {
  checkForReadyForTrialCasesInteractor,
} = require('../../shared/src/business/useCases/checkForReadyForTrialCasesInteractor');
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
  prepareDateFromString,
} = require('../../shared/src/business/utilities/DateHandler');
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
  deleteDocument,
} = require('../../shared/src/persistence/s3/deleteDocument');
const {
  deleteWorkItemFromInbox,
} = require('../../shared/src/persistence/dynamo/workitems/deleteWorkItemFromInbox');
const {
  deleteWorkItemFromSection,
} = require('../../shared/src/persistence/dynamo/workitems/deleteWorkItemFromSection');
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
  generateChangeOfAddressTemplate,
  generateHTMLTemplateForPDF,
  generatePrintableDocketRecordTemplate,
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
  getAllCaseDeadlines,
} = require('../../shared/src/persistence/dynamo/caseDeadlines/getAllCaseDeadlines');
const {
  getAllCaseDeadlinesInteractor,
} = require('../../shared/src/business/useCases/caseDeadline/getAllCaseDeadlinesInteractor');
const {
  getAllCatalogCases,
} = require('../../shared/src/persistence/dynamo/cases/getAllCatalogCases');
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
  getUserById,
} = require('../../shared/src/persistence/dynamo/users/getUserById');
const {
  getUserInteractor,
} = require('../../shared/src/business/useCases/getUserInteractor');
const {
  getUsersBySearchKey,
} = require('../../shared/src/persistence/dynamo/users/getUsersBySearchKey');
const {
  updateCourtIssuedOrderInteractor,
} = require('../../shared/src/business/useCases/courtIssuedOrder/updateCourtIssuedOrderInteractor');
const {
  getUsersInSection,
} = require('../../shared/src/persistence/dynamo/users/getUsersInSection');
const {
  getUsersInSectionInteractor,
} = require('../../shared/src/business/useCases/users/getUsersInSectionInteractor');
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
  WORKITEM,
} = require('../../shared/src/authorization/authorizationClientService');
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
  runBatchProcessInteractor,
} = require('../../shared/src/business/useCases/runBatchProcessInteractor');
const {
  sanitizePdfInteractor,
} = require('../../shared/src/business/useCases/pdf/sanitizePdfInteractor');
const {
  saveDocument,
} = require('../../shared/src/persistence/s3/saveDocument');
const {
  saveSignedDocumentInteractor,
} = require('../../shared/src/business/useCases/saveSignedDocumentInteractor');
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
  sendPetitionToIRSHoldingQueueInteractor,
} = require('../../shared/src/business/useCases/sendPetitionToIRSHoldingQueueInteractor');
const {
  serveSignedStipDecisionInteractor,
} = require('../../shared/src/business/useCases/serveSignedStipDecisionInteractor');
const {
  setCaseToReadyForTrialInteractor,
} = require('../../shared/src/business/useCases/setCaseToReadyForTrialInteractor');
const {
  deleteSectionOutboxRecord,
} = require('../../shared/src/persistence/dynamo/workitems/deleteSectionOutboxRecord');
const {
  createUserInboxRecord,
} = require('../../shared/src/persistence/dynamo/workitems/createUserInboxRecord');

const {
  createSectionInboxRecord,
} = require('../../shared/src/persistence/dynamo/workitems/createSectionInboxRecord');

const {
  deleteUserOutboxRecord,
} = require('../../shared/src/persistence/dynamo/workitems/deleteUserOutboxRecord');
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
  getDownloadPolicyUrlInteractor,
} = require('../../shared/src/business/useCases/getDownloadPolicyUrlInteractor');
const {
  updateCase,
} = require('../../shared/src/persistence/dynamo/cases/updateCase');
const {
  archiveDraftDocumentInteractor,
} = require('../../shared/src/business/useCases/archiveDraftDocumentInteractor');
const {
  updateCaseDeadline,
} = require('../../shared/src/persistence/dynamo/caseDeadlines/updateCaseDeadline');
const {
  updateCaseDeadlineInteractor,
} = require('../../shared/src/business/useCases/caseDeadline/updateCaseDeadlineInteractor');
const {
  updateCaseInteractor,
} = require('../../shared/src/business/useCases/updateCaseInteractor');
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
  updateDocketEntryInteractor,
} = require('../../shared/src/business/useCases/docketEntry/updateDocketEntryInteractor');
const {
  updateDocumentProcessingStatus,
} = require('../../shared/src/persistence/dynamo/documents/updateDocumentProcessingStatus');
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
  getUploadPolicyInteractor,
} = require('../../shared/src/business/useCases/getUploadPolicyInteractor');
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
  isFileExists,
} = require('../../shared/src/persistence/s3/isFileExists');
const {
  virusScanPdfInteractor,
} = require('../../shared/src/business/useCases/pdf/virusScanPdfInteractor');
const {
  zipDocuments,
} = require('../../shared/src/persistence/s3/zipDocuments');
const { Client } = require('@elastic/elasticsearch');
const { exec } = require('child_process');
const { User } = require('../../shared/src/business/entities/User');
const { Order } = require('../../shared/src/business/entities/orders/Order');

const { DynamoDB, S3, SES } = AWS;
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
        getWorkItemById,
        incrementCounter,
        isFileExists,
        putWorkItemInOutbox,
        putWorkItemInUsersOutbox,
        saveDocument,
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
    getSearchClient: () => {
      if (!searchClientCache) {
        searchClientCache = new Client({
          node: environment.elasticsearchEndpoint,
        });
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
      };
    },
    getUniqueId: () => {
      return uuidv4();
    },
    getUseCases: () => {
      return {
        addCoversheetInteractor,
        archiveDraftDocumentInteractor,
        assignWorkItemsInteractor,
        associatePractitionerWithCaseInteractor,
        associateRespondentWithCaseInteractor,
        batchDownloadTrialSessionInteractor,
        caseSearchInteractor,
        checkForReadyForTrialCasesInteractor,
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
        fileCourtIssuedOrderInteractor,
        fileDocketEntryInteractor,
        fileExternalDocumentInteractor,
        forwardWorkItemInteractor,
        generateDocketRecordPdfInteractor,
        generatePDFFromJPGDataInteractor,
        generatePdfFromHtmlInteractor,
        getAllCaseDeadlinesInteractor,
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
        recallPetitionFromIRSHoldingQueueInteractor,
        runBatchProcessInteractor,
        sanitizePdfInteractor: args =>
          process.env.SKIP_SANITIZE ? null : sanitizePdfInteractor(args),
        saveSignedDocumentInteractor,
        sendPetitionToIRSHoldingQueueInteractor,
        serveSignedStipDecisionInteractor,
        setCaseToReadyForTrialInteractor,
        setTrialSessionAsSwingSessionInteractor,
        setTrialSessionCalendarInteractor,
        setWorkItemAsReadInteractor,
        submitCaseAssociationRequestInteractor,
        submitPendingCaseAssociationRequestInteractor,
        updateCaseDeadlineInteractor,
        updateCaseInteractor,
        updateCaseNoteInteractor,
        updateCaseTrialSortTagsInteractor,
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
        createISODateString,
        formatDateString,
        getDocumentTypeForAddressChange,
        getFormattedCaseDetail,
        prepareDateFromString,
        setServiceIndicatorsForCase,
      };
    },
    irsGateway,
    isAuthorized,
    isAuthorizedForWorkItems: () => isAuthorized(user, WORKITEM),
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
