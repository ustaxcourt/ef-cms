import { createTrialSession } from '../../../../helpers/trialSession/create-trial-session';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsCaseServicesSupervisor,
  loginAsPetitioner,
  loginAsPetitionsClerk1,
} from '../../../../helpers/authentication/login-as-helpers';

describe('Trial Session - Notice Change of Location', () => {
  it('should generate NCTL for all the cases in a calendared Trial Session', () => {
    loginAsPetitionsClerk1();
    createTrialSession().as('TRIAL_SESSION_INFO');
    cy.get<{ trialSessionId: string }>('@TRIAL_SESSION_INFO').then(
      (trialSessionInfo: { trialSessionId: string }) => {
        cy.get(
          `[data-testid="trial-location-link-${trialSessionInfo.trialSessionId}"]`,
        ).click();

        cy.get('[data-testid="edit-trial-session"]').click();
        cy.get('[data-testid="trial-session-courthouse-name"]').clear();
        cy.get('[data-testid="trial-session-courthouse-name"]').type(
          'Since this is not calendared it should not display modal',
        );
        cy.get('[data-testid="submit-edit-trial-session"]').click();
      },
    );

    cy.get('[data-testid="success-alert"]').should('exist');
    cy.get('[data-testid="success-alert"]').should(
      'contain.text',
      'Trial session updated',
    );

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
    cy.get('[data-testid="trial-session-courthouse-name"]').clear();
    cy.get('[data-testid="trial-session-courthouse-name"]').type(
      'Updated Courthouse Name',
    );
    cy.get('[data-testid="submit-edit-trial-session"]').click();

    cy.get('[data-testid="current-location-info"]').should(
      'contain.text',
      'this is not calendared',
    );
    cy.get('[data-testid="updated-location-info"]').should(
      'contain.text',
      'Updated Courthouse Name',
    );

    cy.get('[data-testid="modal-button-confirm"]').click();

    cy.get<string[]>('@CREATED_DOCKET_NUMBERS').then(
      (docketNumbers: string[]) => {
        for (let index = 0; index < docketNumbers.length; index++) {
          goToCase(docketNumbers[index]);
          cy.get('[data-testid="docket-record-table"] tr')
            .last()
            .as('NCTL_ROW');
          cy.get('@NCTL_ROW').find('td').eq(3).should('contain.text', 'NCTL');
          cy.get('@NCTL_ROW')
            .find('td')
            .eq(5)
            .should('contain.text', 'Notice of Change of Trial Location');
          cy.get('@NCTL_ROW').find('td').eq(6).should('contain.text', '1');
          cy.get('[data-testid="document-viewer-link-NCTL"]').click();
        }
      },
    );
  });
});
