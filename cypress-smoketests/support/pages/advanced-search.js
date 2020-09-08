exports.gotoAdvancedSearch = () => {
  cy.get('a.advanced').click();
};

exports.searchByPetitionerName = () => {
  cy.get('input#petitioner-name').type('test');
  cy.get('button#advanced-search-button').click();
  cy.get('table.search-results').should('exist');
};

exports.searchByDocketNumber = docketNumber => {
  cy.get('input#docket-number').type(docketNumber);
  cy.get('button#docket-search-button').click();
  cy.url().should('contain', docketNumber);
};
