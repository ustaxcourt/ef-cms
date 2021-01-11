exports.getUserToken = async username => {
  return {
    AuthenticationResult: {
      IdToken: username,
    },
  };
};

exports.login = token => {
  cy.visit(`/mock-login?token=${token}`);

  cy.get('.progress-indicator').should('not.exist');
};

exports.getRestApi = async () => {
  return 'localhost:3000';
};
