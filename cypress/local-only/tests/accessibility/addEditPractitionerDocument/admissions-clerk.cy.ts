import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsAdmissionsClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Add/Edit Practitioner Document - Admissions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsAdmissionsClerk();

    cy.visit('/practitioner-detail/PT1234/add-document');
    cy.get('[data-testid="add-edit-practitioner-document-header"]');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
      },
      terminalLog,
    );

    cy.get(
      '[data-testid="cancel-add-edit-practitioner-document-button"]',
    ).click();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
      },
      terminalLog,
    );
  });
});
