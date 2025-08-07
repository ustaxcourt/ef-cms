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

describe('Trial Session Eligible Cases Journey', () => {
  const trialLocation = `Phoenix, Arizona`;
  let trialSessionId: string;
  const createdDocketNumbers: string[] = [];

  beforeEach(() => {
    cy.intercept('POST', '**/trial-sessions').as('createTrialSession');
    cy.intercept('POST', '**/cases').as('createCase');
    cy.intercept('PUT', '**/cases/*/trial-session').as('assignCaseToTrial');
    cy.intercept('GET', '**/trial-sessions*/*').as('getTrialSessions');
    cy.intercept('GET', '**/trial-sessions*/*/eligible-cases').as(
      'getEligibleCases',
    );
    cy.intercept('PUT', '**/cases/*/calendar').as('calendarCase');
  });

  it('should create trial session and cases, then verify eligible cases are properly assigned', () => {
    // Step 1: Create trial session with Small session type
    loginAsPetitionsClerk1();
    createTrialSession({
      trialLocation,
      sessionType: SESSION_TYPES.small,
      startDate: '12/12/2025',
      endDate: '12/12/2025',
      judge: 'Cohen',
      maxCases: '3',
    }).then(({ trialSessionId: createdTrialSessionId }) => {
      trialSessionId = createdTrialSessionId;
      cy.wait('@createTrialSession')
        .its('response.statusCode')
        .should('eq', 201);
    });

    // Step 2: Create Case #1 - Small procedure type, filed date 1/1/2019
    createAndServePaperPetition({
      procedureType: 'Small',
      trialLocation,
      caseType: 'Other',
      yearReceived: '2019',
    }).then(({ docketNumber }) => {
      createdDocketNumbers.push(docketNumber);

      cy.wait('@createCase').its('response.statusCode').should('eq', 201);

      // Set case ready for trial
      loginAsDocketClerk();
      goToCase(docketNumber);
      updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
      cy.wait('@calendarCase').its('response.statusCode').should('eq', 200);
    });

    // Step 3: Create Case #2 - Small procedure type, filed date 1/2/2019
    createAndServePaperPetition({
      procedureType: 'Small',
      trialLocation,
      yearReceived: '2019',
      caseType: 'Other',
    }).then(({ docketNumber }) => {
      createdDocketNumbers.push(docketNumber);

      cy.wait('@createCase').its('response.statusCode').should('eq', 201);

      // Set case ready for trial
      loginAsDocketClerk();
      goToCase(docketNumber);
      updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);

      cy.wait('@calendarCase').its('response.statusCode').should('eq', 200);
    });

    // Step 4: Create Case #3 - Regular procedure type, filed date 1/1/2019
    createAndServePaperPetition({
      procedureType: 'Regular',
      trialLocation,
      yearReceived: '2019',
    }).then(({ docketNumber }) => {
      createdDocketNumbers.push(docketNumber);

      // Set case ready for trial
      loginAsDocketClerk();
      goToCase(docketNumber);
      updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
    });

    // Step 5: Create Case #4 - CDP (L) type, Small procedure type, filed date 5/1/2019
    createAndServePaperPetition({
      procedureType: 'Small',
      trialLocation,
      caseType: 'CDP (Lien/Levy)',
      yearReceived: '2019',
    }).then(({ docketNumber }) => {
      createdDocketNumbers.push(docketNumber);
      cy.wait('@createCase').its('response.statusCode').should('eq', 201);

      // Set case ready for trial
      loginAsDocketClerk();
      goToCase(docketNumber);
      updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
      cy.wait('@calendarCase').its('response.statusCode').should('eq', 200);
    });

    // Step 6: Create Case #5 - Passport (P) type, Small procedure type, filed date 3/1/2019
    createAndServePaperPetition({
      procedureType: 'Small',
      trialLocation,
      caseType: 'Passport',
      yearReceived: '2019',
    }).then(({ docketNumber }) => {
      createdDocketNumbers.push(docketNumber);
      cy.wait('@createCase').its('response.statusCode').should('eq', 201);

      // Set case ready for trial
      loginAsDocketClerk();
      goToCase(docketNumber);
      updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
      cy.wait('@calendarCase').its('response.statusCode').should('eq', 200);
    });

    // Step 7: Verify eligible cases are shown for the trial session
    cy.then(() => {
      loginAsPetitionsClerk1();

      cy.visit(`/trial-session-detail/${trialSessionId}`);

      cy.wait('@getTrialSessions').its('response.statusCode').should('eq', 200);
      cy.wait('@getEligibleCases').its('response.statusCode').should('eq', 200);

      // Verify the specific cases are eligible (without assuming order)
      cy.get('table#upcoming-sessions').within(() => {
        cy.get('tr').should('contain', createdDocketNumbers[3]); // Case #4
        cy.get('tr').should('contain', createdDocketNumbers[4]); // Case #5
        cy.get('tr').should('contain', createdDocketNumbers[0]); // Case #1
        cy.get('tr').should('contain', createdDocketNumbers[1]); // Case #2
      });
    });

    // Step 8: Mark specific eligible cases as QCed
    cy.then(() => {
      loginAsPetitionsClerk1();

      cy.wait('@getEligibleCases');

      cy.visit(`/trial-session-detail/${trialSessionId}`);

      cy.wait('@getTrialSessions').its('response.statusCode').should('eq', 200);
      cy.wait('@getEligibleCases').its('response.statusCode').should('eq', 200);

      cy.get('table#upcoming-sessions');

      // Mark Case #4 as QCed
      cy.get(`label[for="qc-complete-${createdDocketNumbers[3]}"]`).click();
      cy.get(`label[for="qc-complete-${createdDocketNumbers[4]}"]`).click();
      cy.get(`label[for="qc-complete-${createdDocketNumbers[0]}"]`).click();
      cy.get(`label[for="qc-complete-${createdDocketNumbers[1]}"]`).click();
    });

    // Step 9: Set calendar for trial session
    cy.then(() => {
      calendarTrialSession(trialSessionId);
      cy.get('[data-testid="success-alert"]').should('exist');

      cy.wait('@assignCaseToTrial')
        .its('response.statusCode')
        .should('eq', 200);
    });

    // Step 10: Verify cases are assigned to trial session
    cy.then(() => {
      loginAsPetitionsClerk1();
      cy.visit(`/trial-session-detail/${trialSessionId}`);

      cy.wait('@getTrialSessions').its('response.statusCode').should('eq', 200);
      cy.wait('@getEligibleCases').its('response.statusCode').should('eq', 200);

      // Verify that 3 cases are calendared (Case #4, #5, #1)
      cy.get('[data-testid="open-cases-count"]').should('contain', '3');

      cy.get('table#open-cases').within(() => {
        cy.get('tr').should('contain', createdDocketNumbers[0]);
        cy.get('tr').should('contain', createdDocketNumbers[3]);
        cy.get('tr').should('contain', createdDocketNumbers[4]);
      });
    });

    // Step 11: Verify case statuses are updated correctly
    cy.then(() => {
      // Case #1 - should be calendared
      goToCase(createdDocketNumbers[0]);
      cy.wait('@getTrialSessions').its('response.statusCode').should('eq', 200);
      cy.get('[data-testid="case-status"]').should('be .visible');
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
      cy.get('[data-testid="success-alert"]').should('exist');

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
});
