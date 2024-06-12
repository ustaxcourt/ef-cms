import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsGeneral } from '../../../../helpers/authentication/login-as-helpers';

describe('Dashboard - General Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsGeneral();

    checkA11y();
  });
});
