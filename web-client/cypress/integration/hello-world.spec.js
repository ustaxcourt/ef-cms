describe('Hello world!', function() {
  it('visits the first page and finds all the elements', () => {
    cy.visit('http://localhost:1234/');
    cy.contains('Hello World!');
    cy.contains('#response', 'Silence!');
    cy.contains('#hello-button', 'Hello');
  });
  it('Updates response when hello button is clicked', () => {
    cy.get('#hello-button').click();
    cy.get('#response').should('contain.text', 'Hello World!');
  });
});

describe('USA Banner', () => {
  it('shows header and hides content', () => {
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
