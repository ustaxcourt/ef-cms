const faker = require('faker');
const uuid = require('uuid');
const {
  blockCaseFromTrial,
  goToCaseOverview,
  manuallyAddCaseToCalendaredTrialSession,
  manuallyAddCaseToNewTrialSession,
  removeCaseFromTrialSession,
  setCaseAsHighPriority,
  unblockCaseFromTrial,
} = require('../../support/pages/case-detail');
const {
  COUNTRY_TYPES,
} = require('../../../shared/src/business/entities/EntityConstants');
const {
  createTrialSession,
  goToTrialSession,
  markCaseAsQcCompleteForTrial,
  setTrialSessionAsCalendared,
  verifyOpenCaseOnTrialSession,
} = require('../../support/pages/trial-sessions');
const {
  getRestApi,
  getUserToken,
  login,
} = require('../../support/pages/login');
const {
  runTrialSessionPlanningReport,
  viewBlockedCaseOnBlockedReport,
} = require('../../support/pages/reports');
const { BASE_CASE } = require('../../fixtures/caseMigrations');

faker.seed(faker.random.number());

const createDocketNumber = () => {
  const docketNumberYear = faker.random.number({ max: 99, min: 80 });
  const docketNumberPrefix = faker.random.number({
    max: 99999,
    min: 101,
  });

  return `${docketNumberPrefix}-${docketNumberYear}`;
};

const createRandomContact = () => ({
  address1: faker.address.streetAddress(),
  city: faker.address.city(),
  contactId: uuid.v4(),
  countryType: COUNTRY_TYPES.DOMESTIC,
  email: `${faker.internet.userName()}@example.com`,
  name: faker.name.findName(),
  phone: faker.phone.phoneNumber(),
  postalCode: faker.address.zipCode(),
  state: faker.address.stateAbbr(),
});

let token = null;
const testData = {
  preferredTrialCity: 'Cheyenne, Wyoming',
  trialSessionIds: [],
};
const firstDocketNumber = createDocketNumber();
const secondDocketNumber = createDocketNumber();

describe('Petitions Clerk', () => {
  before(async () => {
    const result = await getUserToken(
      'petitionsclerk1@example.com',
      'Testing1234$',
    );
    token = result.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  describe('create cases via migration', () => {
    let migrateUserToken, migrateRestApi;
    beforeEach(async () => {
      migrateRestApi = await getRestApi();
      const results = await getUserToken(
        'migrator@example.com',
        'Testing1234$',
      );
      migrateUserToken = results.AuthenticationResult.IdToken;
    });

    it('should create two cases for use with trial sessions smoke-tests', () => {
      [firstDocketNumber, secondDocketNumber].forEach(docketNumber => {
        const migrateCase = {
          ...BASE_CASE,
          contactPrimary: {
            ...BASE_CASE.contactPrimary,
            ...createRandomContact(),
          },
          docketNumber,
          docketNumberWithSuffix: docketNumber,
          preferredTrialCity: testData.preferredTrialCity,
        };
        cy.request({
          body: migrateCase,
          headers: {
            Authorization: `Bearer ${migrateUserToken}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          url: `${migrateRestApi}/migrate/case`,
        });
      });
    });
  });

  describe('should be able to create two trial sessions', () => {
    beforeEach(() => {
      cy.server();
      cy.route({ method: 'POST', url: '/trial-sessions' }).as(
        'postTrialSession',
      );
    });

    it('creates two trial sessions', () => {
      createTrialSession(testData);
      createTrialSession(testData);
    });

    it('navigates to the first newly-created trial session', () => {
      goToTrialSession(testData.trialSessionIds[0]);
    });
  });

  describe('after a new trial session is created', () => {
    it('it is possible to manually add, view, and remove first case from an UNSET trial session', () => {
      goToCaseOverview(firstDocketNumber);
      manuallyAddCaseToNewTrialSession(testData.trialSessionIds[0]);
      removeCaseFromTrialSession();
    });

    it('manually block second case', () => {
      // block it
      goToCaseOverview(secondDocketNumber);
      blockCaseFromTrial();
      // do this well before we look for it on blocked cases report...
    });

    it('sets the first trial session as calendared', () => {
      setTrialSessionAsCalendared(testData.trialSessionIds[0]);
    });

    it('manually add, view, and remove first case case from the SET trial session', () => {
      goToCaseOverview(firstDocketNumber);
      manuallyAddCaseToCalendaredTrialSession(testData.trialSessionIds[0]);
      removeCaseFromTrialSession();
    });

    it('view Blocked report containing second case, and unblock second case', () => {
      // enough time has elapsed since we blocked second case. look for it on blocked cases report
      // warning: if there are elasticsearch delays, this test might be brittle...
      // view blocked report
      viewBlockedCaseOnBlockedReport({
        ...testData,
        docketNumber: secondDocketNumber,
      });
    });

    it('unblock second case', () => {
      goToCaseOverview(secondDocketNumber);
      unblockCaseFromTrial();
    });

    it('set second case as High Priority for a trial session', () => {
      goToCaseOverview(secondDocketNumber);
      setCaseAsHighPriority();
    });

    it('complete QC of eligible (second) case and set calendar for second trial session', () => {
      goToTrialSession(testData.trialSessionIds[1]);
      markCaseAsQcCompleteForTrial(secondDocketNumber);

      // set as calendared
      setTrialSessionAsCalendared(testData.trialSessionIds[1]);
      verifyOpenCaseOnTrialSession(secondDocketNumber);
    });

    it('run Trial Session Planning Report', () => {
      runTrialSessionPlanningReport();
    });
  });
});
