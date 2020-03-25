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
  updateCaseAutomaticBlock,
} = require('../useCaseHelper/automaticBlock/updateCaseAutomaticBlock');
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
const { Scan } = require('../entities/Scan');
const { updateCase } = require('../../persistence/dynamo/cases/updateCase');
const { User } = require('../entities/User');
const { WorkItem } = require('../entities/WorkItem');

const createTestApplicationContext = ({ user } = {}) => {
  const mockCognitoReturnValue = {
    adminCreateUser: jest.fn(),
    adminGetUser: jest.fn(),
    adminUpdateUserAttributes: jest.fn(),
  };

  const mockGetUseCasesReturnValue = {
    deleteCounselFromCaseInteractor: jest.fn(),
    generatePrintableCaseInventoryReportInteractor: jest.fn(),
    getCalendaredCasesForTrialSessionInteractor: jest.fn(),
    getCaseInventoryReportInteractor: jest.fn(),
    getJudgeForUserChambersInteractor: jest.fn(),
    removeCasePendingItemInteractor: jest.fn(),
    removeItemInteractor: jest.fn(),
    setWorkItemAsReadInteractor: jest.fn(),
    updateCounselOnCaseInteractor: jest.fn(),
    validateAddIrsPractitionerInteractor: jest.fn(),
  };

  const mockGetScannerReturnValue = {
    getSourceNameByIndex: jest.fn().mockReturnValue('scanner'),
    setSourceByIndex: jest.fn().mockReturnValue(null),
    startScanSession: jest.fn().mockReturnValue({
      scannedBuffer: [],
    }),
  };

  const mockStorageClientReturnValue = {
    deleteObject: jest.fn(),
    getObject: jest.fn(),
  };

  const mockGetUseCaseHelpers = {
    updateCaseAutomaticBlock: jest
      .fn()
      .mockImplementation(updateCaseAutomaticBlock),
  };

  const mockGetPersistenceGatewayReturnValue = {
    addWorkItemToSectionInbox,
    associateUserWithCase: jest.fn(),
    createCase,
    createCaseTrialSortMappingRecords: jest.fn(),
    createSectionInboxRecord,
    createUserInboxRecord,
    createWorkItem: createWorkItemPersistence,
    deleteCaseDeadline: jest.fn(),
    deleteCaseTrialSortMappingRecords: jest.fn(),
    deleteSectionOutboxRecord,
    deleteUserCaseNote: jest.fn(),
    deleteUserOutboxRecord,
    deleteWorkItemFromInbox: jest.fn(deleteWorkItemFromInbox),
    getAllCaseDeadlines: jest.fn(),
    getCaseByCaseId: jest.fn().mockImplementation(getCaseByCaseId),
    getCaseDeadlinesByCaseId: jest
      .fn()
      .mockImplementation(getCaseDeadlinesByCaseId),
    getCasesByUser: jest.fn(),
    getDocumentQCInboxForSection: getDocumentQCInboxForSectionPersistence,
    getDocumentQCInboxForUser: getDocumentQCInboxForUserPersistence,
    getDocumentQCServedForSection: jest
      .fn()
      .mockImplementation(getDocumentQCInboxForSectionPersistence),
    getDownloadPolicyUrl: jest.fn(),
    getEligibleCasesForTrialSession: jest.fn(),
    getInboxMessagesForSection: jest
      .fn()
      .mockImplementation(getInboxMessagesForSection),
    getInboxMessagesForUser: getInboxMessagesForUserPersistence,
    getItem: jest.fn(),
    getSentMessagesForSection: jest.fn(),
    getSentMessagesForUser: jest
      .fn()
      .mockImplementation(getSentMessagesForUserPersistence),
    getTrialSessionById: jest.fn(),
    getTrialSessions: jest.fn(),
    getUserById: jest.fn().mockImplementation(getUserByIdPersistence),
    getUserCaseNote: jest.fn(),
    getUserCaseNoteForCases: jest.fn(),
    getWorkItemById: jest.fn().mockImplementation(getWorkItemByIdPersistence),
    incrementCounter,
    putWorkItemInOutbox: jest.fn().mockImplementation(putWorkItemInOutbox),
    saveWorkItemForNonPaper,
    saveWorkItemForPaper,
    setItem: jest.fn(),
    setWorkItemAsRead,
    updateCase: jest.fn().mockImplementation(updateCase),
    updateUserCaseNote: jest.fn(),
    updateWorkItem,
    updateWorkItemInCase,
    uploadPdfFromClient: jest.fn().mockImplementation(() => ''),
    verifyCaseForUser: jest.fn().mockImplementation(verifyCaseForUser),
  };

  const nodeSassMockReturnValue = {
    render: (data, cb) => cb(data, { css: '' }),
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
    getChiefJudgeNameForSigning: jest
      .fn()
      .mockImplementation(sharedAppContext.getChiefJudgeNameForSigning),
    getChromiumBrowser: jest.fn(),
    getCognito: () => mockCognitoReturnValue,
    getConstants: jest.fn().mockReturnValue({ SCAN_MODES: Scan.SCAN_MODES }),
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
    getDocumentsBucketName: jest.fn().mockReturnValue('DocumentBucketName'),
    getEntityConstructors: () => ({
      CaseExternal: CaseExternalIncomplete,
      CaseInternal: CaseInternal,
      WorkItem: WorkItem,
    }),
    getHttpClient: jest.fn(() => ({
      get: () => ({
        data: 'url',
      }),
    })),
    getNodeSass: jest.fn().mockReturnValue(nodeSassMockReturnValue),
    getPersistenceGateway: jest.fn().mockImplementation(() => {
      return mockGetPersistenceGatewayReturnValue;
    }),
    getPug: jest.fn(),
    getScanner: jest.fn().mockReturnValue(mockGetScannerReturnValue),
    getStorageClient: jest.fn().mockImplementation(() => {
      return mockStorageClientReturnValue;
    }),
    getTempDocumentsBucketName: jest.fn(),
    getUniqueId: jest.fn().mockImplementation(sharedAppContext.getUniqueId),
    getUseCaseHelpers: jest.fn().mockReturnValue(mockGetUseCaseHelpers),
    getUseCases: jest.fn().mockReturnValue(mockGetUseCasesReturnValue),
    getUtilities: () => {
      return { ...DateHandler };
    },
    isAuthorizedForWorkItems: jest.fn().mockReturnValue(() => true),
    logger: {
      error: jest.fn(),
      info: jest.fn(),
    },
  };
  return applicationContext;
};

const applicationContext = createTestApplicationContext();

/*
  If you receive an error when testing cerebral that says:
  `The property someProperty passed to Provider is not a method`
  it is because the cerebral testing framework expects all objects on the 
  applicationContext to be functions.  The code below walks the original 
  applicationContext and adds ONLY the functions to the 
  applicationContextForClient.
*/
const applicationContextForClient = {};
Object.entries(applicationContext).map(([key, value]) => {
  if (typeof value === 'function') {
    applicationContextForClient[key] = value;
  }
});

module.exports = {
  applicationContext,
  applicationContextForClient,
  createTestApplicationContext,
};
