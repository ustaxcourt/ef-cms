describe('File a petition ', function() {
  before(() => {
    cy.visit('/file-a-petition');
  });

  it('has three file inputs', () => {
    cy.get('form#file-a-petition')
      .find('input[type="file"]')
      .should('have.length', 3);
    cy.get('input#petition-file').should('exist');
    cy.get('input#request-for-place-of-trial').should('exist');
    cy.get('input#statement-of-taxpayer-id').should('exist');
    cy.contains('input[type="submit"]', 'Upload');
  });
});
