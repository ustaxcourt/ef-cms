/**
 * This function assumes the label associated with the file input has a similar test id:
 * data-testid="{YOUR_ID}-label"
 *
 * @param testId the data-testid of the element
 */
export function attachDummyFile(testId: string) {
  cy.get(`[data-testid="${testId}-label"]`).should(
    'not.have.class',
    'validated',
  );
  cy.get(`[data-testid="${testId}"]`).attachFile('../fixtures/w3-dummy.pdf');
  cy.get(`[data-testid="${testId}-label"]`).should('have.class', 'validated');
}
