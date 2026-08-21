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

  cy.get(
    '[data-testid="current-start-date-info"], [data-testid="success-alert"]',
    { timeout: 60000 },
  ).then($el => {
    if ($el.attr('data-testid') === 'current-start-date-info') {
      cy.get('[data-testid="updated-start-date-info"]').should(
        'contain.text',
        newStartDate,
      );
      cy.get('[data-testid="modal-button-confirm"]').click();
    }
  });

  cy.get('[data-testid="success-alert"]', { timeout: 120000 })
    .should('exist')
    .and('contain.text', 'Trial session updated');
};
