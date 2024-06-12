import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsFloater } from '../../../../helpers/authentication/login-as-helpers';

describe('Dashboard - Floater Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsFloater();

    checkA11y();
  });
});
