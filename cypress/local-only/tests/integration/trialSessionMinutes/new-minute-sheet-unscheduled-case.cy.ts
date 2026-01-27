import {
  loginAsTrialClerk,
  loginAsPetitionsClerk1,
} from '../../../../helpers/authentication/login-as-helpers';
import { createTrialSession } from '../../../../helpers/trialSession/create-trial-session';

describe('New Minute Sheet for Unscheduled Cases', () => {
  it('should create minute sheet for unscheduled case and show it in the list', () => {
    loginAsPetitionsClerk1();

    createTrialSession().then(({ trialSessionId }) => {
      cy.visit(`/trial-session-detail/${trialSessionId}`);
      cy.get('[data-testid="set-calendar-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      loginAsTrialClerk();
      cy.visit(`/trial-session-detail/${trialSessionId}`);

      cy.get('[data-testid="new-minute-sheet-button"]').click();

      cy.get('[data-testid="confirm-modal-header"]').should(
        'contain',
        'New Minutes Sheet',
      );

      cy.get('[data-testid="new-minute-sheet-docket-number-input"]').type(
        '101-24',
      );
      cy.get('[data-testid="new-minute-sheet-search-button"]').click();

      cy.get('[data-testid="new-minute-sheet-case-checkbox"]').should('exist');
      cy.get('[data-testid="new-minute-sheet-case-checkbox"]').check({
        force: true,
      });

      cy.get('[data-testid="modal-confirm"]').click();

      cy.url().should('include', '/minutes');

      cy.intercept('PUT', '**/trial-sessions/minutes').as('autosaveMinutes');
      cy.get('[data-testid="courtReporter"]').type('Test Reporter');
      cy.get('[data-testid="courtReporter"]').blur();

      cy.wait('@autosaveMinutes');

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);

      cy.visit(`/trial-session-detail/${trialSessionId}`);

      cy.get('[data-testid="new-minute-sheet-button"]').click();

      cy.get('[data-testid="edit-unscheduled-minute-101-24"]').should('exist');

      cy.get('[data-testid="edit-unscheduled-minute-101-24"] a')
        .invoke('removeAttr', 'target')
        .click();
      cy.url().should('include', '/minutes');
      cy.url().should('include', '101-24');
      cy.url().should('include', trialSessionId);
    });
  });
});
