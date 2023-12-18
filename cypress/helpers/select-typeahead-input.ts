export function selectTypeaheadInput(testId: string, value: string) {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000); // TODO: we shouldn't need this wait, but the app fails to type the document type without it
  cy.get(`[data-testid="${testId}"] .select-react-element__input`).type(
    `${value}{enter}`,
  );
}
