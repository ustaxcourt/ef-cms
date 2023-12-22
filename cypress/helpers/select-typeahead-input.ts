export function selectTypeaheadInput(testId: string, value: string) {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(100); // app fails without a wait
  cy.get(`[data-testid="${testId}"] .select-react-element__input`).type(
    `${value}{enter}`,
  );
}
