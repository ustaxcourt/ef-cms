import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';
import { retry } from '../../../../helpers/retry';

describe('Blocked Cases Report', () => {
  beforeEach(() => {
    cy.task('deleteAllFilesInFolder', 'cypress/downloads');
  });

  it('should show a blocked case in the blocked cases report and the downloaded csv report', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      //block case
      loginAsColvin();
      goToCase(docketNumber);
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

      retry(() => {
        cy.reload();
        cy.get('[data-testid="trial-location-filter"]').select(
          'Birmingham, Alabama',
        );
        const selector = `[data-testid="blocked-case-${docketNumber}-row"]`;
        return cy.get(selector).then(elements => elements.length > 0);
      });

      cy.get('[data-testid="blocked-cases-count"]').should('exist');

      //download csv
      cy.get('[data-testid="export-blocked-case-report"]').click();
      const today = formatNow(FORMATS.MMDDYYYY_UNDERSCORED);
      const fileName = `Blocked Cases Report - Birmingham_Alabama ${today}.csv`;
      cy.readFile(`cypress/downloads/${fileName}`, 'utf-8').then(
        fileContent => {
          expect(fileContent).to.include(docketNumber);
        },
      );
    });
  });
});
