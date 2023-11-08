describe('Judge`s chambers stamps an order', () => {
  it('should create an order, serve it, and apply a stamp to it', () => {
    cy.login('docketclerk1', 'case-detail/103-20');

    cy.get('[data-test="create-dropdown"]').click();
    cy.get('[data-test="menu-button-add-paper-filing"').click();

    cy.get('input#date-received-picker').type('11/01/2023');
    cy.get('#document-type .select-react-element__input-container input').type(
      'Motion for Continuance',
    );
    cy.get('#react-select-2-option-0').click({ force: true });
    cy.get('[data-test="filed-by-option"]').contains('Petitioner').click();

    cy.get('#upload-mode-upload').click();
    cy.get('input#primaryDocumentFile-file').attachFile(
      '../fixtures/w3-dummy.pdf',
    );

    cy.get('[data-test="save-and-serve"]').click();

    cy.get('[data-test="confirm"]').click();

    cy.login('colvinschambers', 'case-detail/103-20');

    cy.get('[data-test="document-viewer-link-M006"]').last().click();

    cy.get('[data-test="apply-stamp"]').click();

    cy.get('[data-test="status-report-or-stip-decision-due-date"]').click();
    cy.get('input#due-date-input-statusReportDueDate-picker').type(
      '11/02/2023',
    );
    cy.get('input#due-date-input-statusReportDueDate-picker').should(
      'have.value',
      '11/02/2023',
    );

    cy.get('[data-test="clear-optional-fields"]').click();

    cy.get('[data-test="status-report-or-stip-decision-due-date"]').click();
    cy.get('input#due-date-input-statusReportDueDate-picker').should(
      'have.value',
      '',
    );
  });
});
