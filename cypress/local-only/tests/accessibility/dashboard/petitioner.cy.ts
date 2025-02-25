import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Dashboard - Petitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitioner();

    checkA11y();
  });

  it('should be free of a11y issues when viewing payment options', () => {
    loginAsPetitioner();
    cy.get('[data-testid="other-options"]').click();
    cy.get('a.usa-link--external').should('exist');

    checkA11y();
  });
});
