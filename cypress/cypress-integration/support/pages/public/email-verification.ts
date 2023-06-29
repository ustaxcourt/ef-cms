export const confirmEmailVerificationSuccessful = () => {
  cy.get('h1')
    .contains('You Must Be Logged In to Verify Email')
    .should('not.exist');
  cy.url().should('contain', '/email-verification-success');
};
