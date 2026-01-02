import {
  loginAsTrialClerk,
  loginAsPetitionsClerk1,
} from '../../../../helpers/authentication/login-as-helpers';
import { createTrialSession } from '../../../../helpers/trialSession/create-trial-session';

describe('New Minute Sheet for Unscheduled Cases', () => {
  it('should create minute sheet for unscheduled case and show it in the list', () => {
    loginAsPetitionsClerk1();

    createTrialSession().then(({ trialSessionId }) => {
      // Calendar the trial session
      cy.visit(`/trial-session-detail/${trialSessionId}`);
      cy.get('[data-testid="set-calendar-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      // Login as trial clerk
      loginAsTrialClerk();
      cy.visit(`/trial-session-detail/${trialSessionId}`);

      // Click the New Minutes Sheet button
      cy.get('[data-testid="new-minute-sheet-button"]').click();

      // Verify modal shows up
      cy.get('[data-testid="confirm-modal-header"]').should(
        'contain',
        'New Minutes Sheet',
      );

      // Search for 101-24
      cy.get('[data-testid="new-minute-sheet-docket-number-input"]').type(
        '101-24',
      );
      cy.get('[data-testid="new-minute-sheet-search-button"]').click();

      // Confirm 1 checkbox item shows up and check it
      cy.get('[data-testid="new-minute-sheet-case-checkbox"]').should('exist');
      cy.get('[data-testid="new-minute-sheet-case-checkbox"]').check({
        force: true,
      });

      // Click Add
      cy.get('[data-testid="modal-confirm"]').click();

      // Verify we get redirected to the minute page form
      cy.url().should('include', '/minutes');

      // Type a value into the reporter field and blur to trigger autosave
      cy.intercept('PUT', '**/trial-sessions/minutes').as('autosaveMinutes');
      cy.get('[data-testid="courtReporter"]').type('Test Reporter');
      cy.get('[data-testid="courtReporter"]').blur();

      // Wait for autosave to complete
      cy.wait('@autosaveMinutes');

      // Wait a second for safety
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);

      // Go back to the trial session
      cy.visit(`/trial-session-detail/${trialSessionId}`);

      // Click the Case Minutes Sheet button again
      cy.get('[data-testid="new-minute-sheet-button"]').click();

      // Verify at the bottom 101-24 shows up as a link
      cy.get('[data-testid="edit-unscheduled-minute-101-24"]').should('exist');

      // Click the edit link and verify it goes to the proper minutes detail page
      cy.get('[data-testid="edit-unscheduled-minute-101-24"] a')
        .invoke('removeAttr', 'target')
        .click();
      cy.url().should('include', '/minutes');
      cy.url().should('include', '101-24');
      cy.url().should('include', trialSessionId);
    });
  });
});
