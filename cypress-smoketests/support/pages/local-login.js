exports.getUserToken = async username => {
  if (username === 'migrator@example.com') {
    username =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluIiwibmFtZSI6IlRlc3QgQWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJ1c2VySWQiOiI4NmMzZjg3Yi0zNTBiLTQ3N2QtOTJjMy00M2JkMDk1Y2IwMDYiLCJjdXN0b206cm9sZSI6ImFkbWluIiwic3ViIjoiODZjM2Y4N2ItMzUwYi00NzdkLTkyYzMtNDNiZDA5NWNiMDA2IiwiaWF0IjoxNTgyOTIxMTI1fQ.PBmSyb6_E_53FNG0GiEpAFqTNmooSh4rI0ApUQt3UH8';
  }
  return {
    AuthenticationResult: {
      IdToken: username,
    },
  };
};

exports.login = token => {
  const username = token.split('@')[0];
  cy.visit(`/mock-login?token=${username}`);

  cy.get('.progress-indicator').should('not.exist');
};

exports.getRestApi = async () => {
  return 'localhost:4000';
};
