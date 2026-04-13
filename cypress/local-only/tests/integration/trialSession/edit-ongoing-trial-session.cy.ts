import {
  calculateISODate,
  createISODateString,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import {
  loginAsCaseServicesSupervisor,
  loginAsCohen,
  loginAsCohenChambers,
  loginAsDocketClerk,
  loginAsPetitionsClerk,
} from 'cypress/helpers/authentication/login-as-helpers';
import { selectTypeaheadInput } from 'cypress/helpers/components/typeAhead/select-typeahead-input';

describe('Case Services Supervisor edits an ongoing trial session', () => {
  const trialSessionIdWithStartDatePastEndDateFuture =
    '5d5e7707-4f05-4f09-aa8f-7bebba84d96b';
  const trialSessionIdWithStartDateToday =
    'e222f700-dead-4000-beef-0000000d01e5';
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

  it('should not allow non case services supervisor roles to edit ongoing trial sessions', () => {
    loginAsDocketClerk();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(
      `[data-testid="trial-location-link-${trialSessionIdWithStartDatePastEndDateFuture}"]`,
    ).click();
    cy.get('[data-testid="edit-trial-session"]').should('not.exist');
    loginAsPetitionsClerk();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(
      `[data-testid="trial-location-link-${trialSessionIdWithStartDatePastEndDateFuture}"]`,
    ).click();
    cy.get('[data-testid="edit-trial-session"]').should('not.exist');
  });

  it('should not allow editing certain fields when the start date is past', () => {
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
    cy.get('[data-testid="edit-trial-session"]').click();
    cy.get('[name="start-date-date-picker"]').should('be.disabled');
    cy.get('[name="startTimeHours"]').should('be.disabled');
    cy.get('[name="startTimeMinutes"]').should('be.disabled');
    cy.get('[data-testid="session-type-options"]').click();
    cy.get('[data-testid="trial-session-trial-location"]').should(
      'be.disabled',
    );
    cy.get('[data-testid="trial-session-courthouse-name"]').should(
      'be.disabled',
    );
    cy.get('[data-testid="trial-session-address-1-input"]').should(
      'be.disabled',
    );
    cy.get('[name="address2"]').should('be.disabled');
    cy.get('[data-testid="trial-session-city-input"]').should('be.disabled');
    cy.get('[data-testid="trial-session-state-select"]').should('be.disabled');
    cy.get('[data-testid="trial-session-postal-code-input"]').should(
      'be.disabled',
    );
    cy.get('[data-testid="edit-trial-session-chambers-phone-number"]').should(
      'be.disabled',
    );
    cy.get('[data-testid="trial-session-judge"]').should('be.disabled');
    cy.get('[name="notes"]').should('be.disabled');
    cy.get('[data-testid="submit-edit-trial-session"]').click();
    cy.get('[data-testid="success-alert"]').should('be.visible');
  });

  it('should update trial sessions when starts today', () => {
    loginAsCaseServicesSupervisor();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(
      `[data-testid="trial-location-link-${trialSessionIdWithStartDateToday}"]`,
    ).click();
    cy.get('[data-testid="edit-trial-session"]').click();
    cy.get('[data-testid="estimated-end-date-picker"]').eq(1).clear();
    cy.get('[data-testid="estimated-end-date-picker"]')
      .eq(1)
      .type(formatDateString(tomorrowISO, FORMATS.MMDDYYYY));
    cy.get('[data-testid="trial-session-court-reporter"]').clear();
    cy.get('[data-testid="trial-session-court-reporter"]').type(
      'New Court Reporter',
    );
    selectTypeaheadInput('irs-calendar-administrator-info-search', 'Nero West');

    cy.get('[data-testid="submit-edit-trial-session"]').click();
    cy.get('[data-testid="success-alert"]').should('be.visible');

    cy.get('[data-testid="trial-session-date"]').should(
      'contain',
      formatDateString(tomorrowISO, FORMATS.MMDDYY),
    );
    cy.get('[data-testid="trial-session-court-reporter"]').should(
      'contain',
      'New Court Reporter',
    );
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

  it('should edit calendar administrator information', () => {
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

  it('should update trial clerk', () => {
    loginAsCaseServicesSupervisor();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(
      `[data-testid="trial-location-link-${trialSessionIdWithStartDatePastEndDateFuture}"]`,
    ).click();
    cy.get('[data-testid="edit-trial-session"]').click();
    cy.get('[data-testid="trial-session-trial-clerk"]').select(
      'Test trialclerk1',
    );
    cy.get('[data-testid="submit-edit-trial-session"]').click();
    cy.get('[data-testid="success-alert"]').should('be.visible');
    cy.get('[data-testid="assignments-sessions-trial-clerk"]').contains(
      'Test trialclerk1',
    );
    cy.get('[data-testid="edit-trial-session"]').click();
    cy.get('[data-testid="trial-session-trial-clerk"]').select('Other');
    cy.get('[data-testid="trial-session-trial-clerk-alternate"]').type('Abu');
    cy.get('[data-testid="submit-edit-trial-session"]').click();
    cy.get('[data-testid="success-alert"]').should('be.visible');
    cy.get('[data-testid="assignments-sessions-trial-clerk"]').contains('Abu');
    loginAsCohen();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(
      `[data-testid="trial-location-link-${trialSessionIdWithStartDatePastEndDateFuture}"]`,
    ).click();
    cy.get('[data-testid="assignments-sessions-trial-clerk"]').contains('Abu');
  });

  it('should not let trial session update minute sheets if minute sheets have already been opened', () => {
    loginAsCohenChambers();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(
      `[data-testid="trial-location-link-${trialSessionIdWithStartDatePastEndDateFuture}"]`,
    ).click();
    cy.then(() => {
      if (
        cy.get(
          `[href="/trial-session-detail/${trialSessionIdWithStartDatePastEndDateFuture}"]`,
        )
      ) {
        cy.get(
          `[href="/trial-session-detail/${trialSessionIdWithStartDatePastEndDateFuture}"]`,
        ).click();
      }
    });
    cy.get('[data-testid="minute-sheet-button-103-20"]')
      .invoke('removeAttr', 'target')
      .click();
    cy.get(
      '[data-testid="trial-session-metadata-fieldset-trial-clerk"]',
    ).clear();
    cy.get('[data-testid="trial-session-metadata-fieldset-trial-clerk"]').type(
      'Trial Clerk James May',
    );
    cy.get('[data-testid="courtReporter"]').clear();
    cy.get('[data-testid="courtReporter"]').type('Trial Clerk Jeremy Clarkson');
    cy.get('[data-testid="save-to-drafts-button-top"]').click();

    loginAsCaseServicesSupervisor();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(
      `[data-testid="trial-location-link-${trialSessionIdWithStartDatePastEndDateFuture}"]`,
    ).click();
    cy.get('[data-testid="edit-trial-session"]').click();
    cy.get('[data-testid="trial-session-trial-clerk"]').select(
      'Test trialclerk1',
    );
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
    cy.get('[data-testid="assignments-sessions-trial-clerk"]').contains(
      'Test trialclerk1',
    );
    loginAsCohenChambers();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(
      `[data-testid="trial-location-link-${trialSessionIdWithStartDatePastEndDateFuture}"]`,
    ).click();
    cy.then(() => {
      if (
        cy.get(
          `[href="/trial-session-detail/${trialSessionIdWithStartDatePastEndDateFuture}"]`,
        )
      ) {
        cy.get(
          `[href="/trial-session-detail/${trialSessionIdWithStartDatePastEndDateFuture}"]`,
        ).click();
      }
    });
    cy.get('[data-testid="minute-sheet-button-103-20"]')
      .invoke('removeAttr', 'target')
      .click();
    cy.get(
      '[data-testid="trial-session-metadata-fieldset-trial-clerk"]',
    ).should('contain.value', 'Trial Clerk James May');
    cy.get('[data-testid="courtReporter"]').should(
      'contain.value',
      'Trial Clerk Jeremy Clarkson',
    );
  });

  it.only('should auto populate minute sheets if not already been opened', () => {
    loginAsCaseServicesSupervisor();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(
      `[data-testid="trial-location-link-${trialSessionIdWithStartDatePastEndDateFuture}"]`,
    ).click();
    cy.get('[data-testid="edit-trial-session"]').click();
    cy.get('[data-testid="trial-session-trial-clerk"]').select(
      'Test trialclerk1',
    );
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
    cy.get('[data-testid="assignments-sessions-trial-clerk"]').contains(
      'Test trialclerk1',
    );
    loginAsCohenChambers();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(
      `[data-testid="trial-location-link-${trialSessionIdWithStartDatePastEndDateFuture}"]`,
    ).click();
    cy.then(() => {
      if (
        cy.get(
          `[href="/trial-session-detail/${trialSessionIdWithStartDatePastEndDateFuture}"]`,
        )
      ) {
        cy.get(
          `[href="/trial-session-detail/${trialSessionIdWithStartDatePastEndDateFuture}"]`,
        ).click();
      }
    });
    cy.get('[data-testid="minute-sheet-button-101-21"]')
      .invoke('removeAttr', 'target')
      .click();
    cy.get(
      '[data-testid="trial-session-metadata-fieldset-trial-clerk"]',
    ).should('contain.value', 'Test trialclerk1');
    cy.get('[data-testid="courtReporter"]').should(
      'contain.value',
      'New Court Reporter',
    );
  });
});
