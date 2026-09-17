import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';

describe('irs superuser integration', () => {
  beforeEach(function () {
    if (getCypressEnv().isLocal) {
      //this.skip();
    }
    Cypress.session.clearCurrentSessionData(); // maybe keep?
  });

  it('should let user sign in with single sign-on', () => {
    cy.visit('/login', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          'cypressRunningColor',
          getCypressEnv().deployingColor,
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
