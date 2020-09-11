const faker = require('faker');
const uuid = require('uuid');
const {
  COUNTRY_TYPES,
} = require('../../../shared/src/business/entities/EntityConstants');
const {
  getRestApi,
  getUserToken,
  login,
} = require('../../support/pages/login');
const { BASE_CASE } = require('../../fixtures/caseMigrations');

faker.seed(faker.random.number());

const createFutureDate = () => {
  const month = faker.random.number({ max: 12, min: 1 });
  const day = faker.random.number({ max: 28, min: 1 });
  const year =
    new Date().getUTCFullYear() + faker.random.number({ max: 5, min: 1 });
  return `${month}/${day}/${year}`;
};

const preferredTrialCity = 'Cheyenne, Wyoming';

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

const gotoCaseOverview = docketNumber => {
  cy.goToRoute(`/case-detail/${docketNumber}`);
  cy.get('#tab-case-information').click();
  cy.get('#tab-overview').click();
};

const removeFromTrialSession = () => {
  cy.get('#remove-from-trial-session-btn').should('exist').click();
  cy.get('#disposition').type(faker.company.catchPhrase());
  cy.get('#modal-root .modal-button-confirm').click();
  cy.get('#add-to-trial-session-btn').should('not.exist');
};

let token = null;
let trialSessionId;
let trialSessionIds = [];
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
          preferredTrialCity,
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

    const createTrialSession = () => {
      it('creates a trial session', () => {
        cy.get('a[href="/trial-sessions"]').click();
        cy.get('a[href="/add-a-trial-session"]').click();

        // session information
        cy.get('#start-date-date').type(createFutureDate());
        cy.get('#start-time-hours')
          .clear()
          .type(faker.random.number({ max: 11, min: 6 }));
        cy.get('#start-time-minutes')
          .clear()
          .type(faker.random.arrayElement(['00', '15', '30', '45']));
        cy.get('label[for="startTimeExtension-pm"]').click();
        cy.get('label[for="session-type-Hybrid"]').click();
        cy.get('#max-cases').type(faker.random.number({ max: 100, min: 10 }));

        // location information
        cy.get('#trial-location').select(preferredTrialCity);
        cy.get('#courthouse-name').type(faker.commerce.productName());
        cy.get('#address1').type(faker.address.streetAddress());
        cy.get('#city').type(faker.address.city());
        cy.get('#state').select(faker.address.stateAbbr());
        cy.get('#postal-code').type(faker.address.zipCode());

        // session assignments
        cy.get('#judgeId').select('Chief Judge Foley');
        cy.get('#trial-clerk').select('Test trialclerk1');
        cy.get('#court-reporter').type(faker.name.findName());
        cy.get('#irs-calendar-administrator').type(faker.name.findName());
        cy.get('#notes').type(faker.company.catchPhrase());

        cy.get('#submit-trial-session').click();

        // set up listener for POST call, get trialSessionId
        cy.wait('@postTrialSession').then(xhr => {
          ({ trialSessionId } = xhr.response.body);
          trialSessionIds.push(trialSessionId);
          cy.get('#new-trial-sessions-tab').click();
          cy.get(`a[href="/trial-session-detail/${trialSessionId}"]`).should(
            'exist',
          );
        });
      });
    };
    createTrialSession();
    createTrialSession();

    it('navigates to the first newly-created trial session', () => {
      trialSessionId = trialSessionIds[0];
      cy.get(`a[href="/trial-session-detail/${trialSessionId}"]`).click();
    });
  });

  describe('after a new trial session is created', () => {
    it('it is possible to manually add, view, and remove first case from an UNSET trial session', () => {
      gotoCaseOverview(firstDocketNumber);
      trialSessionId = trialSessionIds[0]; // the first trial session
      cy.get('#add-to-trial-session-btn').should('exist').click();
      cy.get('label[for="show-all-locations-true"]').click();
      cy.get('select#trial-session')
        .select(trialSessionId)
        .should('have.value', trialSessionId);
      cy.get('#modal-root .modal-button-confirm').click();
      cy.get('.usa-alert--success').should(
        'contain',
        'Case scheduled for trial.',
      );

      removeFromTrialSession();
    });

    it('manually block second case', () => {
      // block it
      gotoCaseOverview(secondDocketNumber);
      cy.get('#tabContent-overview .block-from-trial-btn').click();
      cy.get('.modal-dialog #reason').type(faker.company.catchPhrase());
      cy.get('.modal-dialog .modal-button-confirm').click();
      cy.contains('Blocked From Trial');

      // do this well before we look for it on blocked cases report...
    });

    it('sets the first trial session as calendared', () => {
      trialSessionId = trialSessionIds[0]; // the first trial session
      cy.goToRoute(`/trial-session-detail/${trialSessionId}`);
      cy.get('#set-calendar-button').should('exist').click();
      cy.get('#modal-root .modal-button-confirm').click();
      cy.get('#set-calendar-button').should('not.exist');
    });

    it('manually add, view, and remove first case case from the SET trial session', () => {
      gotoCaseOverview(firstDocketNumber);

      trialSessionId = trialSessionIds[0]; // the first trial session
      cy.get('#add-to-trial-session-btn').should('exist').click();
      cy.get('label[for="show-all-locations-true"]').click();
      cy.get('select#trial-session')
        .select(trialSessionId)
        .should('have.value', trialSessionId);
      cy.get('#modal-root .modal-button-confirm').click();
      cy.get('.usa-alert--success').should('contain', 'Case set for trial.');

      removeFromTrialSession();
    });

    it('view Blocked report containing second case, and unblock second case', () => {
      // enough time has elapsed since we blocked second case. look for it on blocked cases report
      // warning: if there are elasticsearch delays, this test might be brittle...
      // view blocked report
      cy.get('#reports-btn').click();
      cy.get('#all-blocked-cases').click();
      cy.get('#trial-location').select(preferredTrialCity);
      cy.get(`a[href="/case-detail/${secondDocketNumber}"]`).should('exist');

      // unblock it
      gotoCaseOverview(secondDocketNumber);
      cy.get('button.red-warning').click(); // TODO: #remove-block
      cy.get('.modal-button-confirm').click();
      cy.contains('Block removed.');
    });

    it('set second case as High Priority for a trial session', () => {
      gotoCaseOverview(secondDocketNumber);

      cy.get('.high-priority-btn').click();
      cy.get('#reason').type(faker.company.catchPhrase());
      cy.get('.modal-button-confirm').click();
      cy.get('.modal-dialog').should('not.exist');
      cy.contains('High Priority').should('exist');
    });

    it('complete QC of eligible (second) case and set calendar for second trial session', () => {
      trialSessionId = trialSessionIds[1];
      cy.goToRoute(`/trial-session-detail/${trialSessionId}`);
      cy.get(
        `#upcoming-sessions label[for="${secondDocketNumber}-complete"]`,
      ).click();

      // set as calendared
      cy.get('#set-calendar-button').should('exist').click();
      cy.get('.modal-dialog .modal-button-confirm').click();
      cy.get('#set-calendar-button').should('not.exist');
      cy.get(
        `#open-cases-tab-content a[href="/case-detail/${secondDocketNumber}"]`,
      ).should('exist');
    });

    it('run Trial Session Planning Report', () => {
      const nextYear = new Date().getUTCFullYear() + 1;
      cy.get('#reports-btn').click();
      cy.get('#trial-session-planning-btn').click();
      cy.get('#modal-root select[name="term"]')
        .select('Winter')
        .should('have.value', 'winter');
      cy.get('#modal-root select[name="year"]')
        .select(`${nextYear}`)
        .should('have.value', `${nextYear}`);
      cy.get('.modal-button-confirm').click();
      cy.url().should('contain', '/trial-session-planning-report');
      cy.contains('Trial Session Planning Report');
    });
  });
});
