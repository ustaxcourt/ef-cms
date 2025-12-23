import {
  loginAsClerkOfCourt,
} from '../../../../helpers/authentication/login-as-helpers';

describe('Clerk of Court Dashboard', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should display the dashboard with trial sessions and recent messages', () => {
    loginAsClerkOfCourt();

    cy.get('h1:contains("Trial Sessions")').should('exist');
    cy.get('[data-testid="view-all-trial-sessions-button"]').should('exist');
    cy.get('[data-testid="current-week-trial-sessions-card"]').should('exist');
    cy.get('[data-testid="next-week-trial-sessions-card"]').should('exist');
    cy.get('[data-testid="recent-messages-table"]').should('exist');
  });

  it('should navigate to trial sessions page when clicking View All', () => {
    loginAsClerkOfCourt();

    cy.get('[data-testid="view-all-trial-sessions-button"]').click();
    cy.url().should('include', '/trial-sessions');
  });

  it('should navigate to messages page when clicking View All Messages', () => {
    loginAsClerkOfCourt();

    cy.get('a:contains("View All Messages")').click();
    cy.url().should('include', '/messages/my/inbox');
  });
});

