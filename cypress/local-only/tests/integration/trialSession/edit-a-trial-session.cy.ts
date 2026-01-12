import { loginAsPetitionsClerk } from 'cypress/helpers/authentication/login-as-helpers';
import { getCancelButton } from '../../../support/pages/edit-trial-session';
import { getCancelModalTitle } from '../../../support/pages/form-cancel-modal-dialog';

describe('Edit a trial session', () => {
  it('should display a modal to confirm discarding changes when cancel is clicked', () => {
    loginAsPetitionsClerk();
    cy.visit(`/edit-trial-session/208a959f-9526-4db5-b262-e58c476a4604`);

    getCancelButton().click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    getCancelModalTitle().should('exist');
  });
});
