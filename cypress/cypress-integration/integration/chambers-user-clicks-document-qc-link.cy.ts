import { navigateTo as navigateToDashboard } from '../support/pages/dashboard';

describe('A Colvins chambers user has the correct flow for QC documents', function () {
  it('should log in as chambers user', () => {
    navigateToDashboard('colvinschambers');
  });

  it('should navigate to document QC', () => {
    cy.get('a.usa-nav__link').contains('Document QC').click();
    cy.get('h1').contains('Document QC').should('exist');
  });

  it('should go directly to the right page when clicking on un-QCed document', () => {
    cy.get('a.case-link').contains('Administrative Record').click();
  });

  it('should find an H3 with the text "administrative record', () => {
    cy.get('h3').contains('Administrative Record').should('exist');
  });
});
