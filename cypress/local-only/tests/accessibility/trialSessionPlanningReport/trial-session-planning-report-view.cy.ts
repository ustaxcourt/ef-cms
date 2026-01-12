import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsDocketClerk1 } from '../../../../helpers/authentication/login-as-helpers';

describe('Trial Sessions Planning Report View - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk1();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get('[data-testid="trial-session-planning-report-button"]').click();

    cy.get('[data-testid="trial-session-planning-report-term-selector"]')
      .find('option')
      .last()
      .then(option => {
        const optionValue = option.val()!;
        cy.get(
          '[data-testid="trial-session-planning-report-term-selector"]',
        ).select(optionValue);
      });

    cy.get('[data-testid="trial-session-planning-report-year-selector"]')
      .find('option')
      .last()
      .then(option => {
        const optionValue = option.val()!;
        cy.get(
          '[data-testid="trial-session-planning-report-year-selector"]',
        ).select(optionValue);
      });

    cy.get('[data-testid="modal-button-confirm"]').click();

    cy.get('[data-testid="cities-not-calendared-in-past-two-terms-table"]');
    checkA11y();
  });

  describe('Trial Sessions Planning Report View - Accessibility', () => {
    it('should be free of a11y issues', () => {
      cy.get(
        '[data-testid="trial-location-link-Birmingham, Alabama"] > a',
      ).click();

      checkA11y();

      cy.get('[data-testid="back-to-planning-report-button"]').click();
      cy.get(
        '[data-testid="trial-location-link-Anchorage, Alaska"]  > a',
      ).click();
      cy.get('[data-testid="blocked-cases-tab"]').click();

      checkA11y();
    });
  });
});
