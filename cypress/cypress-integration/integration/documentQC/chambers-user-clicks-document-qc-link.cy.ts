import { loginAsColvinChambers } from '../../../helpers/authentication/login-as-helpers';

describe('A Colvins chambers user has the correct flow for QC documents', function () {
  it('login as chambers and check administrative record link exists', () => {
    loginAsColvinChambers();
    cy.get('[data-testid="document-qc-nav-item"]')
      .contains('Document QC')
      .click();
    cy.get('[data-testid="work-item-103-20"] a.case-link')
      .contains('Administrative Record')
      .should('exist');
  });
});
