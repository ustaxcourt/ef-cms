import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';
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
      flag: ALLOWLIST_FEATURE_FLAGS.REPORTING_CALENDARS.key,
      readOnly: true,
    }).then(value => {
      previousFlag = value;
    });
    cy.task('toggleFeatureFlag', {
      flag: ALLOWLIST_FEATURE_FLAGS.REPORTING_CALENDARS.key,
      flagValue: true,
    });
    cy.intercept('GET', '**/system/feature-flag/', req => {
      req.continue(res => {
        res.body[ALLOWLIST_FEATURE_FLAGS.REPORTING_CALENDARS.key] = true;
      });
    });
  });

  afterEach(() => {
    cy.task('toggleFeatureFlag', {
      flag: ALLOWLIST_FEATURE_FLAGS.REPORTING_CALENDARS.key,
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
    it(`should allow ${role} to create, view, filter, and edit a Reporting session`, () => {
      login();
      cy.get('[data-testid="trial-session-link"]').click();
      cy.get('[data-testid="add-trial-session-button"]').click();
      cy.get('[data-testid="Reporting-proceeding-label"]').click();
      cy.get('#standaloneRemote-sessionScope').should('not.exist');
      cy.get('#locationBased-sessionScope').should('be.checked');
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
      cy.get('#start-date-picker').should('not.exist');
      cy.get('#estimated-end-date-picker').should('not.exist');
      cy.contains('label', 'Due date').should('be.visible');
      cy.get('[data-testid="session-type-Regular"]').click();
      cy.get('[data-testid="trial-session-number-of-cases-allowed"]').type(
        '10',
      );
      cy.get('[data-testid="trial-session-trial-location"]').select(
        'Birmingham, Alabama',
      );
      cy.get('[data-testid="submit-trial-session"]').click();
      cy.contains('Enter a valid due date').should('be.visible');
      cy.get('#due-date-picker').type('02/10/2099');
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
        expect(request.body.startDate).to.eq('2099-02-10T00:00:00.000-05:00');
        expect(request.body.estimatedEndDate).to.eq(request.body.startDate);
        expect(response?.body).to.have.property('trialSessionId');
        const trialSessionId = response?.body.trialSessionId;

        cy.get('[data-testid="success-alert"]').should('be.visible');
        cy.location('pathname').should('eq', '/trial-sessions');
        cy.get('[data-testid="proceedingType-Reporting"]').click();
        cy.get('#proceedingType-Reporting').should('be.checked');
        cy.get(`[data-testid="trial-sessions-row-${trialSessionId}"]`).should(
          'contain.text',
          'Reporting',
        );
        cy.get(`[data-testid="trial-location-link-${trialSessionId}"]`).click();
        cy.location('pathname').should(
          'eq',
          `/trial-session-detail/${trialSessionId}`,
        );
      });
      cy.contains('Reporting').should('be.visible');
      cy.get('#case-title').should('have.text', '02/10/99');
      cy.get('[data-testid="trial-session-date"]')
        .invoke('text')
        .then(text => {
          expect(text.trim()).to.eq('02/10/99');
        });
      checkA11y();
      cy.contains('Trial clerk').should('not.exist');
      cy.contains('Court reporter').should('not.exist');
      cy.get('[data-testid="edit-trial-session"]').click();
      cy.get('#due-date-picker').should('have.value', '02/10/2099').clear();
      cy.get('#due-date-picker').type('02/11/2099');
      cy.get('#estimated-end-date-picker').should('not.exist');
      cy.get('#irs-calendar-administrator-info-name').clear();
      cy.get('#irs-calendar-administrator-info-name').type(
        'Updated Calendar Admin',
      );
      checkA11y();
      cy.intercept('PUT', '**/async/trial-sessions').as('editReporting');
      cy.get('[data-testid="submit-edit-trial-session"]').click();
      cy.wait('@editReporting').then(({ request }) => {
        expect(request.body.trialSession.startDate).to.eq(
          '2099-02-11T00:00:00.000-05:00',
        );
        expect(request.body.trialSession.estimatedEndDate).to.eq(
          request.body.trialSession.startDate,
        );
      });
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

  it('should clear incompatible data when the proceeding type changes', () => {
    loginAsCaseServicesSupervisor();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get('[data-testid="add-trial-session-button"]').click();
    cy.get('[data-testid="In Person-proceeding-label"]').click();
    cy.get('[data-testid="trial-session-address-1-input"]').type(
      '123 Example Street',
    );
    cy.get('[data-testid="Reporting-proceeding-label"]').click();
    cy.get('[data-testid="In Person-proceeding-label"]').click();
    cy.get('#standaloneRemote-sessionScope').should('be.visible');
    cy.get('[data-testid="trial-session-address-1-input"]').should(
      'have.value',
      '',
    );
  });

  it('should hide Reporting creation when the feature flag is disabled', () => {
    cy.intercept('GET', '**/system/feature-flag/', {
      [ALLOWLIST_FEATURE_FLAGS.REPORTING_CALENDARS.key]: false,
    });
    loginAsCaseServicesSupervisor();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get('[data-testid="proceedingType-Reporting"]').should('not.exist');
    cy.get('[data-testid="add-trial-session-button"]').click();
    cy.get('[data-testid="Reporting-proceeding-label"]').should('not.exist');
  });
});
