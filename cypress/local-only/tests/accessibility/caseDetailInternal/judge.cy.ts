import { impactLevel } from '../../../../helpers/accessibility-impact';
import {
  loginAsColvin,
  loginAsDocketClerk,
} from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

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

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues when deleting note', () => {
      loginAsColvin();

      cy.visit('/case-detail/112-19');
      cy.get('[data-testid="docket-number-header"]');
      cy.get('#tab-notes').click();
      cy.get('#delete-procedural-note-button').click();
      cy.get('.modal-header__title').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
          },
        },
        terminalLog,
      );
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

        cy.injectAxe();

        cy.checkA11y(
          undefined,
          {
            includedImpacts: impactLevel,
            rules: {
              'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
            },
          },
          terminalLog,
        );
      });
    });
  });
});
