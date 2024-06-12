import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';

describe('Dashboard - Judge Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsColvin();

    checkA11y();
  });

  describe('Submitted/CAV tab', () => {
    it('should be free of a11y issues when adding/editing case worksheet', () => {
      loginAsColvin();
      cy.get('[data-testid="tab-case-worksheets"]').click();
      cy.get('button[data-testid="add-edit-case-worksheet"]').first().click();
      cy.get('.modal-screen').should('exist');
      cy.get('#confirm').click();

      checkA11y();
    });
  });

  describe('Pending Motions tab', () => {
    it('should be free of a11y issues when adding/editing pending motion', () => {
      loginAsColvin();
      cy.get('[data-testid="pending-motions-tab"]').click();
      cy.get('button[data-testid="add-edit-pending-motion-worksheet"]')
        .first()
        .click();
      cy.get('.modal-screen').should('exist');
      cy.get('#confirm').click();

      checkA11y();
    });
  });
});
