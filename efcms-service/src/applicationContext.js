const AWS =
  process.env.NODE_ENV === 'production'
    ? AWSXRay.captureAWS(require('aws-sdk'))
    : require('aws-sdk');
const AWSXRay = require('aws-xray-sdk');
const uuidv4 = require('uuid/v4');
const { S3, DynamoDB } = AWS;
const docketNumberGenerator = require('ef-cms-shared/src/persistence/dynamo/cases/docketNumberGenerator');
const irsGateway = require('ef-cms-shared/src/external/irsGateway');
const {
  addWorkItemToSectionInbox,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/addWorkItemToSectionInbox');
const {
  assignWorkItems: assignWorkItemsUC,
} = require('ef-cms-shared/src/business/useCases/workitems/assignWorkItemsInteractor');
const {
  completeWorkItem,
} = require('ef-cms-shared/src/business/useCases/workitems/completeWorkItemInteractor');
const {
  createCase,
} = require('ef-cms-shared/src/business/useCases/createCaseInteractor');
const {
  createCaseFromPaper,
} = require('ef-cms-shared/src/business/useCases/createCaseFromPaperInteractor');
const {
  createDocument,
} = require('ef-cms-shared/src/business/useCases/createDocumentInteractor');
const {
  createUser,
} = require('ef-cms-shared/src/persistence/dynamo/users/createUser');
const {
  createUser: createUserUC,
} = require('ef-cms-shared/src/business/useCases/users/createUserInteractor');
const {
  createWorkItem,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/createWorkItem');
const {
  createWorkItem: createWorkItemUC,
} = require('ef-cms-shared/src/business/useCases/workitems/createWorkItemInteractor');
const {
  deleteDocument,
} = require('ef-cms-shared/src/persistence/s3/deleteDocument');
const {
  deleteWorkItemFromInbox,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/deleteWorkItemFromInbox');
const {
  deleteWorkItemFromSection,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/deleteWorkItemFromSection');
const {
  forwardWorkItem,
} = require('ef-cms-shared/src/business/useCases/workitems/forwardWorkItemInteractor');
const {
  getCase,
} = require('ef-cms-shared/src/business/useCases/getCaseInteractor');
const {
  getCaseByCaseId,
} = require('ef-cms-shared/src/persistence/dynamo/cases/getCaseByCaseId');
const {
  getCaseByDocketNumber,
} = require('ef-cms-shared/src/persistence/dynamo/cases/getCaseByDocketNumber');
const {
  getCasesByStatus,
} = require('ef-cms-shared/src/persistence/dynamo/cases/getCasesByStatus');
const {
  getCasesByStatus: getCasesByStatusUC,
} = require('ef-cms-shared/src/business/useCases/getCasesByStatusInteractor');
const {
  getCasesByUser,
} = require('ef-cms-shared/src/persistence/dynamo/cases/getCasesByUser');
const {
  getCasesByUser: getCasesByUserUC,
} = require('ef-cms-shared/src/business/useCases/getCasesByUserInteractor');
const {
  getCasesForRespondent,
} = require('ef-cms-shared/src/persistence/dynamo/cases/getCasesForRespondent');
const {
  getCasesForRespondent: getCasesForRespondentUC,
} = require('ef-cms-shared/src/business/useCases/respondent/getCasesForRespondentInteractor');
const {
  getDownloadPolicyUrl,
} = require('ef-cms-shared/src/persistence/s3/getDownloadPolicyUrl');
const {
  getInternalUsers,
} = require('ef-cms-shared/src/persistence/dynamo/users/getInternalUsers');
const {
  getInternalUsers: getInternalUsersUC,
} = require('ef-cms-shared/src/business/useCases/users/getInternalUsersInteractor');
const {
  getSentWorkItemsForSection,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/getSentWorkItemsForSection');
const {
  getSentWorkItemsForSection: getSentWorkItemsForSectionUC,
} = require('ef-cms-shared/src/business/useCases/workitems/getSentWorkItemsForSectionInteractor');
const {
  getSentWorkItemsForUser,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/getSentWorkItemsForUser');
const {
  getSentWorkItemsForUser: getSentWorkItemsForUserUC,
} = require('ef-cms-shared/src/business/useCases/workitems/getSentWorkItemsForUserInteractor');
const {
  getUploadPolicy,
} = require('ef-cms-shared/src/persistence/s3/getUploadPolicy');
const {
  getUser,
} = require('ef-cms-shared/src/business/useCases/getUserInteractor');
const {
  getUserById,
} = require('ef-cms-shared/src/persistence/dynamo/users/getUserById');
const {
  getUsersInSection,
} = require('ef-cms-shared/src/persistence/dynamo/users/getUsersInSection');
const {
  getUsersInSection: getUsersInSectionUC,
} = require('ef-cms-shared/src/business/useCases/users/getUsersInSectionInteractor');
const {
  getWorkItem,
} = require('ef-cms-shared/src/business/useCases/workitems/getWorkItemInteractor');
const {
  getWorkItemById,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/getWorkItemById');
const {
  getWorkItemsBySection,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/getWorkItemsBySection');
const {
  getWorkItemsBySection: getWorkItemsBySectionUC,
} = require('ef-cms-shared/src/business/useCases/workitems/getWorkItemsBySectionInteractor');
const {
  getWorkItemsForUser,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/getWorkItemsForUser');
const {
  getWorkItemsForUser: getWorkItemsForUserUC,
} = require('ef-cms-shared/src/business/useCases/workitems/getWorkItemsForUserInteractor');
const {
  incrementCounter,
} = require('ef-cms-shared/src/persistence/dynamo/helpers/incrementCounter');
const {
  isAuthorized,
  WORKITEM,
} = require('ef-cms-shared/src/authorization/authorizationClientService');
const {
  PetitionFromPaperWithoutFiles,
} = require('ef-cms-shared/src/business/entities/PetitionFromPaperWithoutFiles');
const {
  PetitionWithoutFiles,
} = require('ef-cms-shared/src/business/entities/PetitionWithoutFiles');
const {
  putWorkItemInOutbox,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/putWorkItemInOutbox');
const {
  recallPetitionFromIRSHoldingQueue,
} = require('ef-cms-shared/src/business/useCases/recallPetitionFromIRSHoldingQueueInteractor');
const {
  runBatchProcess,
} = require('ef-cms-shared/src/business/useCases/runBatchProcessInteractor');
const {
  saveCase,
} = require('ef-cms-shared/src/persistence/dynamo/cases/saveCase');
const {
  saveWorkItem,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/saveWorkItem');
const {
  sendPetitionToIRSHoldingQueue,
} = require('ef-cms-shared/src/business/useCases/sendPetitionToIRSHoldingQueueInteractor');
const {
  updateCase,
} = require('ef-cms-shared/src/persistence/dynamo/cases/updateCase');
const {
  updateCase: updateCaseUC,
} = require('ef-cms-shared/src/business/useCases/updateCaseInteractor');
const {
  updateWorkItem,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/updateWorkItem');
const {
  updateWorkItem: updateWorkItemUC,
} = require('ef-cms-shared/src/business/useCases/workitems/updateWorkItemInteractor');
const {
  zipDocuments,
} = require('ef-cms-shared/src/persistence/s3/zipDocuments');
const { User } = require('ef-cms-shared/src/business/entities/User');

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

module.exports = (appContextUser = {}) => {
  setCurrentUser(appContextUser);

  return {
    docketNumberGenerator,
    environment,
    getCurrentUser,
    getDocumentClient: ({ useMasterRegion } = {}) => {
      const dynamo = new DynamoDB.DocumentClient({
        endpoint: useMasterRegion
          ? environment.masterDynamoDbEndpoint
          : environment.dynamoDbEndpoint,
        region: useMasterRegion ? environment.masterRegion : environment.region,
      });
      return dynamo;
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
        createUser,
        createWorkItem,
        deleteDocument,
        deleteWorkItemFromInbox,
        deleteWorkItemFromSection,
        getCaseByCaseId,
        getCaseByDocketNumber,
        getCasesByStatus,
        getCasesByUser,
        getCasesForRespondent,
        getDownloadPolicyUrl,
        getInternalUsers,
        getSentWorkItemsForSection,
        getSentWorkItemsForUser,
        getUploadPolicy,
        getUserById,
        getUsersInSection,
        getWorkItemById,
        getWorkItemsBySection,
        getWorkItemsForUser,
        incrementCounter,
        putWorkItemInOutbox,
        saveCase,
        saveWorkItem,
        updateCase,
        updateWorkItem,
        zipDocuments,
      };
    },
    getStorageClient: () => {
      const s3 = new S3({
        endpoint: environment.s3Endpoint,
        region: environment.region,
        s3ForcePathStyle: true,
      });
      return s3;
    },
    // TODO: replace external calls to environment
    getUniqueId: () => {
      return uuidv4();
    },
    getUseCases: () => {
      return {
        assignWorkItems: assignWorkItemsUC,
        completeWorkItem,
        createCase,
        createCaseFromPaper,
        createDocument,
        createUser: createUserUC,
        createWorkItem: createWorkItemUC,
        forwardWorkItem,
        getCase,
        getCasesByStatus: getCasesByStatusUC,
        getCasesByUser: getCasesByUserUC,
        getCasesForRespondent: getCasesForRespondentUC,
        getInternalUsers: getInternalUsersUC,
        getSentWorkItemsForSection: getSentWorkItemsForSectionUC,
        getSentWorkItemsForUser: getSentWorkItemsForUserUC,
        getUser,
        getUsersInSection: getUsersInSectionUC,
        getWorkItem,
        getWorkItemsBySection: getWorkItemsBySectionUC,
        getWorkItemsForUser: getWorkItemsForUserUC,
        recallPetitionFromIRSHoldingQueue,
        runBatchProcess,
        sendPetitionToIRSHoldingQueue,
        updateCase: updateCaseUC,
        updateWorkItem: updateWorkItemUC,
      };
    },
    irsGateway,
    isAuthorized,
    isAuthorizedForWorkItems: () => isAuthorized(user, WORKITEM),
  };
};
