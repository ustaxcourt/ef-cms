describe('USA Banner', () => {
  it('shows header and hides content', () => {
    cy.visit('http://localhost:1234/');
    cy.contains('.usa-banner-header', 'how you know');
    cy.get('.usa-banner-content').should('not.exist');
  });
  it('shows reveals content when clicked, hides when clicked again', () => {
    cy.get('.usa-banner-button').click();
    cy.contains(
      '.usa-banner-content',
      'you are connecting to the official website',
    );
    cy.get('.usa-banner-button').click();
    cy.get('.usa-banner-content').should('not.exist');
  });
});
