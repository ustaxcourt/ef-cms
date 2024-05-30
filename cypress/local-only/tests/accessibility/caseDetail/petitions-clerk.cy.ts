import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Case Detail Page - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });
  describe('Case detail menu', () => {
    // TODO Fix 2 modal issues
    it('should be free of a11y issues when adding message', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/105-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#case-detail-menu-button').click();
      cy.get('#menu-button-add-new-message').click();
      cy.get('.ustc-create-message-modal').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues when creating order', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/105-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#case-detail-menu-button').click();
      cy.get('#menu-button-create-order').click();
      cy.get('#eventCode').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues when adding deadline', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/105-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#case-detail-menu-button').click();
      cy.get('#menu-button-add-deadline').click();
      cy.get('#deadline-date-picker').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });
  });

  describe('Docket record tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/101-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });
  });

  describe('Case information tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/101-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-case-information').click();

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues for manual and automatic block', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/109-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-case-information').click();
      cy.get('#blocked-from-trial-header').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    describe('Parties tab', () => {
      it('should be free of a11y issues when adding practitioner', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/102-19');
        cy.get('[data-testid="docket-record-table"]').should('exist');
        cy.get('#tab-case-information').click();
        cy.get('#tab-parties').click();
        cy.get('#practitioner-search-field').type('GL1111');
        cy.get('#search-for-practitioner').click();
        cy.get('#counsel-matches-legend').should('exist');

        cy.injectAxe();

        cy.checkA11y(
          undefined,
          {
            includedImpacts: impactLevel,
            rules: {
              'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
              'nested-interactive': { enabled: false }, // TODO LINK
            },
          },
          terminalLog,
        );
      });

      it('should be free of a11y issues', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/102-19');
        cy.get('[data-testid="docket-record-table"]').should('exist');
        cy.get('#tab-case-information').click();
        cy.get('#tab-parties').click();

        cy.injectAxe();

        cy.checkA11y(
          undefined,
          {
            includedImpacts: impactLevel,
            rules: {
              'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
              'nested-interactive': { enabled: false }, // TODO LINK
            },
          },
          terminalLog,
        );
      });

      it('should be free of a11y issues when viewing respondent counsel tertiary tabs', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/999-15');
        cy.get('[data-testid="docket-record-table"]').should('exist');
        cy.get('#tab-case-information').click();
        cy.get('#tab-parties').click();
        cy.get('#respondent-counsel').click();
        cy.get('#edit-respondent-counsel').click();

        cy.injectAxe();

        cy.checkA11y(
          undefined,
          {
            includedImpacts: impactLevel,
            rules: {
              'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
              'nested-interactive': { enabled: false }, // TODO LINK
            },
          },
          terminalLog,
        );
      });

      it('should be free of a11y issues when adding respondent', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/102-19');
        cy.get('[data-testid="docket-record-table"]').should('exist');
        cy.get('#tab-case-information').click();
        cy.get('#tab-parties').click();
        cy.get('#respondent-counsel').click();
        cy.get('#respondent-search-field').type('WN7777');
        cy.get('#search-for-respondent').click();
        cy.get('#counsel-matches-legend').should('exist');

        cy.injectAxe();

        cy.checkA11y(
          undefined,
          {
            includedImpacts: impactLevel,
            rules: {
              'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
              'nested-interactive': { enabled: false }, // TODO LINK
            },
          },
          terminalLog,
        );
      });

      it('should be free of a11y issues when editing respondent', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/103-19/edit-respondent-counsel/RT6789');
        cy.get('#submit-edit-respondent-information').should('exist');

        cy.injectAxe();

        cy.checkA11y(
          undefined,
          {
            includedImpacts: impactLevel,
          },
          terminalLog,
        );
      });
    });
  });

  describe('Drafts tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/109-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-case-information').click();
      cy.get('#tab-drafts').click();

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues when editing signed draft', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/109-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-case-information').click();
      cy.get('#tab-drafts').click();
      cy.get('#edit-order-button').click();
      cy.get('.modal-button-confirm').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });
  });

  describe('Tracked items tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/107-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-tracked-items').click();

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });
  });

  describe('Case messages tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/101-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-case-messages').click();

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });
  });
});
