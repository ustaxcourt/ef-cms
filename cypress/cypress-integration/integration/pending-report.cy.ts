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
    it('should view pending report', () => {
      loginAsDocketClerk();
      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="select-pending-report"]').click();
      cy.get('[data-testid="dropdown-select-judge"]').select('Chief Judge');
      cy.get('[data-testid="export-pending-report"]').click();

      cy.readFile(path.join(downloadsFolder, fileName));
    });
  });
});
