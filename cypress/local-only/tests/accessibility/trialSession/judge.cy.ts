import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';

describe('Trial Sessions Page - Judge Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsColvin();
    cy.visit('/trial-sessions');
    cy.get('#trial-sessions-tabs').should('exist');

    checkA11y();
  });

  describe('Trial session details', () => {
    it('should be free of a11y issues', () => {
      loginAsColvin();
      cy.visit('/trial-session-detail/959c4338-0fac-42eb-b0eb-d53b8d0195cc');
      cy.contains('Session Information').should('exist');

      checkA11y();
    });
  });

  describe('Trial session working copy', () => {
    it('should be free of a11y issues', () => {
      loginAsColvin();

      cy.visit(
        '/trial-session-working-copy/959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      );
      cy.contains('Session Copy').should('exist');

      checkA11y();
    });

    it('should be free of a11y issues when printing', () => {
      loginAsColvin();

      cy.visit(
        '/trial-session-working-copy/959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      );
      cy.contains('Session Copy').should('exist');
      cy.get('#print-session-working-copy').click();
      cy.get('.modal-screen').should('exist');
      cy.get('#modal-button-confirm').click();
      cy.get('[data-testid="back-to-working-copy-button"]').should('exist');

      checkA11y();
    });
  });
});
