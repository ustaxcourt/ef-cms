export function goToCase(docketNumber: string) {
  cy.document().its('readyState').should('eq', 'complete');

  cy.get('body').then($body => {
    if ($body.find('[data-testid="docket-number-search-input"]').length > 0) {
      cy.get('[data-testid="docket-number-search-input"]').scrollIntoView();
      cy.get('[data-testid="docket-number-search-input"]').clear();
      cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
      cy.get('[data-testid="search-docket-number"]').click();
    } else {
      cy.get('[data-testid="docket-search-field"]').scrollIntoView();
      cy.get('[data-testid="docket-search-field"]').clear();
      cy.get('[data-testid="docket-search-field"]').type(docketNumber);
      cy.get('[data-testid="search-by-docket-number"]').click();
    }
  });

  cy.get('[data-testid="tab-docket-record"]').should('be.visible');
}
