import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPrivatePractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Dashboard Page - Private Practitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPrivatePractitioner();

    checkA11y();
  });

  it('should be free of a11y issues when viewing closed cases tab', () => {
    loginAsPrivatePractitioner();
    cy.get('#tab-closed').click();

    checkA11y();
  });
});
