export function createAndServePaperPetition(
  options = { yearReceived: '2020' },
) {
  const name = 'rick james ' + Date.now();
  cy.login('petitionsclerk1');
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
  cy.get('[data-testid="document-qc-nav-item"]').click();
  cy.get('[data-testid="start-a-petition"]').click();
  cy.get('#party-type').select('Petitioner');
  cy.get('[data-testid="contact-primary-name"]').clear();
  cy.get('[data-testid="contact-primary-name"]').type(name);
  cy.get('[data-testid="contactPrimary.address1"]').clear();
  cy.get('[data-testid="contactPrimary.address1"]').type('some random street');
  cy.get('[data-testid="contactPrimary.city"]').clear();
  cy.get('[data-testid="contactPrimary.city"]').type('cleveland');
  cy.get('[data-testid="contactPrimary.state"]').select('TN');
  cy.get('[data-testid="contactPrimary.postalCode"]').clear();
  cy.get('[data-testid="contactPrimary.postalCode"]').type('33333');
  cy.get('[data-testid="phone"]').clear();
  cy.get('[data-testid="phone"]').type('n/a');
  cy.get('#tab-case-info > .button-text').click();
  cy.get('#date-received-picker').clear();
  cy.get('#date-received-picker').type(`01/02/${options.yearReceived}`);
  cy.get('#mailing-date').clear();
  cy.get('#mailing-date').type('01/02/2019');
  cy.get('[data-testid="preferred-trial-city"]').select('Birmingham, Alabama');
  cy.get(
    ':nth-child(9) > .usa-fieldset > :nth-child(3) > .usa-radio__label',
  ).click();
  cy.get('#payment-status-unpaid').check({ force: true });
  cy.get(':nth-child(10) > .usa-checkbox__label').click();
  cy.get('#order-for-filing-fee').uncheck({ force: true });
  cy.get('#tab-irs-notice > .button-text').click();
  cy.get('[data-testid="case-type-select"]').select('CDP (Lien/Levy)');
  cy.get('#upload-mode-upload').click();
  cy.get('#uploadMode').check();
  cy.get('#petitionFile-file').attachFile('../fixtures/w3-dummy.pdf');
  cy.get('#tabButton-requestForPlaceOfTrialFile > .button-text').click();
  cy.get('#scan-mode-radios').click();
  cy.get('#upload-mode-upload').click();
  cy.get('#uploadMode').check();
  cy.get('#requestForPlaceOfTrialFile-file').attachFile(
    '../fixtures/w3-dummy.pdf',
  );
  cy.get('[data-testid="tabButton-attachmentToPetitionFile"]').click();
  cy.get('[data-testid="button-upload-pdf"]').click();
  cy.get('input#attachmentToPetitionFile-file').attachFile(
    '../fixtures/w3-dummy.pdf',
  );
  cy.get('[data-testid="remove-pdf"]');
  cy.get('[data-testid="submit-paper-petition"]').click();
  return cy
    .get('.docket-number-header a')
    .invoke('attr', 'href')
    .then(href => {
      const docketNumber = href!.split('/').pop();
      cy.get('[data-testid="serve-case-to-irs"]').click();
      cy.get('[data-testid="modal-confirm"]').click();
      cy.get('#done-viewing-paper-petition-receipt-button').click();
      cy.get('.usa-alert__text').should('have.text', 'Petition served to IRS.');
      return cy.wrap({ docketNumber: docketNumber!, name });
    });
}
