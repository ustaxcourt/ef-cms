const DateHandler = require('../utilities/DateHandler');
const {
  aggregatePartiesForService,
} = require('../utilities/aggregatePartiesForService');
const {
  compareCasesByDocketNumber,
} = require('../utilities/getFormattedTrialSessionDetails');
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
  formatJudgeName,
  getJudgeLastName,
} = require('../../../src/business/utilities/getFormattedJudgeName');
const {
  formatPhoneNumber,
} = require('../../../src/business/utilities/formatPhoneNumber');
const {
  formattedTrialSessionDetails,
} = require('../utilities/getFormattedTrialSessionDetails');
const {
  getChambersSections,
  getChambersSectionsLabels,
  getJudgesChambers,
} = require('../../persistence/dynamo/chambers/getJudgesChambers');
const {
  getDocumentTitleWithAdditionalInfo,
} = require('../../../src/business/utilities/getDocumentTitleWithAdditionalInfo');
const {
  getSealedDocketEntryTooltip,
} = require('../../../src/business/utilities/getSealedDocketEntryTooltip');
const {
  isStandaloneRemoteSession,
} = require('../entities/trialSessions/TrialSession');
const { compareISODateStrings } = require('../utilities/sortFunctions');
const { DocketEntry, isServed } = require('../entities/DocketEntry');
const { filterEmptyStrings } = require('../utilities/filterEmptyStrings');
const { getServedPartiesCode } = require('../entities/DocketEntry');
const { getWorkQueueFilters } = require('../utilities/getWorkQueueFilters');
const { replaceBracketed } = require('../utilities/replaceBracketed');
const { User } = require('../entities/User');

const {
  canAllowDocumentServiceForCase,
  Case,
  getContactPrimary,
  getContactSecondary,
  getPetitionerById,
  getPractitionersRepresenting,
  isUserIdRepresentedByPrivatePractitioner,
} = require('../entities/cases/Case');
const {
  setServiceIndicatorsForCase,
} = require('../utilities/setServiceIndicatorsForCase');
const { formatDollars } = require('../utilities/formatDollars');

const {
  getFormattedPartiesNameAndTitle,
} = require('../utilities/getFormattedPartiesNameAndTitle');
const { ERROR_MAP_429 } = require('../../sharedAppContext');
const { getConstants } = require('../../../../web-client/src/getConstants');
const { v4: uuidv4 } = require('uuid');

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

const createTestApplicationContext = ({ user } = {}) => {
  return appContextProxy({
    getBroadcastGateway: appContextProxy(),
    getCaseTitle: Case.getCaseTitle,
    getConstants: jest.fn().mockImplementation(() => ({
      ...getConstants(),
      ERROR_MAP_429,
    })),
    getCurrentUser: jest.fn().mockReturnValue(user),
    getLogger: appContextProxy(),
    getPersistenceGateway: appContextProxy({
      getChambersSectionsLabels,
      getJudgesChambers: jest.fn().mockImplementation(getJudgesChambers),
    }),
    getScanner: jest.fn().mockReturnValue(mockGetScannerReturnValue),
    getUniqueId: uuidv4,
    getUseCases: appContextProxy(),
    getUtilities: appContextProxy({
      aggregatePartiesForService,
      calculateISODate: jest
        .fn()
        .mockImplementation(DateHandler.calculateISODate),
      canAllowDocumentServiceForCase: jest
        .fn()
        .mockImplementation(canAllowDocumentServiceForCase),
      checkDate: DateHandler.checkDate,
      compareCasesByDocketNumber: jest
        .fn()
        .mockImplementation(compareCasesByDocketNumber),
      compareISODateStrings: jest
        .fn()
        .mockImplementation(compareISODateStrings),
      computeDate: DateHandler.computeDate,
      createEndOfDayISO: DateHandler.createEndOfDayISO,
      createISODateString: DateHandler.createISODateString,
      createStartOfDayISO: DateHandler.createStartOfDayISO,
      dateStringsCompared: DateHandler.dateStringsCompared,
      deconstructDate: jest
        .fn()
        .mockImplementation(DateHandler.deconstructDate),
      filterEmptyStrings,
      formatAttachments: jest.fn().mockImplementation(formatAttachments),
      formatCase: jest.fn().mockImplementation(formatCase),
      formatDateString: DateHandler.formatDateString,
      formatDocketEntry,
      formatDollars,
      formatJudgeName,
      formatNow: jest.fn().mockImplementation(DateHandler.formatNow),
      formatPhoneNumber,
      formattedTrialSessionDetails: jest
        .fn()
        .mockImplementation(formattedTrialSessionDetails),
      getAttachmentDocumentById: Case.getAttachmentDocumentById,
      getCaseCaption: jest.fn().mockImplementation(Case.getCaseCaption),
      getChambersSections,
      getContactPrimary,
      getContactSecondary,
      getDocumentTitleWithAdditionalInfo: jest
        .fn()
        .mockImplementation(getDocumentTitleWithAdditionalInfo),
      getFormattedPartiesNameAndTitle,
      getJudgeLastName: jest.fn().mockImplementation(getJudgeLastName),
      getPetitionerById,
      getPractitionersRepresenting: jest
        .fn()
        .mockImplementation(getPractitionersRepresenting),

      getSealedDocketEntryTooltip,
      getServedPartiesCode,
      getWorkQueueFilters,
      isExternalUser: jest.fn().mockImplementation(User.isExternalUser),
      isInternalUser: jest.fn().mockImplementation(User.isInternalUser),
      isPending: jest.fn().mockImplementation(DocketEntry.isPending),
      isServed: jest.fn().mockImplementation(isServed),
      isStandaloneRemoteSession: jest
        .fn()
        .mockImplementation(isStandaloneRemoteSession),
      isUserIdRepresentedByPrivatePractitioner: jest
        .fn()
        .mockImplementation(isUserIdRepresentedByPrivatePractitioner),
      prepareDateFromString: jest
        .fn()
        .mockImplementation(DateHandler.prepareDateFromString),
      replaceBracketed: jest.fn().mockImplementation(replaceBracketed),
      setServiceIndicatorsForCase: jest
        .fn()
        .mockImplementation(setServiceIndicatorsForCase),
      sortDocketEntries,
      validateDateAndCreateISO: DateHandler.validateDateAndCreateISO,
    }),
    isFeatureEnabled: jest.fn(),
    setCurrentUser: jest.fn().mockReturnValue(null),
    setCurrentUserToken: jest.fn(),
  })();
};

module.exports = {
  applicationContext: createTestApplicationContext({ user: {} }),
  fakeData,
  getFakeFile,
  testInvalidPdfDoc,
  testPdfDoc,
};
