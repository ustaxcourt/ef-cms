const DateHandler = require('../utilities/DateHandler');
const {
  aggregatePartiesForService,
} = require('../utilities/aggregatePartiesForService');
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
} = require('../../../src/business/utilities/getFormattedCaseDetail');
const {
  getDocumentTitleWithAdditionalInfo,
} = require('../../../src/business/utilities/getDocumentTitleWithAdditionalInfo');
const { filterEmptyStrings } = require('../utilities/filterEmptyStrings');
const { getServedPartiesCode } = require('../entities/DocketEntry');
const { replaceBracketed } = require('../utilities/replaceBracketed');
const { User } = require('../entities/User');

const {
  canAllowDocumentServiceForCase,
  Case,
  getContactPrimary,
  getContactSecondary,
  getPetitionerById,
} = require('../entities/cases/Case');
const {
  setServiceIndicatorsForCase,
} = require('../utilities/setServiceIndicatorsForCase');
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
    getPersistenceGateway: appContextProxy(),
    getScanner: jest.fn().mockReturnValue(mockGetScannerReturnValue),
    getUniqueId: uuidv4,
    getUseCases: appContextProxy(),
    getUtilities: appContextProxy({
      aggregatePartiesForService,
      calculateISODate: jest
        .fn()
        .mockImplementation(DateHandler.calculateISODate),
      canAllowDocumentServiceForCase,
      checkDate: DateHandler.checkDate,
      computeDate: DateHandler.computeDate,
      createEndOfDayISO: DateHandler.createEndOfDayISO,
      createISODateString: DateHandler.createISODateString,
      createStartOfDayISO: DateHandler.createStartOfDayISO,
      deconstructDate: jest
        .fn()
        .mockImplementation(DateHandler.deconstructDate),
      filterEmptyStrings,
      formatAttachments: jest.fn().mockImplementation(formatAttachments),
      formatCase,
      formatDateString: DateHandler.formatDateString,
      formatDocketEntry,
      getAttachmentDocumentById: Case.getAttachmentDocumentById,
      getCaseCaption: jest.fn().mockImplementation(Case.getCaseCaption),
      getContactPrimary,
      getContactSecondary,
      getDocumentTitleWithAdditionalInfo: jest
        .fn()
        .mockImplementation(getDocumentTitleWithAdditionalInfo),
      getPetitionerById,
      getServedPartiesCode,
      isInternalUser: jest.fn().mockImplementation(User.isInternalUser),
      prepareDateFromString: jest
        .fn()
        .mockImplementation(DateHandler.prepareDateFromString),
      replaceBracketed: jest.fn().mockImplementation(replaceBracketed),
      setServiceIndicatorsForCase: jest
        .fn()
        .mockImplementation(setServiceIndicatorsForCase),
      validateDateAndCreateISO: DateHandler.validateDateAndCreateISO,
    }),
    setCurrentUser: jest.fn().mockReturnValue(null),
    setCurrentUserToken: jest.fn(),
  })();
};

module.exports = {
  applicationContext: createTestApplicationContext({ user: {} }),
  // applicationContextForClient: applicationContext,
  // createTestApplicationContext,
  fakeData,
  getFakeFile,
  testInvalidPdfDoc,
  testPdfDoc,
};
