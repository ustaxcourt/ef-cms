import {
  loginAsDocketClerk1,
  loginAsPetitioner,
  loginAsPetitionsClerk1,
} from '../../../../helpers/authentication/login-as-helpers';
import {
  AUTOMATIC_BLOCKED_REASONS,
  SESSION_TYPES,
} from '@shared/business/entities/EntityConstants';
import { createTrialSession } from '../../../../helpers/trialSession/create-trial-session';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { scheduleTrialSession } from '../../../../helpers/trialSession/schedule-trial-session';
import { petitionerFilesAndDocketClerkCompletesDocumentQc } from '../../../../helpers/caseDetail/docketRecord/electronicFiling/petitioner-files-and-docket-clerk-completes-document-qc';
import { petitionsClerkQcsAndServesElectronicCase } from '../../../../helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { checkA11y } from '../../../support/generalCommands/checkA11y';

describe('Automatic block restored after trial session removal', () => {
  const trialLocation = 'Phoenix, Arizona';
  const primaryFilerName = 'Autoblock Restore Petitioner';

  const assertBlockedReportContainsCase = (docketNumber: string) => {
    cy.get('[data-testid="dropdown-select-report"]').click();
    cy.get('[data-testid="blocked-cases-report"]').click();
    cy.get('[data-testid="trial-location-filter"]').select(trialLocation);
    cy.get(`[data-testid="blocked-case-${docketNumber}-row"]`).should(
      'be.visible',
    );
    checkA11y();
  };

  const assertBlockedReportDoesNotContainCase = (docketNumber: string) => {
    cy.get('[data-testid="dropdown-select-report"]').click();
    cy.get('[data-testid="blocked-cases-report"]').click();
    cy.get('[data-testid="trial-location-filter"]').select(trialLocation);
    cy.get(`[data-testid="blocked-case-${docketNumber}-row"]`).should(
      'not.exist',
    );
  };

  beforeEach(() => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase(primaryFilerName, trialLocation).then(
      docketNumber => {
        cy.wrap(docketNumber).as('docketNumber');
        petitionsClerkQcsAndServesElectronicCase(docketNumber);
        petitionerFilesAndDocketClerkCompletesDocumentQc({
          docketNumber,
          documentType: 'Motion to Dismiss',
          primaryFilerName,
        });
      },
    );
  });

  it('should restore automatic block when a case is manually removed from trial with pending items still present', () => {
    loginAsPetitionsClerk1();
    createTrialSession({
      sessionType: SESSION_TYPES.regular,
      trialLocation,
    }).then(({ trialSessionId }) => {
      cy.wrap(trialSessionId).as('trialSessionId');
    });

    cy.get<string>('@docketNumber').then(docketNumber => {
      loginAsDocketClerk1();
      cy.intercept(
        'GET',
        `**/cases/${docketNumber}?excludeDocketEntries=true`,
      ).as('getCaseBlocked');
      goToCase(docketNumber);
      cy.wait('@getCaseBlocked').then(({ response }) => {
        expect(response?.body.automaticBlocked).to.equal(true);
        expect(response?.body.automaticBlockedReason).to.equal(
          AUTOMATIC_BLOCKED_REASONS.pending,
        );
      });
      cy.get('[data-testid="blocked-case-icon"]').should('be.visible');
      assertBlockedReportContainsCase(docketNumber);

      cy.get<string>('@trialSessionId').then(trialSessionId => {
        cy.intercept(
          'GET',
          `**/cases/${docketNumber}?excludeDocketEntries=true`,
        ).as('getCaseAfterAddToTrial');
        scheduleTrialSession(docketNumber, trialSessionId);
        cy.get('[data-testid="success-alert"]').should(
          'contain',
          'Case scheduled for trial.',
        );
        cy.wait('@getCaseAfterAddToTrial');
        cy.wait('@getCaseAfterAddToTrial').then(({ response }) => {
          expect(response?.body.automaticBlocked).to.equal(false);
          expect(response?.body.automaticBlockedReason).to.equal(undefined);
        });
        cy.get('[data-testid="blocked-case-icon"]').should('not.exist');
        assertBlockedReportDoesNotContainCase(docketNumber);

        goToCase(docketNumber);
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('#edit-case-trial-information-btn').click();
        cy.get('#remove-from-trial-session-btn').click();
        cy.get(
          '[data-testid="remove-from-trial-session-disposition-textarea"]',
        ).type('Removed for testing automatic block restoration');
        cy.intercept(
          'GET',
          `**/cases/${docketNumber}?excludeDocketEntries=true`,
        ).as('getCaseAfterManualRemove');
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.wait('@getCaseAfterManualRemove').then(({ response }) => {
          expect(response?.body.automaticBlocked).to.equal(true);
          expect(response?.body.automaticBlockedReason).to.equal(
            AUTOMATIC_BLOCKED_REASONS.pending,
          );
        });
        cy.get('[data-testid="blocked-case-icon"]').should('be.visible');
        assertBlockedReportContainsCase(docketNumber);
      });
    });
  });

  it('should restore automatic block when a non-QC complete case is dropped from trial at set calendar', () => {
    loginAsPetitionsClerk1();
    createTrialSession({
      sessionType: SESSION_TYPES.regular,
      trialLocation,
    }).then(({ trialSessionId }) => {
      cy.wrap(trialSessionId).as('trialSessionId');
    });

    cy.get<string>('@docketNumber').then(docketNumber => {
      loginAsDocketClerk1();
      cy.intercept(
        'GET',
        `**/cases/${docketNumber}?excludeDocketEntries=true`,
      ).as('getCaseBlocked');
      goToCase(docketNumber);
      cy.wait('@getCaseBlocked').then(({ response }) => {
        expect(response?.body.automaticBlocked).to.equal(true);
        expect(response?.body.automaticBlockedReason).to.equal(
          AUTOMATIC_BLOCKED_REASONS.pending,
        );
      });
      cy.get('[data-testid="blocked-case-icon"]').should('be.visible');
      assertBlockedReportContainsCase(docketNumber);

      cy.get<string>('@trialSessionId').then(trialSessionId => {
        cy.intercept(
          'GET',
          `**/cases/${docketNumber}?excludeDocketEntries=true`,
        ).as('getCaseAfterAddToTrial');
        scheduleTrialSession(docketNumber, trialSessionId);
        cy.get('[data-testid="success-alert"]').should(
          'contain',
          'Case scheduled for trial.',
        );
        cy.wait('@getCaseAfterAddToTrial');
        cy.wait('@getCaseAfterAddToTrial').then(({ response }) => {
          expect(response?.body.automaticBlocked).to.equal(false);
        });
        cy.get('[data-testid="blocked-case-icon"]').should('not.exist');

        loginAsPetitionsClerk1();
        cy.get('[data-testid="trial-session-link"]').click();
        cy.get('[data-testid="new-trial-sessions-tab"]').click();
        cy.get(`[data-testid="trial-location-link-${trialSessionId}"]`).click();

        cy.get(`[data-testid="qc-complete-${docketNumber}"]:checked`).should(
          'not.exist',
        );

        cy.intercept(
          'POST',
          `**/trial-sessions/${trialSessionId}/set-calendar`,
        ).as('setCalendar');
        cy.get('[data-testid="set-calendar-button"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.wait('@setCalendar');
        cy.get('.progress-indicator', { timeout: 120000 }).should('not.exist');

        cy.intercept(
          'GET',
          `**/cases/${docketNumber}?excludeDocketEntries=true`,
        ).as('getCaseAfterSetCalendar');
        loginAsDocketClerk1();
        goToCase(docketNumber);
        cy.wait('@getCaseAfterSetCalendar').then(({ response }) => {
          expect(response?.body.automaticBlocked).to.equal(true);
          expect(response?.body.automaticBlockedReason).to.equal(
            AUTOMATIC_BLOCKED_REASONS.pending,
          );
        });
        cy.get('[data-testid="blocked-case-icon"]').should('be.visible');
        assertBlockedReportContainsCase(docketNumber);
      });
    });
  });
});
