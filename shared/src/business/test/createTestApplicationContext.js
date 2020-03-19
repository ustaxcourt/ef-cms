const DateHandler = require('../utilities/DateHandler');
const docketNumberGenerator = require('../../persistence/dynamo/cases/docketNumberGenerator');
const sharedAppContext = require('../../sharedAppContext');
const {
  addWorkItemToSectionInbox,
} = require('../../persistence/dynamo/workitems/addWorkItemToSectionInbox');
const {
  CaseExternalIncomplete,
} = require('../entities/cases/CaseExternalIncomplete');
const {
  createSectionInboxRecord,
} = require('../../persistence/dynamo/workitems/createSectionInboxRecord');
const {
  createUserInboxRecord,
} = require('../../persistence/dynamo/workitems/createUserInboxRecord');
const {
  createWorkItem: createWorkItemPersistence,
} = require('../../persistence/dynamo/workitems/createWorkItem');
const {
  deleteSectionOutboxRecord,
} = require('../../persistence/dynamo/workitems/deleteSectionOutboxRecord');
const {
  deleteUserOutboxRecord,
} = require('../../persistence/dynamo/workitems/deleteUserOutboxRecord');
const {
  deleteWorkItemFromInbox,
} = require('../../persistence/dynamo/workitems/deleteWorkItemFromInbox');
const {
  getCaseByCaseId,
} = require('../../persistence/dynamo/cases/getCaseByCaseId');
const {
  getCaseDeadlinesByCaseId,
} = require('../../persistence/dynamo/caseDeadlines/getCaseDeadlinesByCaseId');
const {
  getDocumentQCInboxForSection: getDocumentQCInboxForSectionPersistence,
} = require('../../persistence/dynamo/workitems/getDocumentQCInboxForSection');
const {
  getDocumentQCInboxForUser: getDocumentQCInboxForUserPersistence,
} = require('../../persistence/dynamo/workitems/getDocumentQCInboxForUser');
const {
  getInboxMessagesForSection,
} = require('../../persistence/dynamo/workitems/getInboxMessagesForSection');
const {
  getInboxMessagesForUser: getInboxMessagesForUserPersistence,
} = require('../../persistence/dynamo/workitems/getInboxMessagesForUser');
const {
  getSentMessagesForUser: getSentMessagesForUserPersistence,
} = require('../../persistence/dynamo/workitems/getSentMessagesForUser');
const {
  getUserById: getUserByIdPersistence,
} = require('../../persistence/dynamo/users/getUserById');
const {
  getWorkItemById: getWorkItemByIdPersistence,
} = require('../../persistence/dynamo/workitems/getWorkItemById');
const {
  incrementCounter,
} = require('../../persistence/dynamo/helpers/incrementCounter');
const {
  putWorkItemInOutbox,
} = require('../../persistence/dynamo/workitems/putWorkItemInOutbox');
const {
  saveWorkItemForNonPaper,
} = require('../../persistence/dynamo/workitems/saveWorkItemForNonPaper');
const {
  saveWorkItemForPaper,
} = require('../../persistence/dynamo/workitems/saveWorkItemForPaper');
const {
  setWorkItemAsRead,
} = require('../../persistence/dynamo/workitems/setWorkItemAsRead');
const {
  updateWorkItem,
} = require('../../persistence/dynamo/workitems/updateWorkItem');
const {
  updateWorkItemInCase,
} = require('../../persistence/dynamo/cases/updateWorkItemInCase');
const {
  verifyCaseForUser,
} = require('../../persistence/dynamo/cases/verifyCaseForUser');
const { Case } = require('../entities/cases/Case');
const { CaseInternal } = require('../entities/cases/CaseInternal');
const { createCase } = require('../../persistence/dynamo/cases/createCase');
const { createMockDocumentClient } = require('./createMockDocumentClient');
const { updateCase } = require('../../persistence/dynamo/cases/updateCase');
const { User } = require('../entities/User');

const createTestApplicationContext = ({ user } = {}) => {
  const mockGetPersistenceGatewayReturnValue = {
    addWorkItemToSectionInbox,
    associateUserWithCase: jest.fn(),
    createCase,
    createCaseTrialSortMappingRecords: jest.fn(),
    createSectionInboxRecord,
    createUserInboxRecord,
    createWorkItem: createWorkItemPersistence,
    deleteCaseTrialSortMappingRecords: jest.fn(),
    deleteSectionOutboxRecord,
    deleteUserOutboxRecord,
    deleteWorkItemFromInbox,
    getCaseByCaseId: jest.fn().mockImplementation(getCaseByCaseId),
    getCaseDeadlinesByCaseId: jest
      .fn()
      .mockImplementation(getCaseDeadlinesByCaseId),
    getDocumentQCInboxForSection: getDocumentQCInboxForSectionPersistence,
    getDocumentQCInboxForUser: getDocumentQCInboxForUserPersistence,
    getDownloadPolicyUrl: jest.fn(),
    getInboxMessagesForSection,
    getInboxMessagesForUser: getInboxMessagesForUserPersistence,
    getSentMessagesForUser: getSentMessagesForUserPersistence,
    getUserById: getUserByIdPersistence,
    getWorkItemById: getWorkItemByIdPersistence,
    incrementCounter,
    putWorkItemInOutbox,
    saveWorkItemForNonPaper,
    saveWorkItemForPaper,
    setWorkItemAsRead,
    updateCase: jest.fn().mockImplementation(updateCase),
    updateWorkItem,
    updateWorkItemInCase,
    uploadPdfFromClient: jest.fn().mockImplementation(() => ''),
    verifyCaseForUser: jest.fn().mockImplementation(verifyCaseForUser),
  };

  const PDF_MOCK_BUFFER = 'Hello World';

  const pageMock = {
    addStyleTag: () => {},
    pdf: () => {
      return PDF_MOCK_BUFFER;
    },
    setContent: () => {},
  };

  const nodeSassMockReturnValue = {
    render: (data, cb) => cb(data, { css: '' }),
  };

  const chromiumBrowserMock = {
    close: () => {},
    newPage: () => pageMock,
  };
  const mockDocClient = createMockDocumentClient();

  const applicationContext = {
    ...sharedAppContext,
    docketNumberGenerator,
    environment: {
      stage: 'local',
      tempDocumentsBucketName: 'MockDocumentBucketName',
    },
    getBaseUrl: () => 'http://localhost',
    getCaseCaptionNames: jest.fn().mockReturnValue(Case.getCaseCaptionNames),
    getChromiumBrowser: jest.fn().mockReturnValue(chromiumBrowserMock),
    getCurrentUser: jest.fn().mockImplementation(() => {
      return new User(
        user || {
          name: 'richard',
          role: User.ROLES.petitioner,
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        },
      );
    }),
    getCurrentUserToken: () => {
      return '';
    },
    getDocumentClient: () => mockDocClient,
    getDocumentsBucketName: jest.fn(),
    getEntityConstructors: () => ({
      CaseExternal: CaseExternalIncomplete,
      CaseInternal: CaseInternal,
    }),
    getHttpClient: () => ({
      get: () => ({
        data: 'url',
      }),
    }),
    getNodeSass: jest.fn().mockReturnValue(nodeSassMockReturnValue),
    getPersistenceGateway: jest.fn().mockImplementation(() => {
      return mockGetPersistenceGatewayReturnValue;
    }),
    getPug: jest.fn(),
    getStorageClient: jest.fn(),
    getTempDocumentsBucketName: jest.fn(),
    getUniqueId: jest.fn().mockImplementation(sharedAppContext.getUniqueId),
    getUseCases: jest.fn(),
    getUtilities: () => {
      return { ...DateHandler };
    },
    isAuthorizedForWorkItems: () => true,
    logger: {
      error: jest.fn(),
      info: () => {},
    },
  };
  return applicationContext;
};

const applicationContext = createTestApplicationContext();

module.exports = { applicationContext, createTestApplicationContext };
