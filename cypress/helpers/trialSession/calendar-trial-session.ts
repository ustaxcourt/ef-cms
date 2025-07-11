import { loginAsPetitionsClerk1 } from "../authentication/login-as-helpers";

export const calendarTrialSession = (trialSessionId: string) => {
  loginAsPetitionsClerk1();
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
  cy.get('[data-testid="trial-session-link"]').click();
  cy.get('[data-testid="new-trial-sessions-tab"]').click();
  cy.get(`[data-testid="trial-location-link-${trialSessionId}"]`).click();
  cy.get('[data-testid="set-calendar-button"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
};