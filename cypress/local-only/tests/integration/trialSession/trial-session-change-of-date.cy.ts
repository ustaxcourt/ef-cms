import { createTrialSession } from '../../../../helpers/trialSession/create-trial-session';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsCaseServicesSupervisor,
  loginAsPetitioner,
  loginAsPetitionsClerk1,
} from '../../../../helpers/authentication/login-as-helpers';

describe('Trial Session - Notice Change of Date', () => {
  it('should generate NCTD for all the cases in a calendared Trial Session', () => {
    loginAsPetitionsClerk1();
    createTrialSession().as('TRIAL_SESSION_INFO');
    cy.get<{ trialSessionId: string }>('@TRIAL_SESSION_INFO').then(
      (trialSessionInfo: { trialSessionId: string }) => {
        cy.get(
          `[data-testid="trial-location-link-${trialSessionInfo.trialSessionId}"]`,
        ).click();

        cy.get('[data-testid="edit-trial-session"]').click();
        cy.get('[data-testid="start-date-picker"]').eq(1).clear();
        cy.get('[data-testid="start-date-picker"]').eq(1).type('01/01/2050');
        cy.get('[data-testid="submit-edit-trial-session"]').click();
      },
    );

    cy.get('[data-testid="success-alert"]')
      .should('exist')
      .and('contain.text', 'Trial session updated');

    cy.get('[data-testid="set-calendar-button"]').click();
    cy.get('[data-testid="modal-button-confirm"]').click();

    const createdDocketNumbers: string[] = [];
    for (let index = 0; index < 3; index++) {
      loginAsPetitioner();
      externalUserCreatesElectronicCase().then(docketNumber => {
        loginAsCaseServicesSupervisor();
        goToCase(docketNumber);
        createdDocketNumbers.push(docketNumber);
        cy.wrap(createdDocketNumbers).as('CREATED_DOCKET_NUMBERS');
      });

      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="add-to-trial-session-btn"]').click();
      cy.get('[data-testid="all-locations-option"]').click();
      cy.get<{ trialSessionId: string }>('@TRIAL_SESSION_INFO').then(
        ({ trialSessionId }) => {
          cy.get('[data-testid="trial-session-select"]').select(trialSessionId);
        },
      );
      cy.get('[data-testid="modal-button-confirm"]').click();
    }

    cy.get('[data-testid="trial-session-location-link"]').click();
    cy.get('[data-testid="edit-trial-session"]').click();
    cy.get('[data-testid="start-date-picker"]').eq(1).clear();
    cy.get('[data-testid="start-date-picker"]').eq(1).type('02/01/2050');
    cy.get('[data-testid="submit-edit-trial-session"]').click();

    cy.get('[data-testid="current-start-date-info"]').should(
      'contain.text',
      '01/01/2050',
    );
    cy.get('[data-testid="updated-start-date-info"]').should(
      'contain.text',
      '02/01/2050',
    );

    cy.get('[data-testid="modal-button-confirm"]').click();

    cy.get<string[]>('@CREATED_DOCKET_NUMBERS').then(
      (docketNumbers: string[]) => {
        for (let index = 0; index < docketNumbers.length; index++) {
          goToCase(docketNumbers[index]);
          cy.get('[data-testid="docket-record-table"] tr')
            .last()
            .as('NCTD_ROW');
          cy.get('@NCTD_ROW').find('td').eq(3).should('contain.text', 'NOT');
          cy.get('@NCTD_ROW')
            .find('td')
            .eq(5)
            .should('contain.text', 'Notice of Change of Trial Date');
          cy.get('@NCTD_ROW').find('td').eq(6).should('contain.text', '1');
          cy.get('@NCTD_ROW')
            .get('[data-testid="document-viewer-link-NOT"]')
            .click();
        }
      },
    );
  });

  it('should show Change of Date and Change of Location modals when both start date and location are changed', () => {
    loginAsPetitionsClerk1();
    createTrialSession().as('TRIAL_SESSION_INFO');
    cy.get<{ trialSessionId: string }>('@TRIAL_SESSION_INFO').then(
      (trialSessionInfo: { trialSessionId: string }) => {
        cy.get(
          `[data-testid="trial-location-link-${trialSessionInfo.trialSessionId}"]`,
        ).click();

        cy.get('[data-testid="edit-trial-session"]').click();
        cy.get('[data-testid="start-date-picker"]').eq(1).clear();
        cy.get('[data-testid="start-date-picker"]').eq(1).type('01/01/2050');
        cy.get('[data-testid="trial-session-courthouse-name"]').clear();
        cy.get('[data-testid="trial-session-courthouse-name"]').type(
          'Current Courthouse',
        );
        cy.get('[data-testid="submit-edit-trial-session"]').click();
      },
    );

    cy.get('[data-testid="success-alert"]')
      .should('exist')
      .and('contain.text', 'Trial session updated');

    cy.get('[data-testid="set-calendar-button"]').click();
    cy.get('[data-testid="modal-button-confirm"]').click();

    let createdDocketNumber: string;
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      loginAsCaseServicesSupervisor();
      goToCase(docketNumber);
      createdDocketNumber = docketNumber;
      cy.wrap(createdDocketNumber).as('CREATED_DOCKET_NUMBER');
    });

    cy.get('[data-testid="tab-case-information"]').click();
    cy.get('[data-testid="add-to-trial-session-btn"]').click();
    cy.get('[data-testid="all-locations-option"]').click();
    cy.get<{ trialSessionId: string }>('@TRIAL_SESSION_INFO').then(
      ({ trialSessionId }) => {
        cy.get('[data-testid="trial-session-select"]').select(trialSessionId);
      },
    );
    cy.get('[data-testid="modal-button-confirm"]').click();

    cy.get('[data-testid="trial-session-location-link"]').click();
    cy.get('[data-testid="edit-trial-session"]').click();
    cy.get('[data-testid="start-date-picker"]').eq(1).clear();
    cy.get('[data-testid="start-date-picker"]').eq(1).type('02/01/2050');
    cy.get('[data-testid="trial-session-courthouse-name"]').clear();
    cy.get('[data-testid="trial-session-courthouse-name"]').type(
      'Updated Courthouse',
    );
    cy.get('[data-testid="submit-edit-trial-session"]').click();

    cy.get('[data-testid="current-start-date-info"]').should(
      'contain.text',
      '01/01/2050',
    );
    cy.get('[data-testid="updated-start-date-info"]').should(
      'contain.text',
      '02/01/2050',
    );

    cy.get('[data-testid="modal-button-confirm"]').click();

    cy.get('[data-testid="current-location-info"]').should(
      'contain.text',
      'Current Courthouse',
    );
    cy.get('[data-testid="updated-location-info"]').should(
      'contain.text',
      'Updated Courthouse',
    );

    cy.get('[data-testid="modal-button-confirm"]').click();

    cy.get<string>('@CREATED_DOCKET_NUMBER').then((docketNumber: string) => {
      goToCase(docketNumber);
      cy.get('[data-testid="docket-record-table"] tr').eq(-2).as('NCTL_ROW');
      cy.get('@NCTL_ROW').find('td').eq(3).should('contain.text', 'NCTL');
      cy.get('@NCTL_ROW')
        .find('td')
        .eq(5)
        .should('contain.text', 'Notice of Change of Trial Location');
      cy.get('@NCTL_ROW').find('td').eq(6).should('contain.text', '1');
      cy.get('[data-testid="docket-record-table"] tr').last().as('NCTD_ROW');
      cy.get('@NCTD_ROW').find('td').eq(3).should('contain.text', 'NOT');
      cy.get('@NCTD_ROW')
        .find('td')
        .eq(5)
        .should('contain.text', 'Notice of Change of Trial Date');
      cy.get('@NCTD_ROW').find('td').eq(6).should('contain.text', '1');
      cy.get('@NCTD_ROW')
        .get('[data-testid="document-viewer-link-NOT"]')
        .click();
    });
  });

  it('should not show date change modal if date is restored to the original value after initial change', () => {
    loginAsPetitionsClerk1();
    createTrialSession().as('TRIAL_SESSION_INFO');
    cy.get<{ trialSessionId: string }>('@TRIAL_SESSION_INFO').then(
      (trialSessionInfo: { trialSessionId: string }) => {
        cy.get(
          `[data-testid="trial-location-link-${trialSessionInfo.trialSessionId}"]`,
        ).click();

        cy.get('[data-testid="edit-trial-session"]').click();
        cy.get('[data-testid="start-date-picker"]').eq(1).clear();
        cy.get('[data-testid="start-date-picker"]').eq(1).type('01/01/2050');
        cy.get('[data-testid="trial-session-courthouse-name"]').clear();
        cy.get('[data-testid="trial-session-courthouse-name"]').type(
          'Current Courthouse',
        );
        cy.get('[data-testid="submit-edit-trial-session"]').click();
      },
    );

    cy.get('[data-testid="success-alert"]')
      .should('exist')
      .and('contain.text', 'Trial session updated');

    cy.get('[data-testid="set-calendar-button"]').click();
    cy.get('[data-testid="modal-button-confirm"]').click();

    let createdDocketNumber: string;
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      loginAsCaseServicesSupervisor();
      goToCase(docketNumber);
      createdDocketNumber = docketNumber;
      cy.wrap(createdDocketNumber).as('CREATED_DOCKET_NUMBER');
    });

    cy.get('[data-testid="tab-case-information"]').click();
    cy.get('[data-testid="add-to-trial-session-btn"]').click();
    cy.get('[data-testid="all-locations-option"]').click();
    cy.get<{ trialSessionId: string }>('@TRIAL_SESSION_INFO').then(
      ({ trialSessionId }) => {
        cy.get('[data-testid="trial-session-select"]').select(trialSessionId);
      },
    );
    cy.get('[data-testid="modal-button-confirm"]').click();

    cy.get('[data-testid="trial-session-location-link"]').click();
    cy.get('[data-testid="edit-trial-session"]').click();

    cy.get('[data-testid="start-date-picker"]').eq(1).as('START_DATE_PICKER');

    cy.get('@START_DATE_PICKER').clear();
    cy.get('@START_DATE_PICKER').type('02/01/2050');
    cy.get('[data-testid="trial-session-courthouse-name"]').clear();
    cy.get('[data-testid="trial-session-courthouse-name"]').type(
      'Updated Courthouse',
    );
    cy.get('[data-testid="submit-edit-trial-session"]').click();
    cy.get('[data-testid="modal-button-cancel"]').click();
    cy.get('@START_DATE_PICKER').clear();
    cy.get('@START_DATE_PICKER').type('01/01/2050');
    cy.get('[data-testid="submit-edit-trial-session"]').click();
    cy.get('[data-testid="current-location-info"]').should(
      'contain.text',
      'Current Courthouse',
    );
    cy.get('[data-testid="updated-location-info"]').should(
      'contain.text',
      'Updated Courthouse',
    );
    cy.get('[data-testid="modal-button-confirm"]').click();
    cy.get('[data-testid="success-alert"]')
      .should('exist')
      .and('contain.text', 'Trial session updated');
  });

  it('should not show location change modal if location is restored to the original value after initial change', () => {
    loginAsPetitionsClerk1();
    createTrialSession().as('TRIAL_SESSION_INFO');
    cy.get<{ trialSessionId: string }>('@TRIAL_SESSION_INFO').then(
      (trialSessionInfo: { trialSessionId: string }) => {
        cy.get(
          `[data-testid="trial-location-link-${trialSessionInfo.trialSessionId}"]`,
        ).click();

        cy.get('[data-testid="edit-trial-session"]').click();
        cy.get('[data-testid="start-date-picker"]').eq(1).clear();
        cy.get('[data-testid="start-date-picker"]').eq(1).type('01/01/2050');
        cy.get('[data-testid="trial-session-courthouse-name"]').clear();
        cy.get('[data-testid="trial-session-courthouse-name"]').type(
          'Current Courthouse',
        );
        cy.get('[data-testid="submit-edit-trial-session"]').click();
      },
    );

    cy.get('[data-testid="success-alert"]')
      .should('exist')
      .and('contain.text', 'Trial session updated');

    cy.get('[data-testid="set-calendar-button"]').click();
    cy.get('[data-testid="modal-button-confirm"]').click();

    let createdDocketNumber: string;
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      loginAsCaseServicesSupervisor();
      goToCase(docketNumber);
      createdDocketNumber = docketNumber;
      cy.wrap(createdDocketNumber).as('CREATED_DOCKET_NUMBER');
    });

    cy.get('[data-testid="tab-case-information"]').click();
    cy.get('[data-testid="add-to-trial-session-btn"]').click();
    cy.get('[data-testid="all-locations-option"]').click();
    cy.get<{ trialSessionId: string }>('@TRIAL_SESSION_INFO').then(
      ({ trialSessionId }) => {
        cy.get('[data-testid="trial-session-select"]').select(trialSessionId);
      },
    );
    cy.get('[data-testid="modal-button-confirm"]').click();

    cy.get('[data-testid="trial-session-location-link"]').click();
    cy.get('[data-testid="edit-trial-session"]').click();

    cy.get('[data-testid="trial-session-courthouse-name"]').as(
      'COURTHOUSE_NAME_INPUT',
    );

    cy.get('[data-testid="start-date-picker"]').eq(1).clear();
    cy.get('[data-testid="start-date-picker"]').eq(1).type('02/01/2050');
    cy.get('@COURTHOUSE_NAME_INPUT').clear();
    cy.get('@COURTHOUSE_NAME_INPUT').type('Updated Courthouse');
    cy.get('[data-testid="submit-edit-trial-session"]').click();
    cy.get('[data-testid="modal-button-confirm"]').click();
    cy.get('[data-testid="modal-button-cancel"]').click();
    cy.get('@COURTHOUSE_NAME_INPUT').clear();
    cy.get('@COURTHOUSE_NAME_INPUT').type('Current Courthouse');
    cy.get('[data-testid="submit-edit-trial-session"]').click();
    cy.get('[data-testid="current-start-date-info"]').should(
      'contain.text',
      '01/01/2050',
    );
    cy.get('[data-testid="updated-start-date-info"]').should(
      'contain.text',
      '02/01/2050',
    );
    cy.get('[data-testid="modal-button-confirm"]').click();
    cy.get('[data-testid="success-alert"]')
      .should('exist')
      .and('contain.text', 'Trial session updated');
  });
});
