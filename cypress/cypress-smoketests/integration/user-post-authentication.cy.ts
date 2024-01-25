import { loginAsPetitionsClerk } from '../../helpers/auth/login-as-helpers';
import { v4 as uuidv4 } from 'uuid';

const randomizedEmail = `cypress_test_account+${uuidv4()}@example.com`;

if (!Cypress.env('SMOKETESTS_LOCAL') && !Cypress.env('MIGRATE')) {
  describe('add email to practitioner', () => {
    after(() => {
      cy.task('deleteAllCypressTestAccounts');
    });

    it('a noce should be generated after adding an email to a practitioner', () => {
      loginAsPetitionsClerk();
      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get('#file-a-petition').click();
      cy.get('#party-type').select('Petitioner');
      cy.get('[data-testid="contact-primary-name"]').clear();
      cy.get('[data-testid="contact-primary-name"]').type('bob ross');
      cy.get('[data-testid="contactPrimary.address1"]').clear();
      cy.get('[data-testid="contactPrimary.address1"]').type('some address');
      cy.get('[data-testid="contactPrimary.city"]').clear();
      cy.get('[data-testid="contactPrimary.city"]').type('cleveland');
      cy.get('[data-testid="contactPrimary.state"]').select('TN');
      cy.get('[data-testid="contactPrimary.postalCode"]').clear();
      cy.get('[data-testid="contactPrimary.postalCode"]').type('37363');
      cy.get('[data-testid="phone"]').clear();
      cy.get('[data-testid="phone"]').type('4444444444');
      cy.get('#tab-case-info > .button-text').click();
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
      ).clear();
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
      ).type('01/02/2023');
      cy.get('#mailing-date').clear();
      cy.get('#mailing-date').type('01/02/2023');
      cy.get(
        ':nth-child(9) > .usa-fieldset > :nth-child(3) > .usa-radio__label',
      ).click();
      cy.get('#payment-status-unpaid').check({ force: true });
      cy.get('#tab-irs-notice > .button-text').click();
      cy.get('[data-testid="case-type-select"]').select('CDP (Lien/Levy)');
      cy.get('#upload-mode-upload').click();
      cy.get('#uploadMode').check();
      cy.get('#petitionFile-file').attachFile('../fixtures/w3-dummy.pdf');
      cy.get('[data-testid="submit-paper-petition"]').click();
      cy.get('.docket-number-header a')
        .invoke('attr', 'href')
        .then(href => {
          const docketNumber = href!.split('/').pop()!;
          cy.get('[data-testid="serve-case-to-irs"]').click();
          cy.get('[data-testid="modal-confirm"]').click();
          cy.get(
            '[data-testid="done-viewing-paper-petition-receipt-button"]',
          ).click();
          cy.get('.usa-alert__text').should('be.visible');
          cy.login('admissionsclerk1');
          cy.get('table').should('exist');
          cy.get('#search-field').clear();
          cy.get('#search-field').type(docketNumber);
          cy.get('.usa-search-submit-text').click();
          cy.get('[data-testid="tab-case-information"] > .button-text').click();
          cy.get('[data-testid="tab-parties"] > .button-text').click();
          cy.get('.width-auto').click();
          cy.get('#updatedEmail').clear();
          cy.get('#updatedEmail').type(randomizedEmail);
          cy.get('#confirm-email').clear();
          cy.get('#confirm-email').type(randomizedEmail);
          cy.get('#submit-edit-petitioner-information').click();
          cy.get('[data-testid="modal-button-confirm"]').click();
          cy.get('.parties-card').contains(`${randomizedEmail} (Pending)`);

          cy.task('confirmUser', { email: randomizedEmail });

          cy.task('waitForNoce', { docketNumber }).then(isNOCECreated => {
            expect(isNOCECreated).to.equal(true);
          });

          cy.get('.usa-link').click();
          cy.get('#advanced-search-button').should('exist');
          cy.get('#search-field').clear();
          cy.get('#search-field').type(docketNumber);
          cy.get('.usa-search-submit-text').click();
          cy.get('tbody:contains(NOCE)').should('exist');
          cy.get('#tab-case-information').click();
          cy.get('#tab-parties').click();
          cy.get('.parties-card').contains('(Pending)').should('not.exist');
        });
    });
  });
} else {
  describe('we do not want this test to run locally, so we mock out a test to make it skip', () => {
    it('should skip', () => {
      expect(true).to.equal(true);
    });
  });
}
