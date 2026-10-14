import {
  FORMATS,
  createDateAtStartOfWeekEST,
  createISODateString,
  deconstructDate,
  formatDateString,
  prepareDateFromString,
} from '@shared/business/utilities/DateHandler';
import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import {
  loginAsClerkOfCourt,
  loginAsPetitionsClerk1,
  loginAsPrivatePractitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import {
  createMessage,
  enterSubject,
  fillOutMessageField,
  selectRecipient,
  selectSection,
  sendMessage,
} from '../../../support/pages/document-qc';
import { logout } from '../../../../helpers/authentication/logout';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { formatPositiveNumber } from '@web-client/business/utilities/formatPositiveNumber';

describe('Clerk of Court Dashboard', () => {
  const { year } = deconstructDate(createISODateString());

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should display the dashboard with trial sessions and petitions', () => {
    loginAsClerkOfCourt();

    cy.get('h2:contains("Trial Sessions")').should('exist');
    cy.get('[data-testid="current-week-trial-sessions-card"]').should('exist');
    cy.get('[data-testid="next-week-trial-sessions-card"]').should('exist');
    cy.get('[data-testid="petitions-data-div"]').should('exist');
  });

  it('should display all required trial session fields when sessions exist', () => {
    const today = createISODateString();
    const todayDateTime = prepareDateFromString(today);
    const currentWeekStart = createDateAtStartOfWeekEST(today, FORMATS.ISO);
    const currentWeekStartDateTime = prepareDateFromString(currentWeekStart);
    const daysFromWeekStart = Math.floor(
      todayDateTime.diff(currentWeekStartDateTime, 'days').days,
    );
    const sessionDate =
      daysFromWeekStart < 3
        ? currentWeekStartDateTime.plus({ days: 3 })
        : todayDateTime.plus({ days: 1 });
    const trialSessionStartDate = formatDateString(
      sessionDate.toISO()!,
      FORMATS.MMDDYYYY,
    );

    const trialSessionEndDate = formatDateString(
      sessionDate.plus({ days: 2 }).toISO()!,
      FORMATS.MMDDYYYY,
    );

    loginAsClerkOfCourt();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get('[data-testid="add-trial-session-button"]').click();
    cy.get('#standaloneRemote-session-scope-label').click();
    cy.get('[data-testid="trial-session-meeting-id"]').should('be.visible');
    cy.get('#start-date-picker').should('be.visible');
    cy.intercept('POST', '**/trial-sessions').as('createTrialSession');
    cy.get('#start-date-picker').click();
    cy.get('#start-date-picker').clear();
    cy.get('#start-date-picker').type(trialSessionStartDate);
    cy.get('#start-date-picker').should('have.value', trialSessionStartDate);
    cy.get('#estimated-end-date-picker').click();
    cy.get('#estimated-end-date-picker').clear();
    cy.get('#estimated-end-date-picker').type(trialSessionEndDate);
    cy.get('#estimated-end-date-picker').should(
      'have.value',
      trialSessionEndDate,
    );
    cy.get(`[data-testid="session-type-${SESSION_TYPES.regular}"]`).click();
    cy.get('[data-testid="trial-session-meeting-id"]').should('be.visible');
    cy.get('[data-testid="trial-session-meeting-id"]').type('123456789Meet');
    cy.get('[data-testid="trial-session-password"]').type('testPassword123');
    cy.get('[data-testid="trial-session-join-phone-number"]').type(
      '1234567890',
    );
    cy.get('[data-testid="trial-session-chambers-phone-number"]').type(
      '0987654321',
    );
    cy.get('[data-testid="trial-session-judge"]').select('Buch');
    cy.get('[data-testid="trial-session-trial-clerk"]').select(
      'Test trialclerk1',
    );
    cy.get('[data-testid="submit-trial-session"]').should('not.be.disabled');
    cy.get('[data-testid="submit-trial-session"]').click();
    cy.get('[data-testid="error-alert"]').should('not.exist');
    cy.wait('@createTrialSession', { timeout: 60000 }).then(() => {
      cy.get('[data-testid="success-alert"]').should('exist');
      cy.intercept('GET', '**/trial-sessions').as('getTrialSessions');
      cy.visit('/');
      cy.wait('@getTrialSessions');

      cy.get(
        '[data-testid^="current-week-session-"], [data-testid^="next-week-session-"]',
      )
        .should('have.length.greaterThan', 0)
        .first()
        .within(() => {
          cy.contains('Start Date').should('exist');
          cy.contains('Proc. Type').should('exist');
          cy.contains('City').should('exist');
          cy.contains('Est. End Date').should('exist');
          cy.contains('Session Type').should('exist');
          cy.contains('Judge').should('exist');
          cy.contains('Clerk').should('exist');
        });
    });
  });

  it('should display petitions data', () => {
    loginAsPrivatePractitioner('privatePractitioner@example.com');
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      logout();
      loginAsPetitionsClerk1();
      createAndServePaperPetition({ yearReceived: year }).then(() => {
        cy.intercept('GET', '**/clerk-dashboard-stats').as(
          'clerkDashboardStats',
        );
        loginAsClerkOfCourt();
        cy.wait('@clerkDashboardStats').then(clerkDashboardStats => {
          const calendarYearTotal =
            clerkDashboardStats.response.body.calendarYearPetitionStats.petitionsByServiceType.reduce(
              (yearTotal: number, entry: any) => yearTotal + entry.total,
              0,
            );
          const fiscalYearTotal =
            clerkDashboardStats.response.body.fiscalYearPetitionStats.petitionsByServiceType.reduce(
              (yearTotal: number, entry: any) => yearTotal + entry.total,
              0,
            );

          cy.get('[data-testid="petitions-data-header"]').should(
            'contain.text',
            `Total petitions created in YTD ${year}: ${formatPositiveNumber(calendarYearTotal)}`,
          );

          cy.get(
            `[data-testid="Petitions Created in YTD ${year}-pie-graph-div"]`,
          )
            .eq(0)
            .should('exist');
          cy.get(
            `[data-testid="Petitions Created in YTD ${year}-pie-graph-legend"]`,
          )
            .eq(0)
            .should('exist');
          cy.get(
            `[data-testid="Petitions Created in YTD ${year}-pie-graph-html-button"]`,
          )
            .eq(0)
            .should('exist');

          cy.get(
            `[data-testid="Petitions Created in YTD ${year}-pie-graph-div"]`,
          )
            .eq(1)
            .should('exist');
          cy.get(
            `[data-testid="Petitions Created in YTD ${year}-pie-graph-legend"]`,
          )
            .eq(1)
            .should('exist');
          cy.get(
            `[data-testid="Petitions Created in YTD ${year}-pie-graph-html-button"]`,
          )
            .eq(1)
            .should('exist');

          cy.get(
            '[data-testid="Petitions: Total Petitions by Month-bar-graph-div"]',
          ).should('exist');
          cy.get(
            '[data-testid="Petitions: Total Petitions by Month-bar-graph-legend"]',
          ).should('exist');
          cy.get(
            '[data-testid="Petitions: Total Petitions by Month-bar-graph-html-button"]',
          ).should('exist');

          cy.get('[data-testid="fiscal-year-to-date"]').click();
          cy.get('[data-testid="petitions-data-header"]').should(
            'contain.text',
            `Total petitions created in FYTD ${year}: ${formatPositiveNumber(fiscalYearTotal)}`,
          );

          cy.get(
            `[data-testid="Petitions Created in FYTD ${year}-pie-graph-div"]`,
          )
            .eq(0)
            .should('exist');
          cy.get(
            `[data-testid="Petitions Created in FYTD ${year}-pie-graph-legend"]`,
          )
            .eq(0)
            .should('exist');
          cy.get(
            `[data-testid="Petitions Created in FYTD ${year}-pie-graph-html-button"]`,
          )
            .eq(0)
            .should('exist');

          cy.get(
            `[data-testid="Petitions Created in FYTD ${year}-pie-graph-div"]`,
          )
            .eq(1)
            .should('exist');
          cy.get(
            `[data-testid="Petitions Created in FYTD ${year}-pie-graph-legend"]`,
          )
            .eq(1)
            .should('exist');
          cy.get(
            `[data-testid="Petitions Created in FYTD ${year}-pie-graph-html-button"]`,
          )
            .eq(1)
            .should('exist');

          cy.get(
            '[data-testid="Petitions: Total Petitions by Month-bar-graph-div"]',
          ).should('exist');
          cy.get(
            '[data-testid="Petitions: Total Petitions by Month-bar-graph-legend"]',
          ).should('exist');
          cy.get(
            '[data-testid="Petitions: Total Petitions by Month-bar-graph-html-button"]',
          ).should('exist');

          cy.get('[data-testid="calendar-year-to-date"]').click();
          cy.get('[data-testid="petitions-data-header"]').should(
            'contain.text',
            `Total petitions created in YTD ${year}: ${formatPositiveNumber(calendarYearTotal)}`,
          );

          cy.get(
            `[data-testid="Petitions Created in YTD ${year}-pie-graph-div"]`,
          )
            .eq(0)
            .should('exist');
          cy.get(
            `[data-testid="Petitions Created in YTD ${year}-pie-graph-legend"]`,
          )
            .eq(0)
            .should('exist');
          cy.get(
            `[data-testid="Petitions Created in YTD ${year}-pie-graph-html-button"]`,
          )
            .eq(0)
            .should('exist');

          cy.get(
            `[data-testid="Petitions Created in YTD ${year}-pie-graph-div"]`,
          )
            .eq(1)
            .should('exist');
          cy.get(
            `[data-testid="Petitions Created in YTD ${year}-pie-graph-legend"]`,
          )
            .eq(1)
            .should('exist');
          cy.get(
            `[data-testid="Petitions Created in YTD ${year}-pie-graph-html-button"]`,
          )
            .eq(1)
            .should('exist');

          cy.get(
            '[data-testid="Petitions: Total Petitions by Month-bar-graph-div"]',
          ).should('exist');
          cy.get(
            '[data-testid="Petitions: Total Petitions by Month-bar-graph-legend"]',
          ).should('exist');
          cy.get(
            '[data-testid="Petitions: Total Petitions by Month-bar-graph-html-button"]',
          ).should('exist');
        });
      });
    });
  });

  it('should display cases data', () => {
    const closedTitle = 'Closed/Closed - Dismissed & Changed to On Appeal';
    const openByTypeTitle = 'Total Open Cases by type';
    const sumTotals = (entries: { total: number }[]) =>
      entries.reduce((total, entry) => total + entry.total, 0);

    cy.intercept('GET', '**/clerk-dashboard-stats').as('clerkDashboardStats');
    loginAsClerkOfCourt();
    cy.wait('@clerkDashboardStats').then(clerkDashboardStats => {
      const {
        calendarYearCaseStats,
        fiscalYearCaseStats,
        openCasesByProcedureType,
      } = clerkDashboardStats.response.body;
      const openCasesTotal = formatPositiveNumber(
        sumTotals(openCasesByProcedureType),
      );

      cy.get('#tabButton-cases').click();
      cy.get('[data-testid="cases-data-div"]').should('exist');

      cy.get('[data-testid="open-cases-header"]').should(
        'have.text',
        `Open Cases: ${openCasesTotal}`,
      );
      cy.get('[data-testid="cases-closed-header"]').should(
        'have.text',
        `Cases changed to Closed/Closed - Dismissed: ${formatPositiveNumber(
          sumTotals(calendarYearCaseStats.casesClosedByProcedureType),
        )}`,
      );
      cy.get(`[data-testid="${closedTitle}-bar-graph-div"]`).should('exist');
      cy.get(`[data-testid="${closedTitle}-bar-graph-html-button"]`).should(
        'exist',
      );
      cy.get(`[data-testid="${openByTypeTitle}-bar-graph-div"]`).should(
        'not.exist',
      );
      cy.get(`[data-testid="${openByTypeTitle}-html-view-div"]`).should(
        'contain.text',
        openByTypeTitle,
      );
      cy.window().then(win => {
        cy.stub(win, 'open').as('openHtmlView');
      });
      cy.get(`[data-testid="${openByTypeTitle}-html-view-button"]`).click();
      cy.get('@openHtmlView').should('have.been.calledOnce');

      cy.get('[data-testid="cases-fiscal-year-to-date"]').click();
      cy.get('[data-testid="open-cases-header"]').should(
        'have.text',
        `Open Cases: ${openCasesTotal}`,
      );
      cy.get('[data-testid="cases-closed-header"]').should(
        'have.text',
        `Cases changed to Closed/Closed - Dismissed: ${formatPositiveNumber(
          sumTotals(fiscalYearCaseStats.casesClosedByProcedureType),
        )}`,
      );
      // the pie only has a legend when cases were closed in the fiscal year
      if (sumTotals(fiscalYearCaseStats.casesClosedByProcedureType) > 0) {
        cy.get(
          `[data-testid="Cases Changed to Closed/Closed - Dismissed in FYTD ${year}-pie-graph-legend"]`,
        ).should('exist');
      } else {
        cy.get('[data-testid="cases-data-div"]').should(
          'contain.text',
          'No data available',
        );
      }

      cy.get('#tabButton-petitions').click();
      // the test id is on the label, so check the radio input itself
      cy.get('#calendar-year-to-date').should('be.checked');
    });
  });

  it('should show one loading state for the tab until the stats arrive', () => {
    cy.intercept('GET', '**/clerk-dashboard-stats', req => {
      req.on('response', res => {
        res.setDelay(3000);
      });
    }).as('clerkDashboardStats');
    loginAsClerkOfCourt();

    cy.get('[data-testid="chart-loading"]')
      .should('have.length', 1)
      .and('contain.text', 'Loading chart...');
    cy.get('[data-testid="petitions-data-div"]').should('not.exist');

    cy.wait('@clerkDashboardStats');
    cy.get('[data-testid="chart-loading"]').should('not.exist');
    cy.get(
      '[data-testid="Petitions: Total Petitions by Month-bar-graph-div"]',
    ).should('exist');
  });

  it('should show one error state for the tab when the stats fail to load', () => {
    cy.intercept('GET', '**/clerk-dashboard-stats', {
      statusCode: 500,
    }).as('clerkDashboardStats');
    loginAsClerkOfCourt();
    cy.wait('@clerkDashboardStats');

    cy.get('[data-testid="chart-error"]')
      .should('have.length', 1)
      .and('contain.text', 'Something went wrong, please refresh the page.');
    cy.get('[data-testid="petitions-data-div"]').should('not.exist');

    cy.get('#tabButton-cases').click();
    cy.get('[data-testid="chart-error"]').should('have.length', 1);
    cy.get('[data-testid="cases-data-div"]').should('not.exist');
    cy.get('[data-testid="error-alert"]').should('not.exist');
  });

  it('should display messages', () => {
    loginAsPetitionsClerk1();
    createAndServePaperPetition().then(({ docketNumber }) => {
      loginAsClerkOfCourt();
      cy.visit(`/case-detail/${docketNumber}`);
      createMessage();
      selectSection('clerkofcourt');
      selectRecipient('Test Clerk of Court');
      enterSubject('Test Message');
      fillOutMessageField();
      cy.intercept('POST', '**/messages').as('createMessage');
      sendMessage();
      cy.wait('@createMessage');
      cy.intercept('GET', '**/messages/**').as('getMessages');
      cy.visit('/');
      cy.get('#tabButton-recentMessages').click();
      cy.wait('@getMessages');
      cy.get('[data-testid="recent-messages-table"]').within(() => {
        cy.get('tbody tr').should('have.length.greaterThan', 0);
        cy.contains('Test Message').should('exist');
      });
    });
  });

  it('should navigate to messages page when clicking View All Messages', () => {
    loginAsClerkOfCourt();
    cy.get('#tabButton-recentMessages').click();

    cy.get('a:contains("View All Messages")').click();
    cy.url().should('include', '/messages/my/inbox');
  });

  it('should display mobile view correctly for recent messages', () => {
    cy.viewport('iphone-x');
    loginAsClerkOfCourt();
    cy.get('[data-testid="dashboard-clerk-of-court-mobile-selector"]').select(
      'recentMessages',
    );

    cy.get('[data-testid="current-week-trial-sessions-card"]').should('exist');
    cy.get('[data-testid="next-week-trial-sessions-card"]').should('exist');
    cy.get('[data-testid="recent-messages-table"]').should('exist');
  });

  it('should display mobile view correctly for petitions data', () => {
    cy.viewport('iphone-x');
    loginAsClerkOfCourt();
    cy.get('[data-testid="dashboard-clerk-of-court-mobile-selector"]').select(
      'petitions',
    );

    cy.get('[data-testid="petitions-data-header"]').should(
      'contain.text',
      'Total petitions created in YTD',
    );

    cy.get(`[data-testid="Petitions Created in YTD ${year}-pie-graph-div"]`)
      .eq(0)
      .should('exist');
    cy.get(`[data-testid="Petitions Created in YTD ${year}-pie-graph-legend"]`)
      .eq(0)
      .should('exist');
    cy.get(
      `[data-testid="Petitions Created in YTD ${year}-pie-graph-html-button"]`,
    )
      .eq(0)
      .should('exist');

    cy.get(`[data-testid="Petitions Created in YTD ${year}-pie-graph-div"]`)
      .eq(1)
      .should('exist');
    cy.get(`[data-testid="Petitions Created in YTD ${year}-pie-graph-legend"]`)
      .eq(1)
      .should('exist');
    cy.get(
      `[data-testid="Petitions Created in YTD ${year}-pie-graph-html-button"]`,
    )
      .eq(1)
      .should('exist');

    cy.get(
      '[data-testid="Petitions: Total Petitions by Month-bar-graph-div"]',
    ).should('exist');
    cy.get(
      '[data-testid="Petitions: Total Petitions by Month-bar-graph-legend"]',
    ).should('exist');
    cy.get(
      '[data-testid="Petitions: Total Petitions by Month-bar-graph-html-button"]',
    ).should('exist');

    cy.get('[data-testid="calendar-year-to-date"]').should('exist');
    cy.get('[data-testid="fiscal-year-to-date"]').should('exist');
  });

  it('should display mobile view correctly for cases data', () => {
    cy.viewport('iphone-x');
    loginAsClerkOfCourt();
    cy.get('[data-testid="dashboard-clerk-of-court-mobile-selector"]').select(
      'cases',
    );

    cy.get('[data-testid="open-cases-header"]').should(
      'contain.text',
      'Open Cases:',
    );
    cy.get('[data-testid="cases-closed-header"]').should(
      'contain.text',
      'Cases changed to Closed/Closed - Dismissed:',
    );
    cy.get(
      '[data-testid="Closed/Closed - Dismissed & Changed to On Appeal-bar-graph-div"]',
    ).should('exist');
    cy.get('[data-testid="cases-calendar-year-to-date"]').should('exist');
    cy.get('[data-testid="cases-fiscal-year-to-date"]').should('exist');
  });
});
