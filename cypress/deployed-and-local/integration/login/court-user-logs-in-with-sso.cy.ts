import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';

describe('court user logs in with single sign-on', () => {
  before(function () {
    if (getCypressEnv().isLocal) {
      this.skip();
    } else {
      cy.task('getRawFeatureFlagValue', {
        flag: 'allow-idp-login',
      }).as('ALLOW_IDP_LOGIN');
      cy.get('@ALLOW_IDP_LOGIN').then(ALLOW_IDP_LOGIN => {
        if (!ALLOW_IDP_LOGIN) {
          this.skip();
        }
      });
    }
    Cypress.session.clearCurrentSessionData();
  });

  it('should let user sign in with single sign-on', () => {
    cy.visit('/login', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          '__cypressRunningColor',
          `"${getCypressEnv().deployingColor}"`,
        );
      },
    });
    cy.on('uncaught:exception', () => {
      return false;
    });

    cy.get('[data-testid="microsoft-login-button"]').click();

    cy.origin(
      getCypressEnv().managedLoginOrigin,
      { args: { defaultAccountPass: getCypressEnv().defaultAccountPass } },
      ({ defaultAccountPass }) => {
        cy.get('input[type="email"]').type('petitionsclerk1@example.com');
        cy.get('input[type="password"]').type(defaultAccountPass);
        cy.get('button[type="submit"]').click();
      },
    );

    cy.get('[data-testid="inbox-tab-content"]').should('exist');
  });
});
