import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPrivatePractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File a Petition Page - Private Practitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues for step 1', () => {
    loginAsPrivatePractitioner();
    cy.visit('/file-a-petition/step-1');
    cy.get('[data-testid="complete-step-1"]').should('exist');
    checkA11y();
  });
});
