const DateHandler = require('../utilities/DateHandler');
const getAddressPhoneDiff = require('../utilities/generateChangeOfAddressTemplate');
const path = require('path');
const sharedAppContext = require('../../sharedAppContext');
const {
  addWorkItemToSectionInbox,
} = require('../../persistence/dynamo/workitems/addWorkItemToSectionInbox');
const {
  appendPaperServiceAddressPageToPdf,
} = require('../useCaseHelper/service/appendPaperServiceAddressPageToPdf');
const {
  CaseAssociationRequestFactory,
} = require('../entities/CaseAssociationRequestFactory');
const {
  CaseExternalIncomplete,
} = require('../entities/cases/CaseExternalIncomplete');
const {
  compareISODateStrings,
  compareStrings,
} = require('../utilities/sortFunctions');
const {
  CourtIssuedDocumentFactory,
} = require('../entities/courtIssuedDocument/CourtIssuedDocumentFactory');
const {
  formattedTrialSessionDetails,
} = require('../utilities/getFormattedTrialSessionDetails');

const {
  createDocketNumber,
} = require('../../persistence/dynamo/cases/docketNumberGenerator');
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
  ExternalDocumentFactory,
} = require('../entities/externalDocument/ExternalDocumentFactory');
const {
  formatDocument,
} = require('../../../src/business/utilities/getFormattedCaseDetail');
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
  getFormattedCaseDetail,
} = require('../utilities/getFormattedCaseDetail');
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
  setServiceIndicatorsForCase,
} = require('../utilities/setServiceIndicatorsForCase');
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
const { DocketRecord } = require('../entities/DocketRecord');
const { Document } = require('../entities/Document');
const { filterEmptyStrings } = require('../utilities/filterEmptyStrings');
const { getConstants } = require('../../../../web-client/src/getConstants');
const { getItem } = require('../../persistence/localStorage/getItem');
const { removeItem } = require('../../persistence/localStorage/removeItem');
const { setItem } = require('../../persistence/localStorage/setItem');
const { TrialSession } = require('../entities/trialSessions/TrialSession');
const { updateCase } = require('../../persistence/dynamo/cases/updateCase');
const { User } = require('../entities/User');
const { WorkItem } = require('../entities/WorkItem');

const scannerResourcePath = path.join(__dirname, '../../../shared/test-assets');

const appContextProxy = (initial = {}, makeMock = true) => {
  const applicationContextHandler = {
    get(target, name, receiver) {
      if (!Reflect.has(target, name)) {
        Reflect.set(target, name, jest.fn(), receiver);
      }
      return Reflect.get(target, name, receiver);
    },
  };
  const proxied = new Proxy(initial, applicationContextHandler);
  return makeMock ? jest.fn().mockReturnValue(proxied) : proxied;
};

const createTestApplicationContext = ({ user } = {}) => {
  const mockGetPdfJsReturnValue = {
    getDocument: jest.fn().mockReturnValue({
      promise: Promise.resolve({
        getPage: async () => ({
          cleanup: () => {},
          getViewport: () => ({
            height: 100,
            width: 100,
          }),
          render: () => null,
        }),
        numPages: 5,
      }),
    }),
  };

  const mockGetScannerReturnValue = {
    getSourceNameByIndex: jest.fn().mockReturnValue('scanner'),
    getSources: jest.fn(),
    loadDynamsoft: jest.fn().mockReturnValue('dynam-scanner-injection'),
    setSourceByIndex: jest.fn(),
    setSourceByName: jest.fn().mockReturnValue(null),
    startScanSession: jest.fn().mockReturnValue({
      scannedBuffer: [],
    }),
  };

  const mockGetUtilities = appContextProxy({
    compareISODateStrings: jest.fn().mockImplementation(compareISODateStrings),
    compareStrings: jest.fn().mockImplementation(compareStrings),
    createISODateString: jest
      .fn()
      .mockImplementation(DateHandler.createISODateString),
    createISODateStringFromObject: jest
      .fn()
      .mockImplementation(DateHandler.createISODateStringFromObject),
    deconstructDate: jest.fn().mockImplementation(DateHandler.deconstructDate),
    filterEmptyStrings: jest.fn().mockImplementation(filterEmptyStrings),
    formatDateString: jest
      .fn()
      .mockImplementation(DateHandler.formatDateString),
    formatDocument: jest.fn().mockImplementation(formatDocument),
    formatNow: jest.fn().mockImplementation(DateHandler.formatNow),
    formattedTrialSessionDetails: jest
      .fn()
      .mockImplementation(formattedTrialSessionDetails),
    getAddressPhoneDiff: jest.fn().mockImplementation(getAddressPhoneDiff),
    getFilingsAndProceedings: jest.fn().mockReturnValue(''),
    getFormattedCaseDetail: jest
      .fn()
      .mockImplementation(getFormattedCaseDetail),
    isExternalUser: User.isExternalUser,
    isInternalUser: User.isInternalUser,
    isStringISOFormatted: jest
      .fn()
      .mockImplementation(DateHandler.isStringISOFormatted),
    isValidDateString: jest
      .fn()
      .mockImplementation(DateHandler.isValidDateString),
    prepareDateFromString: jest
      .fn()
      .mockImplementation(DateHandler.prepareDateFromString),
    setServiceIndicatorsForCase: jest
      .fn()
      .mockImplementation(setServiceIndicatorsForCase),
  });

  const mockGetHttpClientReturnValue = {
    get: () => ({
      data: 'url',
    }),
    post: jest.fn(),
  };

  const mockGetUseCaseHelpers = appContextProxy({
    appendPaperServiceAddressPageToPdf: jest
      .fn()
      .mockImplementation(appendPaperServiceAddressPageToPdf),
    generatePendingReportPdf: jest.fn(),
    updateCaseAutomaticBlock: jest
      .fn()
      .mockImplementation(updateCaseAutomaticBlock),
  });

  const getTemplateGeneratorsReturnMock = {
    generateChangeOfAddressTemplate: jest.fn().mockResolvedValue('<div></div>'),
    generateHTMLTemplateForPDF: jest.fn().mockReturnValue('<div></div>'),
    generateNoticeOfTrialIssuedTemplate: jest.fn(),
    generatePrintableDocketRecordTemplate: jest
      .fn()
      .mockResolvedValue('<div></div>'),
    generatePrintableFilingReceiptTemplate: jest
      .fn()
      .mockReturnValue('<div></div>'),
    generateStandingPretrialNoticeTemplate: jest.fn(),
    generateStandingPretrialOrderTemplate: jest.fn(),
    generateTrialCalendarTemplate: jest.fn(),
    generateTrialSessionPlanningReportTemplate: jest.fn(),
  };

  const mockGetChromiumBrowserReturnValue = {
    close: jest.fn(),
    newPage: jest.fn().mockReturnValue({
      pdf: jest.fn(),
      setContent: jest.fn(),
    }),
  };

  const mockGetPersistenceGateway = appContextProxy({
    addWorkItemToSectionInbox,
    createCase: jest.fn().mockImplementation(createCase),
    createCaseTrialSortMappingRecords: jest.fn(),
    createElasticsearchReindexRecord: jest.fn(),
    createSectionInboxRecord: jest
      .fn()
      .mockImplementation(createSectionInboxRecord),
    createUserInboxRecord: jest.fn().mockImplementation(createUserInboxRecord),
    createWorkItem: createWorkItemPersistence,
    deleteCaseTrialSortMappingRecords: jest.fn(),
    deleteElasticsearchReindexRecord: jest.fn(),
    deleteSectionOutboxRecord,
    deleteUserOutboxRecord,
    deleteWorkItemFromInbox: jest.fn(deleteWorkItemFromInbox),
    fetchPendingItems: jest.fn(),
    getAllCaseDeadlines: jest.fn(),
    getAllCatalogCases: jest.fn(),
    getCalendaredCasesForTrialSession: jest.fn(),
    getCaseByCaseId: jest.fn().mockImplementation(getCaseByCaseId),
    getCaseDeadlinesByCaseId: jest
      .fn()
      .mockImplementation(getCaseDeadlinesByCaseId),
    getDocumentQCInboxForSection: getDocumentQCInboxForSectionPersistence,
    getDocumentQCInboxForUser: jest
      .fn()
      .mockImplementation(getDocumentQCInboxForUserPersistence),
    getDocumentQCServedForSection: jest
      .fn()
      .mockImplementation(getDocumentQCInboxForSectionPersistence),
    getElasticsearchReindexRecords: jest.fn(),
    getInboxMessagesForSection: jest
      .fn()
      .mockImplementation(getInboxMessagesForSection),
    getInboxMessagesForUser: jest
      .fn()
      .mockImplementation(getInboxMessagesForUserPersistence),
    getItem: jest.fn().mockImplementation(getItem),
    getRecord: jest.fn(),
    getSentMessagesForUser: jest
      .fn()
      .mockImplementation(getSentMessagesForUserPersistence),
    getUserById: jest.fn().mockImplementation(getUserByIdPersistence),
    getWorkItemById: jest.fn().mockImplementation(getWorkItemByIdPersistence),
    incrementCounter,
    putWorkItemInOutbox: jest.fn().mockImplementation(putWorkItemInOutbox),
    removeItem: jest.fn().mockImplementation(removeItem),
    saveWorkItemForNonPaper: jest
      .fn()
      .mockImplementation(saveWorkItemForNonPaper),
    saveWorkItemForPaper: jest.fn().mockImplementation(saveWorkItemForPaper),
    setItem: jest.fn().mockImplementation(setItem),
    setPriorityOnAllWorkItems: jest.fn(),
    setWorkItemAsRead: jest.fn().mockImplementation(setWorkItemAsRead),
    updateCase: jest.fn().mockImplementation(updateCase),
    updateCaseTrialSortMappingRecords: jest.fn(),
    updateHighPriorityCaseTrialSortMappingRecords: jest.fn(),
    updateWorkItem,
    updateWorkItemInCase,
    uploadPdfFromClient: jest.fn().mockImplementation(() => ''),
    verifyCaseForUser: jest.fn().mockImplementation(verifyCaseForUser),
  });

  const nodeSassMockReturnValue = {
    render: (data, cb) => cb(data, { css: '' }),
  };

  const mockGetEmailClient = {
    sendBulkTemplatedEmail: jest.fn(),
  };

  const mockDocumentClient = createMockDocumentClient();

  const mockCreateDocketNumberGenerator = {
    createDocketNumber: jest.fn().mockImplementation(createDocketNumber),
  };

  const applicationContext = {
    ...sharedAppContext,
    barNumberGenerator: {
      createBarNumber: jest.fn().mockReturnValue('CS20001'),
    },
    checkSearchClientMappings: jest.fn(),
    convertBlobToUInt8Array: jest
      .fn()
      .mockImplementation(() => new Uint8Array([])),
    docketNumberGenerator: mockCreateDocketNumberGenerator,
    environment: {
      stage: 'local',
      tempDocumentsBucketName: 'MockDocumentBucketName',
    },
    filterCaseMetadata: jest.fn(),
    getBaseUrl: () => 'http://localhost',
    getCaseCaptionNames: jest.fn().mockImplementation(Case.getCaseCaptionNames),
    getChiefJudgeNameForSigning: jest.fn(),
    getChromiumBrowser: jest.fn().mockImplementation(() => {
      return mockGetChromiumBrowserReturnValue;
    }),
    getClerkOfCourtNameForSigning: jest.fn(),
    getCognito: appContextProxy(),
    getCognitoClientId: jest.fn(),
    getCognitoRedirectUrl: jest.fn(),
    getCognitoTokenUrl: jest.fn(),
    getConstants: jest.fn().mockImplementation(getConstants),
    getCurrentUser: jest.fn().mockImplementation(() => {
      return new User(
        user || {
          name: 'richard',
          role: User.ROLES.petitioner,
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        },
      );
    }),
    getCurrentUserPermissions: jest.fn(),
    getCurrentUserToken: () => {
      return '';
    },
    getDispatchers: jest.fn().mockReturnValue({
      sendBulkTemplatedEmail: jest.fn(),
    }),
    getDocumentClient: jest.fn().mockImplementation(() => mockDocumentClient),
    getDocumentsBucketName: jest.fn().mockReturnValue('DocumentBucketName'),
    getEmailClient: jest.fn().mockReturnValue(mockGetEmailClient),
    getEntityByName: jest.fn(),
    getEntityConstructors: () => ({
      Case,
      CaseAssociationRequestFactory,
      CaseExternal: CaseExternalIncomplete,
      CaseInternal: CaseInternal,
      CourtIssuedDocumentFactory,
      DocketRecord,
      Document,
      ExternalDocumentFactory: ExternalDocumentFactory,
      TrialSession: TrialSession,
      User,
      WorkItem: WorkItem,
    }),
    getFileReaderInstance: jest.fn(),
    getHttpClient: jest.fn().mockReturnValue(mockGetHttpClientReturnValue),
    getNodeSass: jest.fn().mockReturnValue(nodeSassMockReturnValue),
    getNotificationClient: jest.fn(),
    getNotificationGateway: appContextProxy(),
    getPdfJs: jest.fn().mockReturnValue(mockGetPdfJsReturnValue),
    getPdfStyles: jest.fn(),
    getPersistenceGateway: mockGetPersistenceGateway,
    getPug: jest.fn(),
    getScanner: jest.fn().mockReturnValue(mockGetScannerReturnValue),
    getScannerResourceUri: jest.fn().mockReturnValue(scannerResourcePath),
    getSearchClient: appContextProxy(),
    getStorageClient: appContextProxy(),
    getTempDocumentsBucketName: jest.fn(),
    getTemplateGenerators: jest
      .fn()
      .mockReturnValue(getTemplateGeneratorsReturnMock),
    getUniqueId: jest.fn().mockImplementation(sharedAppContext.getUniqueId),
    getUseCaseHelpers: mockGetUseCaseHelpers,
    getUseCases: appContextProxy(),
    getUtilities: mockGetUtilities,
    initHoneybadger: appContextProxy(),
    isAuthorizedForWorkItems: jest.fn().mockReturnValue(() => true),
    logger: {
      error: jest.fn(),
      info: jest.fn(),
      time: () => jest.fn().mockReturnValue(null),
      timeEnd: () => jest.fn().mockReturnValue(null),
    },
    setCurrentUser: jest.fn(),
    setCurrentUserToken: jest.fn(),
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
