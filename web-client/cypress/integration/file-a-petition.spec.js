describe('File a petition ', function() {
  let rowCount;
  before(() => {
    // TODO: get logged in with a token and go directly to /file-a-petition
    cy.login('taxpayer', '/file-a-petition');
    cy.get('table')
      .find('tr')
      .then($trs => {
        rowCount = $trs.length;
      });
    cy.get('.usa-button').click();
  });

  it('has three file inputs', () => {
    console.log('There are ', rowCount);
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
  it('has gained another record', () => {
    cy.get('table')
      .find('tr')
      .should('have.length', rowCount + 1);
  });
});
