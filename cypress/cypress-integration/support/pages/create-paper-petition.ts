import { faker } from '@faker-js/faker';

export const fillInCreateCaseFromPaperForm = testData => {
  const petitionerName = `${faker.person.firstName()} ${faker.person.lastName()}`;
  cy.get('#party-type').select('Petitioner');
  cy.get('#name').type(petitionerName);
  if (testData) {
    testData.testPetitionerName = petitionerName;
  }
  cy.get('input[name="contactPrimary.address1"]').type(
    faker.location.streetAddress(),
  );
  cy.get('input[name="contactPrimary.city"]').type(faker.location.city());
  cy.get('select[name="contactPrimary.state"]').select(
    faker.location.stateAbbr(),
  );
  cy.get('input[name="contactPrimary.postalCode"]').type(
    faker.location.zipCode(),
  );
  cy.get('input[name="contactPrimary.phone"]').type(faker.phone.number());

  cy.get('#tab-case-info').click();

  cy.get('#date-received-date').type('01/01/2020');
  cy.get('#mailing-date').type('01/01/2020');
  cy.get('#procedure-type-0').click();
  cy.get('#preferred-trial-city')
    .scrollIntoView()
    .select('Birmingham, Alabama');
  cy.get('label[for="payment-status-paid"]').click();
  cy.get('#payment-date-date').type('01/01/2020');
  cy.get('#petition-payment-method').type('Tears of my enemies');

  cy.get('label[for="notice-of-attachments"]').scrollIntoView().click();
  cy.get('label[for="order-for-ratification"]').scrollIntoView().click();

  cy.get('#tab-irs-notice').click();
  cy.get('#case-type').scrollIntoView().select('Deficiency');
  cy.get('#has-irs-verified-notice-yes').click();
  cy.get('#year-0').type('1995');

  const deficiencyAmount = '120,035';
  const deficiencyAmountWithoutComma = deficiencyAmount.replace(',', '');
  cy.get('[data-cy="deficiency-amount-0"]').type(deficiencyAmountWithoutComma);
  cy.get('[data-cy="deficiency-amount-0"]').should(
    'have.value',
    `$${deficiencyAmount}.00`,
  );

  cy.get('button.calculate-penalties').click();
  cy.get('#penalty_0').type(0);
  cy.get('button#modal-button-confirm').click();

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
