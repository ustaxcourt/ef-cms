import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsCaseServicesSupervisor,
  loginAsDocketClerk,
  loginAsPetitionsClerk1,
} from '../../../../helpers/authentication/login-as-helpers';

const DOCKET_CLERK_USER_ID = '1805d1ab-18d0-43ec-bafb-654e83405416';

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

  describe('Messages batch-selection', () => {
    before(() => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        loginAsPetitionsClerk1();
        goToCase(docketNumber);
        for (let i = 0; i < 2; i++) {
          cy.get('[data-testid="case-detail-menu-button"]').click();
          cy.get('[data-testid="menu-button-add-new-message"]').click();
          cy.get('[data-testid="message-to-section"]').select('docket');
          cy.get('[data-testid="message-to-user-id"]').select(
            DOCKET_CLERK_USER_ID,
          );
          cy.get('[data-testid="message-subject"]').type(
            `DCR Batch Test ${i + 1}`,
          );
          cy.get('[data-testid="message-body"]').type('Test message body');
          cy.get('[data-testid="modal-confirm"]').click();
          cy.get('[data-testid="success-alert"]').should('exist');
        }
      });
    });

    function runDocketClerkMessagesReport(): void {
      loginAsCaseServicesSupervisor();
      cy.visit('/reports/docket-clerk-report');
      cy.get('[data-testid="docket-clerk-report-clerk-select"]').select(
        DOCKET_CLERK_USER_ID,
      );
      cy.get('[data-testid="docket-clerk-report-page-type-select"]').select(
        'messages',
      );
      cy.get('[data-testid="docket-clerk-report-run-button"]').click();
      cy.get('#docket-clerk-report-messages-inbox table tbody tr').should(
        'have.length.at.least',
        1,
      );
    }

    it('should select all inbox messages when the select-all checkbox is clicked', () => {
      runDocketClerkMessagesReport();

      cy.get(
        '[data-testid="docket-clerk-report-messages-inbox-all-messages-checkbox"]',
      )
        .should('not.be.checked')
        .click();

      cy.get(
        '#docket-clerk-report-messages-inbox table tbody input[type="checkbox"]',
      ).each($checkbox => {
        cy.wrap($checkbox).should('be.checked');
      });

      cy.get(
        '[data-testid="docket-clerk-report-messages-inbox-batch-complete"]',
      ).should('not.be.disabled');
    });

    it('should deselect all inbox messages when select-all is clicked a second time', () => {
      runDocketClerkMessagesReport();

      cy.get(
        '[data-testid="docket-clerk-report-messages-inbox-all-messages-checkbox"]',
      ).click();

      cy.get(
        '[data-testid="docket-clerk-report-messages-inbox-all-messages-checkbox"]',
      ).click();

      cy.get(
        '#docket-clerk-report-messages-inbox table tbody input[type="checkbox"]',
      ).each($checkbox => {
        cy.wrap($checkbox).should('not.be.checked');
      });

      cy.get(
        '[data-testid="docket-clerk-report-messages-inbox-batch-complete"]',
      ).should('be.disabled');
    });

    it('should clear stale selections from the inbox when the report is re-run', () => {
      runDocketClerkMessagesReport();

      cy.get(
        '[data-testid="docket-clerk-report-messages-inbox-all-messages-checkbox"]',
      ).click();

      cy.get(
        '#docket-clerk-report-messages-inbox table tbody input[type="checkbox"]',
      )
        .first()
        .should('be.checked');

      cy.get('[data-testid="docket-clerk-report-run-button"]').click();

      cy.get(
        '[data-testid="docket-clerk-report-messages-inbox-all-messages-checkbox"]',
      ).should('not.be.checked');

      cy.get(
        '#docket-clerk-report-messages-inbox table tbody input[type="checkbox"]',
      ).each($checkbox => {
        cy.wrap($checkbox).should('not.be.checked');
      });
    });
  });
});
