import { loginAsColvin } from 'cypress/helpers/authentication/login-as-helpers';
import {
  createGrantDenyMotionCase,
  openGrantDenyMotionFromDocketRecord,
} from 'cypress/helpers/grantDenyMotion/grant-deny-motion-helpers';

describe('Grant/Deny Motion validation (T13533)', () => {
  it('should require disposition before Save as Draft', () => {
    createGrantDenyMotionCase().then(({ docketNumber }) => {
      loginAsColvin();
      cy.visit(`/case-detail/${docketNumber}`);
      openGrantDenyMotionFromDocketRecord();

      cy.get('[data-testid="save-draft-button"]').click();
      cy.get('[data-testid="error-alert"]').should(
        'contain.text',
        'Select Granted or Denied',
      );
    });
  });
});
