import { loginAsClerkOfCourt } from '../../../../helpers/authentication/login-as-helpers';

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

  it('should display all required trial session fields when sessions exist', () => {
    loginAsClerkOfCourt();

    cy.get('[data-testid="current-week-trial-sessions-card"]')
      .find('[data-testid^="current-week-session-"]')
      .should('have.length.greaterThan', 0);

    cy.get('[data-testid="current-week-trial-sessions-card"]').within(() => {
      cy.contains('Start Date').should('exist');
      cy.contains('Proc. Type').should('exist');
      cy.contains('City').should('exist');
      cy.contains('Est. End Date').should('exist');
      cy.contains('Session Type').should('exist');
      cy.contains('Judge').should('exist');
      cy.contains('Clerk').should('exist');
    });
  });

  it('should display recent messages with maximum of 5 messages', () => {
    loginAsClerkOfCourt();

    cy.get('[data-testid="recent-messages-table"]').within(() => {
      cy.get('tbody tr').should('have.length.at.most', 5);
    });
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

  it('should navigate to trial session detail when clicking trial location link', () => {
    loginAsClerkOfCourt();

    cy.get('[data-testid^="trial-location-link-"]')
      .first()
      .then($link => {
        const href = $link.attr('href');
        if (href) {
          cy.wrap($link).click();
          cy.url().should('include', '/trial-session-detail/');
        }
      });
  });

  it('should allow keyboard navigation through accordion headers', () => {
    loginAsClerkOfCourt();

    cy.get('[data-testid="current-week-trial-sessions-card-accordion"]')
      .find('button')
      .focus();
    cy.get('[data-testid="current-week-trial-sessions-card-accordion"]')
      .find('button')
      .should('be.focused');

    cy.get('[data-testid="next-week-trial-sessions-card-accordion"]')
      .find('button')
      .focus();
    cy.get('[data-testid="next-week-trial-sessions-card-accordion"]')
      .find('button')
      .should('be.focused');
  });

  it('should display mobile view correctly', () => {
    cy.viewport('iphone-x');
    loginAsClerkOfCourt();

    cy.get('[data-testid="current-week-trial-sessions-card"]').should('exist');
    cy.get('[data-testid="next-week-trial-sessions-card"]').should('exist');
    cy.get('[data-testid="recent-messages-table"]').should('exist');
  });
});
