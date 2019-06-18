/* eslint-disable security/detect-object-injection, security/detect-child-process */
const AWSXRay = require('aws-xray-sdk');

const AWS =
  process.env.NODE_ENV === 'production'
    ? AWSXRay.captureAWS(require('aws-sdk'))
    : require('aws-sdk');

const uuidv4 = require('uuid/v4');
const { S3, DynamoDB } = AWS;
const docketNumberGenerator = require('../../shared/src/persistence/dynamo/cases/docketNumberGenerator');
const irsGateway = require('../../shared/src/external/irsGateway');

const util = require('util');
const { exec } = require('child_process');
const execPromise = util.promisify(exec);

const {
  createISODateString,
  formatDateString,
  prepareDateFromString,
} = require('../../shared/src/business/utilities/DateHandler');

const {
  addCoverToPDFDocument,
} = require('../../shared/src/business/useCases/addCoverToPDFDocumentInteractor');
const {
  addWorkItemToSectionInbox,
} = require('../../shared/src/persistence/dynamo/workitems/addWorkItemToSectionInbox');
const {
  assignWorkItems: assignWorkItemsUC,
} = require('../../shared/src/business/useCases/workitems/assignWorkItemsInteractor');
const {
  associateUserWithCase,
} = require('../../shared/src/persistence/dynamo/cases/associateUserWithCase');
const {
  associateUserWithCasePending,
} = require('../../shared/src/persistence/dynamo/cases/associateUserWithCasePending');
const {
  checkForReadyForTrialCases,
} = require('../../shared/src/business/useCases/checkForReadyForTrialCasesInteractor');
const {
  completeWorkItem,
} = require('../../shared/src/business/useCases/workitems/completeWorkItemInteractor');
const {
  createCase,
} = require('../../shared/src/persistence/dynamo/cases/createCase');
const {
  createCase: createCaseUC,
} = require('../../shared/src/business/useCases/createCaseInteractor');

const {
  createCaseCatalogRecord,
} = require('../../shared/src/persistence/dynamo/cases/createCaseCatalogRecord');
const {
  createCaseFromPaper,
} = require('../../shared/src/business/useCases/createCaseFromPaperInteractor');
const {
  createCaseTrialSessionMappingRecord,
} = require('../../shared/src/persistence/dynamo/cases/createCaseTrialSessionMappingRecord');
const {
  createCaseTrialSortMappingRecords,
} = require('../../shared/src/persistence/dynamo/cases/createCaseTrialSortMappingRecords');
const {
  createDocument,
} = require('../../shared/src/business/useCases/createDocumentInteractor');
const {
  createTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/createTrialSession');
const {
  createTrialSession: createTrialSessionUC,
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
  getAssociatedCasesForTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/getAssociatedCasesForTrialSession');
const {
  getAssociatedCasesForTrialSession: getAssociatedCasesForTrialSessionUC,
} = require('../../shared/src/business/useCases/trialSessions/getAssociatedCasesForTrialSessionInteractor');
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
  getCasesForRespondent,
} = require('../../shared/src/persistence/dynamo/cases/getCasesForRespondent');
const {
  getCasesForRespondent: getCasesForRespondentUC,
} = require('../../shared/src/business/useCases/respondent/getCasesForRespondentInteractor');
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
  getInternalUsers,
} = require('../../shared/src/persistence/dynamo/users/getInternalUsers');
const {
  getInternalUsers: getInternalUsersUC,
} = require('../../shared/src/business/useCases/users/getInternalUsersInteractor');
const {
  getNotifications,
} = require('../../shared/src/business/useCases/getNotificationsInteractor');
const {
  getSentWorkItemsForSection,
} = require('../../shared/src/persistence/dynamo/workitems/getSentWorkItemsForSection');
const {
  getSentWorkItemsForSection: getSentWorkItemsForSectionUC,
} = require('../../shared/src/business/useCases/workitems/getSentWorkItemsForSectionInteractor');
const {
  getSentWorkItemsForUser,
} = require('../../shared/src/persistence/dynamo/workitems/getSentWorkItemsForUser');
const {
  getSentWorkItemsForUser: getSentWorkItemsForUserUC,
} = require('../../shared/src/business/useCases/workitems/getSentWorkItemsForUserInteractor');
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
  getWorkItemsBySection,
} = require('../../shared/src/persistence/dynamo/workitems/getWorkItemsBySection');
const {
  getWorkItemsBySection: getWorkItemsBySectionUC,
} = require('../../shared/src/business/useCases/workitems/getWorkItemsBySectionInteractor');
const {
  getWorkItemsForUser,
} = require('../../shared/src/persistence/dynamo/workitems/getWorkItemsForUser');
const {
  getWorkItemsForUser: getWorkItemsForUserUC,
} = require('../../shared/src/business/useCases/workitems/getWorkItemsForUserInteractor');
const {
  incrementCounter,
} = require('../../shared/src/persistence/dynamo/helpers/incrementCounter');
const {
  isAuthorized,
  WORKITEM,
} = require('../../shared/src/authorization/authorizationClientService');
const {
  PetitionFromPaperWithoutFiles,
} = require('../../shared/src/business/entities/PetitionFromPaperWithoutFiles');
const {
  PetitionWithoutFiles,
} = require('../../shared/src/business/entities/PetitionWithoutFiles');
const {
  putWorkItemInOutbox,
} = require('../../shared/src/persistence/dynamo/workitems/putWorkItemInOutbox');
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
const { User } = require('../../shared/src/business/entities/User');

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
      Petition: PetitionWithoutFiles,
      PetitionFromPaper: PetitionFromPaperWithoutFiles,
    }),
    getPersistenceGateway: () => {
      return {
        addWorkItemToSectionInbox,
        associateUserWithCase,
        associateUserWithCasePending,
        createCase,
        createCaseCatalogRecord,
        createCaseTrialSessionMappingRecord,
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
        getAssociatedCasesForTrialSession,
        getCaseByCaseId,
        getCaseByDocketNumber,
        getCasesByUser,
        getCasesForRespondent,
        getDownloadPolicyUrl,
        getEligibleCasesForTrialSession,
        getInternalUsers,
        getSentWorkItemsForSection,
        getSentWorkItemsForUser,
        getTrialSessionById,
        getTrialSessions,
        getUploadPolicy,
        getUserById,
        getUsersInSection,
        getWorkItemById,
        getWorkItemsBySection,
        getWorkItemsForUser,
        incrementCounter,
        putWorkItemInOutbox,
        saveDocument,
        saveWorkItemForNonPaper,
        saveWorkItemForPaper,
        setWorkItemAsRead,
        updateCase,
        updateCaseTrialSortMappingRecords,
        updateDocumentProcessingStatus,
        updateTrialSession,
        updateWorkItem,
        updateWorkItemInCase,
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
        addCoverToPDFDocument,
        assignWorkItems: assignWorkItemsUC,
        checkForReadyForTrialCases,
        completeWorkItem,
        createCase: createCaseUC,
        createCaseFromPaper,
        createTrialSession: createTrialSessionUC,
        createUser: createUserUC,
        createWorkItem: createWorkItemUC,
        fileExternalDocument,
        forwardWorkItem,
        generatePDFFromPNGData,
        getAssociatedCasesForTrialSession: getAssociatedCasesForTrialSessionUC,
        getCase,
        getCasesByUser: getCasesByUserUC,
        getCasesForRespondent: getCasesForRespondentUC,
        getEligibleCasesForTrialSession: getEligibleCasesForTrialSessionUC,
        getInternalUsers: getInternalUsersUC,
        getNotifications,
        getSentWorkItemsForSection: getSentWorkItemsForSectionUC,
        getSentWorkItemsForUser: getSentWorkItemsForUserUC,
        getTrialSessionDetails,
        getTrialSessions: getTrialSessionsUC,
        getUser,
        getUsersInSection: getUsersInSectionUC,
        getWorkItem,
        getWorkItemsBySection: getWorkItemsBySectionUC,
        getWorkItemsForUser: getWorkItemsForUserUC,
        recallPetitionFromIRSHoldingQueue,
        runBatchProcess,
        sanitizePdf: args =>
          process.env.SKIP_SANITIZE ? null : sanitizePdf(args),
        sendPetitionToIRSHoldingQueue,
        setCaseToReadyForTrial,
        setTrialSessionAsSwingSession,
        setTrialSessionCalendar,
        setWorkItemAsRead: setWorkItemAsReadUC,
        submitCaseAssociationRequest,
        submitPendingCaseAssociationRequest,
        updateCase: updateCaseUC,
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
