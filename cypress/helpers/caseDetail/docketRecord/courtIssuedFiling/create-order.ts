export const createOrderOnConsolidatedCase = (
  orderContents = 'this is a test order',
) => {
  const orderTitle = 'Order first title';
  const orderEventCode = 'O';
  cy.get('[data-testid="case-detail-menu-button"]').click();
  cy.get('[data-testid="menu-button-create-order"]').click();
  cy.get('[data-testid="event-code-select"]').select(orderEventCode);
  cy.get('[data-testid="create-order-document-title"]').clear();
  cy.get('[data-testid="create-order-document-title"]').type(orderTitle);
  cy.get('[data-testid="modal-button-confirm"]').click();
  cy.get('[data-testid="create-order-page-title"]').should(
    'contain',
    `Create ${orderTitle}`,
  );
  cy.get('[data-testid="add-docket-number-btn"]').should(
    'have.text',
    'Add docket numbers to the caption',
  );
  cy.get('[data-testid="add-docket-number-btn"] > .svg-inline--fa').should(
    'have.class',
    'fa-plus-circle',
  );
  cy.get('[data-testid="add-docket-number-btn"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
  cy.get('[data-testid="add-docket-number-btn"]').should(
    'have.text',
    'Edit docket numbers in the caption',
  );
  cy.get('[data-testid="add-docket-number-btn"] > .svg-inline--fa').should(
    'have.class',
    'fa-edit',
  );
  cy.get('.ql-editor').click();
  cy.get('.ql-editor').type(orderContents);
  cy.get('[data-testid="save-order-button"]').click();
  cy.get('[data-testid="skip-signature-button"]').click();
  cy.get('.usa-alert__text').should('have.text', `${orderTitle} updated.`);
};
