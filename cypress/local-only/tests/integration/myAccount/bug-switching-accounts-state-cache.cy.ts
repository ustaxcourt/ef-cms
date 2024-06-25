import { getCypressEnv } from '../../../../helpers/env/cypressEnvironment';
import { navigateTo as loginAs } from '../../../support/pages/maintenance';

describe('BUG: State caching when switching accounts', () => {
  const PETITIONER_ACCOUNT = 'petitioner1';
  const PRIVATE_PRACTITIONER_ACCOUNT = 'privatePractitioner1';

  it('should test', () => {
    loginAs(PETITIONER_ACCOUNT);
    cy.get('[data-testid="account-menu-button"]').click();
    cy.get('[data-testid="my-account-link"]').click();

    cy.get('[data-testid="user-service-email"]').should('exist');
    cy.get('[data-testid="my-contact-information-card"]').should('not.exist');

    cy.get('[data-testid="account-menu-button"]').click();
    cy.get('[data-testid="logout-button-desktop"]').click();

    cy.get('[data-testid="email-input"]').type(
      `${PRIVATE_PRACTITIONER_ACCOUNT}@example.com`,
    );
    cy.get('[data-testid="password-input"]').type(
      getCypressEnv().defaultAccountPass,
    );
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="account-menu-button"]').click();
    cy.get('[data-testid="my-account-link"]').click();

    cy.get('[data-testid="user-service-email"]').should('exist');
    cy.get('[data-testid="my-contact-information-card"]').should('exist');
  });
});
