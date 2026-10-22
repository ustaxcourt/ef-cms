import {
  loginAsAdc,
  loginAsAdmissionsClerk,
  loginAsCaseServicesSupervisor,
  loginAsClerkOfCourt,
  loginAsDocketClerk,
  loginAsGeneral,
  loginAsPetitionsClerk,
  loginAsTrialClerk,
} from '../../../../helpers/authentication/login-as-helpers';
import { checkA11y } from '../../../support/generalCommands/checkA11y';

describe('Reporting trial sessions', () => {
  let previousFlag: boolean | number | string | null;

  beforeEach(() => {
    cy.task<boolean | number | string | null>('toggleFeatureFlag', {
      flag: 'reporting-calendars',
      readOnly: true,
    }).then(value => {
      previousFlag = value;
    });
    cy.task('toggleFeatureFlag', {
      flag: 'reporting-calendars',
      flagValue: true,
    });
    // Read the flag on each request so flag tests do not depend on a runner's cache.
    cy.intercept('GET', '**/system/feature-flag/', req => {
      req.continue(res => {
        res.body['reporting-calendars'] = true;
      });
    });
  });

  afterEach(() => {
    cy.task('toggleFeatureFlag', {
      flag: 'reporting-calendars',
      flagValue: previousFlag,
    });
  });

  const creators = [
    { role: 'case services supervisor', login: loginAsCaseServicesSupervisor },
    { role: 'petitions clerk', login: loginAsPetitionsClerk },
    { role: 'docket clerk', login: loginAsDocketClerk },
    { role: 'clerk of court', login: loginAsClerkOfCourt },
    { role: 'trial clerk', login: loginAsTrialClerk },
    { role: 'admissions clerk', login: loginAsAdmissionsClerk },
    { role: 'ADC', login: loginAsAdc },
    { role: 'general', login: loginAsGeneral },
  ];

  creators.forEach(({ role, login }) => {
    it(`${role} can create, view, filter, and edit a Reporting session`, () => {
      login();
      cy.get('[data-testid="trial-session-link"]').click();
      cy.get('[data-testid="add-trial-session-button"]').click();
      cy.get('[data-testid="Reporting-proceeding-label"]').click();
      cy.get('#standaloneRemote-sessionScope').should('be.disabled');
      cy.get('#start-time-hours').should('not.exist');
      cy.get('#trial-clerk').should('not.exist');
      cy.get('#court-reporter').should('not.exist');
      cy.get('#swing-session').should('not.exist');
      cy.get('[data-testid="session-type-Special"]').should('not.exist');
      cy.get('[data-testid="session-type-Motion/Hearing"]').should('not.exist');
      cy.get('#meeting-id').should('not.exist');
      cy.get('[data-testid="trial-session-courthouse-name"]').should(
        'not.exist',
      );
      cy.get('#start-date-picker').type('02/10/2099');
      cy.get('#estimated-end-date-picker').type('02/11/2099');
      cy.get('[data-testid="session-type-Regular"]').click();
      cy.get('[data-testid="trial-session-number-of-cases-allowed"]').type(
        '10',
      );
      cy.get('[data-testid="trial-session-trial-location"]').select(
        'Birmingham, Alabama',
      );
      cy.get('[data-testid="submit-trial-session"]').click();
      cy.contains(
        'End date must be the same as start date for a reporting session',
      ).should('be.visible');
      cy.get('#estimated-end-date-picker').clear();
      cy.get('#estimated-end-date-picker').type('02/10/2099');
      cy.get('#irs-calendar-administrator-info-name').type('Calendar Admin');
      cy.get('#irs-calendar-administrator-info-email').type(
        'calendar@example.com',
      );
      cy.get('#irs-calendar-administrator-info-phone').type('2025550100');
      checkA11y();
      cy.intercept('POST', '**/trial-sessions').as('createReporting');
      cy.get('[data-testid="submit-trial-session"]').click();
      cy.wait('@createReporting').then(({ request, response }) => {
        expect(response?.statusCode).to.eq(200);
        expect(request.body).not.to.have.property('startTime');
      });
      cy.get('[data-testid="success-alert"]').should('be.visible');
      cy.contains('Reporting').should('be.visible');
      cy.contains('Trial clerk').should('not.exist');
      cy.contains('Court reporter').should('not.exist');
      cy.get('[data-testid="edit-trial-session"]').click();
      cy.get('#irs-calendar-administrator-info-name').clear();
      cy.get('#irs-calendar-administrator-info-name').type(
        'Updated Calendar Admin',
      );
      checkA11y();
      cy.get('[data-testid="submit-edit-trial-session"]').click();
      cy.get('[data-testid="success-alert"]').should('be.visible');
      cy.contains('Updated Calendar Admin').should('be.visible');
      cy.get('[data-testid="trial-session-link"]').click();
      cy.get('[data-testid="new-trial-sessions-tab"]').click();
      cy.get('[data-testid="proceedingType-Reporting"]').click();
      cy.get('tr.trial-sessions-row').each(row => {
        cy.wrap(row).should('contain.text', 'Reporting');
      });
      checkA11y();
    });
  });

  it('clears incompatible data when the proceeding type changes', () => {
    loginAsCaseServicesSupervisor();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get('[data-testid="add-trial-session-button"]').click();
    cy.get('[data-testid="In Person-proceeding-label"]').click();
    cy.get('[data-testid="trial-session-address-1-input"]').type(
      '123 Example Street',
    );
    cy.get('[data-testid="Reporting-proceeding-label"]').click();
    cy.get('[data-testid="In Person-proceeding-label"]').click();
    cy.get('[data-testid="trial-session-address-1-input"]').should(
      'have.value',
      '',
    );
  });

  it('hides Reporting creation when the feature flag is disabled', () => {
    cy.intercept('GET', '**/system/feature-flag/', {
      'reporting-calendars': false,
    });
    loginAsCaseServicesSupervisor();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get('[data-testid="add-trial-session-button"]').click();
    cy.get('[data-testid="Reporting-proceeding-label"]').should('not.exist');
  });
});
