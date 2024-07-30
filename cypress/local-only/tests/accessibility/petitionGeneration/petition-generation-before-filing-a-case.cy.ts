import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Petition generation - before filing a petition page', () => {
  it('should be free of a11y issues', () => {
    loginAsPetitioner();
    cy.visit('/before-filing-a-petition');
    checkA11y();
  });
});
