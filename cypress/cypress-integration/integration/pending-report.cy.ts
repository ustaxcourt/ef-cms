import {
  FORMATS,
  formatNow,
} from '../../../shared/src/business/utilities/DateHandler';
import { loginAsDocketClerk } from '../../helpers/auth/login-as-helpers';
import path from 'path';

describe('Pending report', () => {
  const today = formatNow(FORMATS.MMDDYYYY_UNDERSCORED);
  const fileName = `Pending Report - Chief Judge ${today}.csv`;
  const downloadsFolder = Cypress.config('downloadsFolder');

  describe('View pending report', () => {
    it('should log in as a docket clerk and navigate to the pending report then select chief judge from the dropdown', () => {
      loginAsDocketClerk();
      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="select-pending-report"]').click();
      cy.get('[data-testid="dropdown-select-judge"]').select('Chief Judge');
    });

    it('should have more rows in the table after clicking the "load more" button than before', () => {
      cy.get('[data-testid="display-pending-report-table"]')
        .children()
        .its('length')
        .then(beforeLength => {
          cy.get('[data-testid="load-more-pending-report-data"]').click();
          cy.get('[data-testid="display-pending-report-table"]')
            .children()
            .its('length')
            .then(afterLength => {
              expect(afterLength).to.be.greaterThan(beforeLength);
            });
        });
    });

    it('should export pending report', () => {
      cy.get('[data-testid="export-pending-report"]').click();
      cy.readFile(path.join(downloadsFolder, fileName));
    });

    it('should display pending report pdf page', () => {
      cy.get('[data-testid="print-pending-report"]').click();
      cy.get('[data-testid="preview-pdf').should('exist');
    });
  });
});
