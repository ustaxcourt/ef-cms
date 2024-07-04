/* eslint-disable max-lines */
import * as DateHandler from '@shared/business/utilities/DateHandler';
import * as pdfLib from 'pdf-lib';
import {
  ALLOWLIST_FEATURE_FLAGS,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import {
  Case,
  canAllowDocumentServiceForCase,
  caseHasServedDocketEntries,
  caseHasServedPetition,
  getContactPrimary,
  getContactSecondary,
  getOtherFilers,
  getPetitionDocketEntry,
  getPetitionerById,
  getPractitionersRepresenting,
  isLeadCase,
  isSealedCase,
  isUserPartOfGroup,
} from '@shared/business/entities/cases/Case';
import {
  DocketEntry,
  getServedPartiesCode,
} from '@shared/business/entities/DocketEntry';
import {
  ERROR_MAP_429,
  getPublicSiteUrl,
  getUniqueId,
} from '@shared/sharedAppContext';
import { User } from '@shared/business/entities/User';
import { abbreviateState } from '@shared/business/utilities/abbreviateState';
import { acquireLock } from '@web-api/business/useCaseHelper/acquireLock';
import { addDocketEntryForSystemGeneratedOrder } from '@web-api/business/useCaseHelper/addDocketEntryForSystemGeneratedOrder';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { bulkDeleteRecords } from '@web-api/persistence/elasticsearch/bulkDeleteRecords';
import { bulkIndexRecords } from '@web-api/persistence/elasticsearch/bulkIndexRecords';
import { calculateDaysElapsedSinceLastStatusChange } from '@shared/business/utilities/calculateDaysElapsedSinceLastStatusChange';
import { caseStatusWithTrialInformation } from '@shared/business/utilities/caseStatusWithTrialInformation';
import { combineTwoPdfs } from '@shared/business/utilities/documentGenerators/combineTwoPdfs';
import {
  compareCasesByDocketNumber,
  formatCaseForTrialSession,
  getFormattedTrialSessionDetails,
} from '@shared/business/utilities/getFormattedTrialSessionDetails';
import {
  compareISODateStrings,
  compareStrings,
} from '@shared/business/utilities/sortFunctions';
import { copyPagesAndAppendToTargetPdf } from '@shared/business/utilities/copyPagesAndAppendToTargetPdf';
import { createCase } from '@web-api/persistence/dynamo/cases/createCase';
import { createCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/createCaseAndAssociations';
import { createDocketNumber } from '@web-api/persistence/dynamo/cases/docketNumberGenerator';
import { createMockDocumentClient } from './createMockDocumentClient';
import { deleteRecord } from '@web-api/persistence/elasticsearch/deleteRecord';
import { deleteWorkItem } from '@web-api/persistence/dynamo/workitems/deleteWorkItem';
import { documentUrlTranslator } from '@web-api/utilities/documentUrlTranslator';
import { fileAndServeDocumentOnOneCase } from '@web-api/business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase';
import { filterEmptyStrings } from '@shared/business/utilities/filterEmptyStrings';
import { formatAttachments } from '@shared/business/utilities/formatAttachments';
import {
  formatCase,
  formatDocketEntry,
  getFormattedCaseDetail,
  sortDocketEntries,
} from '@shared/business/utilities/getFormattedCaseDetail';
import { formatDollars } from '@shared/business/utilities/formatDollars';
import {
  formatJudgeName,
  getJudgeLastName,
} from '@shared/business/utilities/getFormattedJudgeName';
import { formatPendingItem } from '@shared/business/utilities/formatPendingItem';
import { formatPhoneNumber } from '@shared/business/utilities/formatPhoneNumber';
import { generateAndServeDocketEntry } from '@web-api/business/useCaseHelper/service/createChangeItems';
import { generateChangeOfAddressHelper } from '@web-api/business/useCaseHelper/generateChangeOfAddressHelper';
import { generateNoticesForCaseTrialSessionCalendarInteractor } from '@web-api/business/useCases/trialSessions/generateNoticesForCaseTrialSessionCalendarInteractor';
import {
  getAddressPhoneDiff,
  getDocumentTypeForAddressChange,
} from '@shared/business/utilities/generateChangeOfAddressTemplate';
import { getAllFeatureFlagsInteractor } from '@web-api/business/useCases/featureFlag/getAllFeatureFlagsInteractor';
import { getAllWebSocketConnections } from '@web-api/persistence/dynamo/notifications/getAllWebSocketConnections';
import { getCaseByDocketNumber } from '@web-api/persistence/dynamo/cases/getCaseByDocketNumber';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/dynamo/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { getCaseDocumentsIdsFilteredByDocumentType } from '@shared/business/utilities/getCaseDocumentsIdsFilteredByDocumentType';
import {
  getChambersSections,
  getChambersSectionsLabels,
  getJudgesChambers,
  getJudgesChambersWithLegacy,
} from '@web-client/business/chambers/getJudgesChambers';
import { getConfigurationItemValue } from '@web-api/persistence/dynamo/deployTable/getConfigurationItemValue';
import { getConstants } from '@web-client/getConstants';
import { getCropBox } from '@shared/business/utilities/getCropBox';
import { getDescriptionDisplay } from '@shared/business/utilities/getDescriptionDisplay';
import {
  getDocQcSectionForUser,
  getWorkQueueFilters,
} from '@shared/business/utilities/getWorkQueueFilters';
import { getDocketEntriesByFilter } from '@shared/business/utilities/getDocketEntriesByFilter';
import { getDocumentQCInboxForSection as getDocumentQCInboxForSectionPersistence } from '@web-api/persistence/elasticsearch/workitems/getDocumentQCInboxForSection';
import { getDocumentTitleWithAdditionalInfo } from '@shared/business/utilities/getDocumentTitleWithAdditionalInfo';
import { getFakeFile, testPdfDoc } from './getFakeFile';
import { getFormattedPartiesNameAndTitle } from '@shared/business/utilities/getFormattedPartiesNameAndTitle';
import { getItem } from '@web-client/persistence/localStorage/getItem';
import { getSealedDocketEntryTooltip } from '@shared/business/utilities/getSealedDocketEntryTooltip';
import { getStampBoxCoordinates } from '@shared/business/utilities/getStampBoxCoordinates';
import { getTextByCount } from '@shared/business/utilities/getTextByCount';
import { getTrialSessionById } from '@web-api/persistence/dynamo/trialSessions/getTrialSessionById';
import { getUserById as getUserByIdPersistence } from '@web-api/persistence/dynamo/users/getUserById';
import { getUserIdForNote } from '@web-api/business/useCaseHelper/getUserIdForNote';
import { getWorkItemById as getWorkItemByIdPersistence } from '@web-api/persistence/dynamo/workitems/getWorkItemById';
import { incrementCounter } from '@web-api/persistence/dynamo/helpers/incrementCounter';
import { putWorkItemInOutbox } from '@web-api/persistence/dynamo/workitems/putWorkItemInOutbox';
import { removeCounselFromRemovedPetitioner } from '@web-api/business/useCaseHelper/caseAssociation/removeCounselFromRemovedPetitioner';
import { removeItem } from '@web-client/persistence/localStorage/removeItem';
import { replaceBracketed } from '@shared/business/utilities/replaceBracketed';
import { saveWorkItem } from '@web-api/persistence/dynamo/workitems/saveWorkItem';
import { sealCaseInteractor } from '@shared/business/useCases/sealCaseInteractor';
import { sealDocketEntryInteractor } from '@web-api/business/useCases/docketEntry/sealDocketEntryInteractor';
import { serveCaseDocument } from '@shared/business/utilities/serveCaseDocument';
import { setConsolidationFlagsForDisplay } from '@shared/business/utilities/setConsolidationFlagsForDisplay';
import { setItem } from '@web-client/persistence/localStorage/setItem';
import { setNoticesForCalendaredTrialSessionInteractor } from '@shared/proxies/trialSessions/setNoticesForCalendaredTrialSessionProxy';
import { setPdfFormFields } from '@web-api/business/useCaseHelper/pdf/setPdfFormFields';
import { setServiceIndicatorsForCase } from '@shared/business/utilities/setServiceIndicatorsForCase';
import { setupPdfDocument } from '@shared/business/utilities/setupPdfDocument';
import { unsealDocketEntryInteractor } from '@web-api/business/useCases/docketEntry/unsealDocketEntryInteractor';
import { updateCase } from '@web-api/persistence/dynamo/cases/updateCase';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { updateCaseAutomaticBlock } from '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock';
import { updateCaseCorrespondence } from '@web-api/persistence/dynamo/correspondence/updateCaseCorrespondence';
import { updateDocketEntry } from '@web-api/persistence/dynamo/documents/updateDocketEntry';
import { updateUserRecords } from '@web-api/persistence/dynamo/users/updateUserRecords';
import { uploadDocumentAndMakeSafeInteractor } from '@shared/business/useCases/uploadDocumentAndMakeSafeInteractor';
import { validatePenaltiesInteractor } from '@shared/business/useCases/validatePenaltiesInteractor';
import { verifyCaseForUser } from '@web-api/persistence/dynamo/cases/verifyCaseForUser';
import path from 'path';
import pug from 'pug';
import sass from 'sass';

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

export const createTestApplicationContext = ({
  user,
}: { user?: User } = {}) => {
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
    abbreviateState: jest.fn().mockImplementation(abbreviateState),
    aggregatePartiesForService: jest
      .fn()
      .mockImplementation(aggregatePartiesForService),
    calculateDaysElapsedSinceLastStatusChange: jest
      .fn()
      .mockImplementation(calculateDaysElapsedSinceLastStatusChange),
    calculateDifferenceInDays: jest
      .fn()
      .mockImplementation(DateHandler.calculateDifferenceInDays),
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
    caseStatusWithTrialInformation: jest
      .fn()
      .mockImplementation(caseStatusWithTrialInformation),
    checkDate: jest.fn().mockImplementation(DateHandler.checkDate),
    combineTwoPdfs: jest.fn().mockImplementation(combineTwoPdfs),
    compareCasesByDocketNumber: jest
      .fn()
      .mockImplementation(compareCasesByDocketNumber),
    compareISODateStrings: jest.fn().mockImplementation(compareISODateStrings),
    compareStrings: jest.fn().mockImplementation(compareStrings),
    copyPagesAndAppendToTargetPdf: jest
      .fn()
      .mockImplementation(copyPagesAndAppendToTargetPdf),
    createEndOfDayISO: jest
      .fn()
      .mockImplementation(DateHandler.createEndOfDayISO),
    createISODateString: jest
      .fn()
      .mockImplementation(DateHandler.createISODateString),
    createStartOfDayISO: jest
      .fn()
      .mockImplementation(DateHandler.createStartOfDayISO),
    dateStringsCompared: jest
      .fn()
      .mockImplementation(DateHandler.dateStringsCompared),
    deconstructDate: jest.fn().mockImplementation(DateHandler.deconstructDate),
    documentUrlTranslator: jest.fn().mockImplementation(documentUrlTranslator),
    filterEmptyStrings: jest.fn().mockImplementation(filterEmptyStrings),
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
    formatPendingItem: jest.fn().mockImplementation(formatPendingItem),
    formatPhoneNumber: jest.fn().mockImplementation(formatPhoneNumber),
    getAddressPhoneDiff: jest.fn().mockImplementation(getAddressPhoneDiff),
    getAttachmentDocumentById: jest
      .fn()
      .mockImplementation(Case.getAttachmentDocumentById),
    getBusinessDateInFuture: jest
      .fn()
      .mockImplementation(DateHandler.getBusinessDateInFuture),
    getCaseCaption: jest.fn().mockImplementation(Case.getCaseCaption),
    getCaseDocumentsIdsFilteredByDocumentType: jest
      .fn()
      .mockImplementation(getCaseDocumentsIdsFilteredByDocumentType),
    getContactPrimary: jest.fn().mockImplementation(getContactPrimary),
    getContactSecondary: jest.fn().mockImplementation(getContactSecondary),
    getCropBox: jest.fn().mockImplementation(getCropBox),
    getDescriptionDisplay: jest.fn().mockImplementation(getDescriptionDisplay),
    getDocQcSectionForUser: jest
      .fn()
      .mockImplementation(getDocQcSectionForUser),
    getDocketEntriesByFilter: jest
      .fn()
      .mockImplementation(getDocketEntriesByFilter),
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
    getJudgesChambers: jest.fn().mockImplementation(getJudgesChambers),
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
    isPetitionerRepresented: jest
      .fn()
      .mockImplementation(Case.isPetitionerRepresented),
    isSealedCase: jest.fn().mockImplementation(isSealedCase),
    isServed: jest.fn().mockImplementation(DocketEntry.isServed),
    isStringISOFormatted: jest
      .fn()
      .mockImplementation(DateHandler.isStringISOFormatted),
    isTodayWithinGivenInterval: jest
      .fn()
      .mockImplementation(DateHandler.isTodayWithinGivenInterval),
    isUserPartOfGroup: jest.fn().mockImplementation(isUserPartOfGroup),
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
    sleep: jest.fn(),
    sortDocketEntries: jest.fn().mockImplementation(sortDocketEntries),
    validateDateAndCreateISO: jest
      .fn()
      .mockImplementation(DateHandler.validateDateAndCreateISO),
  });

  const mockGetHttpClientReturnValue = {
    delete: jest.fn(),
    get: () => ({
      data: 'url',
    }),
    post: jest.fn(),
    put: jest.fn(),
  };

  const mockGetUseCases = appContextProxy({
    generateNoticesForCaseTrialSessionCalendarInteractor: jest
      .fn()
      .mockImplementation(generateNoticesForCaseTrialSessionCalendarInteractor),
    getAllFeatureFlagsInteractor: jest
      .fn()
      .mockImplementation(getAllFeatureFlagsInteractor),
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
    validatePenaltiesInteractor: jest
      .fn()
      .mockImplementation(validatePenaltiesInteractor),
  });

  const mockGetUseCaseHelpers = appContextProxy({
    acquireLock: jest.fn().mockImplementation(acquireLock),
    addDocketEntryForSystemGeneratedOrder: jest
      .fn()
      .mockImplementation(addDocketEntryForSystemGeneratedOrder),
    createCaseAndAssociations: jest
      .fn()
      .mockImplementation(createCaseAndAssociations),
    fileAndServeDocumentOnOneCase: jest
      .fn()
      .mockImplementation(fileAndServeDocumentOnOneCase),
    generateAndServeDocketEntry: jest
      .fn()
      .mockImplementation(generateAndServeDocketEntry),
    generateChangeOfAddressHelper: jest
      .fn()
      .mockImplementation(generateChangeOfAddressHelper),
    getJudgeForUserHelper: jest.fn(),
    getJudgeInSectionHelper: jest.fn(),
    getUserIdForNote: jest.fn().mockImplementation(getUserIdForNote),
    parseAndScrapePdfContents: jest.fn(),
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
    entryOfAppearance: jest.fn().mockImplementation(getFakeFile),
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
    petition: jest.fn().mockImplementation(getFakeFile),
    practitionerCaseList: jest.fn().mockImplementation(getFakeFile),
    printableWorkingCopySessionList: jest.fn().mockImplementation(getFakeFile),
    receiptOfFiling: jest.fn().mockImplementation(getFakeFile),
    standingPretrialOrder: jest.fn().mockImplementation(getFakeFile),
    standingPretrialOrderForSmallCase: jest
      .fn()
      .mockImplementation(getFakeFile),
    thirtyDayNoticeOfTrial: jest.fn().mockImplementation(getFakeFile),
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
    deleteObject: jest.fn().mockReturnValue({}),
    getObject: jest.fn().mockResolvedValue({
      Body: {
        transformToByteArray: () => Promise.resolve(new Uint8Array(10)),
      },
    }),
    putObject: jest.fn().mockReturnValue({}),
  });

  const mockGetPersistenceGateway = appContextProxy({
    addCaseToHearing: jest.fn(),
    bulkDeleteRecords: jest.fn().mockImplementation(bulkDeleteRecords),
    bulkIndexRecords: jest.fn().mockImplementation(bulkIndexRecords),
    createCase: jest.fn().mockImplementation(createCase),
    createCaseTrialSortMappingRecords: jest.fn(),
    createElasticsearchReindexRecord: jest.fn(),
    createLock: jest.fn().mockImplementation(() => Promise.resolve(null)),
    deleteCaseTrialSortMappingRecords: jest.fn(),
    deleteDocumentFile: jest.fn(),
    deleteElasticsearchReindexRecord: jest.fn(),
    deleteKeyCount: jest.fn(),
    deleteLock: jest.fn().mockImplementation(() => Promise.resolve(null)),
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
    getCasesByFilters: jest.fn(),
    getChambersSections: jest.fn().mockImplementation(getChambersSections),
    getChambersSectionsLabels: jest
      .fn()
      .mockImplementation(getChambersSectionsLabels),
    getConfigurationItemValue: jest
      .fn()
      .mockImplementation(getConfigurationItemValue),
    getDispatchNotification: jest.fn(),
    getDocketNumbersByStatusAndByJudge: jest.fn(),
    getDocument: jest.fn().mockResolvedValue(testPdfDoc),
    getDocumentQCInboxForSection: jest.fn(),
    getDocumentQCInboxForUser: jest.fn(),
    getDocumentQCServedForSection: jest
      .fn()
      .mockImplementation(getDocumentQCInboxForSectionPersistence),
    getDownloadPolicyUrl: jest
      .fn()
      .mockReturnValue({ url: 'http://example.com/' }),
    getElasticsearchReindexRecords: jest.fn(),
    getFeatureFlagValue: jest.fn().mockImplementation(({ featureFlag }) => {
      switch (featureFlag) {
        case ALLOWLIST_FEATURE_FLAGS.ENTITY_LOCKING_FEATURE_FLAG.key:
          return { current: true };
      }
    }),
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
    getTrialSessionById: jest.fn().mockImplementation(getTrialSessionById),
    getTrialSessionJobStatusForCase: jest.fn(),
    getTrialSessionProcessingStatus: jest.fn(),
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
    setTrialSessionProcessingStatus: jest.fn(),
    updateCase: jest.fn().mockImplementation(updateCase),
    updateCaseCorrespondence: jest
      .fn()
      .mockImplementation(updateCaseCorrespondence),
    updateCaseHearing: jest.fn(),
    updateDocketEntry: jest.fn().mockImplementation(updateDocketEntry),
    uploadDocument: jest.fn(),
    uploadPdfFromClient: jest.fn().mockImplementation(() => ''),
    verifyCaseForUser: jest.fn().mockImplementation(verifyCaseForUser),
  });

  const mockGetEmailClient = {
    send: jest.fn(),
  };

  const mockGetMessagingClient = {
    send: jest.fn().mockReturnValue({ promise: () => {} }),
  };

  const mockDocumentClient = createMockDocumentClient();

  const mockCreateDocketNumberGenerator = {
    createDocketNumber: jest.fn().mockImplementation(createDocketNumber),
  };

  const mockBroadcastGateway = {
    postMessage: jest.fn(),
  };

  const mockGetNotificationService = {
    send: jest.fn().mockResolvedValue({
      MessageId: 'mockMessageID',
    }),
  };

  const applicationContext = {
    barNumberGenerator: {
      createBarNumber: jest.fn().mockReturnValue('CS20001'),
    },
    convertBlobToUInt8Array: jest
      .fn()
      .mockImplementation(() => new Uint8Array([])),
    docketNumberGenerator: mockCreateDocketNumberGenerator,
    environment: {
      appEndpoint: 'localhost:1234',
      cognitoClientId: 'bvjrggnd3co403c0aahscinne',
      dynamoDbTableName: 'efcms-local',
      stage: 'local',
      tempDocumentsBucketName: 'MockDocumentBucketName',
      userPoolId: 'local_2pHzece7',
      workerQueueUrl: 'sqs.aws',
    },
    filterCaseMetadata: jest.fn(),
    getBaseUrl: () => 'http://localhost',
    getBounceAlertRecipients: jest.fn(),
    getBroadcastGateway: jest.fn().mockReturnValue(mockBroadcastGateway),
    getCaseTitle: jest.fn().mockImplementation(Case.getCaseTitle),
    getChromiumBrowser: jest.fn().mockImplementation(() => {
      return mockGetChromiumBrowserReturnValue;
    }),
    getCognito: appContextProxy({
      adminCreateUser: jest.fn(),
      adminUpdateUserAttributes: jest.fn(),
      initiateAuth: jest.fn(),
    }),
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
    }),
    getMessagingClient: jest.fn().mockReturnValue(mockGetMessagingClient),
    getNodeSass: jest.fn().mockReturnValue(sass),
    getNotificationClient: jest.fn(),
    getNotificationGateway: appContextProxy({
      sendNotificationToUser: jest.fn(),
    }),
    getNotificationService: jest
      .fn()
      .mockReturnValue(mockGetNotificationService),
    getPdfJs: jest.fn().mockReturnValue(mockGetPdfJsReturnValue),
    getPdfLib: jest.fn().mockResolvedValue(pdfLib),
    getPersistenceGateway: mockGetPersistenceGateway,
    getPublicSiteUrl,
    getPug: jest.fn().mockReturnValue(pug),
    getReduceImageBlob: jest.fn().mockReturnValue(mockGetReduceImageBlobValue),
    getScanner: jest.fn().mockReturnValue(mockGetScannerReturnValue),
    getScannerResourceUri: jest.fn().mockReturnValue(scannerResourcePath),
    getSearchClient: emptyAppContextProxy,
    getSlackWebhookUrl: jest.fn(),
    getStorageClient: mockGetStorageClient,
    getUniqueId: jest.fn().mockImplementation(getUniqueId),
    getUseCaseHelpers: mockGetUseCaseHelpers,
    getUseCases: mockGetUseCases,
    getUserGateway: appContextProxy({}),
    getUtilities: mockGetUtilities,
    getWorkerGateway: appContextProxy({
      initialize: jest.fn().mockReturnValue({ promise: () => {} }),
    }),
    isFeatureEnabled: jest.fn(),
    logger: {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    },
    setCurrentUser: jest.fn(),
    setCurrentUserToken: jest.fn(),
    setTimeout: jest.fn().mockImplementation(callback => callback()),
  };
  return applicationContext;
};

export const applicationContext = createTestApplicationContext() as any;
