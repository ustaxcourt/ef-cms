import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsClerkOfCourt } from '../../../../helpers/authentication/login-as-helpers';

const emptyCaseStats = {
  calendarYearCaseStats: {
    casesClosedByMonth: [],
    casesClosedByProcedureType: [],
    casesOnAppealByMonth: [],
  },
  fiscalYearCaseStats: {
    casesClosedByMonth: [],
    casesClosedByProcedureType: [],
    casesOnAppealByMonth: [],
  },
  openCasesByCaseType: [],
  openCasesByProcedureType: [],
};

const emptyPetitionStats = {
  petitionFullElectronicMonths: [],
  petitionFullPaperMonths: [],
  petitionsByRepresentation: [],
  petitionsByServiceType: [],
};

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
          ...emptyCaseStats,
          year: '2026',
        },
      }).as('mockStats');
      loginAsClerkOfCourt();
      cy.get('#tabButton-petitions').click();

      cy.get('[data-testid="petitions-data-div"]').should('exist');

      checkA11y();
    });
  });

  describe('Cases tab', () => {
    it('should be free of a11y issues when viewing cases data', () => {
      // mock the call with minimal cases data so we can guarentee the charts render
      const months = [10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(
        (total, i) => ({ month: i + 1, total }),
      );
      cy.intercept('GET', '**/clerk-dashboard-stats', {
        statusCode: 200,
        body: {
          ...emptyCaseStats,
          calendarYearCaseStats: {
            casesClosedByMonth: months,
            casesClosedByProcedureType: [
              { procedureType: 'Regular', total: 20 },
              { procedureType: 'Small', total: 10 },
            ],
            casesOnAppealByMonth: months,
          },
          calendarYearPetitionStats: emptyPetitionStats,
          fiscalYearPetitionStats: emptyPetitionStats,
          openCasesByCaseType: [
            { caseType: 'Deficiency', total: 60 },
            {
              caseType: 'Declaratory Judgment (Exempt Organization)',
              total: 15,
            },
            { caseType: 'Partnership (Section 6226)', total: 25 },
          ],
          openCasesByProcedureType: [
            { procedureType: 'Regular', total: 70 },
            { procedureType: 'Small', total: 30 },
          ],
          year: '2026',
        },
      }).as('mockStats');
      loginAsClerkOfCourt();
      cy.get('#tabButton-cases').click();

      cy.get('[data-testid="cases-data-div"]').should('exist');

      checkA11y();
    });
  });

  describe('Chart error states', () => {
    it('should be free of a11y issues when the charts fail to load', () => {
      cy.intercept('GET', '**/clerk-dashboard-stats', {
        statusCode: 500,
      }).as('mockStats');
      loginAsClerkOfCourt();
      cy.wait('@mockStats');
      cy.get('#tabButton-cases').click();

      cy.get('[data-testid="chart-error"]').should('exist');

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
