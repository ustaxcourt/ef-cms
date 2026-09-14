import { getCypressEnv } from '../../../../helpers/env/cypressEnvironment';
import { checkA11y } from '../../../support/generalCommands/checkA11y';

describe('Login - Accessibility', () => {
  before(function () {
    cy.task('getRawFeatureFlagValue', {
      flag: 'allow-idp-login',
    }).as('ORIGINAL_FEATURE_FLAG_VALUE');

    cy.task('toggleFeatureFlag', {
      flag: 'allow-idp-login',
      flagValue: true,
    });
  });

  after(function () {
    if (getCypressEnv().isLocal) {
      return;
    }

    cy.get('@ORIGINAL_FEATURE_FLAG_VALUE').then(ORIGINAL_FEATURE_FLAG_VALUE => {
      cy.task('toggleFeatureFlag', {
        flag: 'allow-idp-login',
        flagValue: ORIGINAL_FEATURE_FLAG_VALUE,
      });
    });
  });

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/login');

    cy.get('[data-testid="email-input"]');

    checkA11y();
  });
});
