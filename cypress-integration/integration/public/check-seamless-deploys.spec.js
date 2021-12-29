const {
  enterCaseTitleOrPetitionerName,
  enterDocumentDocketNumber,
  enterDocumentKeywordForAdvancedSearch,
} = require('../../support/pages/public/advanced-search');

describe('Public user experiences seamless reloadd after deployment', function () {
  // go to case search page and fill out appropriate fields
  // execute cypress command to modify deploy-date.txt
  // verify that the page reloads
  // verify form fields are saved after reload

  it('should go to case search page and fill out case fields', () => {
    cy.visit('/');
    cy.get('button#tab-order').click();
    enterDocumentDocketNumber('124-20L');
    enterCaseTitleOrPetitionerName('Osborne');
    enterDocumentKeywordForAdvancedSearch('abcd');

    cy.window().then(w => (w.beforeReload = true));

    cy.window().should('have.prop', 'beforeReload');

    cy.task('modifyDeployedDateTextFile', Date.now().toString());

    cy.window().should('not.have.prop', 'beforeReload');
  });
});

// describe('random unroutable URL', () => {
//   it('should display the not found error page when routing to a random URL that cannot be otherwise fulfilled by the router', () => {
//     cy.visit('/this/definitely-does-not/exist');

//     cy.get('div.big-blue-header h1').should('contain', 'Error 404');
//     cy.get('a#home').should('exist');
//     cy.get('a#home').click();
//     cy.get('div.big-blue-header h1').should('not.contain', 'Error 404');
//   });
// });
