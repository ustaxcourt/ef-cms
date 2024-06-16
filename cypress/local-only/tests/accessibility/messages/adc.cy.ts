import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsAdc } from '../../../../helpers/authentication/login-as-helpers';

describe('Messages - ADC Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('My messages tab', () => {
    describe('Inbox tab', () => {
      it('should be free of a11y issues', () => {
        loginAsAdc();

        checkA11y();
      });
    });
  });
});
