import { checkA11y } from '../../../support/generalCommands/checkA11y';

describe('Login - Accessibility', () => {
  after(function () {
    cy.get('@ORIGINAL_FEATURE_FLAG_VALUE').then(ORIGINAL_FEATURE_FLAG_VALUE => {
      cy.task('toggleFeatureFlag', {
        flag: 'allow-idp-login',
        flagValue: ORIGINAL_FEATURE_FLAG_VALUE,
      });
    });
  });

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();

    cy.task('getRawFeatureFlagValue', {
      flag: 'allow-idp-login',
    }).as('ORIGINAL_FEATURE_FLAG_VALUE');

    cy.task('toggleFeatureFlag', {
      flag: 'allow-idp-login',
      flagValue: true,
    });
  });

  it('should be free of a11y issues', () => {
    cy.visit('/login');

    cy.get('[data-testid="email-input"]');

    checkA11y();
  });
});
