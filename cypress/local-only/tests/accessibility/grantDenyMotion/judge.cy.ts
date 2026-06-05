import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';

describe('Grant/Deny Motion - Judge Accessibility', () => {
  const docketNumber = '105-20';
  const motionDocketEntryId = '3eb53932-1a44-40d1-bfb8-d9e908b0b32e';

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues on the grant/deny motion form', () => {
    loginAsColvin();
    cy.visit(
      `/case-detail/${docketNumber}/documents/${motionDocketEntryId}/grant-deny-motion-create`,
    );

    cy.get('[data-testid="motion-disposition-GRANTED"]').should('be.visible');
    cy.get('[data-testid="motion-disposition-GRANTED"]').click({ force: true });
    cy.get('[data-testid="motion-disposition-GRANTED"]').should('be.checked');

    cy.get('[data-testid="add-additional-order-text"]').click();
    cy.get('[data-testid="additional-order-text-0"]').type(
      'First accessible clause',
    );
    cy.contains('button', 'Add additional order text').click();
    cy.get('[data-testid="additional-order-text-1"]').type(
      'Second accessible clause',
    );

    cy.get('[data-testid="save-draft-button"]').should('exist');

    checkA11y();
  });
});
