import {
  VALID_PASSWORD_CONFIG,
  generatePassword,
} from '../../../../helpers/authentication/generate-password';
import { createAPetitioner } from '../../../../helpers/accountCreation/create-a-petitioner';
import { impactLevel } from '../../../../helpers/accessibility-impact';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Create Petitioner Page Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/create-account/petitioner');

    cy.get('[data-testid="create-petitioner-account-container"]');

    cy.injectAxe();

    cy.checkA11y(undefined, { includedImpacts: impactLevel }, terminalLog);
  });

  // TODO: Clean up later?
  it('should be free of a11y issues when creating petitioner and showing success message', () => {
    createAPetitioner({
      email: `example${Date.now()}@pa11y.com`,
      name: 'pa11y',
      password: generatePassword(VALID_PASSWORD_CONFIG),
    });
    cy.get('[data-testid="verification-sent-message"]').should('exist');

    cy.injectAxe();

    cy.checkA11y(undefined, { includedImpacts: impactLevel }, terminalLog);
  });
});
