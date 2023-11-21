import { isValidRequest } from '../../support/helpers';

const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

describe('todays opinions', () => {
  it('should fetch today opinions from the public api', () => {
    cy.intercept({
      hostname: `public-api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
      method: 'GET',
      url: '/public-api/todays-opinions',
    }).as('getTodaysOpinions');

    cy.visit('/todays-opinions');

    cy.wait('@getTodaysOpinions').then(isValidRequest);
  });
});
