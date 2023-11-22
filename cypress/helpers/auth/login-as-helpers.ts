export function loginAsTestAdmissionsClerk() {
  cy.login('testAdmissionsClerk');
  cy.get('#inbox-tab-content').should('exist');
}

export function loginAsPrivatePractitioner() {
  cy.login('privatePractitioner1');
  cy.get('[data-testid="case-list-table"]').should('exist');
}

export function loginAsPetitioner() {
  cy.login('petitioner1');
  cy.get('[data-testid="file-a-petition"]').should('exist');
}

export function loginAsPetitionsClerk() {
  cy.login('petitionsclerk1');
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsDocketClerk() {
  cy.login('docketclerk1');
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}
