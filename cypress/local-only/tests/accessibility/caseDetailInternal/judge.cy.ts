import { checkA11y } from '../../../support/generalCommands/checkA11y';
import {
  loginAsColvin,
  loginAsDocketClerk,
} from '../../../../helpers/authentication/login-as-helpers';

describe('Case Detail Internal - Judge Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('Notes tab', () => {
    it('should be free of a11y issues when adding/editing note', () => {
      loginAsColvin();

      cy.visit('/case-detail/101-19');
      cy.get('[data-testid="docket-number-header"]');
      cy.get('#tab-notes').click();
      cy.get('#add-procedural-note-button').click();
      cy.get('.modal-header__title').should('exist');

      checkA11y();
    });

    it('should be free of a11y issues when deleting note', () => {
      loginAsColvin();

      cy.visit('/case-detail/112-19');
      cy.get('[data-testid="docket-number-header"]');
      cy.get('#tab-notes').click();
      cy.get('#delete-procedural-note-button').click();
      cy.get('.modal-header__title').should('exist');

      checkA11y();
    });
  });

  describe('Case information tab', () => {
    describe('Case history tab', () => {
      it('should be free of a11y issues', () => {
        loginAsDocketClerk();

        cy.visit('/case-detail/101-19');
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('[data-testid="case-status-history-tab"]').click();
        cy.get('[data-testid="case-status-history-container"]');

        checkA11y();
      });
    });
  });
});
