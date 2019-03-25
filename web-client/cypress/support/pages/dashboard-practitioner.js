exports.navigateTo = username => {
  cy.login(username, '/');
};

exports.getStartCaseButton = () => {
  return cy.get('a#init-file-petition');
};

exports.getCaseList = () => {
  return cy.get('#case-list tbody');
};
