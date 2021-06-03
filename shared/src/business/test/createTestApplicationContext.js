const DateHandler = require('../utilities/DateHandler');
const path = require('path');
const sharedAppContext = require('../../sharedAppContext');
const {
  aggregatePartiesForService,
} = require('../utilities/aggregatePartiesForService');
const {
  appendPaperServiceAddressPageToPdf,
} = require('../useCaseHelper/service/appendPaperServiceAddressPageToPdf');
const {
  bulkDeleteRecords,
} = require('../../persistence/elasticsearch/bulkDeleteRecords');
const {
  bulkIndexRecords,
} = require('../../persistence/elasticsearch/bulkIndexRecords');
const {
  Case,
  caseHasServedDocketEntries,
  getContactPrimary,
  getContactSecondary,
  getOtherFilers,
  getOtherPetitioners,
} = require('../entities/cases/Case');
const {
  compareCasesByDocketNumber,
} = require('../utilities/getFormattedTrialSessionDetails');
const {
  compareISODateStrings,
  compareStrings,
} = require('../utilities/sortFunctions');
const {
  createCaseAndAssociations,
} = require('../useCaseHelper/caseAssociation/createCaseAndAssociations');
const {
  createDocketNumber,
} = require('../../persistence/dynamo/cases/docketNumberGenerator');
const {
  deleteRecord,
} = require('../../persistence/elasticsearch/deleteRecord');
const {
  deleteSectionOutboxRecord,
} = require('../../persistence/dynamo/workitems/deleteSectionOutboxRecord');
const {
  deleteUserOutboxRecord,
} = require('../../persistence/dynamo/workitems/deleteUserOutboxRecord');
const {
  deleteWorkItem,
} = require('../../persistence/dynamo/workitems/deleteWorkItem');
const {
  documentUrlTranslator,
} = require('../../../src/business/utilities/documentUrlTranslator');
const {
  fakeData,
  getFakeFile,
  testInvalidPdfDoc,
  testPdfDoc,
} = require('./getFakeFile');
const {
  filterWorkItemsForUser,
} = require('../../../src/business/utilities/filterWorkItemsForUser');
const {
  formatAttachments,
} = require('../../../src/business/utilities/formatAttachments');
const {
  formatCase,
  formatCaseDeadlines,
  formatDocketEntry,
  sortDocketEntries,
} = require('../../../src/business/utilities/getFormattedCaseDetail');
const {
  formatJudgeName,
  getJudgeLastName,
} = require('../../../src/business/utilities/getFormattedJudgeName');
const {
  formattedTrialSessionDetails,
} = require('../utilities/getFormattedTrialSessionDetails');
const {
  getAddressPhoneDiff,
} = require('../utilities/generateChangeOfAddressTemplate');
const {
  getCaseByDocketNumber,
} = require('../../persistence/dynamo/cases/getCaseByDocketNumber');
const {
  getCaseDeadlinesByDocketNumber,
} = require('../../persistence/dynamo/caseDeadlines/getCaseDeadlinesByDocketNumber');
const {
  getDocQcSectionForUser,
  getWorkQueueFilters,
} = require('../utilities/getWorkQueueFilters');
const {
  getDocumentQCInboxForSection: getDocumentQCInboxForSectionPersistence,
} = require('../../persistence/elasticsearch/workitems/getDocumentQCInboxForSection');
const {
  getDocumentQCInboxForUser: getDocumentQCInboxForUserPersistence,
} = require('../../persistence/elasticsearch/workitems/getDocumentQCInboxForUser');
const {
  getDocumentTitleWithAdditionalInfo,
} = require('../../../src/business/utilities/getDocumentTitleWithAdditionalInfo');
const {
  getDocumentTypeForAddressChange,
} = require('../utilities/generateChangeOfAddressTemplate');
const {
  getFormattedCaseDetail,
} = require('../utilities/getFormattedCaseDetail');
const {
  getFullCaseByDocketNumber,
} = require('../../persistence/dynamo/cases/getFullCaseByDocketNumber');
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
  saveWorkItem,
} = require('../../persistence/dynamo/workitems/saveWorkItem');
const {
  setServiceIndicatorsForCase,
} = require('../utilities/setServiceIndicatorsForCase');
const {
  setWorkItemAsRead,
} = require('../../persistence/dynamo/workitems/setWorkItemAsRead');
const {
  updateCaseAndAssociations,
} = require('../useCaseHelper/caseAssociation/updateCaseAndAssociations');
const {
  updateCaseAutomaticBlock,
} = require('../useCaseHelper/automaticBlock/updateCaseAutomaticBlock');
const {
  updateCaseCorrespondence,
} = require('../../persistence/dynamo/correspondence/updateCaseCorrespondence');
const {
  updateDocketEntry,
} = require('../../persistence/dynamo/documents/updateDocketEntry');
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
const { DocketEntry } = require('../entities/DocketEntry');
const { filterEmptyStrings } = require('../utilities/filterEmptyStrings');
const { formatDollars } = require('../utilities/formatDollars');
const { getConstants } = require('../../../../web-client/src/getConstants');
const { getItem } = require('../../persistence/localStorage/getItem');
const { getServedPartiesCode, isServed } = require('../entities/DocketEntry');
const { removeItem } = require('../../persistence/localStorage/removeItem');
const { replaceBracketed } = require('../utilities/replaceBracketed');
const { ROLES } = require('../entities/EntityConstants');
const { setItem } = require('../../persistence/localStorage/setItem');
const { updateCase } = require('../../persistence/dynamo/cases/updateCase');
const { User } = require('../entities/User');

const scannerResourcePath = path.join(__dirname, '../../../shared/test-assets');

const appContextProxy = (initial = {}, makeMock = true) => {
  const applicationContextHandler = {
    get(target, myName, receiver) {
      if (!Reflect.has(target, myName)) {
        Reflect.set(target, myName, jest.fn(), receiver);
      }
      return Reflect.get(target, myName, receiver);
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
    version: '1',
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

  const mockGetReduceImageBlobValue = {
    default: jest.fn().mockReturnValue({
      toBlob: jest.fn(),
    }),
  };

  const mockGetUtilities = appContextProxy({
    aggregatePartiesForService: jest
      .fn()
      .mockImplementation(aggregatePartiesForService),
    calculateISODate: jest
      .fn()
      .mockImplementation(DateHandler.calculateISODate),
    caseHasServedDocketEntries: jest
      .fn()
      .mockImplementation(caseHasServedDocketEntries),
    checkDate: jest.fn().mockImplementation(DateHandler.checkDate),
    compareCasesByDocketNumber: jest
      .fn()
      .mockImplementation(compareCasesByDocketNumber),
    compareISODateStrings: jest.fn().mockImplementation(compareISODateStrings),
    compareStrings: jest.fn().mockImplementation(compareStrings),
    computeDate: jest.fn().mockImplementation(DateHandler.computeDate),
    createEndOfDayISO: jest
      .fn()
      .mockImplementation(DateHandler.createEndOfDayISO),
    createISODateString: jest
      .fn()
      .mockImplementation(DateHandler.createISODateString),
    createISODateStringFromObject: jest
      .fn()
      .mockImplementation(DateHandler.createISODateStringFromObject),
    createStartOfDayISO: jest
      .fn()
      .mockImplementation(DateHandler.createStartOfDayISO),
    dateStringsCompared: jest
      .fn()
      .mockImplementation(DateHandler.dateStringsCompared),
    deconstructDate: jest.fn().mockImplementation(DateHandler.deconstructDate),
    filterEmptyStrings: jest.fn().mockImplementation(filterEmptyStrings),
    filterWorkItemsForUser: jest
      .fn()
      .mockImplementation(filterWorkItemsForUser),
    formatAttachments: jest.fn().mockImplementation(formatAttachments),
    formatCase: jest.fn().mockImplementation(formatCase),
    formatCaseDeadlines: jest.fn().mockImplementation(formatCaseDeadlines),
    formatDateString: jest
      .fn()
      .mockImplementation(DateHandler.formatDateString),
    formatDocketEntry: jest.fn().mockImplementation(formatDocketEntry),
    formatDollars: jest.fn().mockImplementation(formatDollars),
    formatJudgeName: jest.fn().mockImplementation(formatJudgeName),
    formatNow: jest.fn().mockImplementation(DateHandler.formatNow),
    formattedTrialSessionDetails: jest
      .fn()
      .mockImplementation(formattedTrialSessionDetails),
    getAddressPhoneDiff: jest.fn().mockImplementation(getAddressPhoneDiff),
    getAttachmentDocumentById: jest
      .fn()
      .mockImplementation(Case.getAttachmentDocumentById),
    getCaseCaption: jest.fn().mockImplementation(Case.getCaseCaption),
    getContactPrimary: jest.fn().mockImplementation(getContactPrimary),
    getContactSecondary: jest.fn().mockImplementation(getContactSecondary),
    getDocQcSectionForUser: jest
      .fn()
      .mockImplementation(getDocQcSectionForUser),
    getDocumentTitleWithAdditionalInfo: jest
      .fn()
      .mockImplementation(getDocumentTitleWithAdditionalInfo),
    getDocumentTypeForAddressChange: jest
      .fn()
      .mockImplementation(getDocumentTypeForAddressChange),
    getFilingsAndProceedings: jest.fn().mockReturnValue(''),
    getFormattedCaseDetail: jest
      .fn()
      .mockImplementation(getFormattedCaseDetail),
    getJudgeLastName: jest.fn().mockImplementation(getJudgeLastName),
    getMonthDayYearObj: jest
      .fn()
      .mockImplementation(DateHandler.getMonthDayYearObj),
    getOtherFilers: jest.fn().mockImplementation(getOtherFilers),
    getOtherPetitioners: jest.fn().mockImplementation(getOtherPetitioners),
    getServedPartiesCode: jest.fn().mockImplementation(getServedPartiesCode),
    getWorkQueueFilters: jest.fn().mockImplementation(getWorkQueueFilters),
    isExternalUser: User.isExternalUser,
    isInternalUser: User.isInternalUser,
    isPending: jest.fn().mockImplementation(DocketEntry.isPending),
    isServed: jest.fn().mockImplementation(isServed),
    isStringISOFormatted: jest
      .fn()
      .mockImplementation(DateHandler.isStringISOFormatted),
    isValidDateString: jest
      .fn()
      .mockImplementation(DateHandler.isValidDateString),
    prepareDateFromString: jest
      .fn()
      .mockImplementation(DateHandler.prepareDateFromString),
    replaceBracketed: jest.fn().mockImplementation(replaceBracketed),
    setServiceIndicatorsForCase: jest
      .fn()
      .mockImplementation(setServiceIndicatorsForCase),
    sortDocketEntries: jest.fn().mockImplementation(sortDocketEntries),
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
    createCaseAndAssociations: jest
      .fn()
      .mockImplementation(createCaseAndAssociations),
    updateCaseAndAssociations: jest
      .fn()
      .mockImplementation(updateCaseAndAssociations),
    updateCaseAutomaticBlock: jest
      .fn()
      .mockImplementation(updateCaseAutomaticBlock),
  });

  const getDocumentGeneratorsReturnMock = {
    addressLabelCoverSheet: jest.fn().mockImplementation(getFakeFile),
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
    standingPretrialOrder: jest.fn().mockImplementation(getFakeFile),
    standingPretrialOrderForSmallCase: jest
      .fn()
      .mockImplementation(getFakeFile),
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
    addCaseToHearing: jest.fn(),
    bulkDeleteRecords: jest.fn().mockImplementation(bulkDeleteRecords),
    bulkIndexRecords: jest.fn().mockImplementation(bulkIndexRecords),
    createCase: jest.fn().mockImplementation(createCase),
    createCaseTrialSortMappingRecords: jest.fn(),
    createElasticsearchReindexRecord: jest.fn(),
    deleteCaseTrialSortMappingRecords: jest.fn(),
    deleteElasticsearchReindexRecord: jest.fn(),
    deleteRecord: jest.fn().mockImplementation(deleteRecord),
    deleteSectionOutboxRecord: jest
      .fn()
      .mockImplementation(deleteSectionOutboxRecord),
    deleteUserOutboxRecord: jest
      .fn()
      .mockImplementation(deleteUserOutboxRecord),
    deleteWorkItem: jest.fn(deleteWorkItem),
    fetchPendingItems: jest.fn(),
    getCalendaredCasesForTrialSession: jest.fn(),
    getCaseByDocketNumber: jest.fn().mockImplementation(getCaseByDocketNumber),
    getCaseDeadlinesByDateRange: jest.fn(),
    getCaseDeadlinesByDocketNumber: jest
      .fn()
      .mockImplementation(getCaseDeadlinesByDocketNumber),
    getDocumentQCInboxForSection: jest
      .fn()
      .mockImplementation(getDocumentQCInboxForSectionPersistence),
    getDocumentQCInboxForUser: jest
      .fn()
      .mockImplementation(getDocumentQCInboxForUserPersistence),
    getDocumentQCServedForSection: jest
      .fn()
      .mockImplementation(getDocumentQCInboxForSectionPersistence),
    getDownloadPolicyUrl: jest.fn(),
    getElasticsearchReindexRecords: jest.fn(),
    getFullCaseByDocketNumber: jest
      .fn()
      .mockImplementation(getFullCaseByDocketNumber),
    getItem: jest.fn().mockImplementation(getItem),
    getReconciliationReport: jest.fn(),
    getRecord: jest.fn(),
    getUserById: jest.fn().mockImplementation(getUserByIdPersistence),
    getWorkItemById: jest.fn().mockImplementation(getWorkItemByIdPersistence),
    incrementCounter,
    isEmailAvailable: jest.fn(),
    isFileExists: jest.fn(),
    persistUser: jest.fn(),
    putWorkItemInOutbox: jest.fn().mockImplementation(putWorkItemInOutbox),
    removeItem: jest.fn().mockImplementation(removeItem),
    saveDocumentFromLambda: jest.fn(),
    saveWorkItem: jest.fn().mockImplementation(saveWorkItem),
    setItem: jest.fn().mockImplementation(setItem),
    setPriorityOnAllWorkItems: jest.fn(),
    setWorkItemAsRead: jest.fn().mockImplementation(setWorkItemAsRead),
    updateCase: jest.fn().mockImplementation(updateCase),
    updateCaseCorrespondence: jest
      .fn()
      .mockImplementation(updateCaseCorrespondence),
    updateCaseHearing: jest.fn(),
    updateDocketEntry: jest.fn().mockImplementation(updateDocketEntry),
    updateWorkItem: jest.fn().mockImplementation(updateWorkItem),
    updateWorkItemInCase,
    uploadPdfFromClient: jest.fn().mockImplementation(() => ''),
    verifyCaseForUser: jest.fn().mockImplementation(verifyCaseForUser),
  });

  const nodeSassMockReturnValue = {
    render: (data, cb) => cb(null, { css: '' }),
  };

  const mockGetEmailClient = {
    sendBulkTemplatedEmail: jest.fn(),
  };

  const sendMessageMock = jest.fn().mockReturnValue({
    promise: () => {},
  });

  const mockGetQueueService = () => ({
    sendMessage: sendMessageMock,
  });

  const mockDocumentClient = createMockDocumentClient();

  const mockCreateDocketNumberGenerator = {
    createDocketNumber: jest.fn().mockImplementation(createDocketNumber),
  };

  const mockBroadcastGateway = {
    postMessage: jest.fn(),
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
    documentUrlTranslator: jest.fn().mockImplementation(documentUrlTranslator),
    environment: {
      appEndpoint: 'localhost:1234',
      dynamoDbTableName: 'efcms-local',
      stage: 'local',
      tempDocumentsBucketName: 'MockDocumentBucketName',
    },
    filterCaseMetadata: jest.fn(),
    getAppEndpoint: () => 'localhost:1234',
    getBaseUrl: () => 'http://localhost',
    getBroadcastGateway: jest.fn().mockReturnValue(mockBroadcastGateway),
    getCaseTitle: jest.fn().mockImplementation(Case.getCaseTitle),
    getChiefJudgeNameForSigning: jest.fn(),
    getChromiumBrowser: jest.fn().mockImplementation(() => {
      return mockGetChromiumBrowserReturnValue;
    }),
    getClerkOfCourtNameForSigning: jest.fn(),
    getCognito: appContextProxy({
      adminCreateUser: jest.fn().mockReturnValue({
        promise: jest.fn(),
      }),
      adminUpdateUserAttributes: jest.fn().mockReturnValue({
        promise: jest.fn(),
      }),
    }),
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
    getEmailClient: jest.fn().mockReturnValue(mockGetEmailClient),
    getEntityByName: jest.fn(),
    getEnvironment: jest.fn(),
    getFileReaderInstance: jest.fn(),
    getHttpClient: jest.fn().mockReturnValue(mockGetHttpClientReturnValue),
    getIrsSuperuserEmail: jest.fn(),
    getLogger: jest.fn().mockReturnValue({
      error: jest.fn(),
    }),
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
    getQueueService: mockGetQueueService,
    getReduceImageBlob: jest.fn().mockReturnValue(mockGetReduceImageBlobValue),
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
    logger: {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
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
Object.entries(applicationContext).forEach(([key, value]) => {
  if (typeof value === 'function') {
    applicationContextForClient[key] = value;
  }
});

const over1000Characters =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam volutpat turpis in turpis tincidunt sagittis. Pellentesque fringilla fringilla fermentum. Suspendisse porta semper diam sit amet lobortis. Nam commodo turpis velit, id vestibulum quam porttitor a. Nulla metus eros, interdum eu blandit non, scelerisque at tellus. Ut pretium pretium magna non feugiat. Pellentesque vestibulum tempor leo finibus lobortis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum blandit, urna eu porta eleifend, tortor ante aliquet arcu, non venenatis purus enim in ex. In sed accumsan nibh. In pulvinar id dui id aliquam. Vestibulum ante felis, porta id accumsan sed, hendrerit non arcu. Sed suscipit elit at metus pulvinar, iaculis vulputate justo volutpat. Pellentesque a dolor pharetra risus ornare semper eu at massa. Integer ut rutrum lacus, posuere dignissim massa. Etiam molestie at tortor mollis semper. Donec pulvinar mauris ac commodo malesuada. In quis tellus euismod, tempor quam et, dapibus lacus. Donec gravida tempor nunc, a maximus lectus fermentum vitae. Nullam hendrerit, nisi at fermentum scelerisque, massa nibh varius purus, at dapibus lorem massa id enim. Maecenas aliquet arcu mi, ut volutpat eros consectetur ac. Quisque dolor eros, posuere commodo vehicula sed, auctor ac nulla. Etiam sit amet massa justo. Nunc ullamcorper porta lorem quis maximus. Donec congue vel est eget accumsan. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean non suscipit tortor.';
const over3000Characters =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sapien diam, pellentesque nec sem quis, interdum condimentum ligula. Quisque interdum, tortor efficitur fringilla pharetra, elit risus blandit lacus, sit amet finibus felis lacus in felis. Curabitur at nisl velit. Vestibulum pellentesque tincidunt neque, vel maximus nisl porttitor nec. Nulla et sagittis lorem, in accumsan mi. Sed ultricies magna eu diam finibus, sed blandit sem ultrices. Nullam consequat malesuada vestibulum. Quisque dictum mattis vulputate. Sed ut facilisis nisi. Vestibulum in nunc nulla. Aenean ut dui iaculis, euismod nisl sit amet, porta ex. Quisque ultricies dui tellus, in maximus enim aliquet quis. Praesent id tincidunt ipsum. Sed non vulputate mauris. Praesent dignissim metus in nunc egestas, id tincidunt elit fringilla. In tincidunt, massa ut blandit condimentum, diam neque vulputate lacus, at condimentum tellus felis at nisl. Curabitur purus diam, cursus vel feugiat Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sapien diam, pellentesque nec sem quis, interdum condimentum ligula. Quisque interdum, tortor efficitur fringilla pharetra, elit risus blandit lacus, sit amet finibus felis lacus in felis. Curabitur at nisl velit. Vestibulum pellentesque tincidunt neque, vel maximus nisl porttitor nec. Nulla et sagittis lorem, in accumsan mi. Sed ultricies magna eu diam finibus, sed blandit sem ultrices. Nullam consequat malesuada vestibulum. Quisque dictum mattis vulputate. Sed ut facilisis nisi. Vestibulum in nunc nulla. Aenean ut dui iaculis, euismod nisl sit amet, porta ex. Quisque ultricies dui tellus, in maximus enim aliquet quis. Praesent id tincidunt ipsum. Sed non vulputate mauris. Praesent dignissim metus in nunc egestas, id tincidunt elit fringilla. In tincidunt, massa ut blandit condimentum, diam neque vulputate lacus, at condimentum tellus felis at nisl. Curabitur purus diam, cursus vel feugiat Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sapien diam, pellentesque nec sem quis, interdum condimentum ligula. Quisque interdum, tortor efficitur fringilla pharetra, elit risus blandit lacus, sit amet finibus felis lacus in felis. Curabitur at nisl velit. Vestibulum pellentesque tincidunt neque, vel maximus nisl porttitor nec. Nulla et sagittis lorem, in accumsan mi. Sed ultricies magna eu diam finibus, sed blandit sem ultrices. Nullam consequat malesuada vestibulum. Quisque dictum mattis vulputate. Sed ut facilisis nisi. Vestibulum in nunc nulla. Aenean ut dui iaculis, euismod nisl sit amet, porta ex. Quisque ultricies dui tellus, in maximus enim aliquet quis. Praesent id tincidunt ipsum. Sed non vulputate mauris. Praesent dignissim metus in nunc egestas, id tincidunt elit fringilla. In tincidunt, massa ut blandit condimentum, diam neque vulputate lacus, at condimentum tellus felis at nisl. Curabitur purus diam, cursus vel feugiat Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sapien diam, pellentesque nec se';

module.exports = {
  applicationContext,
  applicationContextForClient,
  createTestApplicationContext,
  fakeData,
  getFakeFile,
  over1000Characters,
  over3000Characters,
  testInvalidPdfDoc,
  testPdfDoc,
};
