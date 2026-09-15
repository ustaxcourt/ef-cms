import { isValidRequest } from '../../support/helpers';

const EFCMS_DOMAIN = Cypress.expose('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.expose('DEPLOYING_COLOR');

describe('todays orders', () => {
  it('should fetch today orders from the public api', () => {
    cy.intercept({
      hostname: `public-api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
      method: 'GET',
      url: '/public-api/todays-orders/**',
    }).as('getTodaysOrders');

    cy.visit('/todays-orders');

    cy.wait('@getTodaysOrders').then(isValidRequest);
  });
});
