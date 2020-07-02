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
  Case,
  getPetitionDocumentFromDocuments,
} = require('../entities/cases/Case');
const {
  compareISODateStrings,
  compareStrings,
} = require('../utilities/sortFunctions');
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
  formatDocument,
} = require('../../../src/business/utilities/getFormattedCaseDetail');
const {
  formatJudgeName,
} = require('../../../src/business/utilities/getFormattedJudgeName');
const {
  formattedTrialSessionDetails,
} = require('../utilities/getFormattedTrialSessionDetails');
const {
  getCaseByCaseId,
} = require('../../persistence/dynamo/cases/getCaseByCaseId');
const {
  getCaseByDocketNumber,
} = require('../../persistence/dynamo/cases/getCaseByDocketNumber');
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
  getDocumentTypeForAddressChange,
} = require('../utilities/generateChangeOfAddressTemplate');
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
const { createCase } = require('../../persistence/dynamo/cases/createCase');
const { createMockDocumentClient } = require('./createMockDocumentClient');
const { filterEmptyStrings } = require('../utilities/filterEmptyStrings');
const { formatDollars } = require('../utilities/formatDollars');
const { getConstants } = require('../../../../web-client/src/getConstants');
const { getItem } = require('../../persistence/localStorage/getItem');
const { removeItem } = require('../../persistence/localStorage/removeItem');
const { ROLES } = require('../entities/EntityConstants');
const { setItem } = require('../../persistence/localStorage/setItem');
const { updateCase } = require('../../persistence/dynamo/cases/updateCase');
const { User } = require('../entities/User');

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

// TODO: Abstract for use elsewhere
const getFakeFile = returnArray => {
  const fakeFile = Buffer.from(fakeData, 'base64');
  fakeFile.name = 'fakeFile.pdf';

  if (returnArray) {
    return new Uint8Array(fakeFile);
  }

  return fakeFile;
};

const getFakeFileUint8Array = () => getFakeFile(true);

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
    dateStringsCompared: jest
      .fn()
      .mockImplementation(DateHandler.dateStringsCompared),
    deconstructDate: jest.fn().mockImplementation(DateHandler.deconstructDate),
    filterEmptyStrings: jest.fn().mockImplementation(filterEmptyStrings),
    formatDateString: jest
      .fn()
      .mockImplementation(DateHandler.formatDateString),
    formatDocument: jest.fn().mockImplementation(formatDocument),
    formatDollars: jest.fn().mockImplementation(formatDollars),
    formatJudgeName: jest.fn().mockImplementation(formatJudgeName),
    formatNow: jest.fn().mockImplementation(DateHandler.formatNow),
    formattedTrialSessionDetails: jest
      .fn()
      .mockImplementation(formattedTrialSessionDetails),
    getAddressPhoneDiff: jest.fn().mockImplementation(getAddressPhoneDiff),
    getCaseCaption: jest.fn().mockImplementation(Case.getCaseCaption),
    getDocumentTypeForAddressChange: jest
      .fn()
      .mockImplementation(getDocumentTypeForAddressChange),
    getFilingsAndProceedings: jest.fn().mockReturnValue(''),
    getFormattedCaseDetail: jest
      .fn()
      .mockImplementation(getFormattedCaseDetail),
    getPetitionDocumentFromDocuments: jest
      .fn()
      .mockImplementation(getPetitionDocumentFromDocuments),
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
    updateCaseAutomaticBlock: jest
      .fn()
      .mockImplementation(updateCaseAutomaticBlock),
  });

  const getDocumentGeneratorsReturnMock = {
    addressLabelCoverSheet: jest.fn().mockImplementation(getFakeFileUint8Array),
    caseInventoryReport: jest.fn().mockImplementation(getFakeFile),
    changeOfAddress: jest.fn().mockImplementation(getFakeFile),
    coverSheet: jest.fn().mockImplementation(getFakeFile),
    docketRecord: jest.fn().mockImplementation(getFakeFile),
    noticeOfDocketChange: jest.fn().mockImplementation(getFakeFile),
    noticeOfReceiptOfPetition: jest.fn().mockImplementation(getFakeFile),
    noticeOfTrialIssued: jest.fn().mockImplementation(getFakeFile),
    order: jest.fn().mockImplementation(getFakeFile),
    pendingReport: jest.fn().mockImplementation(getFakeFile),
    receiptOfFiling: jest.fn().mockImplementation(getFakeFile),
    standingPretrialNotice: jest.fn().mockImplementation(getFakeFile),
    standingPretrialOrder: jest.fn().mockImplementation(getFakeFile),
    trialCalendar: jest.fn().mockImplementation(getFakeFile),
    trialSessionPlanningReport: jest.fn().mockImplementation(getFakeFile),
  };

  const getTemplateGeneratorsReturnMock = {
    generateChangeOfAddressTemplate: jest.fn().mockResolvedValue('<div></div>'),
    generateHTMLTemplateForPDF: jest.fn().mockReturnValue('<div></div>'),
    generateNoticeOfTrialIssuedTemplate: jest.fn(),
    generatePrintableDocketRecordTemplate: jest
      .fn()
      .mockResolvedValue('<div></div>'),
  };

  const mockGetChromiumBrowserReturnValue = {
    close: jest.fn(),
    newPage: jest.fn().mockReturnValue({
      pdf: jest.fn(),
      setContent: jest.fn(),
    }),
  };

  const mockGetStorageClient = appContextProxy({
    getObject: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Body: 's3-get-object-body' }),
    }),
  });

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
    getCaseByDocketNumber: jest.fn().mockImplementation(getCaseByDocketNumber),
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
    getDownloadPolicyUrl: jest.fn(),
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
    persistUser: jest.fn(),
    putWorkItemInOutbox: jest.fn().mockImplementation(putWorkItemInOutbox),
    removeItem: jest.fn().mockImplementation(removeItem),
    saveDocumentFromLambda: jest.fn(),
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
    getCaseTitle: jest.fn().mockImplementation(Case.getCaseTitle),
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
          role: ROLES.petitioner,
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
    getDocumentGenerators: jest
      .fn()
      .mockReturnValue(getDocumentGeneratorsReturnMock),
    getDocumentsBucketName: jest.fn().mockReturnValue('DocumentBucketName'),
    getElasticsearchIndexes: () => ['efcms-case'],
    getEmailClient: jest.fn().mockReturnValue(mockGetEmailClient),
    getEntityByName: jest.fn(),
    getFileReaderInstance: jest.fn(),
    getHttpClient: jest.fn().mockReturnValue(mockGetHttpClientReturnValue),
    getIrsSuperuserEmail: jest.fn(),
    getNodeSass: jest.fn().mockReturnValue(nodeSassMockReturnValue),
    getNotificationClient: jest.fn(),
    getNotificationGateway: appContextProxy(),
    getPdfJs: jest.fn().mockReturnValue(mockGetPdfJsReturnValue),
    getPdfLib: jest.fn().mockReturnValue(require('pdf-lib')),
    getPersistenceGateway: mockGetPersistenceGateway,
    getPug: jest.fn(() => ({
      compile: () => {
        return () => null;
      },
    })),
    getScanner: jest.fn().mockReturnValue(mockGetScannerReturnValue),
    getScannerResourceUri: jest.fn().mockReturnValue(scannerResourcePath),
    getSearchClient: appContextProxy(),
    getStorageClient: mockGetStorageClient,
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
    notifyHoneybadger: jest.fn(),
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
  getFakeFile,
};
