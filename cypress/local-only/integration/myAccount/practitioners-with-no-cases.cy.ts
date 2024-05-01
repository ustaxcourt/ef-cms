import { generateRandomPhoneNumber } from '../../support/helpers';
import { navigateTo as loginAs } from '../../support/pages/maintenance';

describe('Practitioners with no cases', () => {
  it('should allow the practitioner to edit their phone number multiple times', () => {
    loginAs('privatePractitioner4');
    cy.get('[data-testid="account-menu-button"]').click();
    cy.get('[data-testid="my-account-link"]').click();
    cy.get('[data-testid="edit-contact-info"]').click();

    const randomPhoneNumber = generateRandomPhoneNumber();
    cy.get('[data-testid="phone-number-input"').as('phoneNumberInput');
    cy.get('@phoneNumberInput').clear();
    cy.get('@phoneNumberInput').type(randomPhoneNumber);

    cy.get('[data-testid="save-edit-contact"]').click();
    cy.get('[data-testid="success-alert"]').should('exist');

    cy.get('[data-testid="account-menu-button"]').click();
    cy.get('[data-testid="my-account-link"]').click();
    cy.get('[data-testid="contact-info-phone-number"]').should(
      'contain.text',
      randomPhoneNumber,
    );

    cy.get('[data-testid="edit-contact-info"]').click();
    const anotherRandomPhoneNumber = generateRandomPhoneNumber();
    cy.get('[data-testid="phone-number-input"').as('phoneNumberInput');
    cy.get('@phoneNumberInput').clear();
    cy.get('@phoneNumberInput').type(anotherRandomPhoneNumber);

    cy.get('[data-testid="save-edit-contact"]').click();
    cy.get('[data-testid="success-alert"]').should('exist');

    cy.get('[data-testid="account-menu-button"]').click();
    cy.get('[data-testid="my-account-link"]').click();
    cy.get('[data-testid="contact-info-phone-number"]').should(
      'contain.text',
      anotherRandomPhoneNumber,
    );
  });
});
