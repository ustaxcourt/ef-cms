import { loginAsPetitionsClerk } from 'cypress/helpers/authentication/login-as-helpers';
import { getCancelButton } from '../../../support/pages/edit-trial-session';
import { getCancelModalTitle } from '../../../support/pages/form-cancel-modal-dialog';

describe('Edit a trial session', () => {
  it('should display a modal to confirm discarding changes when cancel is clicked', () => {
    loginAsPetitionsClerk();
    cy.visit(`/edit-trial-session/208a959f-9526-4db5-b262-e58c476a4604`);

    cy.get('[data-testid="submit-edit-trial-session"]').should('be.visible');
    cy.get('[data-testid="trial-session-judge"]').should('be.visible');

    getCancelButton().click();

    getCancelModalTitle().should('contain', 'Are You Sure You Want to Cancel?');
  });
});
