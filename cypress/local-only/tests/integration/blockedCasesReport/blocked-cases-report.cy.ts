import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';

describe('Blocked Cases Report', () => {
  before(() => {
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
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(10000); // wait for opensearch to index case
      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="blocked-cases-report"]').click();
      cy.get('[data-testid="trial-location-filter"]').select(
        'Birmingham, Alabama',
      );
      cy.get('[data-testid="blocked-cases-count"]').should('exist');
      cy.get('[data-testid="blocked-cases-report-table"]').contains(
        docketNumber,
      );

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
