import { faker } from '@faker-js/faker';

export const hasIrsNotice = {
  NO: 1,
  YES: 0,
};

export const filingTypes = {
  BUSINESS: 2,
  INDIVIDUAL: 0,
  OTHER: 3,
  PETITIONER_AND_SPOUSE: 1,
};

export const goToStartCreatePetition = () => {
  cy.get('a#file-a-petition').click();
};

export const goToWizardStep1 = () => {
  cy.get('a[href*="file-a-petition/step-1"]').click();
  cy.url().should('contain', '/file-a-petition/step-1');
};

export const goToWizardStep2 = () => {
  cy.get('button#submit-case').click();
  cy.url().should('contain', '/file-a-petition/step-2');
};

export const goToWizardStep3 = () => {
  cy.get('button#submit-case').click();
  cy.url().should('contain', '/file-a-petition/step-3');
};

export const goToWizardStep4 = () => {
  cy.get('button#submit-case').click();
  cy.url().should('contain', '/file-a-petition/step-4');
};

export const goToWizardStep5 = () => {
  cy.get('button#submit-case').click();
  cy.url().should('contain', '/file-a-petition/step-5');
};

export const submitPetition = testData => {
  cy.intercept('POST', '**/cases').as('postCase');
  cy.get('button#submit-case').scrollIntoView();
  cy.get('button#submit-case').click();
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

export const goToDashboard = () => {
  cy.get('a#button-back-to-dashboard').click();
};

export const completeWizardStep1 = () => {
  cy.get('input#stin-file').attachFile('../fixtures/w3-dummy.pdf');
};

export const completeWizardStep2 = (hasIrsNoticeInput, caseType) => {
  cy.screenshot();
  cy.get('input#petition-file').attachFile('../fixtures/w3-dummy.pdf');
  cy.get('#irs-notice-radios').scrollIntoView();
  cy.get(`label#hasIrsNotice-${hasIrsNoticeInput}`).click();
  cy.get('#case-type').scrollIntoView();
  cy.get('#case-type').select(caseType);
};

export const completeWizardStep3 = (filingType, petitionerName) => {
  cy.get(`label#filing-type-${filingType}`).scrollIntoView();
  cy.get(`label#filing-type-${filingType}`).click();

  if (filingType === exports.filingTypes.PETITIONER_AND_SPOUSE) {
    cy.get('label#is-spouse-deceased-0').click();
    cy.get('input#use-same-address-above').scrollIntoView();
    cy.get('input#use-same-address-above').check({ force: true });

    cy.get('input#secondaryName').type(
      `${faker.person.firstName()} ${faker.person.lastName()}`,
    );
    cy.get('input#secondaryInCareOf').type(
      `${faker.person.firstName()} ${faker.person.lastName()}`,
    );
  }

  cy.get('input#name').scrollIntoView();
  cy.get('input#name').type(petitionerName);
  cy.get('input[name="contactPrimary.address1"]').scrollIntoView();
  cy.get('input[name="contactPrimary.address1"]').type(
    faker.location.streetAddress(),
  );
  cy.get('input[name="contactPrimary.city"]').scrollIntoView();
  cy.get('input[name="contactPrimary.city"]').type(faker.location.city());
  cy.get('select[name="contactPrimary.state"]').scrollIntoView();
  cy.get('select[name="contactPrimary.state"]').select(
    faker.location.stateAbbr(),
  );
  cy.get('input[name="contactPrimary.postalCode"]').scrollIntoView();
  cy.get('input[name="contactPrimary.postalCode"]').type(
    faker.location.zipCode(),
  );
  cy.get('input#phone').scrollIntoView();
  cy.get('input#phone').type(faker.phone.number());
};

export const completeWizardStep4 = () => {
  cy.get('label#procedure-type-0').scrollIntoView();
  cy.get('label#procedure-type-0').click();
  cy.get('#preferred-trial-city').scrollIntoView();
  cy.get('#preferred-trial-city').select('Mobile, Alabama');
};
