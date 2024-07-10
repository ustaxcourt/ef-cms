import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsColvinChambers } from '../../../../helpers/authentication/login-as-helpers';

describe('Dashboard - Chambers Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsColvinChambers();

    checkA11y();
  });

  describe('Submitted/CAV tab', () => {
    it('should be free of a11y issues', () => {
      loginAsColvinChambers();

      cy.get('[data-testid="submitted-cav-cases-tab"]').click();
      cy.get('[data-testid="case-worksheets-total-count-text"]');

      checkA11y();
    });
  });

  describe('Pending Motions tab', () => {
    it('should be free of a11y issues', () => {
      loginAsColvinChambers();

      cy.get('[data-testid="pending-motions-tab"]').click();
      cy.get('[data-testid="pending-motions-total-count-text"]');

      checkA11y();
    });
  });
});
