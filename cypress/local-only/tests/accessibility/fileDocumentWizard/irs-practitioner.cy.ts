import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsIrsPractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File Document Wizard - Irs Practitioner Accessibility', () => {
  it('should be free of a11y issues', () => {
    loginAsIrsPractitioner();

    cy.visit('/case-detail/104-18');
    cy.get('[data-testid="docket-record-table"]').should('exist');
    cy.get('[data-testid="button-first-irs-document"]').click();
    cy.get('[data-testid="select-document-to-file-header"]');

    checkA11y();
  });
});
