export function loginAsTestAdmissionsClerk() {
  cy.login('testAdmissionsClerk');
  cy.get('#inbox-tab-content').should('exist');
}

export function loginAsAdc(user: 'adc' = 'adc') {
  cy.login(user);
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsAdmissionsClerk(
  user: 'testAdmissionsClerk' | 'admissionsclerk1' = 'admissionsclerk1',
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

export function loginAsIrsPractitioner() {
  cy.login('irsPractitioner');
  cy.get('[data-testid="search-for-a-case-card"]').should('exist');
  cy.get('[data-testid="open-cases-count"]').contains('Open Cases');
  cy.get('[data-testid="closed-cases-count"]').contains('Closed Cases');
}

export function loginAsIrsPractitioner1() {
  cy.login('irsPractitioner1');
  cy.get('[data-testid="search-for-a-case-card"]').should('exist');
  cy.get('[data-testid="open-cases-count"]').contains('Open Cases');
  cy.get('[data-testid="closed-cases-count"]').contains('Closed Cases');
}

export function loginAsPetitioner(
  petitionerUser: 'petitioner' | 'petitioner1' = 'petitioner1',
) {
  cy.login(petitionerUser);
  cy.get('[data-testid="file-a-petition"]').should('exist');
}

export function loginAsCaseServicesSupervisor() {
  cy.login('caseservicessupervisor');
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
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

export function loginAsFloater() {
  cy.login('floater1');
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsGeneral() {
  cy.login('general');
  cy.get('[data-testid="section-inbox-tab"]').should('exist');
}

export function loginAsColvin() {
  cy.login('judgecolvin');
  cy.get('h1:contains("Trial Sessions")').should('exist');
}

export function loginAsColvinChambers() {
  cy.login('colvinschambers');
  cy.get('[data-testid="upcoming-trial-sessions-card"]').should('exist');
}

export function loginAsReportersOffice() {
  cy.login('reportersoffice');
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsIrsSuperUser() {
  cy.login('irssuperuser');
  cy.get('[data-testid="advanced-search-link"]').should('exist');
}
