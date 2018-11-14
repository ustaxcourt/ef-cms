describe('File a petition ', function() {
  before(() => {
    // TODO: get logged in with a token and go directly to /file-a-petition
    cy.visit('/log-in');
    cy.get('input#name').type('taxpayer');
    cy.get('input[type="submit"]').click();
    cy.url().should('not.include', 'log-in');
    cy.get('.usa-alert-error').should('not.exist');
    cy.get('a.usa-button').click();
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
    cy.get('form#file-a-petition')
      .find('label[for="petition-file"]')
      .should('not.have.class', 'validated');

    // select first file
    cy.upload_file('w3-dummy.pdf', 'form#file-a-petition #petition-file');

    cy.get('form#file-a-petition')
      .find('label[for="petition-file"]')
      .should('have.class', 'validated');

    // select second file
    cy.upload_file(
      'w3-dummy.pdf',
      'form#file-a-petition #request-for-place-of-trial',
    );
    cy.get('form#file-a-petition')
      .find('label[for="request-for-place-of-trial"]')
      .should('have.class', 'validated');

    // select third file
    cy.upload_file(
      'w3-dummy.pdf',
      'form#file-a-petition #statement-of-taxpayer-id',
    );
    cy.get('form#file-a-petition')
      .find('label[for="statement-of-taxpayer-id"]')
      .should('have.class', 'validated');
  });

  it('submits forms and shows a success message', () => {
    cy.get('form#file-a-petition button[type="submit"]').click();
    cy.get('.usa-alert-success', { timeout: 10000 }).should(
      'contain',
      'uploaded successfully',
    );
  });
});
