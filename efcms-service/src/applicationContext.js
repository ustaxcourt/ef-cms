const { S3, DynamoDB } = require('aws-sdk');
const uuidv4 = require('uuid/v4');

const {
  incrementCounter,
} = require('ef-cms-shared/src/persistence/dynamo/helpers/incrementCounter');

const {
  getSentWorkItemsForUser,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/getSentWorkItemsForUser');
const {
  getUserById,
} = require('ef-cms-shared/src/persistence/dynamo/users/getUserById');
const {
  createUser,
} = require('ef-cms-shared/src/persistence/dynamo/users/createUser');
const {
  getSentWorkItemsForSection,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/getSentWorkItemsForSection');
const {
  getWorkItemsForUser,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/getWorkItemsForUser');
const {
  getWorkItemById,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/getWorkItemById');
const {
  saveWorkItem,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/saveWorkItem');
const {
  getWorkItemsBySection,
} = require('ef-cms-shared/src/persistence/dynamo/workitems/getWorkItemsBySection');

// cases
const {
  getCasesByStatus,
} = require('ef-cms-shared/src/persistence/dynamo/cases/getCasesByStatus');
const {
  getCasesByUser,
} = require('ef-cms-shared/src/persistence/dynamo/cases/getCasesByUser');
const {
  getCasesForRespondent,
} = require('ef-cms-shared/src/persistence/dynamo/cases/getCasesForRespondent');
const {
  saveCase,
} = require('ef-cms-shared/src/persistence/dynamo/cases/saveCase');
const {
  getCaseByCaseId,
} = require('ef-cms-shared/src/persistence/dynamo/cases/getCaseByCaseId');
const {
  getUsersInSection,
} = require('ef-cms-shared/src/persistence/dynamo/users/getUsersInSection');
const { getInternalUsers} = require('ef-cms-shared/src/persistence/dynamo/users/getInternalUsers');
const {
  getCaseByDocketNumber,
} = require('ef-cms-shared/src/persistence/dynamo/cases/getCaseByDocketNumber');

const docketNumberGenerator = require('ef-cms-shared/src/persistence/dynamo/cases/docketNumberGenerator');

const {
  getUploadPolicy,
} = require('ef-cms-shared/src/persistence/s3/getUploadPolicy');
const {
  getDownloadPolicyUrl,
} = require('ef-cms-shared/src/persistence/s3/getDownloadPolicyUrl');

const irsGateway = require('ef-cms-shared/src/external/irsGateway');
const {
  getSentWorkItemsForUser: getSentWorkItemsForUserUC
} = require('ef-cms-shared/src/business/useCases/workitems/getSentWorkItemsForUserInteractor');
const {
  getCase,
} = require('ef-cms-shared/src/business/useCases/getCaseInteractor');
const {
  getCasesByStatus: getCasesByStatusUC,
} = require('ef-cms-shared/src/business/useCases/getCasesByStatusInteractor');
const {
  createCase,
} = require('ef-cms-shared/src/business/useCases/createCaseInteractor');
const {
  getCasesByUser: getCasesByUserUC,
} = require('ef-cms-shared/src/business/useCases/getCasesByUserInteractor');
const {
  getInternalUsers: getInternalUsersUC,
} = require('ef-cms-shared/src/business/useCases/users/getInternalUsersInteractor')
const {
  getUser,
} = require('ef-cms-shared/src/business/useCases/getUserInteractor');
const {
  sendPetitionToIRSHoldingQueue,
} = require('ef-cms-shared/src/business/useCases/sendPetitionToIRSHoldingQueueInteractor');
const {
  updateCase,
} = require('ef-cms-shared/src/business/useCases/updateCaseInteractor');
const {
  getCasesForRespondent: getCasesForRespondentUC,
} = require('ef-cms-shared/src/business/useCases/respondent/getCasesForRespondentInteractor');
const {
  getWorkItem,
} = require('ef-cms-shared/src/business/useCases/workitems/getWorkItemInteractor');
const {
  updateWorkItem,
} = require('ef-cms-shared/src/business/useCases/workitems/updateWorkItemInteractor');
const {
  createDocument,
} = require('ef-cms-shared/src/business/useCases/createDocumentInteractor');
const {
  getWorkItemsBySection: getWorkItemsBySectionUC,
} = require('ef-cms-shared/src/business/useCases/workitems/getWorkItemsBySectionInteractor');
const {
  getWorkItemsForUser: getWorkItemsForUserUC,
} = require('ef-cms-shared/src/business/useCases/workitems/getWorkItemsForUserInteractor');

const {
  getUsersInSection: getUsersInSectionUC,
} = require('ef-cms-shared/src/business/useCases/users/getUsersInSectionInteractor');
const {
  getSentWorkItemsForSection: getSentWorkItemsForSectionUC
} = require('ef-cms-shared/src/business/useCases/workitems/getSentWorkItemsForSectionInteractor');
const {
  assignWorkItems: assignWorkItemsUC,
} = require('ef-cms-shared/src/business/useCases/workitems/assignWorkItemsInteractor');
const {
  recallPetitionFromIRSHoldingQueue
} = require('ef-cms-shared/src/business/useCases/recallPetitionFromIRSHoldingQueueInteractor');
const {
  createUser: createUserUC
} = require('ef-cms-shared/src/business/useCases/users/createUserInteractor');

const {
  forwardWorkItem
} = require('ef-cms-shared/src/business/useCases/workitems/forwardWorkItemInteractor');

const {
  isAuthorized,
  WORKITEM,
} = require('ef-cms-shared/src/authorization/authorizationClientService');

const PetitionWithoutFiles = require('ef-cms-shared/src/business/entities/PetitionWithoutFiles');

const User = require('ef-cms-shared/src/business/entities/User');

const environment = {
  documentsBucketName: process.env.DOCUMENTS_BUCKET_NAME || '',
  dynamoDbEndpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
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

/**
 * 
 */
module.exports = (appContextUser = {}) => {
  setCurrentUser(appContextUser);

  return {
    getStorageClient: () => {
      return new S3({
        endpoint: environment.s3Endpoint,
        region: environment.region,
        s3ForcePathStyle: true,
      });
    },
    getDocumentClient: () => {
      return new DynamoDB.DocumentClient({
        endpoint: environment.dynamoDbEndpoint,
        region: environment.region,
      });
    },
    getDocumentsBucketName: () => {
      return environment.documentsBucketName;
    },
    getUniqueId: () => {
      return uuidv4();
    },
    getEntityConstructors: () => ({
      Petition: PetitionWithoutFiles,
    }),
    getPersistenceGateway: () => {
      return {
        incrementCounter,
        getUploadPolicy,
        getDownloadPolicyUrl,
        getUserById,
        createUser,
        getUsersInSection,
        getInternalUsers,

        // work items
        getWorkItemsBySection,
        getWorkItemsForUser,
        getWorkItemById,
        saveWorkItem,
        getSentWorkItemsForUser,
        getSentWorkItemsForSection,

        // cases
        getCasesByStatus,
        getCasesByUser,
        getCasesForRespondent,
        saveCase,
        getCaseByCaseId,
        getCaseByDocketNumber,
      };
    },
    docketNumberGenerator,
    irsGateway,
    // TODO: replace external calls to environment
    environment: {
      stage: process.env.STAGE || 'local',
      region: process.env.AWS_REGION || 'us-east-1',
      s3Endpoint: process.env.S3_ENDPOINT || 'localhost',
      documentsBucketName: process.env.DOCUMENTS_BUCKET_NAME || '',
    },
    getCurrentUser,
    isAuthorized,
    isAuthorizedForWorkItems: () => isAuthorized(user, WORKITEM),
    getUseCases: () => {
      return {
        createCase,
        createUser: createUserUC,
        getCase,
        getCasesByStatus: getCasesByStatusUC,
        getCasesByUser: getCasesByUserUC,
        getUsersInSection: getUsersInSectionUC,
        getInternalUsers: getInternalUsersUC,
        getUser,
        forwardWorkItem,
        sendPetitionToIRSHoldingQueue,
        updateCase,
        getCasesForRespondent: getCasesForRespondentUC,
        getWorkItem,
        updateWorkItem,
        createDocument,
        getWorkItemsBySection: getWorkItemsBySectionUC,
        getSentWorkItemsForSection: getSentWorkItemsForSectionUC,
        getSentWorkItemsForUser: getSentWorkItemsForUserUC,
        getWorkItemsForUser: getWorkItemsForUserUC,
        assignWorkItems: assignWorkItemsUC,
        recallPetitionFromIRSHoldingQueue,
      };
    },
  };
};
