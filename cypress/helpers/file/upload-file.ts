// eslint-disable-next-line spellcheck/spell-checker
/**
 * This function assumes the label associated with the file input has a similar test id:
 * data-testid="{YOUR_ID}-label"
 */
export function uploadFile(testId: string) {
  cy.get(`[data-testid="${testId}-label"]`).should(
    'not.have.class',
    'validated',
  );
  cy.get(`[data-testid="${testId}"]`).attachFile(
    '../../helpers/file/sample.pdf',
  );
  cy.get('[data-testid="upload-file-success"]').should('exist');
}
