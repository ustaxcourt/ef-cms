exports.confirmEmailVerificationSuccessful = () => {
  cy.get('h1')
    .contains('You Must Be Logged In to Verify Email')
    .should('not.exist');
  cy.get('h1').contains('Your Email Has Been Verified').should('exist');
  cy.url().should('contain', '/email-verification-success');
};
