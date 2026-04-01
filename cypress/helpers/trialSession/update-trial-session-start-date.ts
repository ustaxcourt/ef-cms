import { loginAsTrialClerk } from '../authentication/login-as-helpers';

export const updateTrialSessionStartDate = (
  trialSessionId: string,
  newStartDate: string,
) => {
  loginAsTrialClerk();
  cy.get('[data-testid="trial-session-link"]').click();
  cy.get(`[data-testid="trial-location-link-${trialSessionId}"]`).click();
  cy.get('[data-testid="edit-trial-session"]').click();
  cy.get('[data-testid="start-date-picker"]').eq(1).clear();
  cy.get('[data-testid="start-date-picker"]').eq(1).type(newStartDate);
  cy.get('[data-testid="submit-edit-trial-session"]').click();
  cy.get('body').then($body => {
    if ($body.find('[data-testid="modal-button-confirm"]').length > 0) {
      cy.get('[data-testid="modal-button-confirm"]').click();
    }
  });
  cy.get('[data-testid="success-alert"]').should('exist');
  cy.get('[data-testid="success-alert"]').should(
    'contain.text',
    'Trial session updated',
  );
};
