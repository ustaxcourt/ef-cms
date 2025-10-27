export const createDocketEntryAffectingOrderOnConsolidatedCase = (
  orderContents = 'this is a test order',
  motionIndex: string,
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

    // Wait for filtered options to appear
    // cy.wait(500);

    cy.log(`Selecting motion with index: ${motionIndex}`);
    // Select the option that contains the motion index
    // Debug approach to see exact text content
    cy.get('.select-search__option').then($options => {
      cy.log(`Found ${$options.length} options`);

      $options.each((index, option) => {
        const optionText = Cypress.$(option).text().trim();
        cy.log(`Option ${index}: "${optionText}"`);
        cy.log(
          `Does it include "${motionIndex}"? ${optionText.includes(motionIndex)}`,
        );
      });
    });
    cy.get('.select-search__option')
      .contains(motionIndex)
      .click({ force: true }); // This is not triggering
  } else {
    // Fallback: select the first available motion
    cy.get('[data-testid="related-motion-type-search"]').click();
    // cy.wait(500);
    cy.get('.select-search__option').first().click();
  }
  // Select disposition
  cy.get('[data-testid="related-motion-disposition-type-search"]').click();
  cy.get('.select-search__option').contains('Granted').click();

  // Save the docket entry
  cy.get('[data-testid="save-docket-entry-button"]').click();
};
