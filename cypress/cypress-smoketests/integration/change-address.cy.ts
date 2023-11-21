import { createEletronicCase } from '../../helpers/create-electronic-case';
import { faker } from '@faker-js/faker';
import { loginAsPrivatePractitioner } from '../../helpers/auth/login-as-helpers';
import { petitionsclerkServePetition } from '../../helpers/petitionsclerk-serves-petition';

describe('change of address', () => {
  it('changing the address of a private practitioner should generate NCA and update their cases', () => {
    const newAddress = faker.location.streetAddress();
    loginAsPrivatePractitioner();
    createEletronicCase().then(docketNumber => {
      petitionsclerkServePetition(docketNumber);
      cy.login('privatePractitioner1');
      cy.get('[data-testid="case-list-table"]').should('exist');
      cy.get('[data-testid="account-menu-button"]').click();
      cy.get('[data-testid="my-account-link"]').click();
      cy.get('[data-testid="edit-contact-info"]').click();
      cy.get('[data-testid="contact.address1"]').clear();
      cy.get('[data-testid="contact.address1"]').type(newAddress);
      cy.get('[data-testid="save-edit-contact"]').click();
      cy.get('[data-testid="success-alert"]').should('exist');
      cy.get('#docket-search-field').clear();
      cy.get('#docket-search-field').type(docketNumber);
      cy.get('[data-testid="search-by-docket-number"]').click();
      cy.get('#docket-record-table td').contains('NCA').should('exist');
      cy.get('#docket-record-table td').contains('NOTR').should('exist');
      cy.get('[data-testid="tab-case-information"] > .button-text').click();
      cy.get('[data-testid="tab-parties"] > .button-text').click();
      cy.get(
        ':nth-child(1) > .card > .content-wrapper > :nth-child(7) > .grid-row > .grid-col-3 > .width-auto',
      ).click();
      cy.get(':nth-child(1) > .no-margin > .margin-top-1').click();
      cy.get('[data-testid="address1-line"]')
        .contains(newAddress)
        .should('exist');
    });
  });
});
