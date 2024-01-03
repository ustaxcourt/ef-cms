import { faker } from '@faker-js/faker';
import {
  loginAsAdmissionsClerk,
  loginAsPrivatePractitioner,
} from '../../helpers/auth/login-as-helpers';
import { petitionsclerkServePetition } from '../../helpers/petitionsclerk-serves-petition';
import { practitionerCreatesEletronicCase } from '../../helpers/practitioner-creates-electronic-case';
import { searchByDocketNumberInHeader } from '../../helpers/search-by-docket-number-in-header';

describe('change of address', () => {
  it('changing the address of a private practitioner should generate NCA and update their cases', () => {
    const newAddress = faker.location.streetAddress();
    loginAsPrivatePractitioner('privatePractitioner2');
    practitionerCreatesEletronicCase().then(docketNumber => {
      petitionsclerkServePetition(docketNumber);
      cy.login('privatePractitioner2');
      cy.get('[data-testid="case-list-table"]').should('exist');
      cy.get('[data-testid="account-menu-button"]').click();
      cy.get('[data-testid="my-account-link"]').click();
      cy.get('[data-testid="edit-contact-info"]').click();
      cy.get('[data-testid="contact.address1"]').clear();
      cy.get('[data-testid="contact.address1"]').type(newAddress);
      cy.get('[data-testid="save-edit-contact"]').click();
      cy.get('[data-testid="success-alert"]').should('exist');
      cy.get('[data-testid="docket-search-field"]').clear();
      cy.get('[data-testid="docket-search-field"]').type(docketNumber);
      cy.get('[data-testid="search-by-docket-number"]').click();
      cy.get('[data-testid="docket-record-table"] td')
        .contains('NCA')
        .should('exist');
      cy.get('[data-testid="docket-record-table"] td')
        .contains('NOTR')
        .should('exist');
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      cy.get(
        '[data-testid="petitioner-card-John"] [data-testid="view-counsel-info"]',
      ).click();
      cy.get('[data-testid="address1-line"]')
        .contains(newAddress)
        .should('exist');

      loginAsAdmissionsClerk('admissionsclerk1');
      searchByDocketNumberInHeader(docketNumber);

      cy.get('[data-testid="tab-case-information"] > .button-text').click();
      cy.get('[data-testid="tab-parties"] > .button-text').click();
      // TODO: use this after deploying
      // cy.get(
      // eslint-disable-next-line spellcheck/spell-checker
      //   '[data-testid="petitioner-card-John"] [data-testid="edit-petitioner-counsel"]',
      // ).click();
      // TODO: this needs to be replaced with the commented out code above, but I can't refactor to use a test id until after an a deployment
      cy.get(
        '[data-testid="petitioner-card-John"] > .card > .content-wrapper > :nth-child(9) > .grid-row > .grid-col-3 > .margin-left-1',
      ).click();
      // TODO: replace #remove-petitioner-btn with this command after deployment
      // eslint-disable-next-line spellcheck/spell-checker
      // cy.get('[data-testid="remove-petitioner-btn"]').click()
      cy.get('#remove-petitioner-btn').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="success-alert"]').should('be.visible');
    });
  });
});
