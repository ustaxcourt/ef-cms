const createWebApiApplicationContext = require('../../../../web-api/src/applicationContext');
const DateHandler = require('../utilities/DateHandler');
const docketNumberGenerator = require('../../persistence/dynamo/cases/docketNumberGenerator');
const sharedAppContext = require('../../sharedAppContext');
const {
  addWorkItemToSectionInbox,
} = require('../../persistence/dynamo/workitems/addWorkItemToSectionInbox');
const {
  applicationContext: webClientApplicationContext,
} = require('../../../../web-client/src/applicationContext');
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
const { Document } = require('../entities/Document');
const { CaseInternal } = require('../entities/cases/CaseInternal');
const { createCase } = require('../../persistence/dynamo/cases/createCase');
const { createMockDocumentClient } = require('./createMockDocumentClient');
const { filterEmptyStrings } = require('../utilities/filterEmptyStrings');
const { updateCase } = require('../../persistence/dynamo/cases/updateCase');
const { User } = require('../entities/User');
const { WorkItem } = require('../entities/WorkItem');

const webApiApplicationContext = createWebApiApplicationContext({});

const createTestApplicationContext = ({ user } = {}) => {
  const mockCognitoReturnValue = {
    adminCreateUser: jest.fn(),
    adminGetUser: jest.fn(),
    adminUpdateUserAttributes: jest.fn(),
  };

  const mockGetUseCasesReturnValue = {
    addCaseToTrialSessionInteractor: jest.fn(),
    addConsolidatedCaseInteractor: jest.fn(),
    addCoversheetInteractor: jest.fn(),
    archiveDraftDocumentInteractor: jest.fn(),
    generatePrintableFilingReceiptInteractor: jest.fn(),
    assignWorkItemsInteractor: jest.fn(),
    validateExternalDocumentInformationInteractor: jest.fn(),
    associateIrsPractitionerWithCaseInteractor: jest.fn(),
    associatePrivatePractitionerWithCaseInteractor: jest.fn(),
    caseAdvancedSearchInteractor: jest.fn(),
    completeDocketEntryQCInteractor: jest.fn(),
    createCaseDeadlineInteractor: jest.fn(),
    createCourtIssuedOrderPdfFromHtmlInteractor: jest.fn(),
    deleteCaseNoteInteractor: jest.fn(),
    deleteCounselFromCaseInteractor: jest.fn(),
    fileCourtIssuedDocketEntryInteractor: jest.fn(),
    fileCourtIssuedOrderInteractor: jest.fn(),
    fileDocketEntryInteractor: jest.fn(),
    fileExternalDocumentForConsolidatedInteractor: jest.fn(),
    fileExternalDocumentInteractor: jest.fn(),
    generateCourtIssuedDocumentTitleInteractor: jest.fn(),
    generateDocumentTitleInteractor: jest.fn(),
    generatePdfFromHtmlInteractor: jest.fn(),
    generatePrintableCaseInventoryReportInteractor: jest.fn(),
    getAllCaseDeadlinesInteractor: jest.fn(),
    uploadExternalDocumentsInteractor: jest.fn(),
    getBlockedCasesInteractor: jest.fn(),
    submitCaseAssociationRequestInteractor: jest.fn(),
    submitPendingCaseAssociationRequestInteractor: jest.fn(),
    getCalendaredCasesForTrialSessionInteractor: jest.fn(),
    getCaseDeadlinesForCaseInteractor: jest.fn(),
    getCaseInventoryReportInteractor: jest.fn(),
    getIrsPractitionersBySearchKeyInteractor: jest.fn(),
    getJudgeForUserChambersInteractor: jest.fn(),
    getPrivatePractitionersBySearchKeyInteractor: jest.fn(),
    removeCasePendingItemInteractor: jest.fn(),
    removeConsolidatedCasesInteractor: jest.fn(),
    removeItemInteractor: jest.fn(),
    saveCaseNoteInteractor: jest.fn(),
    saveIntermediateDocketEntryInteractor: jest.fn(),
    setWorkItemAsReadInteractor: jest.fn(),
    updateCaseContextInteractor: jest.fn(),
    updateCounselOnCaseInteractor: jest.fn(),
    updateCourtIssuedDocketEntryInteractor: jest.fn(),
    updateDocketEntryInteractor: jest.fn(),
    updateDocketEntryMetaInteractor: jest.fn(),
    uploadOrderDocumentInteractor: jest.fn(),
    validateAddIrsPractitionerInteractor: jest.fn(),
    validateAddPrivatePractitionerInteractor: jest.fn(),
    validateCaseAdvancedSearchInteractor: jest.fn(),
    validateCaseDeadlineInteractor: jest.fn(),
    validateCourtIssuedDocketEntryInteractor: jest.fn(),
    validateDocketEntryInteractor: jest.fn(),
    validateDocketRecordInteractor: jest.fn(),
    validateEditPrivatePractitionerInteractor: jest.fn(),
    validatePdfInteractor: jest.fn(),
    virusScanPdfInteractor: jest.fn(),
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

  const mockGetUtilitiesReturnValue = {
    createISODateString: jest
      .fn()
      .mockImplementation(DateHandler.createISODateString),
    deconstructDate: jest.fn().mockImplementation(DateHandler.deconstructDate),
<<<<<<< HEAD
=======
    filterEmptyStrings: jest.fn().mockImplementation(filterEmptyStrings),
>>>>>>> origin/shared-app-context
    formatDateString: jest.fn().mockReturnValue(DateHandler.formatDateString),
    formatDocument: jest.fn().mockImplementation(v => v),
    formatNow: jest.fn().mockImplementation(DateHandler.formatNow),
    getDocumentTypeForAddressChange: jest.fn(),
    getFilingsAndProceedings: jest.fn().mockReturnValue(''),
    prepareDateFromString: jest
      .fn()
      .mockImplementation(DateHandler.prepareDateFromString),
  };

  const mockGetUseCaseHelpers = {
    sendServedPartiesEmails: jest.fn(),
    updateCaseAutomaticBlock: jest
      .fn()
      .mockImplementation(updateCaseAutomaticBlock),
  };

  const getTemplateGeneratorsReturnMock = {
    generateChangeOfAddressTemplate: jest.fn().mockResolvedValue('<div></div>'),
    generateHTMLTemplateForPDF: jest.fn().mockReturnValue('<div></div>'),
    generatePrintableDocketRecordTemplate: jest
      .fn()
      .mockResolvedValue('<div></div>'),
  };

  const mockGetPersistenceGatewayReturnValue = {
    addWorkItemToSectionInbox,
    associateUserWithCase: jest.fn(),
    createAttorneyUser: jest.fn(),
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
    getCaseByDocketNumber: jest.fn(),
    getCaseByUser: jest.fn(),
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
    getUsersBySearchKey: jest.fn(),
    getWorkItemById: jest.fn().mockImplementation(getWorkItemByIdPersistence),
    incrementCounter,
    putWorkItemInOutbox: jest.fn().mockImplementation(putWorkItemInOutbox),
    saveDocumentFromLambda: jest.fn(),
    saveWorkItemForNonPaper: jest
      .fn()
      .mockImplementation(saveWorkItemForNonPaper),
    saveWorkItemForPaper,
    setItem: jest.fn(),
    setWorkItemAsRead,
    updateAttorneyUser: jest.fn(),
    updateCase: jest.fn().mockImplementation(updateCase),
    updateUser: jest.fn(),
    updateUserCaseNote: jest.fn(),
    updateWorkItem,
    updateWorkItemInCase,
    uploadDocumentFromClient: jest.fn(),
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
    getCaseCaptionNames: jest.fn().mockImplementation(Case.getCaseCaptionNames),
    getChiefJudgeNameForSigning: jest
      .fn()
      .mockImplementation(sharedAppContext.getChiefJudgeNameForSigning),
    getChromiumBrowser: jest.fn(),
    getClerkOfCourtNameForSigning: jest.fn(),
    getCognito: () => mockCognitoReturnValue,
    getConstants: jest.fn().mockReturnValue({
      ...webClientApplicationContext.getConstants(),
      ...webApiApplicationContext.getConstants(),
    }),
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
      Case,
      Document,
      CaseExternal: CaseExternalIncomplete,
      CaseInternal,
      WorkItem: WorkItem,
    }),
    getFileReader: jest.fn(),
    getHttpClient: jest.fn(() => ({
      get: () => ({
        data: 'url',
      }),
    })),
    getNodeSass: jest.fn().mockReturnValue(nodeSassMockReturnValue),
    getPdfJs: jest.fn(),
    getPdfStyles: jest.fn(),
    getPersistenceGateway: jest.fn().mockImplementation(() => {
      return mockGetPersistenceGatewayReturnValue;
    }),
    getPug: jest.fn(),
    getScanner: jest.fn().mockReturnValue(mockGetScannerReturnValue),
    getStorageClient: jest.fn().mockImplementation(() => {
      return mockStorageClientReturnValue;
    }),
    getTempDocumentsBucketName: jest.fn(),
    getTemplateGenerators: jest
      .fn()
      .mockReturnValue(getTemplateGeneratorsReturnMock),
    getUniqueId: jest.fn().mockImplementation(sharedAppContext.getUniqueId),
    getUseCaseHelpers: jest.fn().mockReturnValue(mockGetUseCaseHelpers),
    getUseCases: jest.fn().mockReturnValue(mockGetUseCasesReturnValue),
    getUtilities: jest.fn().mockReturnValue(mockGetUtilitiesReturnValue),
    isAuthorizedForWorkItems: jest.fn().mockReturnValue(() => true),
    logger: {
      error: jest.fn(),
      info: jest.fn(),
      time: () => jest.fn().mockReturnValue(null),
      timeEnd: () => jest.fn().mockReturnValue(null),
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
