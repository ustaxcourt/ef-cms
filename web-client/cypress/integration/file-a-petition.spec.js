describe('File a petition', function() {
  let rowCount;
  before(() => {
    cy.login('taxpayer');
  });

  // describe('Dashboard view', () => {
  //   it('finds footer element', () => {
  //     cy.get('footer').should('exist');
  //   });
  //
  //   it('case list is visible', () => {
  //     cy.get('table')
  //       .find('tr')
  //       .then($trs => {
  //         rowCount = $trs.length;
  //       });
  //     cy.get('#init-file-petition').click();
  //   });
  //   describe('USA Banner', () => {
  //     it('shows header and hides content', () => {
  //       cy.contains('.usa-banner-header', 'how you know');
  //       cy.get('.usa-banner-content').should('not.exist');
  //     });
  //     it('shows reveals content when clicked, hides when clicked again', () => {
  //       cy.get('.usa-banner-button').click();
  //       cy.contains(
  //         '.usa-banner-content',
  //         'you are connecting to the official website',
  //       );
  //       cy.get('.usa-banner-button').click();
  //       cy.get('.usa-banner-content').should('not.exist');
  //     });
  //   });
  // });

  // describe('creation form', () => {
  //   before(() => {
  //     cy.url().should('include', 'file-a-petition');
  //   });
  //
  //   it('has three file inputs', () => {
  //     cy.get('form#file-a-petition')
  //       .find('input[type="file"]')
  //       .should('have.length', 3);
  //     cy.get('input#petition-file').should('exist');
  //     cy.get('input#request-for-place-of-trial').should('exist');
  //     cy.get('input#statement-of-taxpayer-id').should('exist');
  //     cy.contains('button[type="submit"]', 'Upload');
  //   });
  //
  //   it('shows validation checkmark when file is selected', () => {
  //     cy.get('form#file-a-petition')
  //       .find('label[for="petition-file"]')
  //       .should('not.have.class', 'validated');
  //
  //     // select first file
  //     cy.upload_file('w3-dummy.pdf', 'form#file-a-petition #petition-file');
  //
  //     cy.get('form#file-a-petition')
  //       .find('label[for="petition-file"]')
  //       .should('have.class', 'validated');
  //
  //     // select second file
  //     cy.upload_file(
  //       'w3-dummy.pdf',
  //       'form#file-a-petition #request-for-place-of-trial',
  //     );
  //     cy.get('form#file-a-petition')
  //       .find('label[for="request-for-place-of-trial"]')
  //       .should('have.class', 'validated');
  //
  //     // select third file
  //     cy.upload_file(
  //       'w3-dummy.pdf',
  //       'form#file-a-petition #statement-of-taxpayer-id',
  //     );
  //     cy.get('form#file-a-petition')
  //       .find('label[for="statement-of-taxpayer-id"]')
  //       .should('have.class', 'validated');
  //   });
  //
  //   it('submits forms and shows a success message', () => {
  //     cy.get('form#file-a-petition button[type="submit"]').click();
  //     cy.get('.usa-alert-success', { timeout: 10000 }).should(
  //       'contain',
  //       'uploaded successfully',
  //     );
  //   });
  //   it('case list table reflects newly-added record', () => {
  //     cy.get('table')
  //       .find('tr')
  //       .should('have.length', rowCount + 1);
  //   });
  // });

  // describe('can view case detail', () => {
  //   before(() => {
  //     cy.get('#case-list a')
  //       .first()
  //       .click();
  //     cy.url().should('include', 'case-detail');
  //   });
  //   it('shows accordion header', () => {
  //     cy.get('#actions-button').should('exist');
  //   });
  //   it('accordion header expands/collapses', () => {
  //     cy.get('#actions-button').click();
  //     cy.get('#paymentInfo').should('be.visible');
  //   });
  //   it('shows activities table and data', () => {
  //     cy.get('table#case-activities').should('exist');
  //     cy.get('table#case-activities tbody tr').should('exist');
  //   });
  // });
});
