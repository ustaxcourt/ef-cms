import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsColvinChambers } from '../../../../helpers/authentication/login-as-helpers';

describe('Motion Order Response - Chambers Accessibility', () => {
  const docketNumber = '105-20';
  const motionDocketEntryId = '3eb53932-1a44-40d1-bfb8-d9e908b0b32e';

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues on the motion order response form', () => {
    loginAsColvinChambers();
    cy.visit(
      `/case-detail/${docketNumber}/documents/${motionDocketEntryId}/motion-order-response`,
    );

    cy.get('#page-title').should('contain.text', 'Order Response to Motion');
    cy.get('[data-testid="save-draft-button"]').should('exist');

    checkA11y();
  });
});
