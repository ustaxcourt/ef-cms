const faker = require('faker');

exports.fillInCreateCaseFromPaperForm = testData => {
  const petitionerName = `${faker.name.firstName()} ${faker.name.lastName()}`;
  cy.get('#party-type').select('Petitioner');
  cy.get('#name').type(petitionerName);
  if (testData) {
    testData.testPetitionerName = petitionerName;
  }
  cy.get('input[name="contactPrimary.address1"]').type(
    faker.address.streetAddress(),
  );
  cy.get('input[name="contactPrimary.city"]').type(faker.address.city());
  cy.get('select[name="contactPrimary.state"]').select(
    faker.address.stateAbbr(),
  );
  cy.get('input[name="contactPrimary.postalCode"]').type(
    faker.address.zipCode(),
  );
  cy.get('input[name="contactPrimary.phone"]').type(faker.phone.phoneNumber());

  cy.get('#tab-case-info').click();

  cy.get('#date-received-date').type('01/01/2020');
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
  cy.get('input#petitionFile-file').attachFile('../fixtures/w3-dummy.pdf');

  cy.get('button#tabButton-stinFile').click();
  cy.get('#upload-mode-upload').click();
  cy.get('input#stinFile-file').attachFile('../fixtures/w3-dummy.pdf');

  cy.get('button#tabButton-requestForPlaceOfTrialFile').click();
  cy.get('#upload-mode-upload').click();
  cy.get('input#requestForPlaceOfTrialFile-file').attachFile(
    '../fixtures/w3-dummy.pdf',
  );
};
