import {
  loginAsDocketClerk1,
  loginAsPetitionsClerk1,
} from 'cypress/helpers/authentication/login-as-helpers';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';

describe('Add and Remove Case Hearings', () => {
  beforeEach(() => {
    // Create a case
    createAndServePaperPetition().then(({ docketNumber }) => {
      cy.wrap(docketNumber).as('DOCKET_NUMBER');
    });

    // Create a calendared trial session
    loginAsPetitionsClerk1();
    createTrialSession().then(({ trialSessionId }) => {
      cy.wrap(trialSessionId).as('TRIAL_SESSION_ID_HEARING');
      cy.get('[data-testid="new-trial-sessions-tab"]').click();
      cy.get(`[data-testid="trial-location-link-${trialSessionId}"]`).click();
      cy.get('[data-testid="set-calendar-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
    });

    // Create a calendared trial session
    createTrialSession().then(({ trialSessionId }) => {
      cy.wrap(trialSessionId).as('TRIAL_SESSION_ID_PRIMARY');
      cy.get('[data-testid="new-trial-sessions-tab"]').click();
      cy.get(`[data-testid="trial-location-link-${trialSessionId}"]`).click();
      cy.get('[data-testid="set-calendar-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
    });
  });

  it('should add then remove a hearing from a case', () => {
    loginAsDocketClerk1();
    cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      goToCase(docketNumber);
    });

    cy.get<string>('@TRIAL_SESSION_ID_PRIMARY').then(trialSessionId => {
      cy.get('[data-testid="tab-case-information"] span.button-text').click();
      cy.get('[data-testid="add-to-trial-session-btn"]').click();
      cy.get('[data-testid="all-locations-option"]').click();
      cy.get('[data-testid="trial-session-select"]').select(trialSessionId);
      cy.get('[name="calendarNotes"]').click();
      cy.get('[name="calendarNotes"]').type('TRIAL SESSION');
      cy.get('[data-testid="modal-button-confirm"]').click();
    });

    cy.get<string>('@TRIAL_SESSION_ID_HEARING').then(trialSessionId => {
      // Add a hearing to the created trial session
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="set-for-hearing-button"]').click();
      cy.get('[data-testid="all-locations-option"]').click();
      cy.get('[data-testid="trial-session-select"]').select(trialSessionId);
      cy.get('[name="calendarNotes"]').click();
      cy.focused().type('Adding hearing for cypress smoke test');
      cy.get('[data-testid="modal-button-confirm"]').click();

      // Remove the hearing we created
      cy.get(`[id="hearing-edit-menu-${trialSessionId}"]`).click();
      cy.get(`[id="remove-hearing-button-${trialSessionId}"]`).click();
      cy.get(
        '[data-testid="remove-from-trial-session-disposition-textarea"]',
      ).click();
      cy.focused().type('Removing hearing for cypress test');
      cy.get('[data-testid="modal-button-confirm"]').click();

      // Assert that the hearing we created is no longer visible
      cy.get(`[id=hearing-edit-menu-${trialSessionId}]`).should('not.exist');

      // Assert that the trial session we added at the beginning is still there
      cy.get('[data-testid="trial-session-location-link"]').should('exist');
    });
  });
});
