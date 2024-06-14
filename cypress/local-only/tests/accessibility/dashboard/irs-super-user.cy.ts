import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsIrsSuperUser } from '../../../../helpers/authentication/login-as-helpers';

describe('Dashboard Page - IRS Super User Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsIrsSuperUser();

    checkA11y();
  });
});
