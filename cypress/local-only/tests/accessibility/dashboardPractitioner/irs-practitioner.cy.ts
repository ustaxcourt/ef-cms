import { loginAsIrsPractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Dashboard Practitioner - Irs Practitioner Accessibility', () => {
  it('should be free of a11y issues', () => {
    loginAsIrsPractitioner();

    cy.runA11y();
  });
});
