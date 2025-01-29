import {
  CASE_STATUS_TYPES,
  PROCEDURE_TYPES_MAP,
} from '../../../../../shared/src/business/entities/EntityConstants';
import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';
import { retry } from '../../../../helpers/retry';
import { createAndServeConsolidatedGroup } from 'cypress/helpers/fileAPetition/create-consolidated-case-group';

describe('Blocked Cases Report', () => {
  beforeEach(() => {
    cy.task('deleteAllFilesInFolder', 'cypress/downloads');
  });

  it('should show a consolidated group in the blocked cases report and the downloaded csv report', () => {
    const trialLocation = 'Portland, Maine';
    const [trialCity, trialState] = trialLocation.split(', ');
    const procedureType = PROCEDURE_TYPES_MAP.small;
    const caseStatus = CASE_STATUS_TYPES.generalDocketReadyForTrial;
    createAndServeConsolidatedGroup({
      procedureType,
      trialLocation,
      caseStatus,
    }).then(({ leadDocketNumber, memberDocketNumber }) => {
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

      //View report
      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="blocked-cases-report"]').click();

      function checkIfOpensearchHasIndexedBlockedCase() {
        cy.reload();
        cy.get('[data-testid="trial-location-filter"]').select(trialLocation);
        cy.get('[data-testid="procedure-type-filter"]').select(procedureType);
        cy.get('[data-testid="case-status-filter"]').select(caseStatus);
        cy.get('[data-testid="blocked-reason-filter"]').select('Manual Block');
        const selector = `[data-testid="blocked-case-${leadDocketNumber}-row"]`;
        return cy.get(selector).then(elements => elements.length > 0);
      }

      retry(checkIfOpensearchHasIndexedBlockedCase);

      cy.get('[data-testid="blocked-cases-count"]').should('exist');
      cy.get(`[data-testid="blocked-case-${leadDocketNumber}-row"]`).contains('Grouped with blocked case')

      //download csv
      cy.get('[data-testid="export-blocked-case-report"]').click();
      const today = formatNow(FORMATS.MMDDYYYY_UNDERSCORED);
      const fileName = `Blocked Cases Report - ${trialCity}_${trialState} ${today}.csv`;
      cy.readFile(`cypress/downloads/${fileName}`, 'utf-8').should(
        fileContent => {
          expect(fileContent).to.include(leadDocketNumber);
          expect(fileContent).to.include(memberDocketNumber);
        },
      );
    });
  });
});
