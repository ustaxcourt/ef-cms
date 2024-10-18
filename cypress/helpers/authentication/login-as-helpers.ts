import { getCypressEnv } from '../env/cypressEnvironment';

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

export function loginAsDojPractitioner(
  dojPractitionerUser:
    | 'dojPractitioner1'
    | 'dojPractitioner2'
    | 'dojPractitioner3' = 'dojPractitioner1',
) {
  cy.login(dojPractitionerUser);
  cy.get('[data-testid="search-for-a-case-card"]').should('exist');
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
}

export function loginAsIrsPractitioner(
  irsPractitionerUser:
    | 'irsPractitioner'
    | 'irsPractitioner1'
    | 'irsPractitioner2' = 'irsPractitioner',
) {
  cy.login(irsPractitionerUser);
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

export function loginAsPetitioner(petitionerUser: string = 'petitioner1') {
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
  login({ email: 'petitionsclerk1@example.com' });
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

// We created this new login function because our current login function was too generically
// waiting for the account menu button, resulting in visiting a route before the page was fully loaded.
// We need to deprecate usage of cy.login and have all tests login through helper functions so we properly await
function login({ email }: { email: string }) {
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
