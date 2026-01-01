import {
  loginAsTrialClerk,
  loginAsPetitionsClerk1,
} from '../../../../helpers/authentication/login-as-helpers';
import { createTrialSession } from '../../../../helpers/trialSession/create-trial-session';
import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';

describe('New Minute Sheet for Unscheduled Cases', () => {
  describe('Trial clerk can create minute sheet for unscheduled case', () => {
    before(() => {
      // Create a calendared trial session first
      loginAsPetitionsClerk1();
      createTrialSession({ trialLocation: 'Birmingham, Alabama' }).then(
        ({ trialSessionId }) => {
          // Calendar the trial session (without any cases)
          cy.visit(`/trial-session-detail/${trialSessionId}`);
          cy.get('[data-testid="set-calendar-button"]').click();
          cy.get('[data-testid="modal-button-confirm"]').click();
          cy.get('[data-testid="printing-complete"]').click();

          cy.wrap(trialSessionId).as('trialSessionId');

          // Create a case that is NOT added to this trial session
          createAndServePaperPetition({
            trialLocation: 'Birmingham, Alabama',
            includeApwDocument: false,
          }).then(({ docketNumber }) => {
            cy.wrap(docketNumber).as('unscheduledDocketNumber');
          });
        },
      );
    });

    it('should display New Minutes Sheet link on trial session page', function () {
      loginAsTrialClerk();
      cy.visit(`/trial-session-detail/${this.trialSessionId}`);

      // Verify "+ New Minutes Sheet" link exists
      cy.get('[data-testid="new-minute-sheet-button"]').should('exist');
      cy.get('[data-testid="new-minute-sheet-button"]').should(
        'contain',
        'New Minutes Sheet',
      );
    });

    it('should open modal when clicking New Minutes Sheet link', function () {
      loginAsTrialClerk();
      cy.visit(`/trial-session-detail/${this.trialSessionId}`);

      // Click the link
      cy.get('[data-testid="new-minute-sheet-button"]').click();

      // Verify modal opens with title "New Minutes Sheet"
      cy.get('[data-testid="confirm-modal-header"]').should(
        'contain',
        'New Minutes Sheet',
      );

      // Verify docket number input exists
      cy.get('[data-testid="new-minute-sheet-docket-number-input"]').should(
        'exist',
      );
    });

    it('should show no results message for invalid docket number', function () {
      loginAsTrialClerk();
      cy.visit(`/trial-session-detail/${this.trialSessionId}`);

      // Open the modal
      cy.get('[data-testid="new-minute-sheet-button"]').click();

      // Enter invalid docket number
      cy.get('[data-testid="new-minute-sheet-docket-number-input"]').type(
        'invalid',
      );

      // Click search button to trigger validation
      cy.get('[data-testid="new-minute-sheet-search-button"]').click();

      // Verify "No results found" message appears
      cy.get('[data-testid="no-results-found-message"]').should('exist');
      cy.get('[data-testid="no-results-found-message"]').should(
        'contain',
        'No results found',
      );
    });

    it('should show case confirmation when valid docket number entered', function () {
      loginAsTrialClerk();
      cy.visit(`/trial-session-detail/${this.trialSessionId}`);

      // Open the modal
      cy.get('[data-testid="new-minute-sheet-button"]').click();

      // Enter the valid docket number (not on session)
      cy.get('[data-testid="new-minute-sheet-docket-number-input"]').type(
        this.unscheduledDocketNumber,
      );

      // Click search button to search for the case
      cy.get('[data-testid="new-minute-sheet-search-button"]').click();

      // Verify case checkbox appears with docket number
      cy.get('[data-testid="new-minute-sheet-case-checkbox"]').should('exist');
      cy.get('[data-testid="new-minute-sheet-case-label"]').should(
        'contain',
        this.unscheduledDocketNumber,
      );
    });

    it('should navigate to minute sheet form on Add', function () {
      loginAsTrialClerk();
      cy.visit(`/trial-session-detail/${this.trialSessionId}`);

      // Open the modal
      cy.get('[data-testid="new-minute-sheet-button"]').click();

      // Enter the valid docket number
      cy.get('[data-testid="new-minute-sheet-docket-number-input"]').type(
        this.unscheduledDocketNumber,
      );

      // Click search button to search for the case
      cy.get('[data-testid="new-minute-sheet-search-button"]').click();

      // Wait for case checkbox to appear and select it
      cy.get('[data-testid="new-minute-sheet-case-checkbox"]').should('exist');
      cy.get('[data-testid="new-minute-sheet-case-checkbox"]').check({
        force: true,
      });

      // Click Add button
      cy.get('[data-testid="modal-confirm"]').click();

      // Verify navigation to minute sheet page
      cy.url().should('include', '/minutes');
      cy.url().should('include', this.unscheduledDocketNumber);
      cy.url().should('include', this.trialSessionId);
    });

    it('should close modal without action on Close', function () {
      loginAsTrialClerk();
      cy.visit(`/trial-session-detail/${this.trialSessionId}`);

      // Open modal
      cy.get('[data-testid="new-minute-sheet-button"]').click();

      // Verify modal is open
      cy.get('[data-testid="confirm-modal-header"]').should(
        'contain',
        'New Minutes Sheet',
      );

      // Click Close button
      cy.get('[data-testid="confirm-modal-cancel-btn"]').click();

      // Verify modal closes
      cy.get('[data-testid="confirm-modal-header"]').should('not.exist');

      // Verify still on trial session page
      cy.url().should('include', `/trial-session-detail/${this.trialSessionId}`);
    });
  });

  describe('Error handling for case already on trial session', () => {
    before(() => {
      // Create a trial session with a case on it
      loginAsPetitionsClerk1();
      createAndServePaperPetition({
        trialLocation: 'Seattle, Washington',
        includeApwDocument: false,
      }).then(({ docketNumber }) => {
        cy.wrap(docketNumber).as('scheduledDocketNumber');

        createTrialSession({ trialLocation: 'Seattle, Washington' }).then(
          ({ trialSessionId }) => {
            cy.visit(`/trial-session-detail/${trialSessionId}`);

            // Mark QC complete for the case
            cy.get(`[data-testid="qc-complete-${docketNumber}"]`).click({
              force: true,
            });

            // Calendar the trial session with this case
            cy.get('[data-testid="set-calendar-button"]').click();
            cy.get('[data-testid="modal-button-confirm"]').click();
            cy.get('[data-testid="printing-complete"]').click();

            cy.wrap(trialSessionId).as('trialSessionIdWithCase');
          },
        );
      });
    });

    it('should show error when case is already on trial session', function () {
      loginAsTrialClerk();
      cy.visit(`/trial-session-detail/${this.trialSessionIdWithCase}`);

      // Open the modal
      cy.get('[data-testid="new-minute-sheet-button"]').click();

      // Enter docket number that IS on the trial session
      cy.get('[data-testid="new-minute-sheet-docket-number-input"]').type(
        this.scheduledDocketNumber,
      );

      // Click search button to trigger validation
      cy.get('[data-testid="new-minute-sheet-search-button"]').click();

      // Verify error message appears
      cy.get('[data-testid="case-already-on-trial-session-message"]').should(
        'exist',
      );
      cy.get('[data-testid="case-already-on-trial-session-message"]').should(
        'contain',
        'This case is currently active in this trial session',
      );

      // Verify case checkbox does NOT appear when there's an error
      cy.get('[data-testid="new-minute-sheet-case-checkbox"]').should(
        'not.exist',
      );
    });
  });

  describe('Consolidated case handling', () => {
    // Note: Testing consolidated case behavior would require setting up
    // a lead case and member case, which is complex. This describe block
    // is a placeholder for when that test is needed.
    // When entering a member case docket number, only one minute sheet
    // should be created for the lead case, and a message should be shown.

    it.skip('should show consolidated case message for member case', () => {
      // Test that when entering a member case docket number,
      // a message indicates the minute sheet will be for the lead case
    });
  });
});
