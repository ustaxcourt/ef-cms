import { checkA11y } from '../../../support/generalCommands/checkA11y';
import {
  loginAsCaseServicesSupervisor,
  loginAsDocketClerk,
} from '../../../../helpers/authentication/login-as-helpers';

describe('Docket Clerk Report', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('Case Services Supervisor', () => {
    describe('Reports menu entry', () => {
      it('should show the Docket Clerk Report link at the top of the Reports menu', () => {
        loginAsCaseServicesSupervisor();

        cy.get('[data-testid="dropdown-select-report"]').click();
        cy.get('[data-testid="docket-clerk-report-link"]').should('be.visible');
      });
    });

    describe('Form validation', () => {
      it('should show inline errors when Run Report is clicked with no selections', () => {
        loginAsCaseServicesSupervisor();

        cy.visit('/reports/docket-clerk-report');
        cy.get('[data-testid="docket-clerk-report-run-button"]').click();

        cy.get('[data-testid="docket-clerk-report-clerk-error"]')
          .should('be.visible')
          .and('contain', 'Select a Docket Clerk');

        cy.get('[data-testid="docket-clerk-report-page-type-error"]')
          .should('be.visible')
          .and('contain', 'Select a Page Type');
      });

      it('should show only the clerk error when only pageType is missing', () => {
        loginAsCaseServicesSupervisor();

        cy.visit('/reports/docket-clerk-report');

        // Wait for clerk options to load and select the first clerk
        cy.get('[data-testid="docket-clerk-report-clerk-select"]')
          .find('option')
          .should('have.length.at.least', 2);
        cy.get('[data-testid="docket-clerk-report-clerk-select"]').then(
          $select => {
            const firstClerkValue = $select
              .find('option')
              .eq(1)
              .val() as string;
            cy.wrap($select).select(firstClerkValue);
          },
        );

        cy.get('[data-testid="docket-clerk-report-run-button"]').click();

        cy.get('[data-testid="docket-clerk-report-page-type-error"]').should(
          'be.visible',
        );
        cy.get('[data-testid="docket-clerk-report-clerk-error"]').should(
          'not.exist',
        );
      });
    });

    describe('Document QC page type', () => {
      it('should show the Document QC result section with Inbox, In Progress, and Processed tabs', () => {
        loginAsCaseServicesSupervisor();

        cy.visit('/reports/docket-clerk-report');

        // Select the first available clerk
        cy.get('[data-testid="docket-clerk-report-clerk-select"]')
          .find('option')
          .should('have.length.at.least', 2);
        cy.get('[data-testid="docket-clerk-report-clerk-select"]').then(
          $select => {
            cy.wrap($select).select(
              $select.find('option').eq(1).val() as string,
            );
          },
        );

        cy.get('[data-testid="docket-clerk-report-page-type-select"]').select(
          'documentQC',
        );

        cy.get('[data-testid="docket-clerk-report-run-button"]').click();

        cy.get('[data-testid="docket-clerk-report-title"]')
          .should('be.visible')
          .and('contain', 'Document QC');

        cy.get('[data-testid="docket-clerk-report-qc-inbox-tab"]').should(
          'be.visible',
        );
        cy.get('[data-testid="docket-clerk-report-qc-in-progress-tab"]').should(
          'be.visible',
        );
        cy.get('[data-testid="docket-clerk-report-qc-processed-tab"]').should(
          'be.visible',
        );
      });

      it('should switch to the In Progress tab when clicked', () => {
        loginAsCaseServicesSupervisor();

        cy.visit('/reports/docket-clerk-report');

        cy.get('[data-testid="docket-clerk-report-clerk-select"]').then(
          $select => {
            cy.wrap($select).select(
              $select.find('option').eq(1).val() as string,
            );
          },
        );
        cy.get('[data-testid="docket-clerk-report-page-type-select"]').select(
          'documentQC',
        );
        cy.get('[data-testid="docket-clerk-report-run-button"]').click();

        cy.get('[data-testid="docket-clerk-report-qc-inbox-tab"]').should(
          'be.visible',
        );

        cy.get(
          '[data-testid="docket-clerk-report-qc-in-progress-tab"]',
        ).click();

        cy.get('#docket-clerk-report-qc-in-progress').should('exist');
      });

      it('should switch to the Processed tab when clicked', () => {
        loginAsCaseServicesSupervisor();

        cy.visit('/reports/docket-clerk-report');

        cy.get('[data-testid="docket-clerk-report-clerk-select"]').then(
          $select => {
            cy.wrap($select).select(
              $select.find('option').eq(1).val() as string,
            );
          },
        );
        cy.get('[data-testid="docket-clerk-report-page-type-select"]').select(
          'documentQC',
        );
        cy.get('[data-testid="docket-clerk-report-run-button"]').click();

        cy.get('[data-testid="docket-clerk-report-qc-processed-tab"]').click();

        cy.get('#docket-clerk-report-qc-processed').should('exist');
      });
    });

    describe('Messages page type', () => {
      it('should show the Messages result section with Inbox, Sent, and Completed tabs', () => {
        loginAsCaseServicesSupervisor();

        cy.visit('/reports/docket-clerk-report');

        cy.get('[data-testid="docket-clerk-report-clerk-select"]').then(
          $select => {
            cy.wrap($select).select(
              $select.find('option').eq(1).val() as string,
            );
          },
        );

        cy.get('[data-testid="docket-clerk-report-page-type-select"]').select(
          'messages',
        );

        cy.get('[data-testid="docket-clerk-report-run-button"]').click();

        cy.get('[data-testid="docket-clerk-report-title"]')
          .should('be.visible')
          .and('contain', 'Messages');

        cy.get('[data-testid="docket-clerk-report-messages-inbox-tab"]').should(
          'be.visible',
        );
        cy.get('[data-testid="docket-clerk-report-messages-sent-tab"]').should(
          'be.visible',
        );
        cy.get(
          '[data-testid="docket-clerk-report-messages-completed-tab"]',
        ).should('be.visible');
      });

      it('should switch to the Sent tab when clicked', () => {
        loginAsCaseServicesSupervisor();

        cy.visit('/reports/docket-clerk-report');

        cy.get('[data-testid="docket-clerk-report-clerk-select"]').then(
          $select => {
            cy.wrap($select).select(
              $select.find('option').eq(1).val() as string,
            );
          },
        );
        cy.get('[data-testid="docket-clerk-report-page-type-select"]').select(
          'messages',
        );
        cy.get('[data-testid="docket-clerk-report-run-button"]').click();

        cy.get('[data-testid="docket-clerk-report-messages-sent-tab"]').click();

        cy.get('#docket-clerk-report-messages-sent').should('exist');
      });

      it('should switch to the Completed tab when clicked', () => {
        loginAsCaseServicesSupervisor();

        cy.visit('/reports/docket-clerk-report');

        cy.get('[data-testid="docket-clerk-report-clerk-select"]').then(
          $select => {
            cy.wrap($select).select(
              $select.find('option').eq(1).val() as string,
            );
          },
        );
        cy.get('[data-testid="docket-clerk-report-page-type-select"]').select(
          'messages',
        );
        cy.get('[data-testid="docket-clerk-report-run-button"]').click();

        cy.get(
          '[data-testid="docket-clerk-report-messages-completed-tab"]',
        ).click();

        cy.get('#docket-clerk-report-messages-completed').should('exist');
      });
    });

    describe('Accessibility', () => {
      it('should be free of accessibility issues on the Docket Clerk Report page', () => {
        loginAsCaseServicesSupervisor();

        cy.visit('/reports/docket-clerk-report');

        // The form should be loaded and rendered
        cy.get('[data-testid="docket-clerk-report-run-button"]').should(
          'be.visible',
        );

        checkA11y();
      });
    });
  });

  describe('Docket Clerk (non-supervisor)', () => {
    it('should NOT show the Docket Clerk Report link in the Reports menu', () => {
      loginAsDocketClerk();

      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="docket-clerk-report-link"]').should('not.exist');
    });

    it('should redirect to 404 when a docket clerk navigates directly to the report URL', () => {
      loginAsDocketClerk();

      cy.visit('/reports/docket-clerk-report');

      // ifHasAccess redirects unauthorized users to /404
      cy.url().should('include', '404');
    });
  });
});
