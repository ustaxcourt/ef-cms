import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Before Starting Case - Petitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitioner();

    cy.visit('/before-filing-a-petition');
    cy.get('[data-testid="go-to-step-1"]').should('exist');

    checkA11y();
  });
});
