import {
  FORMATS,
  createDateAtStartOfWeekEST,
  createISODateString,
  formatDateString,
  prepareDateFromString,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { SESSION_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { loginAsClerkOfCourt } from '../../../../helpers/authentication/login-as-helpers';
import { loginAsPetitionsClerk1 } from '../../../../helpers/authentication/login-as-helpers';
import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import {
  createMessage,
  enterSubject,
  fillOutMessageField,
  selectRecipient,
  selectSection,
  sendMessage,
} from '../../../support/pages/document-qc';

describe('Clerk of Court Dashboard', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should display the dashboard with trial sessions and recent messages', () => {
    loginAsClerkOfCourt();

    cy.get('h2:contains("Trial Sessions")').should('exist');
    cy.get('[data-testid="current-week-trial-sessions-card"]').should('exist');
    cy.get('[data-testid="next-week-trial-sessions-card"]').should('exist');
    cy.get('[data-testid="recent-messages-table"]').should('exist');
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
        '[data-testid="current-week-trial-sessions-card"], [data-testid="next-week-trial-sessions-card"]',
      )
        .first()
        .find(
          '[data-testid^="current-week-session-"], [data-testid^="next-week-session-"]',
        )
        .should('have.length.greaterThan', 0);

      cy.get(
        '[data-testid="current-week-trial-sessions-card"], [data-testid="next-week-trial-sessions-card"]',
      )
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
      cy.wait('@getMessages');
      cy.get('[data-testid="recent-messages-table"]').within(() => {
        cy.get('tbody tr').should('have.length.greaterThan', 0);
        cy.contains('Test Message').should('exist');
      });
    });
  });

  it('should navigate to messages page when clicking View All Messages', () => {
    loginAsClerkOfCourt();

    cy.get('a:contains("View All Messages")').click();
    cy.url().should('include', '/messages/my/inbox');
  });

  it('should display mobile view correctly', () => {
    cy.viewport('iphone-x');
    loginAsClerkOfCourt();

    cy.get('[data-testid="current-week-trial-sessions-card"]').should('exist');
    cy.get('[data-testid="next-week-trial-sessions-card"]').should('exist');
    cy.get('[data-testid="recent-messages-table"]').should('exist');
  });
});
