import { holdRequests } from '../../../../helpers/hold-requests';
import { loginAsClerkOfCourt } from 'cypress/helpers/authentication/login-as-helpers';

// the dashboard renders at once and loads each section with its own request,
// so each section shows its own loading and error state
describe('Clerk of Court Dashboard - section loading', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should show the trial sessions and messages loading states until their own requests finish', () => {
    const trialSessionsRequests = holdRequests(
      '**/clerk-dashboard-stats/trial-sessions',
    );
    const messagesRequests = holdRequests('**/messages/inbox/*');
    loginAsClerkOfCourt();

    cy.get('h2:contains("Trial Sessions")').should('exist');
    cy.get('[data-testid="trial-sessions-loading"]').should(
      'contain.text',
      'Loading trial sessions...',
    );
    cy.get('[data-testid="current-week-trial-sessions-card"]').should(
      'not.exist',
    );
    cy.get('[data-testid="petitions-data-div"]').should('exist');

    cy.get('#tabButton-recentMessages').click();
    cy.get('a:contains("View All Messages")').should('exist');
    cy.get('[data-testid="messages-loading"]').should(
      'contain.text',
      'Loading messages...',
    );
    cy.get('[data-testid="recent-messages-table"]').should('not.exist');

    cy.then(trialSessionsRequests.release);
    cy.get('[data-testid="trial-sessions-loading"]').should('not.exist');
    cy.get('[data-testid="current-week-trial-sessions-card"]').should('exist');
    cy.get('[data-testid="messages-loading"]').should('exist');

    cy.then(messagesRequests.release);
    cy.get('[data-testid="messages-loading"]').should('not.exist');
    cy.get('[data-testid="recent-messages-table"]').should('exist');
  });

  it('should show an error for trial sessions and messages without blocking the other sections', () => {
    cy.intercept('GET', '**/clerk-dashboard-stats/trial-sessions', {
      statusCode: 500,
    }).as('trialSessions');
    cy.intercept('GET', '**/messages/inbox/*', { statusCode: 500 }).as(
      'inboxMessages',
    );
    loginAsClerkOfCourt();
    cy.wait(['@trialSessions', '@inboxMessages']);

    cy.get('[data-testid="trial-sessions-error"]').should(
      'contain.text',
      'Something went wrong, please refresh the page.',
    );
    cy.get('[data-testid="petitions-data-div"]').should('exist');

    cy.get('#tabButton-recentMessages').click();
    cy.get('[data-testid="messages-error"]').should('exist');
    cy.get('a:contains("View All Messages")').should('exist');
    cy.get('[data-testid="error-alert"]').should('not.exist');
  });

  it('should stay on the dashboard and show an alert when the notifications fail to load', () => {
    cy.intercept('GET', '**/api/notifications*', { statusCode: 500 }).as(
      'notifications',
    );
    loginAsClerkOfCourt();
    cy.wait('@notifications');

    cy.get('[data-testid="error-alert"]').should(
      'contain.text',
      'Notifications could not be loaded',
    );
    cy.get('[data-testid="inbox-tab-content"]').should('exist');
    cy.get('[data-testid="current-week-trial-sessions-card"]').should('exist');
    cy.get('[data-testid="petitions-data-div"]').should('exist');
  });

  it('should display mobile view correctly while trial sessions load', () => {
    cy.viewport('iphone-x');
    const trialSessionsRequests = holdRequests(
      '**/clerk-dashboard-stats/trial-sessions',
    );
    loginAsClerkOfCourt();

    cy.get('[data-testid="trial-sessions-loading"]').should('exist');
    cy.get('[data-testid="dashboard-clerk-of-court-mobile-selector"]').select(
      'petitions',
    );
    cy.get('[data-testid="petitions-data-header"]').should('exist');

    cy.then(trialSessionsRequests.release);
    cy.get('[data-testid="current-week-trial-sessions-card"]').should('exist');
  });
});
