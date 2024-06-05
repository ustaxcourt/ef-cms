import { loginAsIrsSuperUser } from '../../../../helpers/authentication/login-as-helpers';

describe('Case Detail - IRS Super User Accessibility', () => {
  it('should be free of a11y issues when performing docket search', () => {
    loginAsIrsSuperUser();
    cy.visit('/case-detail/103-19');
    cy.get('#case-title').should('exist');

    cy.runA11y();
  });
});
