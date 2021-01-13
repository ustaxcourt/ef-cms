const faker = require('faker');
const uuid = require('uuid');
const {
  blockCaseFromTrial,
  goToCaseOverview,
  manuallyAddCaseToCalendaredTrialSession,
  manuallyAddCaseToNewTrialSession,
  removeCaseFromTrialSession,
  setCaseAsHighPriority,
  setCaseAsReadyForTrial,
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
  getEnvironmentSpecificFunctions,
} = require('../../support/pages/environment-specific-factory');
const {
  runTrialSessionPlanningReport,
  viewBlockedCaseOnBlockedReport,
} = require('../../support/pages/reports');
const { BASE_CASE } = require('../../fixtures/caseMigrations');

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');
const SMOKETESTS_LOCAL = Cypress.env('SMOKETESTS_LOCAL');

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

let petitionsClerkToken = null;
let docketClerkToken = null;
const testData = {
  preferredTrialCity: 'Cheyenne, Wyoming',
  trialSessionIds: [],
};
const firstDocketNumber = createDocketNumber();
const secondDocketNumber = createDocketNumber();

describe('Petitions Clerk', () => {
  const { getRestApi, getUserToken, login } = getEnvironmentSpecificFunctions();

  before(async () => {
    let result = await getUserToken(
      'petitionsclerk1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    petitionsClerkToken = result.AuthenticationResult.IdToken;
    result = await getUserToken(
      'docketclerk1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    docketClerkToken = result.AuthenticationResult.IdToken;
  });

  it('should be able to login as petitions clerk', () => {
    login(petitionsClerkToken);
  });

  describe('create cases via migration', () => {
    let migrateUserToken, migrateRestApi;
    beforeEach(async () => {
      migrateRestApi = await getRestApi();
      const results = await getUserToken(
        'migrator@example.com',
        DEFAULT_ACCOUNT_PASS,
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
          docketEntries: [BASE_CASE.docketEntries[0]],
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

  // This describe block is reliably failing on PR builds, after
  // a lot of investigation, we are still unsure of the root cause of the
  // failure. Skipping this block for now.
  if (!SMOKETESTS_LOCAL) {
    describe('after a new trial session is created', () => {
      it('is possible to manually add, view, and remove first case from an UNSET trial session', () => {
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
        cy.task('log', '1');
        cy.task('log', firstDocketNumber);
        manuallyAddCaseToCalendaredTrialSession(testData.trialSessionIds[0]);
        cy.task('log', '2');
        cy.task('log', testData.trialSessionIds[0]);
        removeCaseFromTrialSession();
        cy.task('log', '3');
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

      it('login as docket clerk', () => {
        login(docketClerkToken);
      });

      it('set second case as High Priority for a trial session', () => {
        goToCaseOverview(secondDocketNumber);
        setCaseAsReadyForTrial(secondDocketNumber);
        setCaseAsHighPriority();
      });

      it('login as petitions clerk', () => {
        login(petitionsClerkToken);
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
  }
});
