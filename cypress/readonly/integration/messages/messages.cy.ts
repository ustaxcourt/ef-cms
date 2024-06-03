import { isValidRequest } from '../../support/helpers';
import { loginAsAdmissionsClerk } from '../../../helpers/authentication/login-as-helpers';

const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

describe('Messages UI Smoketests', () => {
  it('should fetch messages and section messages after log in', () => {
    cy.intercept({
      hostname: `api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
      method: 'GET',
      url: '/messages/inbox/*',
    }).as('getMyMessages');
    loginAsAdmissionsClerk('testAdmissionsClerk');
    cy.wait('@getMyMessages').then(isValidRequest);

    cy.intercept({
      hostname: `api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
      method: 'GET',
      url: '/messages/inbox/section/admissions',
    }).as('getSectionInbox');
    cy.get('a.button-switch-box').click();
    cy.wait('@getSectionInbox').then(isValidRequest);
  });
});
