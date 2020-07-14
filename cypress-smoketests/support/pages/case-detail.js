exports.goToCaseDetail = docketNumber => {
  cy.get('#search-field').type(docketNumber);
  cy.get('.ustc-search-button').click();
  cy.get('.big-blue-header h1 a').contains(docketNumber).should('exist');
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
  cy.url().should('contain', '/case-detail');
};

exports.editAndSignOrder = () => {
  cy.get('#draft-edit-button-not-signed').click();
  cy.url().should('contain', '/edit-order');
  cy.get('.ql-editor').type('edited');
  cy.get('#save-order-button').click();
  cy.url().should('contain', '/sign');
  cy.get('#sign-pdf-canvas').click();
  cy.get('#save-signature-button').click();
  cy.url().should('contain', '/case-detail');
};
