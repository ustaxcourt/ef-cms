import { getCypressEnv } from '../env/cypressEnvironment';

export function loginAsTestAdmissionsClerk() {
  login({ email: 'testAdmissionsClerk@example.com' });
  cy.get('#inbox-tab-content').should('exist');
}

export function loginAsAdc() {
  login({ email: 'adc@example.com' });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsAdmissionsClerk(
  user:
    | 'testAdmissionsClerk@example.com'
    | 'admissionsclerk1@example.com' = 'admissionsclerk1@example.com',
) {
  login({ email: user });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsDojPractitioner(
  dojPractitionerUser:
    | 'dojPractitioner1@example.com'
    | 'dojPractitioner2@example.com'
    | 'dojPractitioner3@example.com' = 'dojPractitioner1@example.com',
) {
  login({ email: dojPractitionerUser });
  cy.get('[data-testid="search-for-a-case-card"]').should('exist');
}

export function loginAsPrivatePractitioner(
  practitionerUser:
    | 'privatePractitioner@example.com'
    | 'privatePractitioner1@example.com'
    | 'privatePractitioner2@example.com'
    | 'privatePractitioner3@example.com'
    | 'privatePractitioner4@example.com' = 'privatePractitioner1@example.com',
) {
  login({ email: practitionerUser });
  cy.get('[data-testid="file-a-petition"]').should('exist');
  cy.get('[data-testid="search-for-a-case-card"]').should('exist');
}

export function loginAsIrsPractitioner(
  irsPractitionerUser:
    | 'irsPractitioner@example.com'
    | 'irsPractitioner1@example.com'
    | 'irsPractitioner2@example.com' = 'irsPractitioner@example.com',
) {
  login({ email: irsPractitionerUser });
  cy.get('[data-testid="search-for-a-case-card"]').should('exist');
  cy.get('[data-testid="open-cases-count"]').contains('Open Cases');
  cy.get('[data-testid="closed-cases-count"]').contains('Closed Cases');
}

export function loginAsIrsPractitioner1() {
  login({ email: 'irsPractitioner1@example.com' });
  cy.get('[data-testid="search-for-a-case-card"]').should('exist');
  cy.get('[data-testid="open-cases-count"]').contains('Open Cases');
  cy.get('[data-testid="closed-cases-count"]').contains('Closed Cases');
}

export function loginAsPetitioner(
  petitionerUser: string = 'petitioner1@example.com',
) {
  login({ email: petitionerUser });
  cy.get('[data-testid="file-a-petition"]').should('exist');
}

export function loginAsCaseServicesSupervisor(
  user:
    | 'caseServicessupervisor@example.com'
    | 'caseServicesSupervisor1@example.com' = 'caseServicessupervisor@example.com',
) {
  login({ email: user });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsPetitionsClerk() {
  login({ email: 'petitionsclerk@example.com' });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsPetitionsClerk1() {
  login({ email: 'petitionsclerk1@example.com' });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsDocketClerk() {
  login({ email: 'docketclerk@example.com' });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsDocketClerk1() {
  login({ email: 'docketclerk1@example.com' });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsClerkOfCourt() {
  login({ email: 'clerkofcourt@example.com' });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsFloater() {
  login({ email: 'floater1@example.com' });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsGeneral() {
  login({ email: 'general@example.com' });
  cy.get('[data-testid="section-inbox-tab"]').should('exist');
}

export function loginAsColvin() {
  login({ email: 'judgecolvin@example.com' });
  cy.get('h1:contains("Trial Sessions")').should('exist');
}

export function loginAsColvinChambers() {
  login({ email: 'colvinschambers@example.com' });
  cy.get('[data-testid="upcoming-trial-sessions-card"]').should('exist');
}

export function loginAsReportersOffice() {
  login({ email: 'reportersoffice@example.com' });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsIrsSuperUser() {
  login({ email: 'irssuperuser@example.com' });
  cy.get('[data-testid="advanced-search-link"]').should('exist');
}

// Try to use the above account specific logins as they wait for specific content.
export function login({ email }: { email: string }) {
  cy.clearAllCookies();
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(
    getCypressEnv().defaultAccountPass,
  );
  cy.get('[data-testid="login-button"]').click();
  cy.window().then(win =>
    win.localStorage.setItem('__cypressOrderInSameTab', 'true'),
  );
  cy.intercept('GET', 'https://**/dynamsoft.webtwain.initiate.js', {
    body: `window.Dynamsoft = {DWT: {
            GetWebTwain() {}
          }}`,
    statusCode: 200,
  });
}
