import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsAdmissionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Practitioner Details - Admissions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
    loginAsAdmissionsClerk();
  });

  describe('Practitioner Information Tabs', () => {
    it('should be free of a11y issues', () => {
      cy.visit('/practitioner-detail/PT1234?tab=practitioner-documentation');
      cy.get('[data-testid="add-practitioner-document-button"]');
      checkA11y();

      cy.visit('/practitioner-detail/PT1234?tab=practitioner-open-cases');
      cy.get('[data-testid="practitioner-open-cases-list-container"]');
      checkA11y();

      cy.visit('/practitioner-detail/PT1234?tab=practitioner-closed-cases');
      cy.get('[data-testid="practitioner-closed-cases-list-container"]');
      checkA11y();
    });
  });
});
