const { S3, DynamoDB } = require('aws-sdk');
const uuidv4 = require('uuid/v4');

const {
  incrementCounter,
} = require('ef-cms-shared/src/persistence/awsDynamoPersistence');

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
  getCasesByDocumentId,
} = require('ef-cms-shared/src/persistence/dynamo/cases/getCasesByDocumentId');
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
  createCase,
} = require('ef-cms-shared/src/persistence/dynamo/cases/createCase');
const {
  getCaseByCaseId,
} = require('ef-cms-shared/src/persistence/dynamo/cases/getCaseByCaseId');
const {
  getCaseByDocketNumber,
} = require('ef-cms-shared/src/persistence/dynamo/cases/getCaseByDocketNumber');

const docketNumberGenerator = require('ef-cms-shared/src/persistence/docketNumberGenerator');

const {
  uploadPdfsForNewCase,
  uploadPdf,
} = require('ef-cms-shared/src/persistence/awsS3Persistence');
const {
  getUploadPolicy,
} = require('ef-cms-shared/src/persistence/getUploadPolicy');
const {
  getDownloadPolicyUrl,
} = require('ef-cms-shared/src/persistence/getDownloadPolicyUrl');

const irsGateway = require('ef-cms-shared/src/external/irsGateway');
const {
  getCase,
} = require('ef-cms-shared/src/business/useCases/getCase.interactor');
const {
  getCasesByStatus: getCasesByStatusUC,
} = require('ef-cms-shared/src/business/useCases/getCasesByStatus.interactor');
const {
  createCase: createCaseUC,
} = require('ef-cms-shared/src/business/useCases/createCase.interactor');
const {
  getCasesByUser: getCasesByUserUC,
} = require('ef-cms-shared/src/business/useCases/getCasesByUser.interactor');
const {
  getUser,
} = require('ef-cms-shared/src/business/useCases/getUser.interactor');
const {
  sendPetitionToIRS,
} = require('ef-cms-shared/src/business/useCases/sendPetitionToIRS.interactor');
const {
  updateCase,
} = require('ef-cms-shared/src/business/useCases/updateCase.interactor');
const {
  uploadCasePdfs,
} = require('ef-cms-shared/src/business/useCases/uploadCasePdfs.interactor');
const {
  getCasesForRespondent: getCasesForRespondentUC,
} = require('ef-cms-shared/src/business/useCases/respondent/getCasesForRespondent.interactor');
const {
  getWorkItem,
} = require('ef-cms-shared/src/business/useCases/workitems/getWorkItem.interactor');
const {
  getWorkItems,
} = require('ef-cms-shared/src/business/useCases/workitems/getWorkItems.interactor');
const {
  updateWorkItem,
} = require('ef-cms-shared/src/business/useCases/workitems/updateWorkItem.interactor');
const {
  associateRespondentDocumentToCase,
} = require('ef-cms-shared/src/business/useCases/respondent/associateRespondentDocumentToCase.interactor');
const {
  associateDocumentToCase,
} = require('ef-cms-shared/src/business/useCases/associateDocumentToCase.interactor');
const {
  getInteractorForGettingCases,
} = require('ef-cms-shared/src/business/useCases/utilities/getInteractorForGettingCases');
const {
  getWorkItemsBySection: getWorkItemsBySectionUC,
} = require('ef-cms-shared/src/business/useCases/workitems/getWorkItemsBySection.interactor');
const {
  assignWorkItems: assignWorkItemsUC,
} = require('ef-cms-shared/src/business/useCases/workitems/assignWorkItems.interactor');

const {
  forwardWorkItem
} = require('ef-cms-shared/src/business/useCases/workitems/forwardWorkItem.interactor');

const {
  isAuthorized,
  WORKITEM,
} = require('ef-cms-shared/src/authorization/authorizationClientService');

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
  user = newUser;
};

module.exports = ({ userId } = {}) => {
  if (userId) {
    setCurrentUser(new User({ userId }));
  }
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
    getPersistenceGateway: () => {
      return {
        incrementCounter,
        uploadPdfsForNewCase,
        uploadPdf,
        getUploadPolicy,
        getDownloadPolicyUrl,

        // work items
        getWorkItemsBySection,
        getWorkItemsForUser,
        getWorkItemById,
        saveWorkItem,

        // cases
        getCasesByStatus,
        getCasesByDocumentId,
        getCasesByUser,
        getCasesForRespondent,
        saveCase,
        createCase,
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
    isAuthorizedForWorkItems: () => isAuthorized(userId, WORKITEM),
    getUseCases: () => {
      return {
        createCase: createCaseUC,
        getCase,
        getCasesByStatus: getCasesByStatusUC,
        getCasesByUser: getCasesByUserUC,
        getUser,
        forwardWorkItem,
        sendPetitionToIRS,
        updateCase,
        uploadCasePdfs,
        getCasesForRespondent: getCasesForRespondentUC,
        getWorkItem,
        getWorkItems,
        updateWorkItem,
        associateDocumentToCase,
        associateRespondentDocumentToCase,
        getWorkItemsBySection: getWorkItemsBySectionUC,
        assignWorkItems: assignWorkItemsUC,
      };
    },
    getUpdateCaseInteractorQueryParam: event => {
      const interactorName =
        (event.queryStringParameters || {}).interactorName || 'updateCase';
      switch (interactorName) {
      case 'associateRespondentDocumentToCase':
        return associateRespondentDocumentToCase;
      case 'associateDocumentToCase':
        return associateDocumentToCase;
      default:
        return updateCase;
      }
    },
    getUpdateWorkItemInteractor: event => {
      const interactorName =
        (event.queryStringParameters || {}).interactorName || 'updateWorkItem';
      switch (interactorName) {
      case 'forwardWorkItem':
        return forwardWorkItem;
      default:
        return updateWorkItem;
      }
    },
    getWorkItemsInteractor: event => {
      const section = (event.queryStringParameters || {}).section;
      if (section) {
        return getWorkItemsBySection;
      } else {
        return getWorkItemsForUser;
      }
    },
    getInteractorForGettingCases,
  };
};
