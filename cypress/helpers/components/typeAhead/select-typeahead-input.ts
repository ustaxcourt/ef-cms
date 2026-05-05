export function selectTypeaheadInput(testId: string, value: string) {
  cy.get(`[data-testid="${testId}"] .select-react-element__control`).should(
    'be.visible',
  );

  cy.get(`[data-testid="${testId}"] .select-react-element__control`).click();

  cy.get(`[data-testid="${testId}"] .select-react-element__input`).type(value, {
    force: true,
  });

  cy.get(`[data-testid="${testId}"] .select-react-element__option`)
    .should('be.visible')
    .first()
    .click();
}
