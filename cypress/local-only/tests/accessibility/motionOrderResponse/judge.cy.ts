import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';

describe('Motion Order Response - Judge Accessibility', () => {
  const docketNumber = '105-20';
  const motionDocketEntryId = '3eb53932-1a44-40d1-bfb8-d9e908b0b32e';

  const visitMotionOrderResponseForm = (): void => {
    cy.visit(
      `/case-detail/${docketNumber}/documents/${motionDocketEntryId}/motion-order-response`,
    );
    cy.get('#page-title').should('contain.text', 'Order Response to Motion');
    cy.get('[data-testid="save-draft-button"]').should('exist');
  };

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues on the default motion order response form', () => {
    loginAsColvin();
    visitMotionOrderResponseForm();

    checkA11y();
  });

  it('should be free of a11y issues with reply and due date fields', () => {
    loginAsColvin();
    visitMotionOrderResponseForm();

    cy.get('[data-testid="motion-order-reply"]').check({ force: true });
    cy.get('[data-testid="due-date-input-motionOrderResponseDueDate-picker"]')
      .last()
      .type('01/01/2025');

    checkA11y();
  });

  it('should be free of a11y issues with additional order text fields', () => {
    loginAsColvin();
    visitMotionOrderResponseForm();

    cy.get('#additional-order-text-array-0').type('First accessible clause');
    cy.contains('button', 'Add additional order text').click();
    cy.get('#additional-order-text-array-1').type('Second accessible clause');

    checkA11y();
  });
});
