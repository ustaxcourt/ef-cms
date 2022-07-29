const DateHandler = require('../utilities/DateHandler');
const {
  fakeData,
  getFakeFile,
  testInvalidPdfDoc,
  testPdfDoc,
} = require('./getFakeFile');
const { Case } = require('../entities/cases/Case');
const { getConstants } = require('../../../../web-client/src/getConstants');

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
  return appContextProxy({
    getCaseTitle: Case.getCaseTitle,
    getConstants,
    getCurrentUser: jest.fn().mockReturnValue(user),
    getUseCases: appContextProxy(),
    getUtilities: appContextProxy({
      calculateISODate: jest
        .fn()
        .mockImplementation(DateHandler.calculateISODate),
      deconstructDate: DateHandler.deconstructDate,
      prepareDateFromString: DateHandler.prepareDateFromString,
    }),
  })();
};

module.exports = {
  applicationContext: createTestApplicationContext(),
  // applicationContextForClient: applicationContext,
  // createTestApplicationContext,
  fakeData,
  getFakeFile,
  testInvalidPdfDoc,
  testPdfDoc,
};
