const {
  searchByDocketNumber,
  searchByPetitionerName,
} = require('../../support/pages/advanced-search');

const docketNumberToSearchBy = '103-20';
const domain = Cypress.env('EFCMS_DOMAIN');

describe('Public Search', () => {
  it('should be able to login', () => {
    cy.request({
      followRedirect: true,
      method: 'GET',
      url: `https://public-api.${domain}/`,
    });
  });

  it('should be able to search for case by practitioner name', () => {
    searchByPetitionerName();
  });

  it('should be able to search for case by docket number', () => {
    searchByDocketNumber(docketNumberToSearchBy);
  });
});
