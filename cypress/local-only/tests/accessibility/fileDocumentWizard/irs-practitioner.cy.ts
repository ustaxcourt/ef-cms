import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsIrsPractitioner } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('File Document Wizard - Irs Practitioner Accessibility', () => {
  it('should be free of a11y issues', () => {
    loginAsIrsPractitioner();

    cy.visit('/case-detail/104-18');
    cy.get('[data-testid="docket-record-table"]').should('exist');
    cy.get('[data-testid="button-first-irs-document"]').click();
    cy.get('[data-testid="select-document-to-file-header"]');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
      },
      terminalLog,
    );
  });
});
