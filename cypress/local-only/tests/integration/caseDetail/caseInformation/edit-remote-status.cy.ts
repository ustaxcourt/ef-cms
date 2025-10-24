import {
  loginAsDocketClerk,
  loginAsPetitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { getCaseDetailTab } from 'cypress/local-only/support/pages/case-detail';
import {
  calculateISODate,
  createISODateString,
  formatDateString,
  formatNow,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';

describe('Edit Remote Status', () => {
  describe('As a docket clerk', () => {
    beforeEach(() => {
      loginAsDocketClerk();
    });

    it('should allow docket clerk to edit remote status and add a granted date', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        goToCase(docketNumber);
        getCaseDetailTab('case-information').click();

        cy.get('[data-testid="edit-remote-status"]').should('exist');
        cy.get('[data-testid="edit-remote-status"]').click();

        cy.get('.modal-header').should('contain', 'Edit Remote Status');

        const dateString = formatNow(FORMATS.MMDDYYYY);

        cy.get('#remote-trial-granted-date-picker').type(dateString);

        cy.get('.modal-button-confirm').click();

        cy.get('.usa-alert--success').should(
          'contain',
          'Successfully updated motion to proceed remotely date',
        );

        cy.contains('Motion to proceed remotely granted date').should('exist');
        cy.contains(dateString).should('exist');
      });
    });

    it('should allow docket clerk to clear the remote status date', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        goToCase(docketNumber);
        getCaseDetailTab('case-information').click();

        cy.get('[data-testid="edit-remote-status"]').click();
        const dateString = formatNow(FORMATS.MMDDYYYY);
        cy.get('#remote-trial-granted-date-picker').type(dateString);
        cy.get('.modal-button-confirm').click();

        cy.get('.usa-alert--success').should('exist');

        cy.get('[data-testid="edit-remote-status"]').click();
        cy.get('.modal-button-clear').click();

        cy.get('#remote-trial-granted-date-picker').should('have.value', '');

        cy.get('.modal-button-confirm').click();

        cy.get('.usa-alert--success').should('exist');

        cy.contains('Motion to proceed remotely granted date').should(
          'not.exist',
        );
      });
    });

    it('should allow saving without a date (no-op when no date is entered)', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        goToCase(docketNumber);
        getCaseDetailTab('case-information').click();

        cy.get('[data-testid="edit-remote-status"]').click();

        cy.get('.modal-button-confirm').click();

        cy.get('.usa-alert--success').should('exist');

        cy.contains('Motion to proceed remotely granted date').should(
          'not.exist',
        );
      });
    });

    it('should show validation error for invalid date format', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        goToCase(docketNumber);
        getCaseDetailTab('case-information').click();

        cy.get('[data-testid="edit-remote-status"]').click();

        cy.get('#remote-trial-granted-date-picker').type('13/45/2023');

        cy.get('.modal-button-confirm').click();

        cy.get('.usa-error-message').should(
          'contain',
          'Format date as MM/DD/YYYY',
        );
      });
    });

    it('should display remote status date in Trial Information section when case is not scheduled', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        goToCase(docketNumber);
        getCaseDetailTab('case-information').click();

        cy.get('[data-testid="edit-remote-status"]').click();
        const dateString = formatNow(FORMATS.MMDDYYYY);
        cy.get('#remote-trial-granted-date-picker').type(dateString);
        cy.get('.modal-button-confirm').click();

        cy.get('.usa-alert--success').should('exist');

        cy.contains('h3', 'Trial - Not Scheduled').should('exist');
        cy.contains('Motion to proceed remotely granted date').should('exist');
        cy.contains(dateString).should('exist');
      });
    });

    it('should allow docket clerk to cancel editing without saving changes', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        goToCase(docketNumber);
        getCaseDetailTab('case-information').click();

        cy.get('[data-testid="edit-remote-status"]').click();

        const dateString = formatNow(FORMATS.MMDDYYYY);
        cy.get('#remote-trial-granted-date-picker').type(dateString);

        cy.get('.modal-button-cancel').click();

        cy.get('.modal-header').should('not.exist');

        cy.get('.usa-alert--success').should('not.exist');

        cy.contains('Motion to proceed remotely granted date').should(
          'not.exist',
        );
      });
    });

    it('should not allow future dates for remote trial granted date', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        goToCase(docketNumber);
        getCaseDetailTab('case-information').click();

        cy.get('[data-testid="edit-remote-status"]').click();

        const futureDate = calculateISODate({
          dateString: createISODateString(),
          howMuch: 30,
          units: 'days',
        });
        const futureDateString = formatDateString(futureDate, FORMATS.MMDDYYYY);
        cy.get('#remote-trial-granted-date-picker').type(futureDateString);

        cy.get('#remote-trial-granted-date-picker').should('exist');
      });
    });
  });

  describe('As an external user (petitioner)', () => {
    beforeEach(() => {
      loginAsPetitioner();
    });

    it('should display remote trial granted date but NOT show edit button', () => {
      cy.visit('/case-detail/101-19');

      cy.get('[data-testid="docket-record-table"]').should('exist');

      cy.get('[data-testid="edit-remote-status"]').should('not.exist');
    });

    it('should not be able to access the edit remote status modal', () => {
      cy.visit('/case-detail/101-19');

      cy.get('[data-testid="docket-record-table"]').should('exist');

      cy.get('[data-testid="edit-remote-status"]').should('not.exist');
    });
  });

  describe('Edit Remote Status persistence', () => {
    beforeEach(() => {
      loginAsDocketClerk();
    });

    it('should persist remote trial granted date after page refresh', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        goToCase(docketNumber);
        getCaseDetailTab('case-information').click();

        cy.get('[data-testid="edit-remote-status"]').click();
        const dateString = formatNow(FORMATS.MMDDYYYY);
        cy.get('#remote-trial-granted-date-picker').type(dateString);
        cy.get('.modal-button-confirm').click();

        cy.get('.usa-alert--success').should('exist');

        cy.reload();
        getCaseDetailTab('case-information').click();

        cy.contains('Motion to proceed remotely granted date').should('exist');
        cy.contains(dateString).should('exist');
      });
    });

    it('should allow updating an existing remote trial granted date', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        goToCase(docketNumber);
        getCaseDetailTab('case-information').click();

        cy.get('[data-testid="edit-remote-status"]').click();
        const initialDateString = formatNow(FORMATS.MMDDYYYY);
        cy.get('#remote-trial-granted-date-picker').type(initialDateString);
        cy.get('.modal-button-confirm').click();

        cy.get('.usa-alert--success').should('exist');

        cy.get('[data-testid="edit-remote-status"]').click();
        const newDate = calculateISODate({
          dateString: createISODateString(),
          howMuch: -7,
          units: 'days',
        });
        const newDateString = formatDateString(newDate, FORMATS.MMDDYYYY);

        cy.get('#remote-trial-granted-date-picker').clear();
        cy.get('#remote-trial-granted-date-picker').type(newDateString);
        cy.get('.modal-button-confirm').click();

        cy.get('.usa-alert--success').should('exist');

        cy.contains('Motion to proceed remotely granted date').should('exist');
        cy.contains(formatDateString(newDate, FORMATS.MMDDYYYY)).should('exist');
        cy.contains(initialDateString).should('not.exist');
      });
    });
  });
});
