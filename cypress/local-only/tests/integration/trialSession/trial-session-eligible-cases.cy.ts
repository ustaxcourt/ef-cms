import {
  loginAsDocketClerk,
  loginAsPetitionsClerk1,
} from '../../../../helpers/authentication/login-as-helpers';
import { createTrialSession } from '../../../../helpers/trialSession/create-trial-session';
import { calendarTrialSession } from '../../../../helpers/trialSession/calendar-trial-session';
import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { updateCaseStatus } from '../../../../helpers/caseDetail/caseInformation/update-case-status';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
} from '@shared/business/entities/EntityConstants';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';

describe('Trial Session Eligible Cases Journey', () => {
  const trialLocation = `Phoenix, Arizona`;
  let trialSessionId: string;
  const createdDocketNumbers: string[] = [];

  it('should create trial session and cases, then verify eligible cases are properly assigned', () => {
    loginAsPetitionsClerk1();
    createTrialSession({
      trialLocation,
      sessionType: SESSION_TYPES.small,
      startDate: '12/12/2099',
      endDate: '12/13/2099',
      judge: 'Cohen',
      maxCases: '3',
    }).then(({ trialSessionId: createdTrialSessionId }) => {
      trialSessionId = createdTrialSessionId;
    });

    createAndServePaperPetition({
      procedureType: 'Small',
      trialLocation,
      caseType: 'Passport',
      yearReceived: '2019',
      includeApwDocument: false,
    })
      .then(({ docketNumber }) => {
        createdDocketNumbers.push(docketNumber);

        loginAsDocketClerk();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
        return createAndServePaperPetition({
          procedureType: 'Small',
          trialLocation,
          yearReceived: '2019',
          caseType: 'Other',
          includeApwDocument: false,
        });
      })
      .then(({ docketNumber }) => {
        createdDocketNumbers.push(docketNumber);

        loginAsDocketClerk();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
        return createAndServePaperPetition({
          procedureType: 'Regular',
          trialLocation,
          yearReceived: '2019',
          includeApwDocument: false,
        });
      })
      .then(({ docketNumber }) => {
        createdDocketNumbers.push(docketNumber);

        loginAsDocketClerk();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
        return createAndServePaperPetition({
          procedureType: 'Small',
          trialLocation,
          caseType: 'CDP (Lien/Levy)',
          yearReceived: '2019',
          includeApwDocument: false,
        });
      })
      .then(({ docketNumber }) => {
        createdDocketNumbers.push(docketNumber);

        loginAsDocketClerk();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
        return createAndServePaperPetition({
          procedureType: 'Small',
          trialLocation,
          caseType: 'Passport',
          yearReceived: '2019',
          includeApwDocument: false,
        });
      })
      .then(({ docketNumber }) => {
        createdDocketNumbers.push(docketNumber);
        loginAsDocketClerk();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
      });

    cy.then(() => {
      loginAsPetitionsClerk1();

      cy.visit(`/trial-session-detail/${trialSessionId}`);

      cy.get('table#upcoming-sessions').within(() => {
        cy.get('tr').should('contain', createdDocketNumbers[3]); // Case #4
        cy.get('tr').should('contain', createdDocketNumbers[4]); // Case #5
        cy.get('tr').should('contain', createdDocketNumbers[0]); // Case #1
        cy.get('tr').should('contain', createdDocketNumbers[1]); // Case #2
      });
    });

    cy.then(() => {
      loginAsPetitionsClerk1();

      cy.visit(`/trial-session-detail/${trialSessionId}`);

      cy.get('table#upcoming-sessions');

      cy.get(`label[for="qc-complete-${createdDocketNumbers[3]}"]`).click();
      cy.get(`label[for="qc-complete-${createdDocketNumbers[4]}"]`).click();
      cy.get(`label[for="qc-complete-${createdDocketNumbers[0]}"]`).click();
      cy.get(`label[for="qc-complete-${createdDocketNumbers[1]}"]`).click();
    });

    cy.then(() => {
      calendarTrialSession(trialSessionId);
      cy.get('[data-testid^="warning-alert"]').should('exist');
    });

    cy.then(() => {
      loginAsPetitionsClerk1();
      cy.visit(`/trial-session-detail/${trialSessionId}`);

      cy.get('table#open-cases').within(() => {
        cy.get('tr').should('contain', createdDocketNumbers[0]);
        cy.get('tr').should('contain', createdDocketNumbers[3]);
        cy.get('tr').should('contain', createdDocketNumbers[4]);
      });
    });

    cy.then(() => {
      goToCase(createdDocketNumbers[0]);
      cy.get('[data-testid="case-status"]').should('be.visible');
      cy.get('[data-testid="case-status"]').should(
        'contain',
        CASE_STATUS_TYPES.calendared,
      );
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="trial-session-location-link"]')
        .should('be.visible')
        .and('contain', trialLocation);

      // Case #2 - should NOT be calendared
      goToCase(createdDocketNumbers[3]);
      cy.get('[data-testid="case-status"]').should(
        'contain',
        CASE_STATUS_TYPES.calendared,
      );
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="trial-session-location-link"]').should(
        'contain',
        trialLocation,
      );

      // Case #3 - should NOT be calendared
      goToCase(createdDocketNumbers[4]);
      cy.get('[data-testid="case-status"]').should(
        'contain',
        CASE_STATUS_TYPES.calendared,
      );
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="trial-session-location-link"]').should(
        'contain',
        trialLocation,
      );

      // Case #4 - should be calendared
      goToCase(createdDocketNumbers[1]);
      cy.get('[data-testid="case-status"]').should(
        'contain',
        CASE_STATUS_TYPES.generalDocketReadyForTrial,
      );

      // Case #5 - should be calendared
      goToCase(createdDocketNumbers[2]);
      cy.get('[data-testid="case-status"]').should(
        'contain',
        CASE_STATUS_TYPES.generalDocketReadyForTrial,
      );
    });

    // // Step 12: Test removing and re-adding a case from trial session
    cy.then(() => {
      goToCase(createdDocketNumbers[0]);

      // Remove case from trial session
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('#edit-case-trial-information-btn').click();
      cy.get('#remove-from-trial-session-btn').click();
      cy.get(
        '[data-testid="remove-from-trial-session-disposition-textarea"]',
      ).type('testing');
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid^="success-alert"]').should('exist');

      // Verify case is no longer calendared
      cy.get('[data-testid="case-status"]').should(
        'not.contain',
        CASE_STATUS_TYPES.calendared,
      );

      // Add case back to trial session
      cy.get('[data-testid="add-to-trial-session-btn"]').click();
      cy.get('[data-testid="trial-session-select"]').select(trialSessionId);
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="success-alert"]').should('exist');

      // Verify case is calendared again
      cy.get('[data-testid="case-status"]').should(
        'contain',
        CASE_STATUS_TYPES.calendared,
      );
    });
  });

  it('should create trial session and cases, then verify eligible cases granted remote motion have an indicator', () => {
    const date = formatNow(FORMATS.MMDDYYYY)

    loginAsPetitionsClerk1();
    createTrialSession({
      trialLocation,
      sessionType: SESSION_TYPES.small,
      startDate: '12/12/2099',
      endDate: '12/13/2099',
      judge: 'Cohen',
      maxCases: '3',
    }).then(({ trialSessionId: createdTrialSessionId }) => {
      trialSessionId = createdTrialSessionId;
      cy.wrap(trialSessionId).as('trialSessionId');
    });

    createAndServePaperPetition({
      procedureType: 'Small',
      trialLocation,
      caseType: 'Other',
      yearReceived: '2019',
      includeApwDocument: false,
    })
      .then(({ docketNumber }) => {
        cy.wrap(docketNumber).as('docketNumber');
        createdDocketNumbers.push(docketNumber);

        loginAsDocketClerk();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
        return createAndServePaperPetition({
          procedureType: 'Small',
          trialLocation,
          yearReceived: '2019',
          caseType: 'Other',
          includeApwDocument: false,
        });
      })
      .then(({ docketNumber }) => {
        cy.wrap(docketNumber).as('docketNumberMotr');
        createdDocketNumbers.push(docketNumber);
        loginAsDocketClerk();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
        cy.get('[data-testid="edit-remote-status"]').click();
        cy.get('#remote-trial-granted-date-picker').type(date);
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.get('[data-testid="trial-session-link"]').click();
      });
    cy.get('@trialSessionId').then(trialSessionId => {
      cy.get('[data-testid="new-trial-sessions-tab"] span.button-text').click();
      cy.get(`[data-testid="trial-location-link-${trialSessionId}"]`).click();
    });
    cy.get('@docketNumberMotr').then(docketNumberMotr => {
      cy.get(
        `[data-testid="table-row-${docketNumberMotr}"] [data-testid="laptop"]`,
      ).should('be.visible');
    });
    cy.get('@docketNumber').then(docketNumber => {
      cy.get(
        `[data-testid="table-row-${docketNumber}"] [data-testid="laptop"]`,
      ).should('not.be.visible');
    });
  });
});
