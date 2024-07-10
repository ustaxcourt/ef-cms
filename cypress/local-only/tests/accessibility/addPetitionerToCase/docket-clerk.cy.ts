import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsDocketClerk1 } from '../../../../helpers/authentication/login-as-helpers';

describe('Add Petitioner To Case - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk1();

    cy.visit('/case-detail/105-20/add-petitioner-to-case');
    cy.get('[data-testid="add-petitioner-to-case-container"]');
    cy.get('[data-testid="use-existing-address-checkbox"]').click();

    checkA11y();
  });
});
