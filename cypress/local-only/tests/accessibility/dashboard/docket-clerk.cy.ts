import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsDocketClerk1 } from '../../../../helpers/authentication/login-as-helpers';

describe('Dashboard - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk1();

    checkA11y();
  });
});
