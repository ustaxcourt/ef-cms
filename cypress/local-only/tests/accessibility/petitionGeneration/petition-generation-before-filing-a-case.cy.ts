import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Petition generation - intro pages', () => {
  it('welcome to dawson: should be free of a11y issues', () => {
    loginAsPetitioner('petitioner7');
    checkA11y();
  });

  it('before filing a case: should be free of a11y issues', () => {
    loginAsPetitioner();
    cy.visit('/before-filing-a-petition');
    checkA11y();
  });
});
