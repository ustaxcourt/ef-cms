import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsAdmissionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Practitioner Details - Admissions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('Practitioner documentation tab', () => {
    it('should be free of a11y issues', () => {
      loginAsAdmissionsClerk();

      cy.visit('/practitioner-detail/PT1234?tab=practitioner-documentation');
      cy.get('[data-testid="add-practitioner-document-button"]');

      checkA11y();
    });
  });
});
