import { loginAsDocketClerk } from "../authentication/login-as-helpers";
import { goToCase } from "../caseDetail/go-to-case";

export const scheduleTrialSession = (docketNumber: string, trialSessionId: string) => {
  loginAsDocketClerk();
  goToCase(docketNumber);
  cy.get('[data-testid="tab-case-information"]').click();
  cy.get('[data-testid="add-to-trial-session-btn"]').click();
  cy.get('[data-testid="all-locations-option"]').click();
  cy.get('[data-testid="trial-session-select"]').select(trialSessionId);
  cy.get('[data-testid="modal-button-confirm"]').click();
};