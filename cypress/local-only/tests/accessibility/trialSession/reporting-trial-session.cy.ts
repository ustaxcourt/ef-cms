import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';
import {
  loginAsDocketClerk,
  loginAsPetitionsClerk,
} from '../../../../helpers/authentication/login-as-helpers';
import { checkA11y } from '../../../support/generalCommands/checkA11y';

const openReportingForm = (): void => {
  cy.get('[data-testid="trial-session-link"]').click();
  cy.get('[data-testid="add-trial-session-button"]').click();
  cy.get('[data-testid="Reporting-proceeding-label"]').click();
  cy.get('#due-date-picker').should('be.visible');
};

const createReportingSession = (): Cypress.Chainable<string> => {
  openReportingForm();
  cy.get('#due-date-picker').type('02/10/2099');
  cy.get('[data-testid="session-type-Regular"]').click();
  cy.get('[data-testid="trial-session-number-of-cases-allowed"]').type('10');
  cy.get('[data-testid="trial-session-trial-location"]').select(
    'Birmingham, Alabama',
  );
  cy.intercept('POST', '**/trial-sessions').as('createReporting');
  cy.get('[data-testid="submit-trial-session"]').click();
  return cy.wait('@createReporting').then(({ response }) => {
    expect(response?.statusCode).to.eq(200);
    const trialSessionId: string = response?.body.trialSessionId;
    cy.get('[data-testid="success-alert"]').should('be.visible');
    return cy.wrap(trialSessionId);
  });
};

describe('Reporting Trial Sessions Accessibility', () => {
  let previousFlag: boolean | number | string | null;

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
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

  it('should be free of a11y issues when a petitions clerk creates a Reporting session', () => {
    loginAsPetitionsClerk();
    openReportingForm();
    checkA11y();
  });

  describe('Existing Reporting session', () => {
    beforeEach(() => {
      loginAsPetitionsClerk();
      createReportingSession().as('reportingSessionId');
    });

    it('should be free of a11y issues when a petitions clerk views Reporting details', () => {
      cy.get<string>('@reportingSessionId').then(trialSessionId => {
        cy.get('[data-testid="proceedingType-Reporting"]').click();
        cy.get(`[data-testid="trial-location-link-${trialSessionId}"]`).click();
      });
      cy.contains('p.label', 'Due Date').should('be.visible');
      checkA11y();
    });

    [true, false].forEach(flagEnabled => {
      it(`should be free of a11y issues when a docket clerk edits Reporting with the flag ${flagEnabled ? 'enabled' : 'disabled'}`, () => {
        cy.task('toggleFeatureFlag', {
          flag: ALLOWLIST_FEATURE_FLAGS.REPORTING_CALENDARS.key,
          flagValue: flagEnabled,
        });
        cy.intercept('GET', '**/system/feature-flag/', {
          [ALLOWLIST_FEATURE_FLAGS.REPORTING_CALENDARS.key]: flagEnabled,
        });
        loginAsDocketClerk();
        cy.get('[data-testid="trial-session-link"]').click();
        cy.get('[data-testid="new-trial-sessions-tab"]').click();
        if (flagEnabled) {
          cy.get('[data-testid="proceedingType-Reporting"]').click();
        }
        cy.get<string>('@reportingSessionId').then(trialSessionId => {
          cy.get(
            `[data-testid="trial-location-link-${trialSessionId}"]`,
          ).click();
        });
        cy.get('[data-testid="edit-trial-session"]').click();
        cy.get('#due-date-picker').should('have.value', '02/10/2099');
        checkA11y();
      });
    });
  });
});
