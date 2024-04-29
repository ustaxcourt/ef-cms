import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../../helpers/authentication/logout';
import { petitionerCreatesElectronicCase } from '../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../../../helpers/documentQC/petitionsclerk-serves-petition';

/**
 * Given a case
 * When a docket clerk adds a paper filing that is not valid and attempts to serve it
 * Then they should see a validation error message
 */
describe('Docket clerk adding a paper filing', () => {
  it('should be alerted when the paper filing is not valid when they attempt to serve', () => {
    loginAsPetitioner();
    petitionerCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      logout();

      loginAsDocketClerk1();
      cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
    });

    cy.get('[data-testid="search-docket-number"]').click();
    cy.get('[data-testid="case-detail-menu-button"]').click();
    cy.get('[data-testid="menu-button-add-paper-filing"]').click();
    cy.get('[data-testid="save-and-serve"]').click();
    cy.get('[data-testid="error-alert"]').contains(
      'Please correct the following errors on the page',
    );
  });
});
