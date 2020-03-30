const createWebApiApplicationContext = require('../../../../web-api/src/applicationContext');
const DateHandler = require('../utilities/DateHandler');
const docketNumberGenerator = require('../../persistence/dynamo/cases/docketNumberGenerator');
const path = require('path');
const sharedAppContext = require('../../sharedAppContext');
const {
  addWorkItemToSectionInbox,
} = require('../../persistence/dynamo/workitems/addWorkItemToSectionInbox');
const {
  applicationContext: webClientApplicationContext,
} = require('../../../../web-client/src/applicationContext');
const {
  CaseAssociationRequestFactory,
} = require('../entities/CaseAssociationRequestFactory');
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
  ExternalDocumentFactory,
} = require('../entities/externalDocument/ExternalDocumentFactory');
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
const { DocketRecord } = require('../entities/DocketRecord');
const { Document } = require('../entities/Document');
const { filterEmptyStrings } = require('../utilities/filterEmptyStrings');
const { TrialSession } = require('../entities/trialSessions/TrialSession');
const { updateCase } = require('../../persistence/dynamo/cases/updateCase');
const { User } = require('../entities/User');
const { WorkItem } = require('../entities/WorkItem');

const scannerResourcePath = path.join(__dirname, '../../../shared/test-assets');

const webApiApplicationContext = createWebApiApplicationContext({});

const createTestApplicationContext = ({ user } = {}) => {
  const mockCognitoReturnValue = {
    adminCreateUser: jest.fn(),
    adminGetUser: jest.fn(),
    adminUpdateUserAttributes: jest.fn(),
  };
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
  const mockGetUseCasesReturnValue = {
    addCaseToTrialSessionInteractor: jest.fn(),
    addConsolidatedCaseInteractor: jest.fn(),
    addCoversheetInteractor: jest.fn(),
    archiveDraftDocumentInteractor: jest.fn(),
    assignWorkItemsInteractor: jest.fn(),
    associateIrsPractitionerWithCaseInteractor: jest.fn(),
    associatePrivatePractitionerWithCaseInteractor: jest.fn(),
    authorizeCodeInteractor: jest.fn(),
    batchDownloadTrialSessionInteractor: jest.fn(),
    caseAdvancedSearchInteractor: jest.fn(),
    casePublicSearchInteractor: jest.fn(),
    completeDocketEntryQCInteractor: jest.fn(),
    completeWorkItemInteractor: jest.fn(),
    createAttorneyUserInteractor: jest.fn(),
    createCaseDeadlineInteractor: jest.fn(),
    createCourtIssuedOrderPdfFromHtmlInteractor: jest.fn(),
    createTrialSessionInteractor: jest.fn(),
    createWorkItemInteractor: jest.fn(),
    deleteCaseNoteInteractor: jest.fn(),
    deleteCounselFromCaseInteractor: jest.fn(),
    deleteTrialSessionInteractor: jest.fn(),
    deleteUserCaseNoteInteractor: jest.fn(),
    fetchPendingItemsInteractor: jest.fn(),
    fileCourtIssuedDocketEntryInteractor: jest.fn(),
    fileCourtIssuedOrderInteractor: jest.fn(),
    fileDocketEntryInteractor: jest.fn(),
    fileExternalDocumentForConsolidatedInteractor: jest.fn(),
    fileExternalDocumentInteractor: jest.fn(),
    filePetitionFromPaperInteractor: jest.fn(),
    filePetitionInteractor: jest.fn(),
    generateCourtIssuedDocumentTitleInteractor: jest.fn(),
    generateDocketRecordPdfInteractor: jest.fn(),
    generateDocumentTitleInteractor: jest.fn(),
    generatePDFFromJPGDataInteractor: jest.fn(),
    generatePdfFromHtmlInteractor: jest.fn(),
    generatePrintableCaseInventoryReportInteractor: jest.fn(),
    generatePrintableFilingReceiptInteractor: jest.fn(),
    generatePrintablePendingReportInteractor: jest.fn(),
    generatePublicDocketRecordPdfInteractor: jest.fn(),
    generateSignedDocumentInteractor: jest.fn(),
    generateTrialCalendarPdfInteractor: jest.fn(),
    getAllCaseDeadlinesInteractor: jest.fn(),
    getBlockedCasesInteractor: jest.fn(),
    getCalendaredCasesForTrialSessionInteractor: jest.fn(),
    getCaseDeadlinesForCaseInteractor: jest.fn(),
    getCaseInteractor: jest.fn(),
    getCaseInventoryReportInteractor: jest.fn(),
    getCasesByUserInteractor: jest.fn(),
    getConsolidatedCasesByCaseInteractor: jest.fn(),
    getEligibleCasesForTrialSessionInteractor: jest.fn(),
    getInboxMessagesForSectionInteractor: jest.fn(),
    getInboxMessagesForUserInteractor: jest.fn(),
    getIrsPractitionersBySearchKeyInteractor: jest.fn(),
    getJudgeForUserChambersInteractor: jest.fn(),
    getNotificationsInteractor: jest.fn(),
    getPrivatePractitionersBySearchKeyInteractor: jest.fn(),
    getTrialSessionDetailsInteractor: jest.fn(),
    getTrialSessionWorkingCopyInteractor: jest.fn(),
    getTrialSessionsInteractor: jest.fn(),
    getUserByIdInteractor: jest.fn(),
    getUserCaseNoteForCasesInteractor: jest.fn(),
    getUserCaseNoteInteractor: jest.fn(),
    getUserInteractor: jest.fn(),
    getUsersInSectionInteractor: jest.fn(),
    loadPDFForPreviewInteractor: jest.fn(),
    loadPDFForSigningInteractor: jest.fn(),
    refreshTokenInteractor: jest.fn(),
    removeCasePendingItemInteractor: jest.fn(),
    removeConsolidatedCasesInteractor: jest.fn(),
    removeItemInteractor: jest.fn(),
    runTrialSessionPlanningReportInteractor: jest.fn(),
    saveCaseDetailInternalEditInteractor: jest.fn(),
    saveCaseNoteInteractor: jest.fn(),
    saveIntermediateDocketEntryInteractor: jest.fn(),
    serveCaseToIrsInteractor: jest.fn(),
    serveCourtIssuedDocumentInteractor: jest.fn(),
    setItemInteractor: jest.fn(),
    setNoticesForCalendaredTrialSessionInteractor: jest.fn(),
    setTrialSessionAsSwingSessionInteractor: jest.fn(),
    setTrialSessionCalendarInteractor: jest.fn(),
    setWorkItemAsReadInteractor: jest.fn(),
    signDocumentInteractor: jest.fn(),
    submitCaseAssociationRequestInteractor: jest.fn(),
    submitPendingCaseAssociationRequestInteractor: jest.fn(),
    updateAttorneyUserInteractor: jest.fn(),
    updateCase: jest.fn(),
    updateCaseContextInteractor: jest.fn(),
    updateCaseTrialSortTagsInteractor: jest.fn(),
    updateCounselOnCaseInteractor: jest.fn(),
    updateCourtIssuedDocketEntryInteractor: jest.fn(),
    updateDocketEntryInteractor: jest.fn(),
    updateDocketEntryMetaInteractor: jest.fn(),
    updatePetitionDetailsInteractor: jest.fn(),
    updatePetitionerInformationInteractor: jest.fn(),
    updateQcCompleteForTrialInteractor: jest.fn(),
    updateSecondaryContactInteractor: jest.fn(),
    updateTrialSessionInteractor: jest.fn(),
    updateTrialSessionWorkingCopyInteractor: jest.fn(),
    updateUserCaseNoteInteractor: jest.fn(),
    updateUserContactInformationInteractor: jest.fn(),
    uploadExternalDocumentsInteractor: jest.fn(),
    uploadOrderDocumentInteractor: jest.fn(),
    validateAddIrsPractitionerInteractor: jest.fn(),
    validateAddPrivatePractitionerInteractor: jest.fn(),
    validateCaseAdvancedSearchInteractor: jest.fn(),
    validateCaseAssociationRequestInteractor: jest.fn(),
    validateCaseDeadlineInteractor: jest.fn(),
    validateCaseDetailInteractor: jest.fn(),
    validateCourtIssuedDocketEntryInteractor: jest.fn(),
    validateDocketEntryInteractor: jest.fn(),
    validateDocketRecordInteractor: jest.fn(),
    validateEditPrivatePractitionerInteractor: jest.fn(),
    validateExternalDocumentInformationInteractor: jest.fn(),
    validateExternalDocumentInteractor: jest.fn(),
    validateForwardMessageInteractor: jest.fn(),
    validateInitialWorkItemMessageInteractor: jest.fn(),
    validateNoteInteractor: jest.fn(),
    validatePdfInteractor: jest.fn(),
    validatePetitionFromPaperInteractor: jest.fn(),
    validatePetitionInteractor: jest.fn(),
    validatePetitionerInformationFormInteractor: jest.fn(),
    validatePrimaryContactInteractor: jest.fn(),
    validateSecondaryContactInteractor: jest.fn(),
    validateStartCaseWizardInteractor: jest.fn(),
    validateTrialSessionInteractor: jest.fn(),
    validateUserContactInteractor: jest.fn(),
    verifyPendingCaseForUserInteractor: jest.fn(),
    virusScanPdfInteractor: jest.fn(),
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

  const mockStorageClientReturnValue = {
    deleteObject: jest.fn(),
    getObject: jest.fn(),
  };

  const mockGetUtilitiesReturnValue = {
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
    formatDocument: jest.fn().mockImplementation(v => v),
    formatNow: jest.fn().mockImplementation(DateHandler.formatNow),
    getDocumentTypeForAddressChange: jest.fn(),
    getFilingsAndProceedings: jest.fn().mockReturnValue(''),
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
  };

  const mockGetNotificationGatewayReturnValue = {
    sendNotificationToUser: jest.fn(),
  };

  const mockGetUseCaseHelpers = {
    appendPaperServiceAddressPageToPdf: jest.fn(),
    generateCaseConfirmationPdf: jest.fn(),
    generateCaseInventoryReportPdf: jest.fn(),
    getCaseInventoryReport: jest.fn(),
    sendServedPartiesEmails: jest.fn(),
    updateCaseAutomaticBlock: jest
      .fn()
      .mockImplementation(updateCaseAutomaticBlock),
  };

  const getTemplateGeneratorsReturnMock = {
    generateChangeOfAddressTemplate: jest.fn().mockResolvedValue('<div></div>'),
    generateHTMLTemplateForPDF: jest.fn().mockReturnValue('<div></div>'),
    generateNoticeOfTrialIssuedTemplate: jest.fn(),
    generatePrintableDocketRecordTemplate: jest
      .fn()
      .mockResolvedValue('<div></div>'),
    generateStandingPretrialNoticeTemplate: jest.fn(),
    generateStandingPretrialOrderTemplate: jest.fn(),
  };

  const mockGetPersistenceGatewayReturnValue = {
    addWorkItemToSectionInbox,
    associateUserWithCase: jest.fn(),
    associateUserWithCasePending: jest.fn(),
    createAttorneyUser: jest.fn(),
    createCase,
    createCaseTrialSortMappingRecords: jest.fn(),
    createSectionInboxRecord,
    createTrialSession: jest.fn(),
    createTrialSessionWorkingCopy: jest.fn(),
    createUserInboxRecord,
    createWorkItem: createWorkItemPersistence,
    deleteCaseDeadline: jest.fn(),
    deleteCaseTrialSortMappingRecords: jest.fn(),
    deleteDocument: jest.fn(),
    deleteSectionOutboxRecord,
    deleteTrialSession: jest.fn(),
    deleteTrialSessionWorkingCopy: jest.fn(),
    deleteUserCaseNote: jest.fn(),
    deleteUserConnection: jest.fn(),
    deleteUserFromCase: jest.fn(),
    deleteUserOutboxRecord,
    deleteWorkItemFromInbox: jest.fn(deleteWorkItemFromInbox),
    getAllCaseDeadlines: jest.fn(),
    getCalendaredCasesForTrialSession: jest.fn(),
    getCaseByCaseId: jest.fn().mockImplementation(getCaseByCaseId),
    getCaseByDocketNumber: jest.fn(),
    getCaseByUser: jest.fn(),
    getCaseDeadlinesByCaseId: jest
      .fn()
      .mockImplementation(getCaseDeadlinesByCaseId),
    getCasesByLeadCaseId: jest.fn(),
    getCasesByUser: jest.fn(),
    getDocument: jest.fn(),
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
    putWorkItemInUsersOutbox: jest.fn(),
    saveDocumentFromLambda: jest.fn(),
    saveUserConnection: jest.fn(),
    saveWorkItemForNonPaper: jest
      .fn()
      .mockImplementation(saveWorkItemForNonPaper),
    saveWorkItemForPaper,
    setItem: jest.fn(),
    setPriorityOnAllWorkItems: jest.fn(),
    setWorkItemAsRead,
    updateAttorneyUser: jest.fn(),
    updateCase: jest.fn().mockImplementation(updateCase),
    updateTrialSession: jest.fn(),
    updateTrialSessionWorkingCopy: jest.fn(),
    updateUser: jest.fn(),
    updateUserCaseNote: jest.fn(),
    updateWorkItem,
    updateWorkItemInCase,
    uploadDocumentFromClient: jest.fn(),
    uploadPdfFromClient: jest.fn().mockImplementation(() => ''),
    verifyCaseForUser: jest.fn().mockImplementation(verifyCaseForUser),
    verifyPendingCaseForUser: jest.fn(),
    zipDocuments: jest.fn(),
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
      .mockImplementation(
        webClientApplicationContext.getChiefJudgeNameForSigning,
      ),
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
    getCurrentUserPermissions: jest.fn(),
    getCurrentUserToken: () => {
      return '';
    },
    getDocumentClient: () => mockDocClient,
    getDocumentsBucketName: jest.fn().mockReturnValue('DocumentBucketName'),
    getEntityConstructors: () => ({
      Case,
      CaseAssociationRequestFactory,
      CaseExternal: CaseExternalIncomplete,
      CaseInternal: CaseInternal,
      DocketRecord,
      Document,
      ExternalDocumentFactory: ExternalDocumentFactory,
      TrialSession: TrialSession,
      User,
      WorkItem: WorkItem,
    }),
    getFileReaderInstance: jest.fn(),
    getHttpClient: jest.fn(() => ({
      get: () => ({
        data: 'url',
      }),
    })),
    getNodeSass: jest.fn().mockReturnValue(nodeSassMockReturnValue),
    getNotificationGateway: jest.fn().mockImplementation(() => {
      return mockGetNotificationGatewayReturnValue;
    }),
    getPdfJs: jest.fn().mockReturnValue(mockGetPdfJsReturnValue),
    getPdfStyles: jest.fn(),
    getPersistenceGateway: jest.fn().mockImplementation(() => {
      return mockGetPersistenceGatewayReturnValue;
    }),
    getPug: jest.fn(),
    getScanner: jest.fn().mockReturnValue(mockGetScannerReturnValue),
    getScannerResourceUri: jest.fn().mockReturnValue(scannerResourcePath),
    getSearchClient: jest.fn(),
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
