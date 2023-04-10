exports.navigateTo = username => {
  cy.login(username, '/');
};

exports.getStartCaseButton = () => {
  return cy.get('a#file-a-petition');
};

exports.getCaseList = () => {
  return cy.get('#case-list tbody tr');
};
