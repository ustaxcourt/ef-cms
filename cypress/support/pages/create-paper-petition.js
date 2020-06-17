exports.fillInCreateCaseFromPaperForm = () => {
  cy.get('#party-type').select('Petitioner');
  cy.get('#name').type('Wile e Coyote');
  cy.get('input[name="contactPrimary.address1"]').type('123 Roadrunner Lane');
  cy.get('input[name="contactPrimary.city"]').type('Nowhere');
  cy.get('select[name="contactPrimary.state"]').select('WA');
  cy.get('input[name="contactPrimary.postalCode"]').type('00000');

  cy.get('#tab-case-info').click();

  cy.get('#date-received-month').type('01');
  cy.get('#date-received-day').type('01');
  cy.get('#date-received-year').type('2020');
  cy.get('#mailing-date').type('01/01/2020');
  cy.get('#procedure-type-0').click();
  cy.get('#preferred-trial-city')
    .scrollIntoView()
    .select('Birmingham, Alabama');
  cy.get('label[for="payment-status-unpaid"]').click();

  cy.get('#tab-irs-notice').click();
  cy.get('#case-type').scrollIntoView().select('Deficiency');
  cy.get('#has-irs-verified-notice-no').click();

  cy.get('#upload-mode-upload').click();
  cy.upload_file('w3-dummy.pdf', 'input#petitionFile-file');

  cy.get('button[aria-controls="tabContent-stinFile"]').click();
  cy.get('#upload-mode-upload').click();
  cy.upload_file('w3-dummy.pdf', 'input#stinFile-file');

  cy.get(
    'button[aria-controls="tabContent-requestForPlaceOfTrialFile"]',
  ).click();
  cy.get('#upload-mode-upload').click();
  cy.upload_file('w3-dummy.pdf', 'input#requestForPlaceOfTrialFile-file');
};
