import {
  FORMATS,
  formatNow,
} from '../../../shared/src/business/utilities/DateHandler';
import { loginAsDocketClerk } from '../../helpers/auth/login-as-helpers';
import path from 'path';

describe('Pending report', () => {
  describe('View pending report', () => {
    it('should view pending report', () => {
      loginAsDocketClerk();
      cy.get('#reports-btn').click();
      cy.get('#pending-report').click();
      cy.get('[data-testid="dropdown-select-judge"]').select('Chief Judge');
      cy.intercept('GET', 'url').as('download');
      cy.get('[data-testid="export-pending-report"]').click();
      const today = formatNow(FORMATS.MMDDYYYY_UNDERSCORED);
      const fileName = `Pending Report - Chief Judge ${today}.csv`;
      const downloadsFolder = Cypress.config('downloadsFolder');
      cy.readFile(path.join(downloadsFolder, fileName));
    });
  });
});
