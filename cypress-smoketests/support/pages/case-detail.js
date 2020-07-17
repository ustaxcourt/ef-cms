exports.goToCaseDetail = docketNumber => {
  cy.get('#search-field').type(docketNumber);
  cy.get('.ustc-search-button').click();
  cy.get(`.big-blue-header h1 a:contains("${docketNumber}")`).should('exist');
};

exports.createOrder = () => {
  cy.get('#case-detail-menu-button').click();
  cy.get('#menu-button-create-order').click();
  cy.get('.modal-dialog').should('exist');
  cy.get('#eventCode').select('OSC');
  cy.get('.modal-button-confirm').click();
  cy.url().should('contain', '/create-order');
  cy.get('.ql-editor').type('A created order!');
  cy.get('#save-order-button').click();
  cy.url().should('contain', '/sign');
  cy.get('#skip-signature-button').click();
  cy.url().should('not.contain', '/sign');
};

exports.editAndSignOrder = () => {
  cy.get('#draft-edit-button-not-signed').click();
  cy.url().should('contain', '/edit-order');
  cy.get('.ql-editor').type('edited');
  cy.get('#save-order-button').click();
  cy.url().should('contain', '/sign');
  cy.get('#sign-pdf-canvas').click();
  cy.get('#save-signature-button').click();
  cy.url().should('not.contain', '/sign');
};

exports.addDocketEntryForOrderAndServe = () => {
  cy.get('#add-court-issued-docket-entry-button').click();
  cy.url().should('contain', '/add-court-issued-docket-entry');
  cy.get('#serve-to-parties-btn').click();
  cy.get('.modal-button-confirm').click();
  cy.url().should('not.contain', '/add-court-issued-docket-entry');
  cy.get('button:contains("Order to Show Cause")').click();
  cy.get('h3:contains("Order to Show Cause")').should('exist');
  cy.get('div:contains("Served")').should('exist');
};

exports.addDocketEntryForOrderAndServePaper = () => {
  cy.get('#add-court-issued-docket-entry-button').click();
  cy.url().should('contain', '/add-court-issued-docket-entry');
  cy.get('#serve-to-parties-btn').click();
  cy.get('.modal-button-confirm').click();
  cy.url().should('contain', '/print-paper-service');
  cy.get('#print-paper-service-done-button').click();
  cy.get('button:contains("Order to Show Cause")').click();
  cy.get('h3:contains("Order to Show Cause")').should('exist');
  cy.get('div:contains("Served")').should('exist');
};
