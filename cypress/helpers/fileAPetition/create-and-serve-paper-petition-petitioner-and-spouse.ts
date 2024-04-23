import {
  CASE_TYPES_MAP,
  PARTY_TYPES,
} from '../../../shared/src/business/entities/EntityConstants';
import { faker } from '@faker-js/faker';

export function createAndServePaperPetitionMultipleParties(
  options = { yearReceived: '2021' },
) {
  const name = 'Zofia Olszewska ' + Date.now();
  const spouseName = 'Jaylin Olszewska ' + Date.now();
  cy.login('petitionsclerk1');
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
  cy.get('[data-testid="document-qc-nav-item"]').click();
  cy.get('[data-testid="start-a-petition"]').click();
  cy.get('#party-type').select(PARTY_TYPES.petitionerSpouse);
  cy.get('[data-testid="contact-primary-name"]').type(name);
  cy.get('[data-testid="contactPrimary.address1"]').type(
    faker.location.streetAddress(),
  );
  cy.get('[data-testid="contactPrimary.city"]').type(faker.location.city());
  cy.get('[data-testid="contactPrimary.state"]').select(
    faker.location.state({ abbreviated: true }),
  );
  cy.get('[data-testid="contactPrimary.postalCode"]').type(
    faker.location.zipCode(),
  );
  cy.get('[data-testid="phone"]').type(faker.phone.number());
  cy.get('[data-testid="contact-secondary-name"]').type(spouseName);
  cy.get('[data-testid="contactSecondary.address1"]').type(
    faker.location.streetAddress(),
  );
  cy.get('[data-testid="contactSecondary.city"]').type(faker.location.city());
  cy.get('[data-testid="contactSecondary.state"]').select(
    faker.location.state({ abbreviated: true }),
  );
  cy.get('[data-testid="contactSecondary.postalCode"]').type(
    faker.location.zipCode(),
  );
  cy.get('[data-testid="contact-secondary-phone-input"]').type(
    faker.phone.number(),
  );

  cy.get('#tab-case-info > .button-text').click();
  cy.get('#date-received-picker').type(`01/02/${options.yearReceived}`);
  cy.get('#mailing-date').clear();
  cy.get('#mailing-date').type('01/02/2019');
  cy.get('[data-testid="preferred-trial-city"]').select(
    'Charleston, West Virginia',
  );
  cy.get(
    ':nth-child(9) > .usa-fieldset > :nth-child(3) > .usa-radio__label',
  ).click();
  cy.get('#payment-status-unpaid').check({ force: true });
  cy.get(':nth-child(10) > .usa-checkbox__label').click();
  cy.get('#order-for-filing-fee').uncheck({ force: true });
  cy.get('#tab-irs-notice > .button-text').click();
  cy.get('[data-testid="case-type-select"]').select(CASE_TYPES_MAP.passport);
  cy.get('#upload-mode-upload').click();
  cy.get('#uploadMode').check();
  cy.get('#petitionFile-file').attachFile('../fixtures/w3-dummy.pdf');
  cy.get('#tabButton-requestForPlaceOfTrialFile > .button-text').click();
  cy.get('#scan-mode-radios').click();
  cy.get('#upload-mode-upload').click();
  cy.get('#uploadMode').check();
  cy.get('#requestForPlaceOfTrialFile-file').attachFile(
    '../fixtures/w3-dummy.pdf',
  );
  cy.get('[data-testid="submit-paper-petition"]').click();
  return cy
    .get('.docket-number-header a')
    .invoke('attr', 'href')
    .then(href => {
      const docketNumber = href!.split('/').pop();
      cy.get('[data-testid="serve-case-to-irs"]').click();
      cy.get('[data-testid="modal-confirm"]').click();
      cy.get('#done-viewing-paper-petition-receipt-button').click();
      cy.get('.usa-alert__text').should('have.text', 'Petition served to IRS.');
      return cy.wrap({ docketNumber: docketNumber!, name, spouseName });
    });
}
