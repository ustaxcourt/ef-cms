import { AuthenticationResult } from '../../support/login-types';
import { isValidRequest } from '../support/helpers';
import { login } from '../support/pages/login';

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');
const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

describe('Trial Sessions UI Smoketests', () => {
  before(() => {
    cy.task<AuthenticationResult>('getUserToken', {
      email: 'testAdmissionsClerk@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      login(result.AuthenticationResult.IdToken);
    });
  });

  describe('login and view the trial sessions page', () => {
    it('should fetch the open trial sessions upon navigation', () => {
      cy.intercept({
        hostname: `api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
        method: 'GET',
        url: '/trial-sessions',
      }).as('getOpenTrialSessions');

      cy.get('a').contains('Trial Sessions').click();

      cy.wait('@getOpenTrialSessions').then(isValidRequest);
    });
  });
});
