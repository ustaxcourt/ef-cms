exports.navigateTo = username => {
  cy.login(username, '/document-qc');
};

exports.getCreateACaseButton = () => {
  return cy.get('a#file-a-petition');
};
