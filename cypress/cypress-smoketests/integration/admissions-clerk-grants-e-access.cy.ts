import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { logout } from '../../helpers/auth/logout';
import { v4 } from 'uuid';

// TODO 10007
// Old Test Files
// web-client/integration-tests/admissionsClerkAddsPetitionerWithNoAccountToCase.test.ts
// web-client/integration-tests/admissionsClerkAddsSecondaryPetitionerWithNoAccountToCase.test.ts
// web-client/integration-tests/petitionsClerkCounselAssociationElectronicServiceJourney.test.ts
describe('Given an admissions clerk is working with a served paper case that has two petitioners', () => {
  after(() => {
    cy.task('deleteAllCypressTestAccounts');
  });

  describe('When they grant a practitioner electronic access to the case', () => {
    describe('And the practitioner creates and verifies their DAWSON account', () => {
      it('Then a Notice Of Change of Email (NOCE) should be generated and served on the case', () => {
        // TODO 10007
      });
    });
  });

  describe('When they grant the first petitioner electronic access to the case', () => {
    describe('And the petitioner verifies their accounts', () => {
      it('Then a Notice Of Change of Email (NOCE) should be generated and served on the case, a work item added for the NOCE to the docket section work queue, and the petitioner`s service preference should change to Electronic', () => {
        createAndServePaperPetition().then(({ docketNumber }) => {
          const petitionerUsername = `cypress_test_account+${v4()}`;
          const petitionerEmail = `${petitionerUsername}@example.com`;
          cy.login('admissionsclerk1');
          cy.get('[data-testid="messages-banner"]');
          cy.get('[data-testid="docket-number-search-input"]').type(
            docketNumber,
          );
          cy.get('[data-testid="search-docket-number"]').click();
          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('[data-testid="tab-parties"]').click();
          cy.get('[data-testid="edit-petitioner"]').click();
          cy.get('[data-testid="internal-edit-petitioner-email-input"]').type(
            petitionerEmail,
          );
          cy.get(
            '[data-testid="internal-confirm-petitioner-email-input"]',
          ).type(petitionerEmail);
          cy.get(
            '[data-testid="submit-edit-petitioner-information-button"]',
          ).click();
          cy.get('[data-testid="modal-button-confirm"]').click();
          cy.get('[data-testid="success-alert"]').contains('Changes saved');
          cy.get('[data-testid="petitioner-service-indicator"]').contains(
            'Paper',
          );
          logout();

          cy.visit('/login');
          cy.get('[data-testid="email-input"]').type(petitionerEmail);
          cy.get('[data-testid="password-input"]').type('Testing1234$', {
            log: false,
          });
          cy.get('[data-testid="login-button"]').click();
          cy.get('[data-testid="new-password-input"]').type('Testing1234$');
          cy.get('[data-testid="confirm-new-password-input"]').type(
            'Testing1234$',
          );
          cy.get('[data-testid="change-password-button"]').click();
          cy.get('[data-testid="my-cases-link"]');
          cy.task('waitForNoce', { docketNumber }).then(isNOCECreated => {
            expect(isNOCECreated).to.equal(
              true,
              'NOCE was not generated on a case that a petitioner was granted e-access for.',
            );
          });
          cy.get(`[data-testid="${docketNumber}"]`)
            .contains(docketNumber)
            .click();
          cy.get('tbody:contains(NOCE)').should('exist');
          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('[data-testid="tab-parties"]').click();
          cy.get('[data-testid="petitioner-service-indicator"]').contains(
            'Electronic',
          );
          cy.get('[data-testid="petitioner-pending-email"]').should(
            'not.contain.text',
          );
          logout();

          cy.login('docketclerk1');
          cy.get('[data-testid="messages-banner"]');
          cy.get('[data-testid="document-qc-nav-item"]').click();
          cy.get(
            '[data-testid="switch-to-section-document-qc-button"]',
          ).click();
          cy.get(`[data-testid="work-item-${docketNumber}"]`).contains(
            'Notice of Change of Email Address for rick james',
          );
        });
      });
    });
  });
});

/*

*/
