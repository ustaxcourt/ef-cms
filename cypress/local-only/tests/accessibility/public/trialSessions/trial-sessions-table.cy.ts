import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';
import { checkA11y } from '../../../../support/generalCommands/checkA11y';

describe('Trial Sessions - Public Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
    cy.intercept('GET', '**/system/feature-flag/', req => {
      req.continue(res => {
        res.body[ALLOWLIST_FEATURE_FLAGS.REPORTING_CALENDARS.key] = true;
      });
    }).as('getFeatureFlags');
  });

  it('should be free of a11y issues', () => {
    cy.visit('/trial-sessions');
    cy.wait('@getFeatureFlags');
    cy.get('[data-testid="Reporting-proceeding-label"]').should('be.visible');
    checkA11y();
  });

  it('should be free of a11y issues with mobile filters expanded', () => {
    cy.viewport('iphone-xr');
    cy.visit('/trial-sessions');
    cy.wait('@getFeatureFlags');
    cy.contains('button', 'Filters').click();
    cy.get('[data-testid="Reporting-proceeding-label"]').should('be.visible');
    checkA11y();
  });
});
