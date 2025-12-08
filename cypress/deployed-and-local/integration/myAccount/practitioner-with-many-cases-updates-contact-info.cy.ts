import { faker } from '@faker-js/faker';
import { loginAsPractitionerWithManyCases } from 'cypress/helpers/authentication/login-as-helpers';
import { goToMyAccount } from 'cypress/local-only/support/pages/my-account';

describe('Practioner with many cases updates phone number and address', () => {
  let oldEmail: string = '';
  let cases: string[];

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
    cy.task('getPractionerWithMostCasesEmail').as('EMAIL');
    cy.get('@EMAIL').then(email => {
      oldEmail = email;
      console.log('Practioner with most cases email: ', email);
      cy.task('getOpenAndRecentCasesByEmail', email).then(resultCases => {
        cases = resultCases;
      });
      loginAsPractitionerWithManyCases(oldEmail);
    });
  });

  it('should update phone numbers on all open cases or cases closed within past 6 months', () => {
    goToMyAccount();

    // update practitioner number
    cy.get('[data-testid="edit-contact-info"]').click();
    cy.get('[data-testid="phone-number-input"]').click();
    cy.get('[data-testid="phone-number-input"]').clear();
    cy.get('[data-testid="phone-number-input"]').type(faker.phone.number());
    cy.get('[data-testid="save-edit-contact"]').click();

    cy.get('[data-testid="success-alert"]', { timeout: 7200000 }).should(
      'exist',
    );

    // check docket record that phone number document is on the docket record of each case
    console.log('Cases to check: ', cases);
    cases.forEach(docketNumber => {
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('[data-testid="docket-record-table"]')
        .find('tr')
        .last()
        .contains('NCP')
        .should('exist');
    });
  });

  it('should update addresses on all open cases or cases closed within past 6 months', () => {
    goToMyAccount();

    // update practitioner address
    cy.get('[data-testid="edit-contact-info"]').click();
    cy.get('[data-testid="contact.address1"]').clear();
    cy.get('[data-testid="contact.address1"]').type(
      faker.location.streetAddress(),
    );
    cy.get('[data-testid="save-edit-contact"]').click();
    cy.get('[data-testid="success-alert"]', { timeout: 7200000 }).should(
      'exist',
    );

    // check docket record that phone number document is on the docket record of each case
    console.log('Cases to check: ', cases);
    cases.forEach(docketNumber => {
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('[data-testid="docket-record-table"]')
        .find('tr')
        .last()
        .contains('NCA')
        .should('exist');
    });
  });
});
