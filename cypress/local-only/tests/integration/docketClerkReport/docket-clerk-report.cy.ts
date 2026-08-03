import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import {
  attachFile,
  attachSamplePdfFile,
} from '../../../../helpers/file/upload-file';
import { calendarTrialSession } from '../../../../helpers/trialSession/calendar-trial-session';
import { createAndServeConsolidatedGroup } from '../../../../helpers/fileAPetition/create-consolidated-case-group';
import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { createTrialSession } from '../../../../helpers/trialSession/create-trial-session';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsCaseServicesSupervisor,
  loginAsDocketClerk,
  loginAsDocketClerk1,
  loginAsPetitioner,
  loginAsPetitionsClerk1,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { scheduleTrialSession } from '../../../../helpers/trialSession/schedule-trial-session';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';
import { updateCaseStatus } from '../../../../helpers/caseDetail/caseInformation/update-case-status';

const DOCKET_CLERK_USER_ID = '1805d1ab-18d0-43ec-bafb-654e83405416';

type UserInfo = {
  email: string;
  name: string;
  role: string;
  userId: string;
};

const getUserByEmail = (email: string): Cypress.Chainable<UserInfo> => {
  return cy.task<UserInfo>('getUserByEmail', email);
};

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

    it("should complete the selected inbox messages on the docket clerk's behalf and move them into the completing supervisor's own Completed box", () => {
      runDocketClerkMessagesReport();

      cy.get(
        '[data-testid="docket-clerk-report-messages-inbox-all-messages-checkbox"]',
      ).click();

      cy.get(
        '[data-testid="docket-clerk-report-messages-inbox-batch-complete"]',
      )
        .should('not.be.disabled')
        .click();

      cy.get('[data-testid="docket-clerk-report-messages-completion-success"]')
        .should('be.visible')
        .and('contain', 'Message(s) completed at');

      // The docket clerk's inbox no longer shows the completed messages...
      cy.get('[data-testid="docket-clerk-report-messages-inbox-tab"]').should(
        'contain',
        'Inbox (0)',
      );
      cy.get('#docket-clerk-report-messages-inbox table tbody tr').should(
        'not.exist',
      );

      // ...and the docket clerk's own Completed tab does NOT show them, because
      // the Case Services Supervisor completed them, not the docket clerk.
      cy.get(
        '[data-testid="docket-clerk-report-messages-completed-tab"]',
      ).click();
      cy.get('#docket-clerk-report-messages-completed').should(
        'not.contain',
        'DCR Batch Test 1',
      );
      cy.get('#docket-clerk-report-messages-completed').should(
        'not.contain',
        'DCR Batch Test 2',
      );

      // Instead, the completing party (the supervisor) finds them in their own
      // "My Messages" Completed box.
      cy.visit('/messages/my/completed');
      cy.get('#messages-individual-completed').should(
        'contain',
        'DCR Batch Test 1',
      );
      cy.get('#messages-individual-completed').should(
        'contain',
        'DCR Batch Test 2',
      );
    });
  });

  describe('Document QC - high priority icon', () => {
    it('shows the high-priority icon in the Inbox tab for a work item assigned on a calendared case', () => {
      loginAsPetitioner();
      externalUserCreatesElectronicCase().then(docketNumber => {
        petitionsClerkServesPetition(docketNumber);

        loginAsPetitionsClerk1();
        createTrialSession().then(({ trialSessionId }) => {
          loginAsDocketClerk1();
          goToCase(docketNumber);
          updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
          calendarTrialSession(trialSessionId);
          scheduleTrialSession(docketNumber, trialSessionId);

          // The petitioner is an actual party on this case (it was created
          // while logged in as them), so they can search for and file a
          // document on it. This routes unassigned into the docket
          // section's inbox (not the petitions section).
          loginAsPetitioner();
          cy.get('[data-testid="docket-search-field"]').type(docketNumber);
          cy.get('[data-testid="search-by-docket-number"]').click();
          cy.get('[data-testid="button-file-document"]').click();
          cy.get('[data-testid="ready-to-file"]').click();
          selectTypeaheadInput(
            'complete-doc-document-type-search',
            'Exhibit(s)',
          );
          cy.get('[data-testid="submit-document"]').click();
          attachSamplePdfFile('primary-document');
          cy.get('#submit-document').click();
          cy.get('[data-testid="redaction-acknowledgement-label"]').click();
          cy.get(
            '[data-testid="file-document-review-submit-document"]',
          ).click();
          cy.get('[data-testid="success-alert"]').should('exist');

          getUserByEmail('docketclerk1@example.com').then(docketClerkInfo => {
            loginAsCaseServicesSupervisor();
            cy.visit(
              '/document-qc/section/inbox/selectedSection?section=docket',
            );
            cy.get(`[data-testid="work-item-${docketNumber}"]`)
              .find('[data-testid="checkbox-assign-work-item"]')
              .click();
            cy.get('[data-testid="dropdown-select-assignee"]').select(
              docketClerkInfo.name,
            );

            loginAsCaseServicesSupervisor();
            cy.visit('/reports/docket-clerk-report');
            cy.get('[data-testid="docket-clerk-report-clerk-select"]').select(
              docketClerkInfo.userId,
            );
            cy.get(
              '[data-testid="docket-clerk-report-page-type-select"]',
            ).select('documentQC');
            cy.get('[data-testid="docket-clerk-report-run-button"]').click();

            cy.get(
              `[data-testid="docket-clerk-report-docket-number-${docketNumber}"]`,
            )
              .closest('tr')
              .find('[aria-label="High priority"]')
              .should('exist');
          });
        });
      });
    });
  });

  describe('Document QC - consolidated case grouping', () => {
    it('groups a consolidated lead + member case into a single row in the Processed tab', () => {
      createAndServeConsolidatedGroup({ numberOfMemberCases: 1 }).then(
        ({ leadDocketNumber, memberDocketNumbers }) => {
          loginAsDocketClerk1();
          goToCase(leadDocketNumber);
          cy.get('[data-testid="case-detail-menu-button"]').click();
          cy.get('[data-testid="menu-button-add-paper-filing"]').click();

          cy.get(
            '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
          ).click();
          cy.get(
            '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
          ).type('01/01/2018');

          selectTypeaheadInput('primary-document-type-search', 'M115');
          selectTypeaheadInput('secondary-document-type-search', 'NCON');

          cy.get('[data-testid="filed-by-option"]')
            .contains('Petitioner')
            .click();
          cy.get('[data-testid="objections-No"]').click();

          cy.get('[data-testid="upload-pdf-button"]').click();
          attachFile({
            filePath: '../../helpers/file/sample.pdf',
            selector: '[data-testid="primaryDocumentFile-file-input"',
            selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
          });

          cy.get('[data-testid="save-for-later"]').click();
          cy.get('[data-testid="success-alert"]').contains(
            'Your entry has been added to the docket record.',
          );

          // Open the saved-for-later filing from My Document QC, adjust the
          // secondary doc type, then serve it across the whole consolidated
          // group so the resulting docket entry is multi-docketed.
          cy.get('[data-testid="document-qc-nav-item"]').click();
          cy.get(
            '[data-testid="individual-work-queue-in-progress-button"]',
          ).click();
          cy.get(
            `[data-testid="${leadDocketNumber}-qc-item-row"] [data-testid="qc-link"]`,
          ).click();
          selectTypeaheadInput('secondary-document-type-search', 'Answer');
          cy.get('[data-testid="save-and-serve"]').click();

          cy.get('[data-testid="confirm-initiate-service-modal"]').should(
            'exist',
          );
          cy.get('[data-testid="consolidated-case-checkbox-all"]').check({
            force: true,
          });
          cy.get('[data-testid="modal-button-confirm"]').click();
          cy.get('[data-testid="loading-overlay"]').should('not.exist');

          getUserByEmail('docketclerk1@example.com').then(docketClerkInfo => {
            loginAsCaseServicesSupervisor();
            cy.visit('/reports/docket-clerk-report');
            cy.get('[data-testid="docket-clerk-report-clerk-select"]').select(
              docketClerkInfo.userId,
            );
            cy.get(
              '[data-testid="docket-clerk-report-page-type-select"]',
            ).select('documentQC');
            cy.get('[data-testid="docket-clerk-report-run-button"]').click();

            cy.get(
              '[data-testid="docket-clerk-report-qc-processed-tab"]',
            ).click();

            cy.get(
              `[data-testid="docket-clerk-report-docket-number-${leadDocketNumber}"]`,
            )
              .closest('tr')
              .within(() => {
                memberDocketNumbers.forEach(memberDocketNumber => {
                  cy.contains('.member-case-line', memberDocketNumber).should(
                    'exist',
                  );
                });
              });
          });
        },
      );
    });
  });
});
