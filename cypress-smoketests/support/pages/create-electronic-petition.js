const faker = require('faker');

exports.hasIrsNotice = {
  NO: 1,
  YES: 0,
};

exports.filingTypes = {
  BUSINESS: 2,
  INDIVIDUAL: 0,
  OTHER: 3,
  PETITIONER_AND_SPOUSE: 1,
};

exports.goToStartCreatePetition = () => {
  cy.get('a#file-a-petition').click();
};

exports.goToWizardStep1 = () => {
  cy.get('a[href*="file-a-petition/step-1"]').click();
  cy.url().should('contain', '/file-a-petition/step-1');
};

exports.goToWizardStep2 = () => {
  cy.get('button#submit-case').click();
  cy.url().should('contain', '/file-a-petition/step-2');
};

exports.goToWizardStep3 = () => {
  cy.get('button#submit-case').click();
  cy.url().should('contain', '/file-a-petition/step-3');
};

exports.goToWizardStep4 = () => {
  cy.get('button#submit-case').click();
  cy.url().should('contain', '/file-a-petition/step-4');
};

exports.goToWizardStep5 = () => {
  cy.get('button#submit-case').click();
  cy.url().should('contain', '/file-a-petition/step-5');
};

exports.submitPetition = testData => {
  cy.get('button#submit-case').scrollIntoView().click();

  cy.intercept('POST', '**/cases').as('postCase');
  cy.wait('@postCase').then(({ response }) => {
    expect(response.body).to.have.property('docketNumber');
    const { docketNumber } = response.body;
    if (testData) {
      testData.createdDocketNumber = docketNumber;
      if (testData.docketNumbers) {
        testData.docketNumbers.push(docketNumber);
      }
    }
  });
  cy.url().should('include', 'file-a-petition/success');
};

exports.goToDashboard = () => {
  cy.get('a#button-back-to-dashboard').click();
};

exports.completeWizardStep1 = () => {
  cy.get('input#stin-file').attachFile('../fixtures/w3-dummy.pdf');
};

exports.completeWizardStep2 = (hasIrsNotice, caseType) => {
  cy.screenshot();
  cy.get('input#petition-file').attachFile('../fixtures/w3-dummy.pdf');
  cy.get('#irs-notice-radios').scrollIntoView();
  cy.get(`label#hasIrsNotice-${hasIrsNotice}`).click();
  cy.get('#case-type').scrollIntoView().select(caseType);
};

exports.completeWizardStep3 = (filingType, petitionerName) => {
  cy.get(`label#filing-type-${filingType}`).scrollIntoView().click();

  if (filingType === exports.filingTypes.PETITIONER_AND_SPOUSE) {
    cy.get('label#is-spouse-deceased-0').click();
    cy.get('input#use-same-address-above')
      .scrollIntoView()
      .check({ force: true });

    cy.get('input#secondaryName').type(
      `${faker.name.firstName()} ${faker.name.lastName()}`,
    );
    cy.get('input#secondaryInCareOf').type(
      `${faker.name.firstName()} ${faker.name.lastName()}`,
    );
  }

  cy.get('input#name').scrollIntoView().type(petitionerName);
  cy.get('input[name="contactPrimary.address1"]')
    .scrollIntoView()
    .type(faker.address.streetAddress());
  cy.get('input[name="contactPrimary.city"]')
    .scrollIntoView()
    .type(faker.address.city());
  cy.get('select[name="contactPrimary.state"]')
    .scrollIntoView()
    .select(faker.address.stateAbbr());
  cy.get('input[name="contactPrimary.postalCode"]')
    .scrollIntoView()
    .type(faker.address.zipCode());
  cy.get('input#phone').scrollIntoView().type(faker.phone.phoneNumber());
};

exports.completeWizardStep4 = () => {
  cy.get('label#procedure-type-0').scrollIntoView().click();
  cy.get('#preferred-trial-city').scrollIntoView().select('Mobile, Alabama');
};
