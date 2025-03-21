import { loginAsPetitionsClerk1 } from 'cypress/helpers/authentication/login-as-helpers';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';

export function petitionsClerkAddsRespondentToCase(
  docketNumber: string,
  barNumber: string,
) {
  loginAsPetitionsClerk1();
  goToCase(docketNumber);
  cy.get('[data-testid="tab-case-information"]').click();
  cy.get('[data-testid="tab-parties"]').click();
  cy.get('[data-testid="respondent-counsel"]').click();
  cy.get('[data-testid="respondent-search-field"]').type(barNumber);
  cy.get('[data-testid="search-for-respondent"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
  cy.get('[data-testid="success-alert"]').should('exist');
  cy.get('[data-testid="respondent-counsel-name"]')
    .contains(barNumber)
    .should('exist');
}
