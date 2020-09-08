const { getUserToken, login } = require('../../support/pages/login');

let token = null;

describe('Petitions Clerk', () => {
  before(async () => {
    const result = await getUserToken(
      'petitionsclerk1@example.com',
      'Testing1234$',
    );
    token = result.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token, '/trial-sessions');
  });

  describe('should be able to create a trial session', () => {
    before(() => {
      cy.server();
      cy.route({ method: 'POST', url: '/trial-session' }).as(
        'postTrialSession',
      );
    });
    it('creates a swing session', () => {
      cy.get('a[href="/add-a-trial-session"]').click();

      // session information
      cy.get('#start-date-date').type('09/09/2029');
      cy.get('#start-time-hours').type('1');
      cy.get('#start-time-minutes').type('30');
      cy.get('label[for="startTimeExtension-pm"]').click();
      cy.get('label[for="session-type-Hybrid"]').click();
      cy.get('#max-cases').type('20');

      // location information
      cy.get('#trial-location').select('Phoenix, Arizona');
      cy.get('#courthouse-name').type("Judge Wapner's Chambers");
      cy.get('#address1').type('100 West Main St');
      cy.get('#address2').type('Suite 500');
      cy.get('#city').type('Sun Prairie');
      cy.get('#state').type('WI');
      cy.get('#postal-code').type('90210');

      // session assignments
      cy.get('#judgeId').select('Chief Judge Foley');
      cy.get('#trial-clerk').select('Test trialclerk1');
      cy.get('#court-reporter').type('Jimmy');
      cy.get('#irs-calendar-administrator').type('Cal Ender');
      cy.get('#notes').type('One bowl of M&Ms, all red ones removed.');

      // set up listener for POST call, get trialSessionId
      cy.wait('@postTrialSession').then(xhr => {
        console.log('Good news', xhr);
      });
      cy.get('#submit-trial-session').click();

      // verify we are at trial sessions page
      cy.get('#new-trial-sessions-tab').click();
      // verify that our created trial session exists
      // look for hyperlink with /trial-session/{trialSessionId}
    });
    goToCreateTrialSession();
  });
});

/**
 *
 */
function goToCreateTrialSession() {}
