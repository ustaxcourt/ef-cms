import { faker } from '@faker-js/faker';
import { loginAsDocketClerk } from 'cypress/helpers/authentication/login-as-helpers';
import { goToCase } from '../go-to-case';

export const addPartyPetitionerToCase = (
  docketNumber: string,
  petitionerFirstName: string = faker.person.firstName(),
) => {
  loginAsDocketClerk();
  goToCase(docketNumber);
  cy.get('[data-testid="tab-case-information"]').click();
  cy.get('[data-testid="tab-parties"]').click();
  cy.get('[data-testid="button-add-party"]').click();
  cy.get('[data-testid="add-petitioner-contact-type"]').select('petitioner');
  cy.get('[data-testid="add-petitioner-name"]').type(petitionerFirstName);
  cy.get('[data-testid="contact.address1"]').type('123 Main St');
  cy.get('[data-testid="contact.city"]').type('Charlotte');
  cy.get('[data-testid="contact.state"]').select('DE');
  cy.get('[data-testid="contact.postalCode"]').type('11111');
  cy.get('[data-testid="add-petitioner-phone"]').type('1234567890');
  cy.get('[data-testid="service-type-none-label-form.contact"]').click();
  cy.get('[data-testid="add-petitioner-submit-button"]').click();
};
