import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { loginAsDocketClerk1 } from '../../../../helpers/authentication/login-as-helpers';
import path from 'path';

describe('Pending report', () => {
  const today = formatNow(FORMATS.MMDDYYYY_UNDERSCORED);
  const fileName = `Pending Report - Chief Judge ${today}.csv`;
  const downloadsFolder = Cypress.config('downloadsFolder');

  describe('View pending report', () => {
    it('should navigate to the pending report, select chief judge from the dropdown, verify the results, export said results as csv, and navigate to the pending report pdf page', () => {
      loginAsDocketClerk1();

      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="select-pending-report"]').click();
      cy.get('[data-testid="dropdown-select-judge"]').select('Chief Judge');

      const headerTitles = [
        'Docket No.',
        'No.',
        'Filed Date',
        'Case Title',
        'Filings and Proceedings',
        'Case Status',
      ];

      cy.get('[data-testid$="-sortable-button"]').each((header, index) => {
        cy.wrap(header.children('.margin-right-1')).should(
          'contain.text',
          headerTitles[index],
        );
      });

      cy.get('th').eq(7).should('contain.text', 'Judge');

      cy.get('[data-testid="export-pending-report"]').click();
      cy.readFile(path.join(downloadsFolder, fileName));
      cy.get('[data-testid="print-pending-report"]').click();
      cy.get('[data-testid="preview-pdf').should('exist');
    });
  });
});
