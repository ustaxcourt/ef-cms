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
import { fillPaperFilingForm } from '../../../../helpers/caseDetail/docketRecord/paperFiling/fill-paper-filing-form';
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
  beforeEach(() => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase(undefined, location).then(
      docketNumber => {
        cy.wrap(docketNumber).as('docketNumber');
        petitionsClerkQcsAndServesElectronicCase(docketNumber);
      },
    );
  });

  it('should clear the automatic block when the last pending item is removed from a case not set for trial', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      fillPaperFilingForm({
        dateReceived: '01/01/2021',
        documentType: 'Motion to Dismiss',
      });
      cy.get('[data-testid="save-and-serve"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.intercept(
        'GET',
        `**/cases/${docketNumber}?excludeDocketEntries=true`,
      ).as('getCase');
      cy.wait('@getCase').then(({ response }) => {
        cy.get('[data-testid="blocked-case-icon"]').should('be.visible');
        const caseEntity = response?.body;
        expect(caseEntity.automaticBlocked).to.equal(true);
        expect(caseEntity.automaticBlockedReason).to.equal(
          AUTOMATIC_BLOCKED_REASONS.pending,
        );
      });
      cy.get('[data-testid="tab-tracked-items"]').click();
      cy.get('[data-testid="pending-report-tab"]').click();
      cy.get('[data-testid="remove-pending-item-button-0"]').click();
      cy.get('[data-testid="modal-confirm"]').click();
      cy.wait('@getCase').then(({ response }) => {
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
    // add a pending item and deadline to the case
    loginAsDocketClerk1();
    cy.get<string>('@docketNumber').then(docketNumber => {
      goToCase(docketNumber);
      fillPaperFilingForm({
        dateReceived: '01/01/2021',
        documentType: 'Motion to Dismiss',
      });
      cy.get('[data-testid="save-and-serve"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
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
          AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
        );
      });
      // check blocked cases report
      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="blocked-cases-report"]').click();
      cy.get('[data-testid="trial-location-filter"]').select(location);
      cy.get(`[data-testid="blocked-case-${docketNumber}-row"]`).should(
        'be.visible',
      );

      cy.get<string>('@trialSessionId').then(trialSessionId => {
        scheduleTrialSession(docketNumber, trialSessionId);
        cy.intercept(
          'GET',
          `**/cases/${docketNumber}?excludeDocketEntries=true`,
        ).as('getCaseAfterCalendaring');
        cy.get('[data-testid="header-messages-link"]').click();
        goToCase(docketNumber);
        cy.wait('@getCaseAfterCalendaring').then(({ response }) => {
          const caseEntity = response?.body;
          expect(caseEntity.automaticBlocked).to.equal(false);
          expect(caseEntity.automaticBlockedReason).to.equal(undefined);
        });
        cy.get('[data-testid="blocked-case-icon"]').should('not.exist');

        // check blocked cases report
        cy.get('[data-testid="dropdown-select-report"]').click();
        cy.get('[data-testid="blocked-cases-report"]').click();
        cy.get('[data-testid="trial-location-filter"]').select(location);
        cy.get(`[data-testid="blocked-case-${docketNumber}-row"]`).should(
          'not.exist',
        );
      });
    });
  });
});
