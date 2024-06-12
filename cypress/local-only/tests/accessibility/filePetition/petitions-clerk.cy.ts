import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('Step 1', () => {
    it('should be free of a11y issues on statistics section', () => {
      loginAsPetitionsClerk();
      cy.visit('/file-a-petition/step-1');
      cy.get('#tab-irs-notice').click();
      cy.get('#has-irs-verified-notice-yes').click();
      cy.get('#date-of-notice-picker').should('exist');
      cy.get('#case-type').select('Deficiency');
      cy.get('.statistic-form').should('exist');

      checkA11y();
    });

    it('should be free of a11y issues on irs notice modal', () => {
      loginAsPetitionsClerk();
      cy.visit('/file-a-petition/step-1');
      cy.get('#tab-irs-notice').click();
      cy.get('#has-irs-verified-notice-yes').click();
      cy.get('#date-of-notice-picker').should('exist');
      cy.get('#case-type').select('Deficiency');
      cy.get('.calculate-penalties').click();
      cy.get('.modal-screen').should('exist');

      checkA11y();
    });
  });
});
