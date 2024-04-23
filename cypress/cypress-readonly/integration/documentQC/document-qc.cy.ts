import { isValidRequest } from '../../support/helpers';
import { loginAsTestAdmissionsClerk } from '../../../helpers/authentication/login-as-helpers';

const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

describe('Document QC UI Smoketests', () => {
  describe('login and view the document QC page', () => {
    it("should fetch the user's inbox upon navigation", () => {
      loginAsTestAdmissionsClerk();

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
