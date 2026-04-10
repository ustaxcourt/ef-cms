import {
  calculateISODate,
  createISODateString,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import {
  loginAsCaseServicesSupervisor,
  loginAsCohen,
} from 'cypress/helpers/authentication/login-as-helpers';
import { selectTypeaheadInput } from 'cypress/helpers/components/typeAhead/select-typeahead-input';

describe('Case Services Supervisor edits an ongoing trial session', () => {
  const trialSessionIdWithStartDatePastEndDateFuture =
    '5d5e7707-4f05-4f09-aa8f-7bebba84d96b';
  // const trialSessionIdWithStartDateToday =
  //   'e222f700-dead-4000-beef-0000000d01e5';
  const tomorrowISO = calculateISODate({
    dateString: createISODateString(),
    howMuch: 1,
    units: 'days',
  });

  it('should update estimated end date', () => {
    loginAsCaseServicesSupervisor();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(
      `[data-testid="trial-location-link-${trialSessionIdWithStartDatePastEndDateFuture}"]`,
    ).click();
    cy.get('[data-testid="edit-trial-session"]').click();
    cy.get('[data-testid="estimated-end-date-picker"]').eq(1).clear();
    cy.get('[data-testid="estimated-end-date-picker"]')
      .eq(1)
      .type(formatDateString(tomorrowISO, FORMATS.MMDDYYYY));
    cy.get('[data-testid="submit-edit-trial-session"]').click();
    cy.get('[data-testid="success-alert"]').should('be.visible');
    cy.get('[data-testid="trial-session-date"]').should(
      'contain',
      formatDateString(tomorrowISO, FORMATS.MMDDYY),
    );
  });

  it('should update the court reporter', () => {
    loginAsCaseServicesSupervisor();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(
      `[data-testid="trial-location-link-${trialSessionIdWithStartDatePastEndDateFuture}"]`,
    ).click();
    cy.get('[data-testid="edit-trial-session"]').click();
    cy.get('[data-testid="trial-session-court-reporter"]').clear();
    cy.get('[data-testid="trial-session-court-reporter"]').type(
      'New Court Reporter',
    );
    cy.get('[data-testid="submit-edit-trial-session"]').click();
    cy.get('[data-testid="success-alert"]').should('be.visible');
    cy.get('[data-testid="trial-session-court-reporter"]').should(
      'contain',
      'New Court Reporter',
    );
    loginAsCohen();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(
      `[data-testid="trial-location-link-${trialSessionIdWithStartDatePastEndDateFuture}"]`,
    ).click();
    cy.get('[data-testid="trial-session-court-reporter"]').should(
      'contain',
      'New Court Reporter',
    );
  });

  it.only('should edit calendar administrator information', () => {
    loginAsCaseServicesSupervisor();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(
      `[data-testid="trial-location-link-${trialSessionIdWithStartDatePastEndDateFuture}"]`,
    ).click();
    cy.get('[data-testid="edit-trial-session"]').click();
    selectTypeaheadInput('irs-calendar-administrator-info-search', 'Nero West');
    cy.get('[data-testid="submit-edit-trial-session"]').click();
    cy.get('[data-testid="success-alert"]').should('be.visible');
    cy.get('[data-testid="irs-calendar-admin-info-name"]').should(
      'contain',
      'Nero West',
    );
    cy.get('[data-testid="irs-calendar-admin-info-email"]').should(
      'contain',
      'irspractitioner2@example.com',
    );
    cy.get('[data-testid="irs-calendar-admin-info-phone"]').should(
      'contain',
      '+1 (555) 555-5555',
    );
    cy.get('[data-testid="edit-trial-session"]').click();
    cy.get('[data-testid="irs-calendar-administrator-info-name"]').clear();
    cy.get('[data-testid="irs-calendar-administrator-info-email"]').clear();
    cy.get('[data-testid="irs-calendar-administrator-info-phone"]').clear();
    cy.get('[data-testid="irs-calendar-administrator-info-name"]').type(
      'New Admin',
    );
    cy.get('[data-testid="irs-calendar-administrator-info-email"]').type(
      'newadmin@example.com',
    );
    cy.get('[data-testid="irs-calendar-administrator-info-phone"]').type(
      '123-456-7890',
    );
    cy.get('[data-testid="submit-edit-trial-session"]').click();
    cy.get('[data-testid="success-alert"]').should('be.visible');
    cy.get('[data-testid="irs-calendar-admin-info-name"]').should(
      'contain',
      'New Admin',
    );
    cy.get('[data-testid="irs-calendar-admin-info-email"]').should(
      'contain',
      'newadmin@example.com',
    );
    cy.get('[data-testid="irs-calendar-admin-info-phone"]').should(
      'contain',
      '123-456-7890',
    );
    cy.get('[data-testid="edit-trial-session"]').click();
    cy.get('[data-testid="irs-calendar-administrator-info-phone"]').clear();
    cy.get('[data-testid="irs-calendar-administrator-info-phone"]').type(
      '111-111-1111',
    );
    cy.get('[data-testid="submit-edit-trial-session"]').click();
    cy.get('[data-testid="success-alert"]').should('be.visible');
    cy.get('[data-testid="irs-calendar-admin-info-name"]').should(
      'contain',
      'New Admin',
    );
    cy.get('[data-testid="irs-calendar-admin-info-email"]').should(
      'contain',
      'newadmin@example.com',
    );
    cy.get('[data-testid="irs-calendar-admin-info-phone"]').should(
      'contain',
      '111-111-1111',
    );
    cy.get('[data-testid="edit-trial-session"]').click();
    cy.get('[data-testid="irs-calendar-administrator-info-email"]').clear();
    cy.get('[data-testid="irs-calendar-administrator-info-email"]').type(
      'newnewadmin@example.com',
    );
    cy.get('[data-testid="submit-edit-trial-session"]').click();
    cy.get('[data-testid="success-alert"]').should('be.visible');

    cy.get('[data-testid="irs-calendar-admin-info-name"]').should(
      'contain',
      'New Admin',
    );
    cy.get('[data-testid="irs-calendar-admin-info-email"]').should(
      'contain',
      'newnewadmin@example.com',
    );
    cy.get('[data-testid="irs-calendar-admin-info-phone"]').should(
      'contain',
      '111-111-1111',
    );

    loginAsCohen();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(
      `[data-testid="trial-location-link-${trialSessionIdWithStartDatePastEndDateFuture}"]`,
    ).click();
    cy.get('[data-testid="irs-calendar-admin-info-name"]').should(
      'contain',
      'New Admin',
    );
    cy.get('[data-testid="irs-calendar-admin-info-email"]').should(
      'contain',
      'newnewadmin@example.com',
    );
    cy.get('[data-testid="irs-calendar-admin-info-phone"]').should(
      'contain',
      '111-111-1111',
    );
  });
});
