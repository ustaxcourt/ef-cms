import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Edit Petitioner Counsel - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues when editing petitioner counsel', () => {
    loginAsPetitionsClerk();

    cy.visit('/case-detail/105-19/edit-petitioner-counsel/PT1234');
    cy.get('#practitioner-representing').should('exist');

    checkA11y();
  });
});
