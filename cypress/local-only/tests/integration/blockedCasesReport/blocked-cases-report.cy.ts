import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { loginAsDocketClerk1 } from '../../../../helpers/authentication/login-as-helpers';

describe('Blocked Cases Report', () => {
  beforeEach(() => {
    cy.task('deleteAllFilesInFolder', 'cypress/downloads');

    loginAsDocketClerk1();

    cy.get('[data-testid="dropdown-select-report"]').click();
    cy.get('[data-testid="blocked-cases-report"]').click();
  });

  describe('Filtering', () => {
    it('should display the not found error page when routing to a case that does not exist', () => {
      cy.get('[data-testid="trial-location-filter"]').select('Lubbock, Texas');
      cy.get('[data-testid="blocked-cases-count"]').should('have.text', '6');

      cy.get('[data-testid="procedure-type-filter"]').select('Regular');
      cy.get('[data-testid="blocked-cases-count"]').should('have.text', '5');

      cy.get('[data-testid="case-status-filter"]').select('Submitted');
      cy.get('[data-testid="blocked-cases-count"]').should('have.text', '4');

      cy.get('[data-testid="blocked-reason-filter"]').select('Pending Item');
      cy.get('[data-testid="blocked-cases-count"]').should('have.text', '3');
    });
  });

  describe('CSV Export', () => {
    it('should display the not found error page when routing to a case that does not exist', () => {
      cy.get('[data-testid="trial-location-filter"]').select('Lubbock, Texas');
      cy.get('[data-testid="procedure-type-filter"]').select('Regular');
      cy.get('[data-testid="case-status-filter"]').select('Submitted');
      cy.get('[data-testid="blocked-reason-filter"]').select('Pending Item');

      cy.get('[data-testid="blocked-cases-count"]').should('have.text', '3');

      cy.get('[data-testid="export-blocked-case-report"]').click();

      const today = formatNow(FORMATS.MMDDYYYY_UNDERSCORED);
      const fileName = `Blocked Cases Report - Lubbock_Texas ${today}.csv`;
      cy.readFile(`cypress/downloads/${fileName}`, 'utf-8').should(
        fileContent => {
          const totalCasesInReport = fileContent
            .split('\n')
            .filter((str: string) => !!str).length;
          expect(totalCasesInReport).to.equal(4);
        },
      );
    });
  });
});
