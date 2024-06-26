export function createOrderAndDecision(contents = 'this is a test order') {
  cy.get('[data-testid="case-detail-menu-button"]').click();
  cy.get('[data-testid="menu-button-create-order"]').click();
  cy.get('[data-testid="event-code-select"]').select('OAD');
  cy.get('[data-testid="modal-button-confirm"]').click();
  cy.get('.ql-editor').click();
  cy.get('.ql-editor').type(contents);
  cy.get('[data-testid="save-order-button"]').click();
  cy.get('[data-testid="sign-pdf-canvas"]').click();
  cy.get('[data-testid="save-signature-button"]').click();
  cy.get('[data-testid="success-alert"]');
}

export function createOrder({
  contents = 'this is a test order',
  title = 'a title',
}) {
  cy.get('[data-testid="case-detail-menu-button"]').click();
  cy.get('[data-testid="menu-button-create-order"]').click();
  cy.get('[data-testid="event-code-select"]').select('O');
  cy.get('[data-testid="create-order-document-title"]').clear();
  cy.get('[data-testid="create-order-document-title"]').type(title);
  cy.get('[data-testid="modal-button-confirm"]').click();
  cy.get('.ql-editor').click();
  cy.get('.ql-editor').type(contents);
  cy.get('[data-testid="save-order-button"]').click();
  cy.get('[data-testid="sign-pdf-canvas"]').click();
  cy.get('[data-testid="save-signature-button"]').click();
  cy.get('[data-testid="success-alert"]');
}

export function addOrderToDocketEntry() {
  cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
  cy.get('[data-testid="document-description-input"]').type(' testing');
  cy.get('[data-testid="service-stamp-Served"]').click();
  cy.get('[data-testid="serve-to-parties-btn"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
}
