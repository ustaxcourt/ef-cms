import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';

describe('irs superuser integration', () => {
  beforeEach(function () {
    if (getCypressEnv().isLocal) {
      //this.skip();
    }
    Cypress.session.clearCurrentSessionData(); // maybe keep?
  });

  it('should let user sign in with single sign-on', () => {
    cy.visit('/login');

    cy.get('[data-testid="microsoft-login-button"]').click();

    // cy.origin(
    //   getCypressEnv().managedLoginOrigin
    // )
    // cy.visit(
    //   'https://ef-cms-exp4.auth.us-east-1.amazoncognito.com/login?client_id=3uf5b6t2rqtno64n82vrqmnli7&redirect_uri=https://app.exp4.ef-cms.ustaxcourt.gov/auth-code&response_type=code',
    // );
    // cy.on('uncaught:exception', () => {
    //   return false;
    // });

    cy.origin(getCypressEnv().managedLoginOrigin, () => {
      cy.get('input[type="email"]').type('petitioner1@example.com');
      cy.get('input[type="password"]').type(getCypressEnv().defaultAccountPass);
      cy.get('button[type="submit"]').click();
    });
  });
});
