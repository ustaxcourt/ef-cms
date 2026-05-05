export function selectTypeaheadInput(testId: string, value: string): void {
  cy.get(`[data-testid="${testId}"]`).within(() => {
    cy.get('.select-react-element__control').should('be.visible').click();

    cy.get('.select-react-element__input').type(value, {
      force: true,
    });

    cy.get('.select-react-element__option')
      .should('be.visible')
      .contains(value)
      .click();
  });
}
