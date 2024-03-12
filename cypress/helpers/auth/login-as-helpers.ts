export function loginAsTestAdmissionsClerk() {
  cy.login('testAdmissionsClerk');
  cy.get('#inbox-tab-content').should('exist');
}

export function loginAsAdmissionsClerk(
  user: 'admissionsclerk1' = 'admissionsclerk1',
) {
  cy.login(user);
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsPrivatePractitioner(
  practitionerUser:
    | 'privatePractitioner1'
    | 'privatePractitioner2'
    | 'privatePractitioner3'
    | 'privatePractitioner4' = 'privatePractitioner1',
) {
  cy.login(practitionerUser);
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
  cy.login('petitionsclerk');
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsPetitionsClerk1() {
  cy.login('petitionsclerk1');
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsDocketClerk() {
  cy.login('docketclerk');
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsDocketClerk1() {
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
