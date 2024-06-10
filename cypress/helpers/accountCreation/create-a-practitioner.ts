import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';

export function createAPractitioner() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  cy.get('[data-testid="search-link"]').click();
  cy.get('[data-testid="practitioner-search-tab"] > .button-text').click();
  cy.get('[data-testid="add-new-practitioner"]').click();

  cy.get('[data-testid="first-name-input"]').type(firstName);
  cy.get('[data-testid="last-name-input"]').type(lastName);

  const birthday = faker.date.birthdate({ max: 70, min: 1, mode: 'age' });
  cy.get('[data-testid="birth-year-input"]').type(
    birthday.getFullYear().toString(),
  );

  cy.get('[data-testid="practitioner-type-Attorney-radio"]').click();
  cy.get('#practitioner-type-Attorney').check();

  cy.get('[data-testid="practiceType-IRS-radio"]').click();
  cy.get('#practiceType-IRS').check();

  cy.get('[data-testid="contact.address1"]').type(
    faker.location.streetAddress(),
  );
  cy.get('#contact\\.address2').type(faker.location.buildingNumber());
  cy.get('[data-testid="contact.city"]').type(faker.location.city());
  cy.get('[data-testid="contact.state"]').select(
    faker.location.state({ abbreviated: true }),
  );
  cy.get('[data-testid="contact.postalCode"]').type(faker.location.zipCode());

  cy.get('[data-testid="practitioner-phone-input"]').type(faker.phone.number());

  const practitionerEmail = `cypress_test_account+${v4()}@example.com`;
  cy.get('[data-testid="practitioner-email-input"]').type(practitionerEmail);
  cy.get('[data-testid="practitioner-confirm-email-input"]').type(
    practitionerEmail,
  );

  cy.get('[data-testid="practitioner-bar-state-select"]').select(
    faker.location.state({ abbreviated: true }),
  );
  cy.get(
    '.usa-date-picker__wrapper > [data-testid="admissions-date-picker"]',
  ).type('02/14/2018');
  cy.get('[data-testid="create-practitioner-button"]').click();

  cy.get('[data-testid="success-alert"]').contains('Practitioner added');

  return cy
    .get('[data-testid="practitioner-bar-number"]')
    .then(barNumberDiv => {
      const barNumber = barNumberDiv.text();

      return cy.wrap({
        barNumber,
        firstName,
        lastName,
      });
    });
}
