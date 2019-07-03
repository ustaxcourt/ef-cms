/* eslint-disable security/detect-object-injection, security/detect-child-process */
const AWSXRay = require('aws-xray-sdk');

const AWS =
  process.env.NODE_ENV === 'production'
    ? AWSXRay.captureAWS(require('aws-sdk'))
    : require('aws-sdk');

// ^ must come first --------------------

const docketNumberGenerator = require('../../shared/src/persistence/dynamo/cases/docketNumberGenerator');
const irsGateway = require('../../shared/src/external/irsGateway');
const util = require('util');
const uuidv4 = require('uuid/v4');
const {
  addCoverToPDFDocumentInteractor,
} = require('../../shared/src/business/useCases/addCoverToPDFDocumentInteractor');
const {
  addWorkItemToSectionInbox,
} = require('../../shared/src/persistence/dynamo/workitems/addWorkItemToSectionInbox');
const {
  assignWorkItemsInteractor,
} = require('../../shared/src/business/useCases/workitems/assignWorkItemsInteractor');
const {
  associateUserWithCase,
} = require('../../shared/src/persistence/dynamo/cases/associateUserWithCase');
const {
  associateUserWithCasePending,
} = require('../../shared/src/persistence/dynamo/cases/associateUserWithCasePending');
const {
  CaseExternalIncomplete,
} = require('../../shared/src/business/entities/cases/CaseExternalIncomplete');
const {
  CaseInternalIncomplete,
} = require('../../shared/src/business/entities/cases/CaseInternalIncomplete');
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
  createDocument,
} = require('../../shared/src/business/useCases/createDocumentInteractor');
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
  createUser,
} = require('../../shared/src/persistence/dynamo/users/createUser');
const {
  createUser: createUserUC,
} = require('../../shared/src/business/useCases/users/createUserInteractor');
const {
  createWorkItem,
} = require('../../shared/src/persistence/dynamo/workitems/createWorkItem');
const {
  createWorkItem: createWorkItemUC,
} = require('../../shared/src/business/useCases/workitems/createWorkItemInteractor');
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
  fileExternalDocument,
} = require('../../shared/src/business/useCases/externalDocument/fileExternalDocumentInteractor');
const {
  forwardWorkItem,
} = require('../../shared/src/business/useCases/workitems/forwardWorkItemInteractor');
const {
  generatePDFFromPNGData,
} = require('../../shared/src/business/useCases/generatePDFFromPNGDataInteractor');
const {
  getAllCatalogCases,
} = require('../../shared/src/persistence/dynamo/cases/getAllCatalogCases');
const {
  getCalendaredCasesForTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/getCalendaredCasesForTrialSession');
const {
  getCalendaredCasesForTrialSession: getCalendaredCasesForTrialSessionUC,
} = require('../../shared/src/business/useCases/trialSessions/getCalendaredCasesForTrialSessionInteractor');
const {
  getCase,
} = require('../../shared/src/business/useCases/getCaseInteractor');
const {
  getCaseByCaseId,
} = require('../../shared/src/persistence/dynamo/cases/getCaseByCaseId');
const {
  getCaseByDocketNumber,
} = require('../../shared/src/persistence/dynamo/cases/getCaseByDocketNumber');
const {
  getCasesByUser,
} = require('../../shared/src/persistence/dynamo/cases/getCasesByUser');
const {
  getCasesByUser: getCasesByUserUC,
} = require('../../shared/src/business/useCases/getCasesByUserInteractor');
const {
  getDocumentQCBatchedForSection
} = require('../../shared/src/persistence/dynamo/workitems/getDocumentQCBatchedForSection');
const {
  getDocumentQCBatchedForSection: getDocumentQCBatchedForSectionUC, 
} = require('../../shared/src/business/useCases/workitems/getDocumentQCBatchedForSectionInteractor');
const {
  getDocumentQCBatchedForUser: getDocumentQCBatchedForUserUC
} = require('../../shared/src/business/useCases/workitems/getDocumentQCBatchedForUserInteractor');
const {
  getDocumentQCInboxForSection: getDocumentQCInboxForSectionUC
} = require('../../shared/src/business/useCases/workitems/getDocumentQCInboxForSectionInteractor');
const {
  getDocumentQCInboxForUser
} = require('../../shared/src/persistence/dynamo/workitems/getDocumentQCInboxForUser');
const {
  getDocumentQCInboxForUser: getDocumentQCInboxForUserUC,
} = require('../../shared/src/business/useCases/workitems/getDocumentQCInboxForUserInteractor');
const {
  getDocumentQCServedForSection, 
} = require('../../shared/src/persistence/dynamo/workitems/getDocumentQCServedForSection');
const {
  getDocumentQCServedForSection: getDocumentQCServedForSectionUC,
} = require('../../shared/src/business/useCases/workitems/getDocumentQCServedForSectionInteractor');
const {
  getDocumentQCServedForUser
} = require('../../shared/src/persistence/dynamo/workitems/getDocumentQCServedForUser');
const {
  getDocumentQCServedForUser: getDocumentQCServedForUserUC,
} = require('../../shared/src/business/useCases/workitems/getDocumentQCServedForUserInteractor');
const {
  getDownloadPolicyUrl,
} = require('../../shared/src/persistence/s3/getDownloadPolicyUrl');
const {
  getEligibleCasesForTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/getEligibleCasesForTrialSession');
const {
  getEligibleCasesForTrialSession: getEligibleCasesForTrialSessionUC,
} = require('../../shared/src/business/useCases/trialSessions/getEligibleCasesForTrialSessionInteractor');
const {
  getInboxMessagesForSection
} = require('../../shared/src/persistence/dynamo/workitems/getInboxMessagesForSection');
const {
  getInboxMessagesForSection: getInboxMessagesForSectionUC
} = require('../../shared/src/business/useCases/workitems/getInboxMessagesForSectionInteractor');
const {
  getInboxMessagesForUser
} = require('../../shared/src/persistence/dynamo/workitems/getInboxMessagesForUser');
const {
  getInboxMessagesForUser: getInboxMessagesForUserUC
} = require('../../shared/src/business/useCases/workitems/getInboxMessagesForUserInteractor');
const {
  getInternalUsers,
} = require('../../shared/src/persistence/dynamo/users/getInternalUsers');
const {
  getInternalUsers: getInternalUsersUC,
} = require('../../shared/src/business/useCases/users/getInternalUsersInteractor');
const {
  getNotifications,
} = require('../../shared/src/business/useCases/getNotificationsInteractor');
const {
  getSentMessagesForSection
} = require('../../shared/src/persistence/dynamo/workitems/getSentMessagesForSection');
const {
  getSentMessagesForSection: getSentMessagesForSectionUC,
} = require('../../shared/src/business/useCases/workitems/getSentMessagesForSectionInteractor');
const {
  getSentMessagesForUser
} = require('../../shared/src/persistence/dynamo/workitems/getSentMessagesForUser');
const {
  getSentMessagesForUser: getSentMessagesForUserUC
} = require('../../shared/src/business/useCases/workitems/getSentMessagesForUserInteractor');
const {
  getTrialSessionById,
} = require('../../shared/src/persistence/dynamo/trialSessions/getTrialSessionById');
const {
  getTrialSessionDetails,
} = require('../../shared/src/business/useCases/trialSessions/getTrialSessionDetailsInteractor');
const {
  getTrialSessions,
} = require('../../shared/src/persistence/dynamo/trialSessions/getTrialSessions');
const {
  getTrialSessions: getTrialSessionsUC,
} = require('../../shared/src/business/useCases/trialSessions/getTrialSessionsInteractor');
const {
  getUploadPolicy,
} = require('../../shared/src/persistence/s3/getUploadPolicy');
const {
  getUser,
} = require('../../shared/src/business/useCases/getUserInteractor');
const {
  getUserById,
} = require('../../shared/src/persistence/dynamo/users/getUserById');
const {
  getUsersInSection,
} = require('../../shared/src/persistence/dynamo/users/getUsersInSection');
const {
  getUsersInSection: getUsersInSectionUC,
} = require('../../shared/src/business/useCases/users/getUsersInSectionInteractor');
const {
  getWorkItem,
} = require('../../shared/src/business/useCases/workitems/getWorkItemInteractor');
const {
  getWorkItemById,
} = require('../../shared/src/persistence/dynamo/workitems/getWorkItemById');
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
  recallPetitionFromIRSHoldingQueue,
} = require('../../shared/src/business/useCases/recallPetitionFromIRSHoldingQueueInteractor');
const {
  runBatchProcess,
} = require('../../shared/src/business/useCases/runBatchProcessInteractor');
const {
  sanitizePdf,
} = require('../../shared/src/business/useCases/pdf/sanitizePdfInteractor');
const {
  saveDocument,
} = require('../../shared/src/persistence/s3/saveDocument');
const {
  saveSignedDocument,
} = require('../../shared/src/business/useCases/saveSignedDocumentInteractor');
const {
  saveWorkItemForDocketClerkFilingExternalDocument,
} = require('../../shared/src/persistence/dynamo/workitems/saveWorkItemForDocketClerkFilingExternalDocument');
const {
  saveWorkItemForNonPaper,
} = require('../../shared/src/persistence/dynamo/workitems/saveWorkItemForNonPaper');
const {
  saveWorkItemForPaper,
} = require('../../shared/src/persistence/dynamo/workitems/saveWorkItemForPaper');
const {
  sendPetitionToIRSHoldingQueue,
} = require('../../shared/src/business/useCases/sendPetitionToIRSHoldingQueueInteractor');
const {
  setCaseToReadyForTrial,
} = require('../../shared/src/business/useCases/setCaseToReadyForTrialInteractor');
const {
  setTrialSessionAsSwingSession,
} = require('../../shared/src/business/useCases/trialSessions/setTrialSessionAsSwingSessionInteractor');
const {
  setTrialSessionCalendar,
} = require('../../shared/src/business/useCases/trialSessions/setTrialSessionCalendarInteractor');
const {
  setWorkItemAsRead,
} = require('../../shared/src/persistence/dynamo/workitems/setWorkItemAsRead');
const {
  setWorkItemAsRead: setWorkItemAsReadUC,
} = require('../../shared/src/business/useCases/workitems/setWorkItemAsReadInteractor');
const {
  submitCaseAssociationRequest,
} = require('../../shared/src/business/useCases/caseAssociationRequest/submitCaseAssociationRequestInteractor');
const {
  submitPendingCaseAssociationRequest,
} = require('../../shared/src/business/useCases/caseAssociationRequest/submitPendingCaseAssociationRequestInteractor');
const {
  updateCase,
} = require('../../shared/src/persistence/dynamo/cases/updateCase');
const {
  updateCase: updateCaseUC,
} = require('../../shared/src/business/useCases/updateCaseInteractor');
const {
  updateCaseTrialSortMappingRecords,
} = require('../../shared/src/persistence/dynamo/cases/updateCaseTrialSortMappingRecords');
const {
  updateCaseTrialSortTags,
} = require('../../shared/src/business/useCases/updateCaseTrialSortTagsInteractor');
const {
  updateDocumentProcessingStatus,
} = require('../../shared/src/persistence/dynamo/documents/updateDocumentProcessingStatus');
const {
  updateTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/updateTrialSession');
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
  validatePdf,
} = require('../../shared/src/business/useCases/pdf/validatePdfInteractor');
const {
  verifyCaseForUser,
} = require('../../shared/src/persistence/dynamo/cases/verifyCaseForUser');
const {
  verifyCaseForUser: verifyCaseForUserUC,
} = require('../../shared/src/business/useCases/caseAssociationRequest/verifyCaseForUserInteractor');
const {
  verifyPendingCaseForUser,
} = require('../../shared/src/persistence/dynamo/cases/verifyPendingCaseForUser');
const {
  verifyPendingCaseForUser: verifyPendingCaseForUserUC,
} = require('../../shared/src/business/useCases/caseAssociationRequest/verifyPendingCaseForUserInteractor');
const {
  virusScanPdf,
} = require('../../shared/src/business/useCases/pdf/virusScanPdfInteractor');
const {
  zipDocuments,
} = require('../../shared/src/persistence/s3/zipDocuments');
const { 
  getDocumentQCBatchedForUser
} = require('../../shared/src/persistence/dynamo/workitems/getDocumentQCBatchedForUser');
const { exec } = require('child_process');
const { getDocumentQCInboxForSection } = require('../../shared/src/persistence/dynamo/workitems/getDocumentQCInboxForSection');
const { User } = require('../../shared/src/business/entities/User');

const { DynamoDB, S3 } = AWS;
const execPromise = util.promisify(exec);

const environment = {
  documentsBucketName: process.env.DOCUMENTS_BUCKET_NAME || '',
  dynamoDbEndpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  masterDynamoDbEndpoint:
    process.env.MASTER_DYNAMODB_ENDPOINT || 'dynamodb.us-east-1.amazonaws.com',
  masterRegion: process.env.MASTER_REGION || 'us-east-1',
  region: process.env.AWS_REGION || 'us-east-1',
  s3Endpoint: process.env.S3_ENDPOINT || 'localhost',
  stage: process.env.STAGE || 'local',
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

module.exports = (appContextUser = {}) => {
  setCurrentUser(appContextUser);

  return {
    docketNumberGenerator,
    environment,
    getChromium: () => {
      // Notice: this require is here to only have the lambdas that need it call it.
      // This dependency is only available on lambdas with the 'puppeteer' layer,
      // which means including it globally causes the other lambdas to fail.
      // This also needs to have the string split to cause parcel to not bundle this dependency,
      // which is wanted as bundling would have the dependency to not be searched for
      // and found at the layer level and would cause issues.
      // eslint-disable-next-line security/detect-non-literal-require
      const chromium = require('chrome-' + 'aws-lambda');
      return chromium;
    },
    getCurrentUser,
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
    getEntityConstructors: () => ({
      CaseExternal: CaseExternalIncomplete,
      CaseInternal: CaseInternalIncomplete,
    }),
    getPersistenceGateway: () => {
      return {
        addWorkItemToSectionInbox,
        associateUserWithCase,
        associateUserWithCasePending,
        createCase,
        createCaseCatalogRecord,
        createCaseTrialSortMappingRecords,
        createDocument,
        createTrialSession,
        createUser,
        createWorkItem,
        deleteCaseTrialSortMappingRecords,
        deleteDocument,
        deleteWorkItemFromInbox,
        deleteWorkItemFromSection,
        getAllCatalogCases,
        getCalendaredCasesForTrialSession,
        getCaseByCaseId,
        getCaseByDocketNumber,
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
        getTrialSessions,
        getUploadPolicy,
        getUserById,
        getUsersInSection,
        getWorkItemById,
        incrementCounter,
        putWorkItemInOutbox,
        putWorkItemInUsersOutbox,
        saveDocument,
        saveWorkItemForDocketClerkFilingExternalDocument,
        saveWorkItemForNonPaper,
        saveWorkItemForPaper,
        setWorkItemAsRead,
        updateCase,
        updateCaseTrialSortMappingRecords,
        updateDocumentProcessingStatus,
        updateTrialSession,
        updateWorkItem,
        updateWorkItemInCase,
        uploadDocument,
        verifyCaseForUser,
        verifyPendingCaseForUser,
        zipDocuments,
      };
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
    // TODO: replace external calls to environment
    getUniqueId: () => {
      return uuidv4();
    },
    getUseCases: () => {
      return {
        addCoverToPDFDocumentInteractor,
        assignWorkItemsInteractor,
        checkForReadyForTrialCasesInteractor,
        completeWorkItemInteractor,
        createCaseFromPaperInteractor,
        createCaseInteractor,
        createCourtIssuedOrderPdfFromHtmlInteractor,
        createTrialSessionInteractor,
        createUser: createUserUC,
        createWorkItem: createWorkItemUC,
        fileExternalDocument,
        forwardWorkItem,
        generatePDFFromPNGData,
        getCalendaredCasesForTrialSession: getCalendaredCasesForTrialSessionUC,
        getCase,
        getCasesByUser: getCasesByUserUC,
        getDocumentQCBatchedForSection: getDocumentQCBatchedForSectionUC,
        getDocumentQCBatchedForUser: getDocumentQCBatchedForUserUC,
        getDocumentQCInboxForSection: getDocumentQCInboxForSectionUC,
        getDocumentQCInboxForUser: getDocumentQCInboxForUserUC,
        getDocumentQCServedForSection: getDocumentQCServedForSectionUC,
        getDocumentQCServedForUser: getDocumentQCServedForUserUC,
        getEligibleCasesForTrialSession: getEligibleCasesForTrialSessionUC,
        getInboxMessagesForSection: getInboxMessagesForSectionUC,
        getInboxMessagesForUser: getInboxMessagesForUserUC,
        getInternalUsers: getInternalUsersUC,
        getNotifications,
        getSentMessagesForSection: getSentMessagesForSectionUC,
        getSentMessagesForUser: getSentMessagesForUserUC,
        getTrialSessionDetails,
        getTrialSessions: getTrialSessionsUC,
        getUser,
        getUsersInSection: getUsersInSectionUC,
        getWorkItem,
        recallPetitionFromIRSHoldingQueue,
        runBatchProcess,
        sanitizePdf: args =>
          process.env.SKIP_SANITIZE ? null : sanitizePdf(args),
        saveSignedDocument,
        sendPetitionToIRSHoldingQueue,
        setCaseToReadyForTrial,
        setTrialSessionAsSwingSession,
        setTrialSessionCalendar,
        setWorkItemAsRead: setWorkItemAsReadUC,
        submitCaseAssociationRequest,
        submitPendingCaseAssociationRequest,
        updateCase: updateCaseUC,
        updateCaseTrialSortTags,
        validatePdf,
        verifyCaseForUser: verifyCaseForUserUC,
        verifyPendingCaseForUser: verifyPendingCaseForUserUC,
        virusScanPdf: args =>
          process.env.SKIP_VIRUS_SCAN ? null : virusScanPdf(args),
      };
    },
    getUtilities: () => {
      return {
        createISODateString,
        formatDateString,
        prepareDateFromString,
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
