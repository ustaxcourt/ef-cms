import {
  loginAsDocketClerk1,
  loginAsPetitioner,
  loginAsPetitionsClerk1,
} from '../../../../helpers/authentication/login-as-helpers';
import {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
  SESSION_TYPES,
} from '@shared/business/entities/EntityConstants';
import { updateCaseStatus } from '../../../../helpers/caseDetail/caseInformation/update-case-status';
import { createTrialSession } from '../../../../helpers/trialSession/create-trial-session';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { scheduleTrialSession } from '../../../../helpers/trialSession/schedule-trial-session';
import { petitionerFilesAndDocketClerkCompletesDocumentQc } from '../../../../helpers/caseDetail/docketRecord/electronicFiling/petitioner-files-and-docket-clerk-completes-document-qc';
import { petitionsClerkQcsAndServesElectronicCase } from '../../../../helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import {
  calculateISODate,
  createISODateAtStartOfDayEST,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';

describe('Automatic block on a case set for trial', () => {
  const location = 'Phoenix, Arizona';
  const primaryFilerName = 'Automatic Block Petitioner';
  beforeEach(() => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase(primaryFilerName, location).then(
      docketNumber => {
        cy.wrap(docketNumber).as('docketNumber');
        petitionsClerkQcsAndServesElectronicCase(docketNumber);
      },
    );
  });

  it('should clear the automatic block when the last pending item is removed from a case not set for trial', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      petitionerFilesAndDocketClerkCompletesDocumentQc({
        docketNumber,
        documentType: 'Motion to Dismiss',
        primaryFilerName,
      });
      loginAsDocketClerk1();
      cy.intercept(
        'GET',
        `**/cases/${docketNumber}?excludeDocketEntries=true`,
      ).as('getCase');
      goToCase(docketNumber);
      cy.wait('@getCase').then(({ response }) => {
        const caseEntity = response?.body;
        expect(caseEntity.automaticBlocked).to.equal(true);
        expect(caseEntity.automaticBlockedReason).to.equal(
          AUTOMATIC_BLOCKED_REASONS.pending,
        );
      });
      cy.get('[data-testid="blocked-case-icon"]').should('be.visible');
      cy.get('[data-testid="tab-tracked-items"]').click();
      cy.get('[data-testid="pending-report-tab"]').click();
      cy.get('[data-testid="remove-pending-item-button-0"]').click();
      cy.intercept(
        'GET',
        `**/cases/${docketNumber}?excludeDocketEntries=true`,
      ).as('getCaseAfterRemovePending');
      cy.get('[data-testid="modal-confirm"]').click();
      cy.wait('@getCaseAfterRemovePending').then(({ response }) => {
        cy.get('[data-testid="blocked-case-icon"]').should('not.exist');
        const caseEntity = response?.body;
        expect(caseEntity.automaticBlocked).to.equal(false);
        expect(caseEntity.automaticBlockedReason).to.equal(undefined);
      });
    });
  });

  it('should clear the automatic block when the last deadline is removed from a case', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      // add a deadline
      const today = createISODateAtStartOfDayEST();
      const tomorrow = calculateISODate({
        dateString: today,
        howMuch: 1,
        units: 'days',
      });
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-create-deadline"]').click();
      cy.get('#deadline-date-picker').clear();
      cy.get('#deadline-date-picker').type(
        formatDateString(tomorrow, FORMATS.MMDDYYYY),
      );
      cy.get('[data-testid="case-deadline-description-input"]').type(
        'alex was here',
      );
      cy.intercept(
        'GET',
        `**/cases/${docketNumber}?excludeDocketEntries=true`,
      ).as('getCase');
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.wait('@getCase').then(({ response }) => {
        cy.get('[data-testid="blocked-case-icon"]').should('be.visible');
        const caseEntity = response?.body;
        expect(caseEntity.automaticBlocked).to.equal(true);
        expect(caseEntity.automaticBlockedReason).to.equal(
          AUTOMATIC_BLOCKED_REASONS.dueDate,
        );
      });
      // remove the deadline
      cy.get('[data-testid="tab-tracked-items"]').click();
      cy.get('[data-testid="delete-case-deadline-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.wait('@getCase').then(({ response }) => {
        cy.get('[data-testid="blocked-case-icon"]').should('not.exist');
        const caseEntity = response?.body;
        expect(caseEntity.automaticBlocked).to.equal(false);
        expect(caseEntity.automaticBlockedReason).to.equal(undefined);
      });
    });
  });

  it('should clear the automatic block when a blocked case is manually added to a trial session and should not appear in the blocked cases report', () => {
    loginAsPetitionsClerk1();
    createTrialSession({
      sessionType: SESSION_TYPES.regular,
      trialLocation: location,
    }).then(({ trialSessionId }) => {
      cy.wrap(trialSessionId).as('trialSessionId');
    });

    cy.get<string>('@docketNumber').then(docketNumber => {
      petitionerFilesAndDocketClerkCompletesDocumentQc({
        docketNumber,
        documentType: 'Motion to Dismiss',
        primaryFilerName,
      });

      loginAsDocketClerk1();
      goToCase(docketNumber);

      const today = createISODateAtStartOfDayEST();
      const tomorrow = calculateISODate({
        dateString: today,
        howMuch: 1,
        units: 'days',
      });
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-create-deadline"]').click();
      cy.get('#deadline-date-picker').clear();
      cy.get('#deadline-date-picker').type(
        formatDateString(tomorrow, FORMATS.MMDDYYYY),
      );
      cy.get('[data-testid="case-deadline-description-input"]').type(
        'alex was here',
      );
      cy.intercept(
        'GET',
        `**/cases/${docketNumber}?excludeDocketEntries=true`,
      ).as('getCaseBlocked');
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.wait('@getCaseBlocked').then(({ response }) => {
        const caseEntity = response?.body;
        expect(caseEntity.automaticBlocked).to.equal(true);
        expect(caseEntity.automaticBlockedReason).to.equal(
          AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
        );
      });
      cy.get('[data-testid="blocked-case-icon"]').should('be.visible');

      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="blocked-cases-report"]').click();
      cy.get('[data-testid="trial-location-filter"]').select(location);
      cy.get(`[data-testid="blocked-case-${docketNumber}-row"]`).should(
        'be.visible',
      );

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
          const caseEntity = response?.body;
          expect(caseEntity.automaticBlocked).to.equal(false);
          expect(caseEntity.automaticBlockedReason).to.equal(undefined);
        });
        cy.get('[data-testid="blocked-case-icon"]').should('not.exist');

        cy.get('[data-testid="dropdown-select-report"]').click();
        cy.get('[data-testid="blocked-cases-report"]').click();
        cy.get('[data-testid="trial-location-filter"]').select(location);
        cy.get(`[data-testid="blocked-case-${docketNumber}-row"]`).should(
          'not.exist',
        );
      });
    });
  });

  it('should clear the automatic block when a blocked case is manually added and calendared via set calendar', () => {
    loginAsPetitionsClerk1();
    createTrialSession({
      sessionType: SESSION_TYPES.regular,
      trialLocation: location,
    }).then(({ trialSessionId }) => {
      cy.wrap(trialSessionId).as('trialSessionId');
    });

    cy.get<string>('@docketNumber').then(docketNumber => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);

      petitionerFilesAndDocketClerkCompletesDocumentQc({
        docketNumber,
        documentType: 'Motion to Dismiss',
        primaryFilerName,
      });
      cy.intercept(
        'GET',
        `**/cases/${docketNumber}?excludeDocketEntries=true`,
      ).as('getCase');
      goToCase(docketNumber);
      cy.wait('@getCase').then(({ response }) => {
        const caseEntity = response?.body;
        expect(caseEntity.automaticBlocked).to.equal(true);
        expect(caseEntity.automaticBlockedReason).to.equal(
          AUTOMATIC_BLOCKED_REASONS.pending,
        );
      });
      cy.get('[data-testid="blocked-case-icon"]').should('be.visible');

      cy.get<string>('@trialSessionId').then(trialSessionId => {
        scheduleTrialSession(docketNumber, trialSessionId);
        cy.get('[data-testid="success-alert"]').should(
          'contain',
          'Case scheduled for trial.',
        );

        loginAsPetitionsClerk1();
        cy.get('[data-testid="trial-session-link"]').click();
        cy.get('[data-testid="new-trial-sessions-tab"]').click();
        cy.get(`[data-testid="trial-location-link-${trialSessionId}"]`).click();

        cy.intercept('PUT', `**/case-meta/${docketNumber}/qc-complete`).as(
          'qcComplete',
        );
        cy.get(`label[for="qc-complete-${docketNumber}"]`).click();
        cy.wait('@qcComplete');
        cy.get(`[data-testid="qc-complete-${docketNumber}"]:checked`).should(
          'exist',
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
        ).as('getCaseAfterCalendaring');
        loginAsDocketClerk1();
        goToCase(docketNumber);
        cy.wait('@getCaseAfterCalendaring').then(({ response }) => {
          const caseEntity = response?.body;
          expect(caseEntity.automaticBlocked).to.equal(false);
          expect(caseEntity.automaticBlockedReason).to.equal(undefined);
          expect(caseEntity.automaticBlockedDate).to.equal(undefined);
        });
        cy.get('[data-testid="blocked-case-icon"]').should('not.exist');
      });
    });
  });
});
