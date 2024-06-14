import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Trial Sessions Page - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitionsClerk();
    cy.visit('/trial-sessions');
    cy.get('#trial-sessions-tabs').should('exist');

    checkA11y();
  });

  describe('Add trial session', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();
      cy.visit('/add-a-trial-session');
      cy.get('#start-date-picker').should('exist');

      checkA11y();
    });

    it('should be free of a11y issues when adding remote trial session', () => {
      loginAsPetitionsClerk();
      cy.visit('/add-a-trial-session');
      cy.get('#standaloneRemote-session-scope-label').click();
      cy.get('[data-testid="trial-session-number-of-cases-allowed"]').should(
        'not.exist',
      );

      checkA11y();
    });

    it('should be free of a11y issues when adding in-person', () => {
      loginAsPetitionsClerk();
      cy.visit('/add-a-trial-session');
      cy.get('#start-date-picker').should('exist');
      cy.get('#inPerson-proceeding-label').click();
      cy.get('#address1').should('exist');

      checkA11y();
    });
  });

  describe('Edit trial session', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();
      cy.visit('/edit-trial-session/6b6975cf-2b10-4e84-bcae-91e162d2f9d1');
      cy.get('#start-date-picker').should('exist');

      checkA11y();
    });
  });

  describe('Trial session details', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();
      cy.visit('/trial-session-detail/5b18af9e-4fbd-459b-8db7-7b15108c7fa5');
      cy.contains('Session Information').should('exist');

      checkA11y();
    });
  });
});
