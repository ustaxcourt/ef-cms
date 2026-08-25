import {
  loginAsDocketClerk1,
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
import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import {
  calculateISODate,
  createISODateAtStartOfDayEST,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';

describe('Automatic block on a case set for trial', () => {
  const trialLocation = 'Phoenix, Arizona';
  const procedureType = 'Regular';

  const createServedCase = (): Cypress.Chainable<string> => {
    return createAndServePaperPetition({
      trialLocation,
      procedureType,
      includeApwDocument: false,
    }).then(({ docketNumber }) => cy.wrap(docketNumber));
  };

  it('should clear the automatic block when the last pending item is removed from a case not set for trial', () => {
    createServedCase().then(docketNumber => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      fillPaperFilingForm({
        dateReceived: '01/01/2021',
        documentType: 'Motion to Dismiss',
      });
      cy.intercept(
        'GET',
        `**/cases/${docketNumber}?excludeDocketEntries=true`,
      ).as('getCase');
      cy.get('[data-testid="save-and-serve"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
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
    createServedCase().then(docketNumber => {
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
    createServedCase().then(docketNumber => {
      loginAsPetitionsClerk1();
      createTrialSession({
        sessionType: SESSION_TYPES.regular,
        trialLocation,
      }).then(({ trialSessionId }) => {
        loginAsDocketClerk1();
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
      });
    });
  });
});
