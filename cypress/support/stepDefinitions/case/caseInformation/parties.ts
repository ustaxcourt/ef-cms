import { Given } from '@badeball/cypress-cucumber-preprocessor';
import { cypressState } from '../../../state';
import { v4 } from 'uuid';

Given('I grant electronic access to a petitioner', () => {
  const email = `cypress_test_account+${v4()}@example.com`;

  cypressState.currentUser.email = email;

  cy.login('admissionsclerk1');
  cy.get('[data-testid="messages-banner"]');
  cy.get('[data-testid="docket-number-search-input"]').type(
    cypressState.docketNumber,
  );
  cy.get('[data-testid="search-docket-number"]').click();
  cy.get('[data-testid="tab-case-information"]').click();
  cy.get('[data-testid="tab-parties"]').click();
  cy.get('[data-testid="edit-petitioner-button"]').click();
  cy.get('[data-testid="internal-edit-petitioner-email-input"]').type(email);
  cy.get('[data-testid="internal-confirm-petitioner-email-input"]').type(email);
  cy.get('[data-testid="submit-edit-petitioner-information-button"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();

  cy.get('[data-testid="success-alert"]').contains('Changes saved');
});
