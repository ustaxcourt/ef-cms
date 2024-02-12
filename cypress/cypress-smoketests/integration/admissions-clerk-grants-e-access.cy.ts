import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { logout } from '../../helpers/auth/logout';
import { v4 } from 'uuid';

// TODO 10007
// Old Test Files
// web-client/integration-tests/admissionsClerkAddsPetitionerWithNoAccountToCase.test.ts
// web-client/integration-tests/admissionsClerkAddsSecondaryPetitionerWithNoAccountToCase.test.ts
// web-client/integration-tests/petitionsClerkCounselAssociationElectronicServiceJourney.test.ts
describe('Given an admissions clerk is working with a served paper case with two petitioners', () => {
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
  describe('When they grant the petitioners electronic access to the case', () => {
    describe('And the petitioners create & verifies their accounts', () => {
      it('Then a Notice Of Change of Email (NOCE) should be generated for each petitioner and served on the case', () => {
        // TODO 10007: this isn't 100% correct
        createAndServePaperPetition().then(({ docketNumber }) => {
          const practitionerUserName = `cypress_test_account+${v4()}`;
          const practitionerEmail = `${practitionerUserName}@example.com`;
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
            practitionerEmail,
          );
          cy.get(
            '[data-testid="internal-confirm-petitioner-email-input"]',
          ).type(practitionerEmail);
          cy.get(
            '[data-testid="submit-edit-petitioner-information-button"]',
          ).click();
          cy.get('[data-testid="modal-button-confirm"]').click();
          cy.get('[data-testid="success-alert"]').contains('Changes saved');
          logout();

          cy.visit('/login');
          cy.get('[data-testid="email-input"]').type(practitionerEmail);
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
              'NOCE was not generated on a case that a practitioner was granted e-access for.',
            );
          });
          cy.get(`[data-testid="${docketNumber}"]`)
            .contains(docketNumber)
            .click();
          cy.get('tbody:contains(NOCE)').should('exist');
          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('[data-testid="tab-parties"]').click();
          cy.get('[data-testid="petitioner-pending-email"]').should(
            'not.contain.text',
          );
        });
      });

      describe('And when the NOCE is QC`d by a docket clerk,', () => {
        it('Then the petitioners service preference should be updated to electronic', () => {
          // TODO 10007
        });
      });
    });
  });
});

/*

*/
