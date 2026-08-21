import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsClerkOfCourt } from '../../../../helpers/authentication/login-as-helpers';

describe('Dashboard - Clerk of Court Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsClerkOfCourt();

    checkA11y();
  });

  describe('Petitions tab', () => {
    it('should be free of a11y issues when viewing petitions data', () => {
      // mock the call with minimal petitions data so we can guarentee the pie chart renders
      cy.intercept('GET', '**/clerk-dashboard-stats', {
        statusCode: 200,
        body: {
          calendarYearPetitionStats: {
            petitionFullPaperMonths: [],
            petitionFullElectronicMonths: [],
            petitionsByRepresentation: [
              {
                total: 50,
                isRepresenting: false,
              },
              {
                total: 50,
                isRepresenting: true,
              },
            ],
            petitionsByServiceType: [
              {
                total: 66,
                isPaper: false,
              },
              {
                total: 34,
                isPaper: true,
              },
            ],
          },
          fiscalYearPetitionStats: {
            petitionFullPaperMonths: [],
            petitionFullElectronicMonths: [],
            petitionsByRepresentation: [],
            petitionsByServiceType: [],
          },
          year: '2026',
        },
      }).as('mockStats');
      loginAsClerkOfCourt();
      cy.get('#tabButton-petitions').click();

      cy.get('[data-testid="petitions-data-div"]').should('exist');

      checkA11y();
    });
  });

  describe('Recent Messages tab', () => {
    it('should be free of a11y issues when viewing recent messages', () => {
      loginAsClerkOfCourt();
      cy.get('#tabButton-recentMessages').click();

      cy.get('[data-testid="recent-messages-table"]').should('exist');

      checkA11y();
    });
  });

  describe('Keyboard navigation', () => {
    it('should have focusable interactive elements', () => {
      loginAsClerkOfCourt();
      cy.get('#tabButton-recentMessages').click();

      cy.get('a:contains("View All Messages")')
        .should('be.visible')
        .should('have.attr', 'href');

      cy.get('[data-testid="current-week-trial-sessions-card-accordion"]')
        .should('be.visible')
        .should('have.attr', 'aria-expanded');
    });
  });
});
