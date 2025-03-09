import { loginAsDojPractitioner } from 'cypress/helpers/authentication/login-as-helpers';

describe('DOJ practitioner views dashboard', () => {
  it('should NOT display the "Create a Case" button', () => {
    cy.viewport('iphone-5');

    loginAsDojPractitioner('dojPractitioner1@example.com');
    cy.get('[data-testid="additional-case-select"]').should('exist');
    cy.get('[data-testid="file-a-petition"]').should('not.exist');
  });
});
