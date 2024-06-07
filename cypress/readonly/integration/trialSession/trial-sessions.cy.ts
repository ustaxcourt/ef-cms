import { isValidRequest } from '../../support/helpers';
import { loginAsAdmissionsClerk } from '../../../helpers/authentication/login-as-helpers';

const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

describe('Trial Sessions UI Smoketests', () => {
  it('should fetch the open trial sessions upon navigation', () => {
    loginAsAdmissionsClerk('testAdmissionsClerk');
    cy.intercept({
      hostname: `api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
      method: 'GET',
      url: '/trial-sessions',
    }).as('getOpenTrialSessions');

    cy.get('a').contains('Trial Sessions').click();

    cy.wait('@getOpenTrialSessions').then(isValidRequest);
  });
});
