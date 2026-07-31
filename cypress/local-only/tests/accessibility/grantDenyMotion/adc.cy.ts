import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsAdc } from '../../../../helpers/authentication/login-as-helpers';

describe('Grant/Deny Motion - ADC Accessibility', () => {
  const docketNumber = '105-20';
  const motionDocketEntryId = '3eb53932-1a44-40d1-bfb8-d9e908b0b32e';

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues on the grant/deny motion form', () => {
    loginAsAdc();
    cy.visit(
      `/case-detail/${docketNumber}/documents/${motionDocketEntryId}/grant-deny-motion-create`,
    );

    cy.get('[data-testid="motion-disposition-GRANTED"]').should('be.visible');
    cy.get('[data-testid="jurisdiction-restored-label"]').should(
      'contain.text',
      'Restored to the general docket',
    );

    checkA11y();
  });
});
