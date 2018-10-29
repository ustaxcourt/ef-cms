describe.only('File a petition ', function() {
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
    cy.contains('button[type="submit"]', 'Upload');
  });
  it('shows validation checkmark when file is selected', () => {
    cy.fixture('sample.pdf')
      .as('pdf')
      .get('form#file-a-petition #petition-file')
      .then(function(fileInput) {
        return Cypress.Blob.base64StringToBlob(
          this.pdf,
          'application/pdf',
        ).then(blob => {
          fileInput[0].files[0] = blob;
          fileInput[0].dispatchEvent(new Event('change', { bubbles: true }));
        });
      });

    cy.get('form#file-a-petition')
      .find('label[for="petition-file"]')
      .should('have.class', 'validated');
  });
});
