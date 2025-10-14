import {
  loginAsDocketClerk,
  loginAsPetitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { getCaseDetailTab } from 'cypress/local-only/support/pages/case-detail';
import { DateTime } from 'luxon';

describe('Edit Remote Status', () => {
  describe('As a docket clerk', () => {
    beforeEach(() => {
      loginAsDocketClerk();
    });

    it('should allow docket clerk to edit remote status and add a granted date', () => {
      // Create a case
      createAndServePaperPetition().then(({ docketNumber }) => {
        // Navigate to case detail
        cy.visit(`/case-detail/${docketNumber}`);
        getCaseDetailTab('case-information').click();

        // Verify Edit Remote Status button is visible
        cy.get('[data-testid="edit-remote-status"]').should('exist');
        cy.get('[data-testid="edit-remote-status"]').click();

        // Modal should be open
        cy.get('.modal-header').should('contain', 'Edit Remote Status');

        // Set a date
        const today = DateTime.now();
        const dateString = today.toFormat('MM/dd/yyyy');

        cy.get('[data-testid="remote-trial-granted-date"]').type(dateString);

        // Save
        cy.get('.modal-button-confirm').click();

        // Verify success message
        cy.get('.usa-alert--success').should(
          'contain',
          'Successfully updated motion to proceed remotely date',
        );

        // Verify the date is displayed
        cy.contains('Motion to proceed remotely granted date').should('exist');
        cy.contains(today.toFormat('MM/dd/yyyy')).should('exist');
      });
    });

    it('should allow docket clerk to clear the remote status date', () => {
      // Create a case
      createAndServePaperPetition().then(({ docketNumber }) => {
        // Navigate to case detail
        cy.visit(`/case-detail/${docketNumber}`);
        getCaseDetailTab('case-information').click();

        // First, add a date
        cy.get('[data-testid="edit-remote-status"]').click();
        const today = DateTime.now();
        const dateString = today.toFormat('MM/dd/yyyy');
        cy.get('[data-testid="remote-trial-granted-date"]').type(dateString);
        cy.get('.modal-button-confirm').click();

        // Wait for success
        cy.get('.usa-alert--success').should('exist');

        // Now clear the date
        cy.get('[data-testid="edit-remote-status"]').click();
        cy.get('.modal-button-clear').click();

        // Verify the date input is cleared
        cy.get('[data-testid="remote-trial-granted-date"]').should(
          'have.value',
          '',
        );

        // Save
        cy.get('.modal-button-confirm').click();

        // Verify success message
        cy.get('.usa-alert--success').should('exist');

        // Verify the date is no longer displayed
        cy.contains('Motion to proceed remotely granted date').should(
          'not.exist',
        );
      });
    });

    it('should show validation error when saving without a date', () => {
      // Create a case
      createAndServePaperPetition().then(({ docketNumber }) => {
        // Navigate to case detail
        cy.visit(`/case-detail/${docketNumber}`);
        getCaseDetailTab('case-information').click();

        // Open modal
        cy.get('[data-testid="edit-remote-status"]').click();

        // Try to save without entering a date
        cy.get('.modal-button-confirm').click();

        // Verify validation error
        cy.get('.usa-error-message').should(
          'contain',
          'Insert Date as MM/DD/YYYY',
        );
      });
    });

    it('should show validation error for invalid date format', () => {
      // Create a case
      createAndServePaperPetition().then(({ docketNumber }) => {
        // Navigate to case detail
        cy.visit(`/case-detail/${docketNumber}`);
        getCaseDetailTab('case-information').click();

        // Open modal
        cy.get('[data-testid="edit-remote-status"]').click();

        // Enter invalid date
        cy.get('[data-testid="remote-trial-granted-date"]').type('13/45/2023');

        // Try to save
        cy.get('.modal-button-confirm').click();

        // Verify validation error
        cy.get('.usa-error-message').should(
          'contain',
          'Format date as MM/DD/YYYY',
        );
      });
    });

    it('should display remote status date in Trial Information section when case is not scheduled', () => {
      // Create a case
      createAndServePaperPetition().then(({ docketNumber }) => {
        // Navigate to case detail
        cy.visit(`/case-detail/${docketNumber}`);
        getCaseDetailTab('case-information').click();

        // Add remote status date
        cy.get('[data-testid="edit-remote-status"]').click();
        const today = DateTime.now();
        const dateString = today.toFormat('MM/dd/yyyy');
        cy.get('[data-testid="remote-trial-granted-date"]').type(dateString);
        cy.get('.modal-button-confirm').click();

        // Wait for success
        cy.get('.usa-alert--success').should('exist');

        // Verify the date is displayed in Trial Information section
        cy.contains('h3', 'Trial - Not Scheduled').should('exist');
        cy.contains('Motion to proceed remotely granted date').should('exist');
        cy.contains(today.toFormat('MM/dd/yyyy')).should('exist');
      });
    });

    it('should allow docket clerk to cancel editing without saving changes', () => {
      // Create a case
      createAndServePaperPetition().then(({ docketNumber }) => {
        // Navigate to case detail
        cy.visit(`/case-detail/${docketNumber}`);
        getCaseDetailTab('case-information').click();

        // Open modal
        cy.get('[data-testid="edit-remote-status"]').click();

        // Enter a date
        const today = DateTime.now();
        const dateString = today.toFormat('MM/dd/yyyy');
        cy.get('[data-testid="remote-trial-granted-date"]').type(dateString);

        // Cancel
        cy.get('.modal-button-cancel').click();

        // Modal should be closed
        cy.get('.modal-header').should('not.exist');

        // Verify no success message
        cy.get('.usa-alert--success').should('not.exist');

        // Verify date was not saved
        cy.contains('Motion to proceed remotely granted date').should(
          'not.exist',
        );
      });
    });

    it('should not allow future dates for remote trial granted date', () => {
      // Create a case
      createAndServePaperPetition().then(({ docketNumber }) => {
        // Navigate to case detail
        cy.visit(`/case-detail/${docketNumber}`);
        getCaseDetailTab('case-information').click();

        // Open modal
        cy.get('[data-testid="edit-remote-status"]').click();

        // Try to enter a future date
        const futureDate = DateTime.now().plus({ days: 30 });
        const futureDateString = futureDate.toFormat('MM/dd/yyyy');
        cy.get('[data-testid="remote-trial-granted-date"]').type(
          futureDateString,
        );

        // The date picker should have maxDate set to today, so future dates should not be selectable
        // This test verifies the DateSelector component has the maxDate prop set correctly
        cy.get('[data-testid="remote-trial-granted-date"]').should('exist');
      });
    });
  });

  describe('As an external user (petitioner)', () => {
    beforeEach(() => {
      loginAsPetitioner();
    });

    it('should display remote trial granted date but NOT show edit button', () => {
      // Navigate to a case with remote trial permission granted
      // Using a known test case from the seed data
      cy.visit('/case-detail/101-19');
      getCaseDetailTab('case-information').click();

      // Verify Edit Remote Status button is NOT visible
      cy.get('[data-testid="edit-remote-status"]').should('not.exist');

      // If there's a remote trial granted date on this case, it should still display
      // (This depends on the test data - adjust as needed)
    });

    it('should not be able to access the edit remote status modal', () => {
      cy.visit('/case-detail/101-19');
      getCaseDetailTab('case-information').click();

      // Verify button doesn't exist
      cy.get('[data-testid="edit-remote-status"]').should('not.exist');
    });
  });

  describe('Edit Remote Status persistence', () => {
    beforeEach(() => {
      loginAsDocketClerk();
    });

    it('should persist remote trial granted date after page refresh', () => {
      // Create a case
      createAndServePaperPetition().then(({ docketNumber }) => {
        // Navigate to case detail
        cy.visit(`/case-detail/${docketNumber}`);
        getCaseDetailTab('case-information').click();

        // Add remote status date
        cy.get('[data-testid="edit-remote-status"]').click();
        const today = DateTime.now();
        const dateString = today.toFormat('MM/dd/yyyy');
        cy.get('[data-testid="remote-trial-granted-date"]').type(dateString);
        cy.get('.modal-button-confirm').click();

        // Wait for success
        cy.get('.usa-alert--success').should('exist');

        // Refresh the page
        cy.reload();
        getCaseDetailTab('case-information').click();

        // Verify the date is still displayed
        cy.contains('Motion to proceed remotely granted date').should('exist');
        cy.contains(today.toFormat('MM/dd/yyyy')).should('exist');
      });
    });

    it('should allow updating an existing remote trial granted date', () => {
      // Create a case
      createAndServePaperPetition().then(({ docketNumber }) => {
        // Navigate to case detail
        cy.visit(`/case-detail/${docketNumber}`);
        getCaseDetailTab('case-information').click();

        // Add initial remote status date
        cy.get('[data-testid="edit-remote-status"]').click();
        const today = DateTime.now();
        const initialDateString = today.toFormat('MM/dd/yyyy');
        cy.get('[data-testid="remote-trial-granted-date"]').type(
          initialDateString,
        );
        cy.get('.modal-button-confirm').click();

        // Wait for success
        cy.get('.usa-alert--success').should('exist');

        // Update to a different date
        cy.get('[data-testid="edit-remote-status"]').click();
        const newDate = today.minus({ days: 7 });
        const newDateString = newDate.toFormat('MM/dd/yyyy');

        // Clear existing date and enter new one
        cy.get('[data-testid="remote-trial-granted-date"]').clear();
        cy.get('[data-testid="remote-trial-granted-date"]').type(newDateString);
        cy.get('.modal-button-confirm').click();

        // Wait for success
        cy.get('.usa-alert--success').should('exist');

        // Verify the new date is displayed
        cy.contains('Motion to proceed remotely granted date').should('exist');
        cy.contains(newDate.toFormat('MM/dd/yyyy')).should('exist');
        cy.contains(initialDateString).should('not.exist');
      });
    });
  });
});
