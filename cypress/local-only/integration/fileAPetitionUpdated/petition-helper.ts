export function textInput(
  errorMessageSelector: string,
  inputSelector: string,
  inputValue: string,
) {
  cy.get(`[data-testid="${errorMessageSelector}"]`).should('not.exist');
  cy.get(`[data-testid="${inputSelector}"]`).scrollIntoView();
  cy.get(`[data-testid="${inputSelector}"]`).should('exist');
  cy.get(`[data-testid="${inputSelector}"]`).focus();
  cy.get(`[data-testid="${inputSelector}"]`).blur();
  cy.get(`[data-testid="${errorMessageSelector}"]`).should('exist');
  cy.get(`[data-testid="${inputSelector}"]`).focus();
  cy.get(`[data-testid="${inputSelector}"]`).type(inputValue);
  cy.get(`[data-testid="${inputSelector}"]`).blur();
  cy.get(`[data-testid="${errorMessageSelector}"]`).should('not.exist');
}

export function selectInput(
  errorMessageSelector: string,
  selectSelector: string,
  optionValue: string,
) {
  cy.get(`[data-testid="${errorMessageSelector}"]`).should('not.exist');
  cy.get(`[data-testid="${selectSelector}"]`).scrollIntoView();
  cy.get(`[data-testid="${selectSelector}"]`).should('exist');
  cy.get(`[data-testid="${selectSelector}"]`).focus();
  cy.get(`[data-testid="${selectSelector}"]`).blur();
  cy.get(`[data-testid="${errorMessageSelector}"]`).should('exist');
  cy.get(`[data-testid="${selectSelector}"]`).focus();
  cy.get(`select[data-testid="${selectSelector}"]`).select(optionValue);
  cy.get(`[data-testid="${errorMessageSelector}"]`).should('not.exist');
}
