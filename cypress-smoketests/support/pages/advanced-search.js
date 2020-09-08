exports.gotoAdvancedSearch = () => {
  cy.get('a.advanced').click();
};

exports.gotoAdvancedPractitionerSearch = () => {
  cy.get('a.advanced').click();
  cy.get('button#tab-practitioner').click();
};

exports.goToOrderSearch = () => {
  cy.get('a.advanced').click();
  cy.get('button#tab-order').click();
};

exports.goToOpinionSearch = () => {
  cy.get('a.advanced').click();
  cy.get('button#tab-opinion').click();
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

exports.searchByPractitionerName = () => {
  cy.get('input#practitioner-name').type('test');
  cy.get('button#practitioner-search-by-name-button').click();
  cy.get('table.search-results').should('exist');
};

exports.searchByPractitionerbarNumber = barNumber => {
  cy.get('input#bar-number').type(barNumber);
  cy.get('button.advanced-search__button').eq(1).click();
  cy.url().should('contain', barNumber);
};

exports.searchOrderByKeyword = keyword => {
  cy.get('input#order-search').type(keyword);
  cy.get('button#advanced-search-button').click();
  cy.get('table.search-results').should('exist');
};

exports.searchOpinionByKeyword = keyword => {
  cy.get('input#opinion-search').type(keyword);
  cy.get('button#advanced-search-button').click();
  cy.get('table.search-results').should('exist');
};
