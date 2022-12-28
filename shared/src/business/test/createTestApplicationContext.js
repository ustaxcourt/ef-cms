/* eslint-disable max-lines */
const DateHandler = require('../utilities/DateHandler');
const path = require('path');
const sharedAppContext = require('../../sharedAppContext');
const {
  addDocketEntryForSystemGeneratedOrder,
} = require('../useCaseHelper/addDocketEntryForSystemGeneratedOrder');
const {
  aggregatePartiesForService,
} = require('../utilities/aggregatePartiesForService');
const {
  bulkDeleteRecords,
} = require('../../persistence/elasticsearch/bulkDeleteRecords');
const {
  bulkIndexRecords,
} = require('../../persistence/elasticsearch/bulkIndexRecords');
const {
  canAllowDocumentServiceForCase,
  Case,
  caseHasServedDocketEntries,
  caseHasServedPetition,
  getContactPrimary,
  getContactSecondary,
  getOtherFilers,
  getPetitionDocketEntry,
  getPetitionerById,
  getPractitionersRepresenting,
  isLeadCase,
  isUserIdRepresentedByPrivatePractitioner,
} = require('../entities/cases/Case');
const {
  combineTwoPdfs,
} = require('../utilities/documentGenerators/combineTwoPdfs');
const {
  compareCasesByDocketNumber,
} = require('../utilities/getFormattedTrialSessionDetails');
const {
  compareISODateStrings,
  compareStrings,
} = require('../utilities/sortFunctions');
const {
  copyPagesAndAppendToTargetPdf,
} = require('../utilities/copyPagesAndAppendToTargetPdf');
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
  formatAttachments,
} = require('../../../src/business/utilities/formatAttachments');
const {
  formatCase,
  formatDocketEntry,
  sortDocketEntries,
} = require('../../../src/business/utilities/getFormattedCaseDetail');
const {
  formatCase: formatCaseForTrialSession,
} = require('../utilities/getFormattedTrialSessionDetails');
const {
  formatJudgeName,
  getJudgeLastName,
} = require('../../../src/business/utilities/getFormattedJudgeName');
const {
  formatPhoneNumber,
} = require('../../../src/business/utilities/formatPhoneNumber');
const {
  generateAndServeDocketEntry,
} = require('../useCaseHelper/service/createChangeItems');
const {
  generateNoticesForCaseTrialSessionCalendarInteractor,
} = require('../useCases/trialSessions/generateNoticesForCaseTrialSessionCalendarInteractor');
const {
  getAddressPhoneDiff,
} = require('../utilities/generateChangeOfAddressTemplate');
const {
  getAllWebSocketConnections,
} = require('../../persistence/dynamo/notifications/getAllWebSocketConnections');
const {
  getCaseByDocketNumber,
} = require('../../persistence/dynamo/cases/getCaseByDocketNumber');
const {
  getCaseDeadlinesByDocketNumber,
} = require('../../persistence/dynamo/caseDeadlines/getCaseDeadlinesByDocketNumber');
const {
  getChambersSections,
  getChambersSectionsLabels,
  getJudgesChambers,
  getJudgesChambersWithLegacy,
} = require('../../persistence/dynamo/chambers/getJudgesChambers');
const {
  getDocQcSectionForUser,
  getWorkQueueFilters,
} = require('../utilities/getWorkQueueFilters');
const {
  getDocumentQCInboxForSection: getDocumentQCInboxForSectionPersistence,
} = require('../../persistence/elasticsearch/workitems/getDocumentQCInboxForSection');
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
  getFormattedPartiesNameAndTitle,
} = require('../utilities/getFormattedPartiesNameAndTitle');
const {
  getFormattedTrialSessionDetails,
} = require('../utilities/getFormattedTrialSessionDetails');
const {
  getSealedDocketEntryTooltip,
} = require('../../../src/business/utilities/getSealedDocketEntryTooltip');
const {
  getStampBoxCoordinates,
} = require('../../../src/business/utilities/getStampBoxCoordinates');
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
  isStandaloneRemoteSession,
} = require('../entities/trialSessions/TrialSession');
const {
  putWorkItemInOutbox,
} = require('../../persistence/dynamo/workitems/putWorkItemInOutbox');
const {
  removeCounselFromRemovedPetitioner,
} = require('../useCaseHelper/caseAssociation/removeCounselFromRemovedPetitioner');
const {
  saveWorkItem,
} = require('../../persistence/dynamo/workitems/saveWorkItem');
const {
  sealDocketEntryInteractor,
} = require('../useCases/docketEntry/sealDocketEntryInteractor');
const {
  setConsolidationFlagsForDisplay,
} = require('../utilities/setConsolidationFlagsForDisplay');
const {
  setNoticesForCalendaredTrialSessionInteractor,
} = require('../useCases/trialSessions/setNoticesForCalendaredTrialSessionInteractor');
const {
  setServiceIndicatorsForCase,
} = require('../utilities/setServiceIndicatorsForCase');
const {
  setupPdfDocument,
} = require('../../../src/business/utilities/setupPdfDocument');
const {
  unsealDocketEntryInteractor,
} = require('../useCases/docketEntry/unsealDocketEntryInteractor');
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
  updateUserRecords,
} = require('../../persistence/dynamo/users/updateUserRecords');
const {
  uploadDocumentAndMakeSafeInteractor,
} = require('../useCases/uploadDocumentAndMakeSafeInteractor');
const {
  verifyCaseForUser,
} = require('../../persistence/dynamo/cases/verifyCaseForUser');
const { createCase } = require('../../persistence/dynamo/cases/createCase');
const { createMockDocumentClient } = require('./createMockDocumentClient');
const { DocketEntry } = require('../entities/DocketEntry');
const { ERROR_MAP_429 } = require('../../sharedAppContext');
const { filterEmptyStrings } = require('../utilities/filterEmptyStrings');
const { formatDollars } = require('../utilities/formatDollars');
const { getConstants } = require('../../../../web-client/src/getConstants');
const { getCropBox } = require('../../../src/business/utilities/getCropBox');
const { getDescriptionDisplay } = require('../utilities/getDescriptionDisplay');
const { getItem } = require('../../persistence/localStorage/getItem');
const { getServedPartiesCode, isServed } = require('../entities/DocketEntry');
const { getTextByCount } = require('../utilities/getTextByCount');
const { getUserIdForNote } = require('../useCaseHelper/getUserIdForNote');
const { removeItem } = require('../../persistence/localStorage/removeItem');
const { replaceBracketed } = require('../utilities/replaceBracketed');
const { ROLES } = require('../entities/EntityConstants');
const { sealCaseInteractor } = require('../useCases/sealCaseInteractor');
const { serveCaseDocument } = require('../utilities/serveCaseDocument');
const { setItem } = require('../../persistence/localStorage/setItem');
const { setPdfFormFields } = require('../useCaseHelper/pdf/setPdfFormFields');
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
  const emptyAppContextProxy = appContextProxy();

  const mockGetPdfJsReturnValue = {
    getDocument: jest.fn().mockReturnValue({
      promise: Promise.resolve({
        getPage: () => ({
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
    toBlob: jest.fn(),
  };

  const mockGetUtilities = appContextProxy({
    aggregatePartiesForService: jest
      .fn()
      .mockImplementation(aggregatePartiesForService),
    calculateISODate: jest
      .fn()
      .mockImplementation(DateHandler.calculateISODate),
    canAllowDocumentServiceForCase: jest
      .fn()
      .mockImplementation(canAllowDocumentServiceForCase),
    caseHasServedDocketEntries: jest
      .fn()
      .mockImplementation(caseHasServedDocketEntries),
    caseHasServedPetition: jest.fn().mockImplementation(caseHasServedPetition),
    checkDate: jest.fn().mockImplementation(DateHandler.checkDate),
    combineTwoPdfs: jest.fn().mockImplementation(combineTwoPdfs),
    compareCasesByDocketNumber: jest
      .fn()
      .mockImplementation(compareCasesByDocketNumber),
    compareISODateStrings: jest.fn().mockImplementation(compareISODateStrings),
    compareStrings: jest.fn().mockImplementation(compareStrings),
    computeDate: jest.fn().mockImplementation(DateHandler.computeDate),
    copyPagesAndAppendToTargetPdf: jest
      .fn()
      .mockImplementation(copyPagesAndAppendToTargetPdf),
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
    filterWorkItemsForUser: jest.fn(),
    formatAttachments: jest.fn().mockImplementation(formatAttachments),
    formatCase: jest.fn().mockImplementation(formatCase),
    formatCaseForTrialSession: jest
      .fn()
      .mockImplementation(formatCaseForTrialSession),
    formatDateString: jest
      .fn()
      .mockImplementation(DateHandler.formatDateString),
    formatDocketEntry: jest.fn().mockImplementation(formatDocketEntry),
    formatDollars: jest.fn().mockImplementation(formatDollars),
    formatJudgeName: jest.fn().mockImplementation(formatJudgeName),
    formatNow: jest.fn().mockImplementation(DateHandler.formatNow),
    formatPhoneNumber: jest.fn().mockImplementation(formatPhoneNumber),
    getAddressPhoneDiff: jest.fn().mockImplementation(getAddressPhoneDiff),
    getAttachmentDocumentById: jest
      .fn()
      .mockImplementation(Case.getAttachmentDocumentById),
    getBusinessDateInFuture: jest
      .fn()
      .mockImplementation(DateHandler.getBusinessDateInFuture),
    getCaseCaption: jest.fn().mockImplementation(Case.getCaseCaption),
    getContactPrimary: jest.fn().mockImplementation(getContactPrimary),
    getContactSecondary: jest.fn().mockImplementation(getContactSecondary),
    getCropBox: jest.fn().mockImplementation(getCropBox),
    getDescriptionDisplay: jest.fn().mockImplementation(getDescriptionDisplay),
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
    getFormattedPartiesNameAndTitle: jest
      .fn()
      .mockImplementation(getFormattedPartiesNameAndTitle),
    getFormattedTrialSessionDetails: jest
      .fn()
      .mockImplementation(getFormattedTrialSessionDetails),
    getJudgeLastName: jest.fn().mockImplementation(getJudgeLastName),
    getMonthDayYearInETObj: jest
      .fn()
      .mockImplementation(DateHandler.getMonthDayYearInETObj),
    getOtherFilers: jest.fn().mockImplementation(getOtherFilers),
    getPetitionDocketEntry: jest
      .fn()
      .mockImplementation(getPetitionDocketEntry),
    getPetitionerById: jest.fn().mockImplementation(getPetitionerById),
    getPractitionersRepresenting: jest
      .fn()
      .mockImplementation(getPractitionersRepresenting),
    getSealedDocketEntryTooltip: jest
      .fn()
      .mockImplementation(getSealedDocketEntryTooltip),
    getServedPartiesCode: jest.fn().mockImplementation(getServedPartiesCode),
    getSortableDocketNumber: jest
      .fn()
      .mockImplementation(Case.getSortableDocketNumber),
    getStampBoxCoordinates: jest
      .fn()
      .mockImplementation(getStampBoxCoordinates),
    getTextByCount: jest.fn().mockImplementation(getTextByCount),
    getWorkQueueFilters: jest.fn().mockImplementation(getWorkQueueFilters),
    isExternalUser: User.isExternalUser,
    isInternalUser: jest.fn().mockImplementation(User.isInternalUser),
    isLeadCase: jest.fn().mockImplementation(isLeadCase),
    isPending: jest.fn().mockImplementation(DocketEntry.isPending),
    isServed: jest.fn().mockImplementation(isServed),
    isStandaloneRemoteSession: jest
      .fn()
      .mockImplementation(isStandaloneRemoteSession),
    isStringISOFormatted: jest
      .fn()
      .mockImplementation(DateHandler.isStringISOFormatted),
    isUserIdRepresentedByPrivatePractitioner: jest
      .fn()
      .mockImplementation(isUserIdRepresentedByPrivatePractitioner),
    isValidDateString: jest
      .fn()
      .mockImplementation(DateHandler.isValidDateString),
    prepareDateFromString: jest
      .fn()
      .mockImplementation(DateHandler.prepareDateFromString),
    replaceBracketed: jest.fn().mockImplementation(replaceBracketed),

    serveCaseDocument: jest.fn().mockImplementation(serveCaseDocument),
    setConsolidationFlagsForDisplay: jest
      .fn()
      .mockImplementation(setConsolidationFlagsForDisplay),
    setServiceIndicatorsForCase: jest
      .fn()
      .mockImplementation(setServiceIndicatorsForCase),
    setupPdfDocument: jest.fn().mockImplementation(setupPdfDocument),
    sortDocketEntries: jest.fn().mockImplementation(sortDocketEntries),
    uploadToS3: jest.fn(),
    validateDateAndCreateISO: jest
      .fn()
      .mockImplementation(DateHandler.validateDateAndCreateISO),
  });

  const mockGetHttpClientReturnValue = {
    get: () => ({
      data: 'url',
    }),
    post: jest.fn(),
  };

  const mockGetUseCases = appContextProxy({
    generateNoticesForCaseTrialSessionCalendarInteractor: jest
      .fn()
      .mockImplementation(generateNoticesForCaseTrialSessionCalendarInteractor),
    sealCaseInteractor: jest.fn().mockImplementation(sealCaseInteractor),
    sealDocketEntryInteractor: jest
      .fn()
      .mockImplementation(sealDocketEntryInteractor),
    setNoticesForCalendaredTrialSessionInteractor: jest
      .fn()
      .mockImplementation(setNoticesForCalendaredTrialSessionInteractor),
    unsealDocketEntryInteractor: jest
      .fn()
      .mockImplementation(unsealDocketEntryInteractor),
    uploadDocumentAndMakeSafeInteractor: jest
      .fn()
      .mockImplementation(uploadDocumentAndMakeSafeInteractor),
  });

  const mockGetUseCaseHelpers = appContextProxy({
    addDocketEntryForSystemGeneratedOrder: jest
      .fn()
      .mockImplementation(addDocketEntryForSystemGeneratedOrder),
    createCaseAndAssociations: jest
      .fn()
      .mockImplementation(createCaseAndAssociations),
    generateAndServeDocketEntry: jest
      .fn()
      .mockImplementation(generateAndServeDocketEntry),
    getJudgeInSectionHelper: jest.fn(),
    getUserIdForNote: jest.fn().mockImplementation(getUserIdForNote),
    removeCounselFromRemovedPetitioner: jest
      .fn()
      .mockImplementation(removeCounselFromRemovedPetitioner),
    sendServedPartiesEmails: jest.fn(),
    setPdfFormFields: jest.fn().mockImplementation(setPdfFormFields),
    updateCaseAndAssociations: jest
      .fn()
      .mockImplementation(updateCaseAndAssociations),
    updateCaseAutomaticBlock: jest
      .fn()
      .mockImplementation(updateCaseAutomaticBlock),
    updateUserRecords: jest.fn().mockImplementation(updateUserRecords),
  });

  const getDocumentGeneratorsReturnMock = {
    addressLabelCoverSheet: jest.fn().mockImplementation(getFakeFile),
    caseInventoryReport: jest.fn().mockImplementation(getFakeFile),
    changeOfAddress: jest.fn().mockImplementation(getFakeFile),
    coverSheet: jest.fn().mockImplementation(getFakeFile),
    docketRecord: jest.fn().mockImplementation(getFakeFile),
    noticeOfChangeOfTrialJudge: jest.fn().mockImplementation(getFakeFile),
    noticeOfChangeToInPersonProceeding: jest
      .fn()
      .mockImplementation(getFakeFile),
    noticeOfChangeToRemoteProceeding: jest.fn().mockImplementation(getFakeFile),
    noticeOfDocketChange: jest.fn().mockImplementation(getFakeFile),
    noticeOfReceiptOfPetition: jest.fn().mockImplementation(getFakeFile),
    noticeOfTrialIssued: jest.fn().mockImplementation(getFakeFile),
    noticeOfTrialIssuedInPerson: jest.fn().mockImplementation(getFakeFile),
    order: jest.fn().mockImplementation(getFakeFile),
    pendingReport: jest.fn().mockImplementation(getFakeFile),
    practitionerCaseList: jest.fn().mockImplementation(getFakeFile),
    printableWorkingCopySessionList: jest.fn().mockImplementation(getFakeFile),
    receiptOfFiling: jest.fn().mockImplementation(getFakeFile),
    standingPretrialOrder: jest.fn().mockImplementation(getFakeFile),
    standingPretrialOrderForSmallCase: jest
      .fn()
      .mockImplementation(getFakeFile),
    trialCalendar: jest.fn().mockImplementation(getFakeFile),
    trialSessionPlanningReport: jest.fn().mockImplementation(getFakeFile),
  };

  const mockGetChromiumBrowserReturnValue = {
    close: jest.fn(),
    newPage: jest.fn().mockReturnValue({
      pdf: jest.fn(),
      setContent: jest.fn(),
    }),
  };

  const mockGetStorageClient = appContextProxy({
    deleteObject: jest.fn().mockReturnValue({ promise: () => {} }),
    getObject: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Body: 's3-get-object-body' }),
    }),
    putObject: jest.fn().mockReturnValue({ promise: () => {} }),
  });

  const mockGetPersistenceGateway = appContextProxy({
    addCaseToHearing: jest.fn(),
    bulkDeleteRecords: jest.fn().mockImplementation(bulkDeleteRecords),
    bulkIndexRecords: jest.fn().mockImplementation(bulkIndexRecords),
    createCase: jest.fn().mockImplementation(createCase),
    createCaseTrialSortMappingRecords: jest.fn(),
    createElasticsearchReindexRecord: jest.fn(),
    deleteCaseTrialSortMappingRecords: jest.fn(),
    deleteDocumentFile: jest.fn(),
    deleteElasticsearchReindexRecord: jest.fn(),
    deleteKeyCount: jest.fn(),
    deleteRecord: jest.fn().mockImplementation(deleteRecord),
    deleteWorkItem: jest.fn(deleteWorkItem),
    fetchPendingItems: jest.fn(),
    getAllWebSocketConnections: jest
      .fn()
      .mockImplementation(getAllWebSocketConnections),
    getCalendaredCasesForTrialSession: jest.fn(),
    getCaseByDocketNumber: jest.fn().mockImplementation(getCaseByDocketNumber),
    getCaseDeadlinesByDateRange: jest.fn(),
    getCaseDeadlinesByDocketNumber: jest
      .fn()
      .mockImplementation(getCaseDeadlinesByDocketNumber),
    getChambersSections: jest.fn().mockImplementation(getChambersSections),
    getChambersSectionsLabels: jest
      .fn()
      .mockImplementation(getChambersSectionsLabels),
    getDispatchNotification: jest.fn(),
    getDocument: jest.fn(),
    getDocumentQCInboxForSection: jest.fn(),
    getDocumentQCInboxForUser: jest.fn(),
    getDocumentQCServedForSection: jest
      .fn()
      .mockImplementation(getDocumentQCInboxForSectionPersistence),
    getDownloadPolicyUrl: jest
      .fn()
      .mockReturnValue({ url: 'http://example.com/' }),
    getElasticsearchReindexRecords: jest.fn(),
    getItem: jest.fn().mockImplementation(getItem),
    getJudgesChambers: jest.fn().mockImplementation(getJudgesChambers),
    getJudgesChambersWithLegacy: jest
      .fn()
      .mockImplementation(getJudgesChambersWithLegacy),
    getLimiterByKey: jest.fn(),
    getMaintenanceMode: jest.fn(),
    getMessagesByDocketNumber: jest.fn(),
    getPractitionerDocuments: jest.fn(),
    getReconciliationReport: jest.fn(),
    getRecord: jest.fn(),
    getTrialSessionJobStatusForCase: jest.fn(),
    getUserById: jest.fn().mockImplementation(getUserByIdPersistence),
    getUserCaseMappingsByDocketNumber: jest.fn().mockReturnValue([]),
    getWorkItemById: jest.fn().mockImplementation(getWorkItemByIdPersistence),
    getWorkItemsByDocketNumber: jest.fn().mockReturnValue([]),
    incrementCounter,
    incrementKeyCount: jest.fn(),
    isEmailAvailable: jest.fn(),
    isFileExists: jest.fn(),
    persistUser: jest.fn(),
    putWorkItemInOutbox: jest.fn().mockImplementation(putWorkItemInOutbox),
    removeItem: jest.fn().mockImplementation(removeItem),
    saveDispatchNotification: jest.fn(),
    saveDocumentFromLambda: jest.fn(),
    saveWorkItem: jest.fn().mockImplementation(saveWorkItem),
    setExpiresAt: jest.fn(),
    setItem: jest.fn().mockImplementation(setItem),
    setPriorityOnAllWorkItems: jest.fn(),
    setTrialSessionJobStatusForCase: jest.fn(),
    updateCase: jest.fn().mockImplementation(updateCase),
    updateCaseCorrespondence: jest
      .fn()
      .mockImplementation(updateCaseCorrespondence),
    updateCaseHearing: jest.fn(),
    updateDocketEntry: jest.fn().mockImplementation(updateDocketEntry),
    uploadPdfFromClient: jest.fn().mockImplementation(() => ''),
    verifyCaseForUser: jest.fn().mockImplementation(verifyCaseForUser),
  });

  const mockGetEmailClient = {
    sendBulkTemplatedEmail: jest.fn(),
  };

  const mockGetMessagingClient = {
    deleteMessage: jest.fn().mockReturnValue({ promise: () => {} }),
    sendMessage: jest.fn().mockReturnValue({ promise: () => {} }),
  };

  const mockDocumentClient = createMockDocumentClient();

  const mockCreateDocketNumberGenerator = {
    createDocketNumber: jest.fn().mockImplementation(createDocketNumber),
  };

  const mockBroadcastGateway = {
    postMessage: jest.fn(),
  };

  const mockGetNotificationService = {
    publish: jest.fn().mockReturnValue({
      promise: () => Promise.resolve('ok'),
    }),
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
    getBounceAlertRecipients: jest.fn(),
    getBroadcastGateway: jest.fn().mockReturnValue(mockBroadcastGateway),
    getCaseTitle: jest.fn().mockImplementation(Case.getCaseTitle),
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
    getConstants: jest.fn().mockImplementation(() => {
      return {
        ...getConstants(),
        ERROR_MAP_429,
      };
    }),
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
      sendNotificationOfSealing: jest.fn(),
      sendSlackNotification: jest.fn(),
    }),
    getDocumentClient: jest.fn().mockImplementation(() => mockDocumentClient),
    getDocumentGenerators: jest
      .fn()
      .mockReturnValue(getDocumentGeneratorsReturnMock),
    getDocumentsBucketName: jest.fn().mockReturnValue('DocumentBucketName'),
    getEmailClient: jest.fn().mockReturnValue(mockGetEmailClient),
    getEntityByName: jest.fn(),
    getEnvironment: jest.fn().mockReturnValue({
      stage: 'local',
    }),
    getFileReaderInstance: jest.fn(),
    getHttpClient: jest.fn().mockReturnValue(mockGetHttpClientReturnValue),
    getIrsSuperuserEmail: jest.fn(),
    getLogger: jest.fn().mockReturnValue({
      error: jest.fn(),
    }),
    getMessageGateway: appContextProxy({
      sendCalendarSessionEvent: jest.fn(),
      sendEmailEventToQueue: jest.fn(),
      sendSetTrialSessionCalendarEvent: jest.fn(),
      sendUpdatePetitionerCasesMessage: jest.fn(),
    }),
    getMessagingClient: jest.fn().mockReturnValue(mockGetMessagingClient),
    getNodeSass: jest.fn().mockReturnValue(require('sass')),
    getNotificationClient: jest.fn(),
    getNotificationGateway: emptyAppContextProxy,
    getNotificationService: jest
      .fn()
      .mockReturnValue(mockGetNotificationService),
    getPdfJs: jest.fn().mockReturnValue(mockGetPdfJsReturnValue),
    getPdfLib: jest.fn().mockResolvedValue(require('pdf-lib')),
    getPersistenceGateway: mockGetPersistenceGateway,
    getPug: jest.fn().mockReturnValue(require('pug')),
    getQuarantineBucketName: jest.fn().mockReturnValue('QuarantineBucketName'),
    getReduceImageBlob: jest.fn().mockReturnValue(mockGetReduceImageBlobValue),
    getScanner: jest.fn().mockReturnValue(mockGetScannerReturnValue),
    getScannerResourceUri: jest.fn().mockReturnValue(scannerResourcePath),
    getSearchClient: emptyAppContextProxy,
    getSlackWebhookUrl: jest.fn(),
    getStorageClient: mockGetStorageClient,
    getTempDocumentsBucketName: jest.fn(),
    getUniqueId: jest.fn().mockImplementation(sharedAppContext.getUniqueId),
    getUseCaseHelpers: mockGetUseCaseHelpers,
    getUseCases: mockGetUseCases,
    getUtilities: mockGetUtilities,
    isFeatureEnabled: jest.fn(),
    logger: {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    },
    runVirusScan: jest.fn(),
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

module.exports = {
  applicationContext,
  applicationContextForClient,
  createTestApplicationContext,
  fakeData,
  getFakeFile,
  testInvalidPdfDoc,
  testPdfDoc,
};
