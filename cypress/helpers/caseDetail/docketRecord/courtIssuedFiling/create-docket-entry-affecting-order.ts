export const createDocketEntryAffectingOrderOnConsolidatedCase = (
  orderContents = 'this is a test order',
  motionIndex: string,
  disposition = 'GRANTED',
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

  cy.get('.ql-editor').click();
  cy.get('.ql-editor').type(orderContents);
  cy.get('[data-testid="save-order-button"]').click();

  // Let's sign it now
  cy.get('[data-testid="sign-pdf-canvas"]').click();
  cy.get('[data-testid="save-signature-button"]').click();

  // Add the signed order
  cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
  cy.get('[data-testid="disposition-order-checkbox"]').click({ force: true });

  if (motionIndex) {
    cy.log(`Motion index: ${motionIndex}`);
    cy.log(`Motion index type: ${typeof motionIndex}`);
    // Click to open the dropdown
    cy.get('[data-testid="related-motion-type-search"]').click();
    // Type the motion index to filter options
    cy.get('[data-testid="related-motion-type-search"]').type(motionIndex);

    // Select from dropdown options
    cy.get('[class*="option"]').contains(motionIndex).click();
  } else {
    // Fallback: select the first available motion
    cy.get('[data-testid="related-motion-type-search"]').click();
    // cy.wait(500);
    cy.get('.select-search__option').first().click();
  }
  // Select disposition
  cy.get('[data-testid="related-motion-disposition-type-search"]').click();
  cy.get('[data-testid="related-motion-disposition-type-search"]')
    .contains(disposition)
    .click();

  cy.get('[data-testid="service-stamp-Served"]').click();

  cy.intercept('POST', '**/file-and-serve-court-issued-docket-entry').as(
    'PostCourtIssuedDocument',
  );

  // Save and serve docket entry
  cy.get('[data-testid="serve-to-parties-btn"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();

  return cy.wait('@PostCourtIssuedDocument').then(({ request }) => {
    return cy.wrap({ docketEntryId: request.body.docketEntryId });
  });
};
