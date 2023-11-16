export function petitionsclerkCreatesAndServesPaperPetition() {
  cy.login('petitionsclerk1');
  cy.getByTestId('inbox-tab-content').should('exist');
  cy.intercept('GET', 'https://**/dynamsoft.webtwain.initiate.js', {
    body: `window.Dynamsoft = {DWT: {
            GetWebTwain() {}
          }}`,
    statusCode: 200,
  });
  cy.getByTestId('document-qc-nav-item').click();
  cy.getByTestId('start-a-petition').click();
  cy.get('#party-type').select('Petitioner');
  cy.getByTestId('contact-primary-name').clear();
  cy.getByTestId('contact-primary-name').type('rick james');
  cy.getByTestId('contactPrimary.address1').clear();
  cy.getByTestId('contactPrimary.address1').type('some random street');
  cy.getByTestId('contactPrimary.city').clear();
  cy.getByTestId('contactPrimary.city').type('cleveland');
  cy.getByTestId('contactPrimary.state').select('TN');
  cy.getByTestId('contactPrimary.postalCode').clear();
  cy.getByTestId('contactPrimary.postalCode').type('33333');
  cy.getByTestId('phone').clear();
  cy.getByTestId('phone').type('n/a');
  cy.get('#tab-case-info > .button-text').click();
  cy.get('#date-received-picker').clear();
  cy.get('#date-received-picker').type('01/02/2020');
  cy.get('#mailing-date').clear();
  cy.get('#mailing-date').type('01/02/2019');
  cy.getByTestId('preferred-trial-city').select('Birmingham, Alabama');
  cy.get(
    ':nth-child(9) > .usa-fieldset > :nth-child(3) > .usa-radio__label',
  ).click();
  cy.get('#payment-status-unpaid').check({ force: true });
  cy.get(':nth-child(10) > .usa-checkbox__label').click();
  cy.get('#order-for-filing-fee').uncheck({ force: true });
  cy.get('#tab-irs-notice > .button-text').click();
  cy.getByTestId('case-type-select').select('CDP (Lien/Levy)');
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
  cy.getByTestId('submit-paper-petition').click();
  return cy
    .get('.docket-number-header a')
    .invoke('attr', 'href')
    .then(href => {
      const docketNumber = href!.split('/').pop();
      cy.getByTestId('serve-case-to-irs').click();
      cy.getByTestId('modal-confirm').click();
      cy.get('#done-viewing-paper-petition-receipt-button').click();
      cy.get('.usa-alert__text').should('have.text', 'Petition served to IRS.');
      return cy.wrap(docketNumber!);
    });
}
