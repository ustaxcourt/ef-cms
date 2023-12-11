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
    it('should navigate to the pending report, select chief judge from the dropdown, verify the results, export said results as csv, and navigate to the pending report pdf page', () => {
      loginAsDocketClerk();

      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="select-pending-report"]').click();
      cy.get('[data-testid="dropdown-select-judge"]').select('Chief Judge');

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

      cy.get('[data-testid="export-pending-report"]').click();
      cy.readFile(path.join(downloadsFolder, fileName));

      cy.get('[data-testid="print-pending-report"]').click();
      cy.get('[data-testid="preview-pdf').should('exist');
    });
  });
});
