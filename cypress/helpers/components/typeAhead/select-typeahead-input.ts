export function selectTypeaheadInput(testId: string, value: string): void {
  cy.get(`[data-testid="${testId}"]`).within(() => {
    cy.get('.select-react-element__control').should('be.visible').click();

    cy.get('.select-react-element__input').type(value, {
      force: true,
    });

    cy.get('.select-react-element__option').should('have.length.at.least', 1);
    cy.get('.select-react-element__option').then($options => {
      const options = Array.from($options);
      const exactMatch = options.find(opt => opt.textContent === value);
      const containsMatch = options.find(opt =>
        opt.textContent?.includes(value),
      );

      cy.wrap(exactMatch || containsMatch || $options[0]).click();
    });
  });
}
