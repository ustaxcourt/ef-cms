export function loginAsTestAdmissionsClerk() {
  cy.login('testAdmissionsClerk');
  cy.get('#inbox-tab-content').should('exist');
}

export function loginAsPrivatePractitioner() {
  cy.login('privatePractitioner1');
  cy.get('[data-testid="file-a-petition"]').should('exist');
  cy.get('[data-testid="search-for-a-case-card"]').should('exist');
  cy.get('[data-testid="open-cases-count"]').contains('Open Cases');
  cy.get('[data-testid="closed-cases-count"]').contains('Closed Cases');
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

export function loginAsColvin() {
  cy.login('judgecolvin');
  cy.get('h1:contains("Trial Sessions")').should('exist');
}

export function loginAsColvinChambers() {
  cy.login('colvinschambers');
  cy.get('[data-testid="upcoming-trial-sessions-card"]').should('exist');
}
