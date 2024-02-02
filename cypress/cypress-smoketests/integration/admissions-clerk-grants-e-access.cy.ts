import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { v4 } from 'uuid';

describe('admissions clerk grants e-access to practitioner', () => {
  after(() => {
    cy.task('deleteAllCypressTestAccounts');
  });

  it('a NOCE should be generated after granting e-access to a practitioner', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      const practitionerUserName = `cypress_test_account+${v4()}`;
      const practitionerEmail = `${practitionerUserName}@example.com`;
      cy.login('admissionsclerk1');
      cy.get('[data-testid="messages-banner"]');
      cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
      cy.get('[data-testid="search-docket-number"]').click();
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      cy.get('[data-testid="edit-petitioner-counsel"]').click();
      cy.get('[data-testid="internal-edit-petitioner-email-input"]').type(
        practitionerEmail,
      );
      cy.get('[data-testid="internal-confirm-petitioner-email-input"]').type(
        practitionerEmail,
      );
      cy.get(
        '[data-testid="submit-edit-petitioner-information-button"]',
      ).click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="success-alert"]').contains('Changes saved');

      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type(practitionerEmail);
      cy.get('[data-testid="password-input"]').type('Testing1234$', {
        log: false,
      });
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="new-password-input"]').type('Testing1234$');
      cy.get('[data-testid="confirm-new-password-input"]').type('Testing1234$');
      cy.get('[data-testid="change-password-button"]').click();
      cy.get('[data-testid="my-cases-link"]');
      cy.task('waitForNoce', { docketNumber }).then(isNOCECreated => {
        expect(isNOCECreated).to.equal(
          true,
          'NOCE was not generated on a case that a practitioner was granted e-access for.',
        );
      });
      cy.get(`[data-testid="${docketNumber}"]`).contains(docketNumber).click();
      cy.get('tbody:contains(NOCE)').should('exist');
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      cy.get('[data-testid="petitioner-pending-email"]').should(
        'not.contain.text',
      );
    });
  });
});
