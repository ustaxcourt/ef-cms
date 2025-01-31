import {
  CASE_STATUS_TYPES,
  PROCEDURE_TYPES_MAP,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsColvin,
  loginAsDocketClerk1,
  loginAsPetitionsClerk1,
} from '../../../../helpers/authentication/login-as-helpers';
import { createAndServeConsolidatedGroup } from 'cypress/helpers/fileAPetition/create-consolidated-case-group';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';

describe('Blocked Cases Report', () => {
  beforeEach(() => {
    cy.task('deleteAllFilesInFolder', 'cypress/downloads');
  });

  // it('should show a consolidated group in the blocked cases report and the downloaded csv report', () => {
  //   const trialLocation = 'Portland, Maine';
  //   const [trialCity, trialState] = trialLocation.split(', ');
  //   const procedureType = PROCEDURE_TYPES_MAP.small;
  //   const caseStatus = CASE_STATUS_TYPES.generalDocketReadyForTrial;
  //   createAndServeConsolidatedGroup({
  //     procedureType,
  //     trialLocation,
  //     caseStatus,
  //   }).then(({ leadDocketNumber, memberDocketNumber }) => {
  //     //block case
  //     loginAsColvin();
  //     goToCase(memberDocketNumber);
  //     cy.get('[data-testid="tab-case-information"]').click();
  //     cy.get('[data-testid="add-manual-block-button"]').click();
  //     cy.get('[data-testid="blocked-from-trial-reason-textarea"]').type(
  //       'This case cannot go to trial.',
  //     );
  //     cy.get('[data-testid="modal-button-confirm"]').click();
  //     cy.get('[data-testid="success-alert"]').contains(
  //       'Case blocked from being set for trial.',
  //     );

  //     //View report
  //     cy.get('[data-testid="dropdown-select-report"]').click();
  //     cy.get('[data-testid="blocked-cases-report"]').click();

  //     function checkIfOpensearchHasIndexedBlockedCase() {
  //       cy.reload();
  //       cy.get('[data-testid="trial-location-filter"]').select(trialLocation);
  //       cy.get('[data-testid="procedure-type-filter"]').select(procedureType);
  //       cy.get('[data-testid="case-status-filter"]').select(caseStatus);
  //       cy.get('[data-testid="blocked-reason-filter"]').select('Manual Block');
  //       const selector = `[data-testid="blocked-case-${leadDocketNumber}-row"]`;
  //       return cy.get(selector).then(elements => elements.length > 0);
  //     }

  //     retry(checkIfOpensearchHasIndexedBlockedCase);

  //     cy.get('[data-testid="blocked-cases-count"]').should('exist');
  //     cy.get(`[data-testid="blocked-case-${leadDocketNumber}-row"]`).contains(
  //       'Grouped with blocked case',
  //     );

  //     //download csv
  //     cy.get('[data-testid="export-blocked-case-report"]').click();
  //     const today = formatNow(FORMATS.MMDDYYYY_UNDERSCORED);
  //     const fileName = `Blocked Cases Report - ${trialCity}_${trialState} ${today}.csv`;
  //     cy.readFile(`cypress/downloads/${fileName}`, 'utf-8').should(
  //       fileContent => {
  //         expect(fileContent).to.include(leadDocketNumber);
  //         expect(fileContent).to.include(memberDocketNumber);
  //       },
  //     );
  //   });
  // });

  it('should show a consolidated group in the eligible cases list, then when blocked, show in the blocked cases report', () => {
    const trialLocation = 'Portland, Maine';
    const [_trialCity, _trialState] = trialLocation.split(', ');
    const procedureType = PROCEDURE_TYPES_MAP.small;
    const caseStatus = CASE_STATUS_TYPES.generalDocketReadyForTrial;
    createAndServeConsolidatedGroup({
      procedureType,
      trialLocation,
      caseStatus,
    }).then(({ leadDocketNumber, memberDocketNumber }) => {
      loginAsPetitionsClerk1();
      createTrialSession({ trialLocation, sessionType: procedureType }).then(
        ({ trialSessionId }) => {
          //Shows as eligible
          loginAsPetitionsClerk1();
          cy.get('[data-testid="trial-session-link"]').click();
          cy.visit(`/trial-session-detail/${trialSessionId}`);
          cy.get(`label[for="qc-complete-${leadDocketNumber}"]`);
          cy.get(`label[for="qc-complete-${memberDocketNumber}"]`);

          //block case
          loginAsColvin();
          goToCase(memberDocketNumber);
          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('[data-testid="add-manual-block-button"]').click();
          cy.get('[data-testid="blocked-from-trial-reason-textarea"]').type(
            'This case cannot go to trial.',
          );
          cy.get('[data-testid="modal-button-confirm"]').click();
          cy.get('[data-testid="success-alert"]').contains(
            'Case blocked from being set for trial.',
          );

          //Does not show in eligible case list
          loginAsPetitionsClerk1();
          cy.get('[data-testid="trial-session-link"]').click();
          cy.visit(`/trial-session-detail/${trialSessionId}`);
          cy.get(`label[for="qc-complete-${leadDocketNumber}"]`).should(
            'not.exist',
          );
          cy.get(`label[for="qc-complete-${memberDocketNumber}"]`).should(
            'not.exist',
          );

          //Shows in blocked cases report
          cy.get('[data-testid="dropdown-select-report"]').click();
          cy.get('[data-testid="blocked-cases-report"]').click();
          cy.get('[data-testid="trial-location-filter"]').select(trialLocation);
          cy.get('[data-testid="procedure-type-filter"]').select(procedureType);
          cy.get('[data-testid="case-status-filter"]').select(caseStatus);
          cy.get('[data-testid="blocked-reason-filter"]').select(
            'Manual Block',
          );
          cy.get(`[data-testid="blocked-case-${leadDocketNumber}-row"]`);
          cy.get(`[data-testid="blocked-case-${memberDocketNumber}-row"]`);

          //Remove block
          goToCase(memberDocketNumber);
          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('[data-testid=remove-block-button').click();
          cy.get('[data-testid=modal-button-confirm').click();
          cy.get('[data-testid="success-alert"]').contains(
            'Block removed. Case is eligible for next available trial session.',
          );

          //Shows as eligible
          cy.get('[data-testid="trial-session-link"]').click();
          cy.visit(`/trial-session-detail/${trialSessionId}`);
          cy.get(`label[for="qc-complete-${leadDocketNumber}"]`);
          cy.get(`label[for="qc-complete-${memberDocketNumber}"]`);

          //Does not shows in blocked cases report
          cy.get('[data-testid="dropdown-select-report"]').click();
          cy.get('[data-testid="blocked-cases-report"]').click();
          cy.get('[data-testid="trial-location-filter"]').select(trialLocation);
          cy.get(`[data-testid="blocked-case-${leadDocketNumber}-row"]`).should(
            'not.exist',
          );
          cy.get(
            `[data-testid="blocked-case-${memberDocketNumber}-row"]`,
          ).should('not.exist');
        },
      );
    });
  });

  it.only('should show a case as ineligible for trial when it has a case deadline or a pending item', () => {
    const trialLocation = 'Knoxville, Tennessee';
    const procedureType = PROCEDURE_TYPES_MAP.small;
    const [_trialCity, _trialState] = trialLocation.split(', ');
    const caseStatus = CASE_STATUS_TYPES.generalDocketReadyForTrial;
    createAndServePaperPetition({
      trialLocation,
      procedureType,
      includeApwDocument: false,
    }).then(({ docketNumber }) => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      updateCaseStatus(caseStatus);
      loginAsPetitionsClerk1();
      createTrialSession({ trialLocation, sessionType: procedureType }).then(
        ({ trialSessionId }) => {
          // Add case deadline
          goToCase(docketNumber);
          cy.get('[data-testid="case-detail-menu-button"]').click();
          cy.get('[data-testid=menu-button-create-deadline]').click();
          cy.get(
            '.usa-date-picker__wrapper > [data-testid="deadline-date-picker"]',
          ).type('03/01/2200');
          cy.get('[data-testid=case-deadline-description-input]').type(
            'deadline description',
          );
          cy.get('[data-testid="modal-button-confirm"]').click();
          cy.get('[data-testid=success-alert]').contains('Deadline saved');

          // Should not show as eligible
          cy.get('[data-testid="trial-session-link"]').click();
          cy.visit(`/trial-session-detail/${trialSessionId}`);
          cy.get(`label[for="qc-complete-${docketNumber}"]`).should(
            'not.exist',
          );

          // Shows in blocked cases report
          cy.get('[data-testid="dropdown-select-report"]').click();
          cy.get('[data-testid="blocked-cases-report"]').click();
          cy.get('[data-testid="trial-location-filter"]').select(trialLocation);
          cy.get('[data-testid="procedure-type-filter"]').select(procedureType);
          cy.get('[data-testid="case-status-filter"]').select(caseStatus);
          cy.get(`[data-testid="blocked-case-${docketNumber}-row"]`);

          // Remove deadline
          goToCase(docketNumber);
          cy.get('[data-testid=tab-tracked-items]').click();
          cy.get('[data-testid=delete-case-deadline-button]').click();
          cy.get('[data-testid="modal-button-confirm"]').click();

          //Shows as eligible
          cy.get('[data-testid="trial-session-link"]').click();
          cy.visit(`/trial-session-detail/${trialSessionId}`);
          cy.get(`label[for="qc-complete-${docketNumber}"]`);

          //Does not shows in blocked cases report
          cy.get('[data-testid="dropdown-select-report"]').click();
          cy.get('[data-testid="blocked-cases-report"]').click();
          cy.get('[data-testid="trial-location-filter"]').select(trialLocation);
          cy.get(`[data-testid="blocked-case-${docketNumber}-row"]`).should(
            'not.exist',
          );
        },
      );
    });
  });
});
