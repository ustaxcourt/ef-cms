import { AuthenticationResult } from '../../support/login-types';
import { getEnvironmentSpecificFunctions } from '../support/pages/environment-specific-factory';
import { isValidRequest } from '../support/helpers';

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');
const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

describe('Document QC UI Smoketests', () => {
  const { login } = getEnvironmentSpecificFunctions();

  before(() => {
    cy.task<AuthenticationResult>('getUserToken', {
      email: 'testAdmissionsClerk@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      login(result.AuthenticationResult.IdToken);
    });
  });

  describe('login and view the document QC page', () => {
    it("should fetch the user's inbox upon navigation", () => {
      cy.get('.button-switch-box')
        .contains('Switch to Section Messages')
        .click();

      cy.intercept({
        hostname: `api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
        method: 'GET',
        url: '/sections/admissions/document-qc/inbox*',
      }).as('getSectionInbox');

      cy.get('a').contains('Document QC').click();

      cy.wait('@getSectionInbox').then(isValidRequest);
    });
  });
});
