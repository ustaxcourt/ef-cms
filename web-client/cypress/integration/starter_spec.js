describe('App Component first page', function() {
  it('visits the first page and finds all the elements', () => {
    cy.visit('http://localhost:1234/');
    cy.contains('Click a button!');
    cy.contains('#response', 'Silence!');
    cy.contains('#trivia-button', 'Trivia');
    cy.contains('#hello-button', 'Hello');
  });
  it('Updates response when trivia button is clicked', () => {
    cy.get('#trivia-button').click();
    cy.contains('#response', 'Today is ');
  });
  it('Updates response when hello button is clicked', () => {
    cy.get('#hello-button').click();
    cy.get('#response').should('contain.text', 'Hello World!');
  });
});
