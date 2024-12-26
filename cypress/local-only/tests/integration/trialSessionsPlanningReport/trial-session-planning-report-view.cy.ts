import { loginAsDocketClerk1 } from '../../../../helpers/authentication/login-as-helpers';

describe('Trial Sessions Planning Report View', () => {
  describe('BUGs', () => {
    it('should not display errors when user has not selected any option in dropdowns', () => {
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

      cy.get(
        '[data-testid="trial-session-planning-report-modal-term-error"]',
      ).should('not.exist');

      cy.get(
        '[data-testid="trial-session-planning-report-modal-year-error"]',
      ).should('not.exist');

      cy.get('[data-testid="trial-session-planning-report-year-selector"]')
        .find('option')
        .last()
        .then(option => {
          const optionValue = option.val()!;
          cy.get(
            '[data-testid="trial-session-planning-report-year-selector"]',
          ).select(optionValue);
        });

      cy.get(
        '[data-testid="trial-session-planning-report-modal-term-error"]',
      ).should('not.exist');

      cy.get(
        '[data-testid="trial-session-planning-report-modal-year-error"]',
      ).should('not.exist');

      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.get('[data-testid="cities-not-calendared-in-past-two-terms-table"]');

      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="trial-session-planning-btn"').click();

      cy.get('[data-testid="trial-session-planning-report-term-selector"]')
        .find('option')
        .last()
        .then(option => {
          const optionValue = option.val()!;
          cy.get(
            '[data-testid="trial-session-planning-report-term-selector"]',
          ).select(optionValue);
        });

      cy.get(
        '[data-testid="trial-session-planning-report-modal-term-error"]',
      ).should('not.exist');

      cy.get(
        '[data-testid="trial-session-planning-report-modal-year-error"]',
      ).should('not.exist');
    });
  });
});
