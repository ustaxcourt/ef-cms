const { getUserToken, login } = require('../../support/pages/login');
const { migrateGeneratedCase } = require('../../support/pages/case-migration');

let token = null;
let trialSessionId;

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

  describe.only('should find a new case and associate it with the new trial session', () => {
    let result;
    before(async () => {
      result = await migrateGeneratedCase();
    });

    it('finds a new case', () => {
      cy.visit(`/case-detail/${result.docketNumber}`);
      cy.get('#reports-btn').click();
      cy.get('#case-inventory-btn').click();
      cy.get('#select-case-inventory-status').select('New');
      cy.get('.case-inventory-report-modal .modal-button-confirm').click();
    });

    it('opens case detail and case information tab', () => {
      cy.get('.case-inventory tr:first-child > td > a').click();
      cy.get('#add-to-trial-session-btn').click();
      cy.get('label[for="show-all-locations-true"]').click();
      cy.get('select#trial-session')
        .select(trialSessionId)
        .should.have(trialSessionId);
    });
  });
});
