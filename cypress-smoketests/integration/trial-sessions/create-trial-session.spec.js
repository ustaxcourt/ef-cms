const faker = require('faker');
const {
  getRestApi,
  getUserToken,
  login,
} = require('../../support/pages/login');
const { BASE_CASE } = require('../../fixtures/caseMigrations');

let token = null;
let trialSessionId;
let docketNumber;

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

  describe('create a case via migration', () => {
    let migrateUserToken, migrateRestApi;
    before(async () => {
      migrateRestApi = await getRestApi();
      const results = await getUserToken(
        'migrator@example.com',
        'Testing1234$',
      );
      migrateUserToken = results.AuthenticationResult.IdToken;
      faker.seed(faker.random.number());

      const docketNumberYear = faker.random.number({ max: 99, min: 80 });
      const docketNumberPrefix = faker.random.number({ max: 99999, min: 101 });

      docketNumber = `${docketNumberPrefix}-${docketNumberYear}`;
    });

    it('should be able to POST a basic migrated case to the endpoint for use with trial sessions', () => {
      cy.request({
        body: { ...BASE_CASE, docketNumber },
        headers: {
          Authorization: `Bearer ${migrateUserToken}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        url: `${migrateRestApi}/migrate/case`,
      });
    });
  });

  describe('should be able to create a trial session', () => {
    before(() => {
      cy.server();
      cy.route({ method: 'POST', url: '/trial-sessions' }).as(
        'postTrialSession',
      );
    });
    it('creates a trial session', () => {
      cy.get('a[href="/trial-sessions"]').click();
      cy.get('a[href="/add-a-trial-session"]').click();

      // session information
      cy.get('#start-date-date').type('09/09/2029');
      cy.get('#start-time-hours').clear().type('1');
      cy.get('#start-time-minutes').clear().type('30');
      cy.get('label[for="startTimeExtension-pm"]').click();
      cy.get('label[for="session-type-Hybrid"]').click();
      cy.get('#max-cases').type('20');

      // location information
      cy.get('#trial-location').select('Phoenix, Arizona');
      cy.get('#courthouse-name').type("Judge Wapner's Chambers");
      cy.get('#address1').type('100 West Main St');
      cy.get('#address2').type('Suite 500');
      cy.get('#city').type('Sun Prairie');
      cy.get('#state').select('WI');
      cy.get('#postal-code').type('90210');

      // session assignments
      cy.get('#judgeId').select('Chief Judge Foley');
      cy.get('#trial-clerk').select('Test trialclerk1');
      cy.get('#court-reporter').type('Jimmy');
      cy.get('#irs-calendar-administrator').type('Cal Ender');
      cy.get('#notes').type('One bowl of M&Ms, all red ones removed.');

      // cy.get('#submit-trial-session').click(); // TODO: use this instead of the following after button has ID
      cy.get('#main-content > section > div > button:nth-child(10)').click();

      // set up listener for POST call, get trialSessionId
      cy.wait('@postTrialSession').then(xhr => {
        ({ trialSessionId } = xhr.response.body);
        cy.get('#new-trial-sessions-tab').click();
        cy.get(`a[href="/trial-session-detail/${trialSessionId}"]`).should(
          'exist',
        );
      });
    });

    it('navigates to newly-created trial session', () => {
      cy.get(`a[href="/trial-session-detail/${trialSessionId}"]`).click();
    });
  });

  describe('after a new trial session is created', () => {
    before(() => {});

    it('a newly-created case is found', () => {
      cy.get('#search-field').type(docketNumber);
      cy.get('#search-input button').click();
      cy.get('#case-title').should('exist');
    });

    it('it is possible to manually add, view, and remove case from an unset trial session', () => {
      cy.get('#tab-case-information').click();
      cy.get('#tab-overview').click();

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

      cy.get('#remove-from-trial-session-btn').should('exist').click();
      cy.get('#disposition').type('which position?');
      cy.get('#modal-root .modal-button-confirm').click();
      cy.get('#add-to-trial-session-btn').should('not.exist');
    });

    it.skip('sets a trial session as calendared', () => {
      cy.goToRoute(`/trial-session-detail/${trialSessionId}`);
      const setCalendarSelector =
        '#main-content > section > div.ustc-ui-tabs.ustc-num-tabs-1 > button'; // todo: use #set-calendar-button
      cy.get(setCalendarSelector).should('exist').click();
      cy.get('#modal-root .modal-button-confirm').click();
      cy.get(setCalendarSelector).should('not.exist');
    });

    it.skip('manually add, view, and remove case from a set trial session', () => {
      cy.get('#tab-case-information').click();
      cy.get('#tab-overview').click();

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

      cy.get('#remove-from-trial-session-btn').should('exist').click();
      cy.get('#disposition').type('which position?');
      cy.get('#modal-root .modal-button-confirm').click();
      cy.get('#add-to-trial-session-btn').should('not.exist');
    });

    it.skip('Petitions clerk- Set case as High Priority for a trial session', () => {});
    it.skip('Petitions clerk - Manually block, view (Blocked report), and unblock a case', () => {});
    it.skip('Petitions clerk: Complete QC of eligible cases and set calendar for trial session', () => {});
    it.skip('Petitions clerk: Run Trial Session Planning Report', () => {});
  });
});
